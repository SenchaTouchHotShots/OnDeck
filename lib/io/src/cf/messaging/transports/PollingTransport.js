/**
 * @private
 *
 * Polling Transport
 *
 */
Ext.define('Ext.cf.messaging.transports.PollingTransport', {
    requires: ['Ext.cf.util.Logger', 'Ext.cf.util.ErrorHelper'],

    mixins: {
        observable: "Ext.util.Observable"
    },

    statics: {
       isSupported: function() {
            // all modern browsers support xhr
            return true;
        }
    },

    config: {
        url: 'http://api.sencha.io',
        maxEnvelopesPerReceive: 25,
        started: true,
        reconnectBackoffInterval: 5000,
        connected: false
    },

    backoffCounter: 0,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this);

        return this;
    },

    /** 
     * Trigger xhr long-poll
     *
     */
    invokeReceiver: function() {
        var self = this;

        if(self.getStarted()) {
           var params = { deviceId: self.getDeviceId(), max: self.config.maxEnvelopesPerReceive} ;
            
            params.deviceSid = self.getDeviceSid();
           
            self.ajaxRequest("/receive", params, {}, function(err, response) {
                self.responseHandler(err, response);
            });
        }
    },

    /** 
     * Start
     *
     */
    start: function() {
        var self = this;
        this.setStarted(true);
        Ext.cf.util.Logger.debug("Starting polling transport");
   
        // start long poll
        this.invokeReceiver();

        return true;
    },

    /**
     * Stop
     *
     */
    stop: function() {
        // turn off long polling
        this.setStarted(false);  
        this.setConnected(false);
    },

    /** 
     * Response handler
     *
     * @param {Object} err
     * @param {Object} response
     *
     */
    responseHandler: function(err, response) {
        var self = this;

        var backoffDuration = 0;
        if(err && err.code === 'NETWORK_ERROR') {
            // n/w error, increment backoff counter
            self.backoffCounter++;
            backoffDuration = self.getReconnectBackoffInterval() * self.backoffCounter;
        } else {
            // not a n/w problem, reset backoff counter
            self.backoffCounter = 0;
        }

       // start the next long poll
        if(backoffDuration > 0) {
            Ext.cf.util.Logger.debug("polling trying reconnect in", backoffDuration, "ms");
        }

        setTimeout(function() {
            self.invokeReceiver();
        }, backoffDuration);

        if(!err) {
            Ext.cf.util.Logger.debug("PollingTransport",this.config.url,"response:",response.responseText);

            if(!this.getConnected() && this.getStarted()){
                //checking if we are still started because if we were stopped while 
                // waiting for this request to complete we don't want to broadcast 
                // a connected event when we are actually in the process of shutting down.
                this.setConnected(true);
                this.fireEvent("connected", "polling");
            }

            var data = Ext.decode(response.responseText);
            if(data) {
                var envelopes = data.envelopes;
                var hasMore = data.hasMore;
                if(envelopes && envelopes.length) {
                    for(var i = 0; i < envelopes.length; i++) {
                         this.fireEvent('receive', envelopes[i]);
                    }
                }
            } else {
                Ext.cf.util.Logger.warn("PollingTransport",this.config.url,"response text is null",response.status);  
            }
        } else {
            Ext.cf.util.Logger.warn("PollingTransport",this.config.url,"response error:",err,response);
            this.setConnected(false);
            if(err.code=="NETWORK_ERROR"){
                self.fireEvent("offline", err);
            }
            if(response && response.status === 403) {
                self.fireEvent('forbidden', err);
            }
        }
    },

    /** 
     * Send message
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    send: function(message, callback) {
        var self = this;

        this.ajaxRequest("/send", { max: this.config.maxEnvelopesPerReceive }, message, function(err, response, doBuffering) {
            callback(err, doBuffering);

            if(err && err.code=="NETWORK_ERROR"){
                self.fireEvent("offline", err);
            }

            if(err && response && response.status === 403) {
                 this.setConnected(false);
                self.fireEvent('forbidden', err);
            }
        });
    },

    /** 
     * Subscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    subscribe: function(params, callback) {
        var self = this;

        params.deviceSid = self.getDeviceSid();
        
        this.ajaxRequest("/subscribe", params, {}, callback);
    },

    /** 
     * Unsubscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    unsubscribe: function(params, callback) {
        var self = this;

        params.deviceSid = self.getDeviceSid();
        
        this.ajaxRequest("/unsubscribe", params, {}, callback);
    },

    /** 
     * AJAX Request
     *
     * @param {String} path
     * @param {Object} params
     * @param {Object} jsonData
     * @param {Function} callback
     *
     */
    ajaxRequest: function(path, params, jsonData, callbackFunction) {
        Ext.Ajax.request({
            method: "POST",
            url: this.config.url + path,
            params: params,
            jsonData: jsonData,
            scope: this,

            callback: function(options, success, response) {
                if(callbackFunction) {
                    if(response && response.status === 0) { // status 0 = server down / network error
                        callbackFunction(Ext.cf.util.ErrorHelper.get('NETWORK_ERROR'), null, true); // request can be buffered
                    } else {
                        if(success) {
                            callbackFunction(null, response);
                        } else {
                            var err = Ext.cf.util.ErrorHelper.decode(response.responseText);
                            callbackFunction(err, response, false); // no buffering, server replied
                        }
                    }
                }
            }
        });
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
     * Get Device id
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceId: function() {
        return Ext.io.Io.getIdStore().getId('device');
    }
});

