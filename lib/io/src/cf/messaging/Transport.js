/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.Transport', {
    requires: [
        'Ext.data.proxy.LocalStorage',
        'Ext.cf.messaging.EnvelopeWrapper',
        'Ext.cf.messaging.transports.PollingTransport',
        'Ext.cf.messaging.transports.WebSocketTransport',
        'Ext.cf.messaging.transports.AutoTransport',
        'Ext.cf.util.ErrorHelper',
        'Ext.cf.ServiceDefinitions',
        'Ext.cf.util.ServiceVersionHelper'
    ],
    
    mixins: {
        observable: "Ext.util.Observable"
    },

    transport: null,

    listeners: {},

    undeliveredIncomingStore: null,

    retryIncomingInProgress: false,

    undeliveredOutgoingStore: null,

    retryOutgoingInProgress: false,

    /** @private
    * Mapping of transport classes to short name
    * transportName provided by config used for transport lookup.
    */
    transportClasses: {
        "polling": 'Ext.cf.messaging.transports.PollingTransport',
        "websocket": 'Ext.cf.messaging.transports.WebSocketTransport',
        "auto": 'Ext.cf.messaging.transports.AutoTransport'
    },

    config: {
        url: 'https://api.sencha.io',
        piggybacking: true,
        maxEnvelopesPerReceive: 10,
        transportName: "auto",
        debug: false, /* pass debug flag to server in envelope */

        connected: false,

        undeliveredIncomingExpiryInterval: 60 * 60 * 24 * 1000, // 24 hours
        undeliveredIncomingMaxCount: 100, // max queue size after which we start dropping new messages

        undeliveredOutgoingExpiryInterval: 60 * 60 * 24 * 1000, // 24 hours
        undeliveredOutgoingMaxCount: 100, // max queue size after which we start dropping new messages

        waitAfterBrowserOnline: 5000 //network requests will fail if started inside online event handler.
    },

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        var self = this;

        this.initConfig(config);

        this.mixins.observable.constructor.call(this);

        this.listeners= {};

        Ext.cf.util.Logger.info("Transport type ", this.getTransportName());

        var directory= Ext.io.Io.getStoreDirectory(); 
        this.undeliveredIncomingStore = Ext.create('Ext.data.Store', {
            model: 'Ext.cf.messaging.EnvelopeWrapper',
            proxy: {
                type: 'localstorage', 
                id: 'sencha-io-undelivered-incoming-envelopes'
            },
            autoLoad: true,
            autoSync: false
        });

        this.undeliveredOutgoingStore = Ext.create('Ext.data.Store', {
            model: 'Ext.cf.messaging.EnvelopeWrapper',
            proxy: {
                type: 'localstorage', 
                id: 'sencha-io-undelivered-outgoing-envelopes'
            },
            autoLoad: true,
            autoSync: false
        });

        directory.update("sencha-io-undelivered-incoming-envelopes", "queue", { direction: "in" });
        directory.update("sencha-io-undelivered-outgoing-envelopes", "queue", { direction: "out" });

        Ext.cf.util.Logger.debug("Transport config", this.config);
        var transportName = this.getTransportName();
        var transportClassName =this.transportClasses[transportName];
        if(!transportClassName){
            Ext.cf.util.Logger.error("No transport class for " + transportName + " defaulting to 'auto' transport."); 
            transportClassName =this.transportClasses["auto"];   
        }
        
        this.transport = Ext.create(transportClassName, this.config);
        
        this.setupEventHandlersHandler();

        /* Only attempt to redeliver messages when we have a confirmed connection. */
        this.on("connected", function(){ self.retryUndeliveredOutgoingMessages();});

        this.transport.start();

        return this;
    },

    start: function(){
        if(this.transport){
            this.transport.start();
        } else {
            Ext.cf.util.Logger.error("Transport: attempted to start without a valid transport class."); 
            
        }
    },

    /** 
     * Setup transport event handlers.
     *
     */      
    setupEventHandlersHandler: function() {
        var self = this;

        this.transport.on('receive', function(envelope) { self.receive(envelope); });

        this.transport.on('offline', function(envelope) { 
            self.setConnected(false);
            self.fireEvent("offline");
         });

        window.addEventListener("offline", function (evt) {
            Ext.cf.util.Logger.warn("Browser fired offline event. Stopping connection; assuming offline", evt);
            self.setConnected(false);
            self.transport.stop();
            self.fireEvent("offline");
        }, false);

        window.addEventListener("online", function () {
            Ext.cf.util.Logger.info("Browser fired online event. Will attempt to restart connection.");
            //wait a few seconds because network requests can fail
            //if you start right away.
            setTimeout(function(){
                self.transport.start();
            }, self.getWaitAfterBrowserOnline());
        }, false);


        this.transport.on('connected', function(type) {
            self.setConnected(true);
            self.fireEvent('connected', type);
        });

        this.transport.on('forbidden', function(err) {
            if(err && err.code === 'INVALID_SID') {
                self.setConnected(false);
                self.transport.stop();
                self.fireEvent('invalidsession', err);
            }
        });
    },


    /** 
     * Retry undelivered outgoing messages
     *
     */
    retryUndeliveredOutgoingMessages: function() {
        var self = this;

        if(self.retryOutgoingInProgress) {
            Ext.cf.util.Logger.debug("Another retry (outgoing) already in progress, skipping...");
            return;
        }

        var pendingCount = this.undeliveredOutgoingStore.getCount();
        if(pendingCount > 0) {
            Ext.cf.util.Logger.debug("Transport trying redelivery for outgoing envelopes:", pendingCount);
        } else {
            return;
        }

        self.retryOutgoingInProgress = true;

        try {
            var now = new Date().getTime();
            var expiryInterval = self.getUndeliveredOutgoingExpiryInterval();

            // get the first envelope for redelivery
            var record = this.undeliveredOutgoingStore.getAt(0);
            var envelope = record.data.e;


            if(envelope.expires) {
                Ext.cf.util.Logger.debug("Transport: envelope has expires value of ", envelope.expires);
                expiryInterval = envelope.expires * 1000;
            }

            // Expiry based on age
            if((now - record.data.ts) > expiryInterval) {
                Ext.cf.util.Logger.warn("Buffered outgoing envelope is too old, discarding", record);
                this.undeliveredOutgoingStore.remove(record);
                self.undeliveredOutgoingStore.sync();
                self.retryOutgoingInProgress = false;
                setTimeout(function(){
                    self.retryUndeliveredOutgoingMessages();
                },1);
            } else {
                if(self.getConnected()) { // attempt redelivery only if transport says we're online
                    Ext.cf.util.Logger.debug("Transport trying redelivery for outgoing envelope: " + record);
                    self.transport.send(envelope, function(err, doBuffering) {
                        if(doBuffering) {
                            // could not be delivered again, do nothing
                            Ext.cf.util.Logger.debug("Redelivery failed for outgoing envelope, keeping it queued", record, err);

                            self.retryOutgoingInProgress = false;
                        } else {
                            // sent to server, now remove it from the queue
                            Ext.cf.util.Logger.debug("Transport: Delivered outgoing envelope on retry", record);
                            self.undeliveredOutgoingStore.remove(record);
                            self.undeliveredOutgoingStore.sync();
                            self.retryOutgoingInProgress = false;
                            if(self.undeliveredOutgoingStore.getCount() > 0){
                                Ext.cf.util.Logger.debug("Transport: there are outgoing messages left to deliver:", self.undeliveredOutgoingStore.getCount());
                                setTimeout(function(){
                                    self.retryUndeliveredOutgoingMessages();
                                },1);
                            } else {
                                Ext.cf.util.Logger.debug("Transport: All queued outgoing messages delivered ");
                            }
                        }
                    });
                } else {
                    Ext.cf.util.Logger.debug("Browser still offline, not retrying delivery for outgoing envelope", record);  
                    self.retryOutgoingInProgress = false;
                }
            }
        } catch(e) {
            // if an exception occurs, ensure retryOutgoingInProgress is false
            // otherwise future retries will be skipped!
            self.retryOutgoingInProgress = false;

            Ext.cf.util.Logger.debug("Error during retryUndeliveredOutgoingMessages", e);
        }
    },

    /** 
     * Retry undelivered incoming messages
     *
     */
    retryUndeliveredIncomingMessages: function() {
        var self = this;

        if(self.retryIncomingInProgress) {
            Ext.cf.util.Logger.debug("Another retry (incoming) already in progress, skipping...");
            return;
        }

        self.retryIncomingInProgress = true;
        try {
            var now = new Date().getTime();
            var expiryInterval = self.getUndeliveredIncomingExpiryInterval();

            var undelivered = this.undeliveredIncomingStore.getRange();
            if(undelivered.length > 0) {
                Ext.cf.util.Logger.debug("Transport trying redelivery for incoming envelopes:", undelivered.length);
            }

            for(var i = 0; i < undelivered.length; i++) {
                var record = undelivered[i];
                var envelope = record.data.e;

                var map = this.listeners[envelope.service];

                if(map) {
                    map.listener.call(map.scope, envelope);
                    Ext.cf.util.Logger.debug("Delivered incoming envelope on retry", record);
                    this.undeliveredIncomingStore.remove(record);
                } else {
                    // Still can't deliver the message... see if the message is eligible for expiry
                    
                    // Expiry based on age
                    if((now - record.data.ts) > expiryInterval) {
                        Ext.cf.util.Logger.warn("Buffered incoming envelope is too old, discarding", record);
                        this.undeliveredIncomingStore.remove(record);
                    }
                }
            }
        } finally {
            // even if an exception occurs, sync the store and ensure retryIncomingInProgress is false
            // otherwise future retries will be skipped!
            this.undeliveredIncomingStore.sync();
            self.retryIncomingInProgress = false;
        }
    },

    /** 
     * Get Developer sid
     *
     * @return {String/Number} Developer Sid
     *
     */
    getDeveloperSid: function() {
        return Ext.io.Io.getIdStore().getSid('developer');
    },

    /** 
     * Get Device sid
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceSid: function() {
        return Ext.io.Io.getIdStore().getSid('device');
    },

    /** 
     * Get user sid
     *
     * @return {String/Number} User Sid
     *
     */
    getUserSid: function() {
        return Ext.io.Io.getIdStore().getSid('user');
    },

    /** 
     * Get Device id
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceId: function() {
        return Ext.io.Io.getIdStore().getId('device');
    },

    /** 
     * Set listener
     *
     * @param {String} serviceName
     * @param {Object} listener
     * @param {Object} scope
     *
     */
    setListener: function(serviceName, listener, scope) {
        Ext.cf.util.Logger.debug("Transport Adding listener for service", serviceName);
        this.listeners[serviceName] = {listener:listener, scope:scope};
        //New listener registered, check to see if there are any queued messages
        //for them.
        var self = this;
        setTimeout(function(){
            self.retryUndeliveredIncomingMessages();
        },1);
        
    },

    /** 
     * Remove listener
     *
     * @param {String} serviceName
     *
     */
    removeListener: function(serviceName) {
        delete this.listeners[serviceName];
    },

    /** 
     * Send to service
     *
     * @param {String} serviceName
     * @param {Object} payload
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sendToService: function(serviceName, payload, callbackFunction, scope) {
        this.send({service: serviceName, msg: payload}, callbackFunction, scope);
    },

    /** 
     * Send to client
     *
     * @param {String/Number} targetClientId
     * @param {Object} payload
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sendToClient: function(targetClientId, payload, expires, callbackFunction, scope) {
        if(payload && typeof(payload) === "object") {
            payload.to = targetClientId;
            this.send({service: "CourierService", msg: payload, expires: expires}, callbackFunction, scope);
        } else {
            Ext.cf.util.Logger.error("Message is not a JSON object");
            callbackFunction.call(scope, Ext.cf.util.ErrorHelper.get('MESSAGE_NOT_JSON', payload));
        }
    },

    /** 
     * Send
     *
     * @param {Object} envelope
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    send: function(envelope, callbackFunction, scope) {
        var self = this;

        Ext.cf.util.ServiceVersionHelper.get(envelope.service, function(sv) {
            // service version
            envelope.sv = sv;

            if(self.getDebug()) {
                envelope.debug = true;
            }

            envelope.from = self.getDeviceId();

            // pass deviceSid if available
            var deviceSid = self.getDeviceSid();
            if(deviceSid) {
                envelope.deviceSid = deviceSid;  
            }

            // pass developerSid if available
            var developerSid = self.getDeveloperSid();
            if(developerSid) {
                envelope.developerSid = developerSid;  
            }
            
            // pass userSid if available
            var userSid = self.getUserSid();
            if(userSid) {
                envelope.userSid = userSid;  
            }
            
            Ext.cf.util.Logger.debug("Transport.send " + JSON.stringify(envelope));

            if(self.getConnected()) {
                self.transport.send(envelope, function(err, doBuffering) {
                    if(callbackFunction) {
                        if(!doBuffering) {
                            callbackFunction.call(scope, err);    
                        }

                        if(err && doBuffering) {
                            // could not send outgoing envelope. Buffer it!
                            Ext.cf.util.Logger.warn("Error delivering outgoing envelope", envelope, err);
                            self.bufferOutgoingEnvelope(envelope);
                        }
                    }
                });
            } else {
                self.bufferOutgoingEnvelope(envelope);
            }
        });
    },

    /** 
     * Buffer outgoing envelope
     *
     * @param {Object} envelope
     *
     */
    bufferOutgoingEnvelope: function(envelope) {
        if(this.undeliveredOutgoingStore) {

            if(envelope.expires == 0){
                Ext.cf.util.Logger.debug("Dropping undelivered message with an expiry of zero.", envelope);
                return;
            }

            if(this.undeliveredOutgoingStore.getCount() < this.getUndeliveredOutgoingMaxCount()) {
                var record = this.undeliveredOutgoingStore.add(Ext.create('Ext.cf.messaging.EnvelopeWrapper', {e: envelope, ts: (new Date().getTime())}));
                this.undeliveredOutgoingStore.sync();
                Ext.cf.util.Logger.debug("Added to outgoing queue, will retry delivery later", record);
            } else {
                // queue is full, start dropping messages now
                Ext.cf.util.Logger.warn("Queue full, discarding undeliverable outgoing message!", envelope);
            }
        }
    },

    /** 
     * Receive
     *
     * @param {Object} envelope
     *
     */
    receive: function(envelope) {
        Ext.cf.util.Logger.debug("Transport.receive " + JSON.stringify(envelope));

        // Check 1: Is the service known?
        // Check 2: Is the service version the same as in CF?
        var expected = Ext.cf.ServiceDefinitions[envelope.service];
        if(!expected) {
            Ext.cf.util.Logger.error("Unknown service", envelope.service, ". Envelope discarded", envelope);
        } else if(expected !== envelope.sv) {
            Ext.cf.util.Logger.error("Expected service", envelope.service, "version", expected, ", actual ", envelope.sv, ". Envelope discarded", envelope);
        } else {
            // dispatch it to the correct service listener
            if(this.listeners[envelope.service]) {
                var map = this.listeners[envelope.service];
                map.listener.call(map.scope, envelope);
            } else {
                Ext.cf.util.Logger.error("Transport.receive no listener for service '",envelope.service,"'.",this.listeners);

                // check current length of queue
                if(this.undeliveredIncomingStore) {
                    if(this.undeliveredIncomingStore.getCount() < this.getUndeliveredIncomingMaxCount()) {
                        // add it to the undelivered store for trying delivery later
                        var record = this.undeliveredIncomingStore.add(Ext.create('Ext.cf.messaging.EnvelopeWrapper', {e: envelope, ts: (new Date().getTime())}));
                        Ext.cf.util.Logger.debug("Added to incoming queue, will retry delivery later", record);
                        
                        this.undeliveredIncomingStore.sync();      
                    } else {
                        // queue is full, start dropping messages now
                        Ext.cf.util.Logger.warn("Queue full, discarding undeliverable incoming message!", envelope);
                    }
                }
            }
        }
    },

    /** 
     * Subscribe
     *
     * @param {String} serviceName
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    subscribe: function(serviceName, callbackFunction, scope) {
        var self = this;

        Ext.cf.util.Logger.debug("Transport.subscribe " + serviceName);

        Ext.cf.util.ServiceVersionHelper.get(serviceName, function(sv) {
            var params = { 
                deviceId: self.getDeviceId(), 
                service: serviceName,
                sv: sv
            };

            self.transport.subscribe(params, function(err) {
                if(callbackFunction){
                    callbackFunction.call(scope, err);
                }
            });
        });
    },

    /** 
     * Unsubscribe
     *
     * @param {String} serviceName
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    unsubscribe: function(serviceName, callbackFunction, scope) {
        var self = this;

        Ext.cf.util.Logger.debug("Transport.unsubscribe " + serviceName);

        Ext.cf.util.ServiceVersionHelper.get(serviceName, function(sv) {
            var params = { 
                deviceId: self.getDeviceId(), 
                service: serviceName,
                sv: sv
            };

            self.transport.unsubscribe(params, function(err) {
                if(callbackFunction){
                    callbackFunction.call(scope, err);
                }
            });
        });
    }
});
