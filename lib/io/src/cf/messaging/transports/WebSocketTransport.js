/**
 * @private
 *
 * Web Socket Transport
 *
 */
Ext.define('Ext.cf.messaging.transports.WebSocketTransport', {
    requires: [
        'Ext.cf.util.Logger', 
        'Ext.cf.util.ErrorHelper'],

    mixins: {
        observable: "Ext.util.Observable"
    },

    statics: {
       isSupported: function() {
            return (typeof(WebSocket) !== "undefined");
        }
    },
     
    config: {
        url: 'https://api.sencha.io',
        webSocketUrl: null,
        reconnectBackoffInterval: 5000,
        connectGracePeriod: 500,
        reconnect: true, // by default, tries reconnecting after socket close
        started: false
    },

    backoffCounter: 0,

    // need to correlate sent packets with ack replies so that 
    // we can return appropriate status to the original callback
    packetCorrMap: {},

    // acts as the correlation counter for the packet corr map
    messageCounter: 0,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */  
    constructor : function(config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this);

        this.deriveWebSocketUrl();

        return this;
    },

    deriveWebSocketUrl: function() {
        // takes care of both http, https -> ws, wss
        var httpUrl = this.getUrl();
        var socketUrl = httpUrl.replace(/^http/,'ws');
        if(socketUrl[socketUrl.length - 1] !== "/") {
            socketUrl += "/";
        }
        socketUrl += "ws";

        this.setWebSocketUrl(socketUrl);
    },

    start: function() {
        var self = this;

        if(this.getStarted()){
            Ext.cf.util.Logger.debug("WebsocketTransport already started");
            return;
        }
        this.setReconnect(true);
        this.setStarted(true);

        // see if websockets are supported in the browser
        if(!self.self.isSupported()) {
            Ext.cf.util.Logger.error("WebSocket constructor not found, your browser may not support websockets");
            return false;
        }

        Ext.cf.util.Logger.debug("websocket connecting to", this.getWebSocketUrl());

        this.socket = new WebSocket(this.getWebSocketUrl());

        this.socket.onopen = function() {
            self.backoffCounter = 0;

            Ext.cf.util.Logger.debug("websocket connected");
           
            var params = { deviceId: self.getDeviceId() };
            if(self.getDeviceSid()) {
                params.deviceSid = self.getDeviceSid();
            }

            self._emit('start', params, function(err) {
                if(err) {
                    Ext.cf.util.Logger.debug("websocket start error", err);
                    if(err && err.code === 'INVALID_SID') {
                        self.fireEvent('forbidden', err);
                    }
                } else {
                    self.fireEvent("connected", "websocket");
                }
            });
        };

        this.socket.onmessage = function(event) {
            var packet;

            try {
                packet = JSON.parse(event.data);
            } catch(e) {
               Ext.cf.util.Logger.error("websocket got illegal packet", event.data, e); 

               // don't continue further
               return;
            }

            Ext.cf.util.Logger.debug("websocket got", packet);

            switch(packet.kind) {
                case 'data': {
                    self._receive(packet.data);
                }
                break;

                case 'ack': {
                    self._handleAck(packet);
                }
                break;

                case 'error': {
                    Ext.cf.util.Logger.error("websocket error", packet);
                }
                break;

                case 'settings': {
                    self.processSettings(packet.data);
                }
                break;
            }
        };

        this.socket.onclose = function() {
            Ext.cf.util.Logger.debug("websocket closed");
            self.setStarted(false);
            clearInterval(self.heartbeatTimer);
            self.fireEvent('offline');

            if(self.getReconnect()) {
                self.backoffCounter++;

                var tryReconnectInterval = self.getReconnectBackoffInterval() * self.backoffCounter;
                Ext.cf.util.Logger.debug("websocket trying reconnect in", tryReconnectInterval, "ms");
                setTimeout(function() {
                    self.start();
                }, tryReconnectInterval);
            }
        };

        return true;
    },

    stop: function() {
        var self = this;

        // turn off reconnect & close the socket
        this.setReconnect(false);
        this.setStarted(false);

        clearInterval(self.heartbeatTimer);

        if(self.socket){
            // clear out the old close function handler 
            // if the network connection is down the socket won't cleanly disconnect
            // an onclose won't fire. When the connection comes back onclose will fire
            // and cause problems.
            this.socket.onclose = function(){}; 
            self.socket.close();
        }
        
        Ext.cf.util.Logger.debug("websocket stopped");
    },

    processSettings: function(settings) {
        var self = this;

        Ext.cf.util.Logger.debug("websocket got settings from server", settings);

        // setup heartbeat
        this.heartbeatTimer = setInterval(function() {
            var now = new Date().getTime();
            self._emit('heartbeat', { time: now }, function(err) {
                if(err) {
                    Ext.cf.util.Logger.warn("websocket could not send heartbeat", now, err);
                } else {
                    Ext.cf.util.Logger.debug("websocket sent heartbeat", now); 
                }
            });
        }, settings.heartbeatInterval);
    },

    send: function(message, callback) {
        var self = this;

        self._emit('data', message, function(err, doBuffering) {
            if(callback) {
                callback(err, doBuffering);
            }
        });
    },

    /** 
     * Subscribe
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    subscribe: function(message, callback) {
        this._emit('subscribe', message, function(err) {
            if(callback) {
                callback(err);
            }
        });
    },

    /** 
     * Unsubscribe
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    unsubscribe: function(message, callback) {
        this._emit('unsubscribe', message, function(err) {
            if(callback) {
                callback(err);
            }
        });
    },

    isOpen: function() {
        return this.socket && this.socket.readyState === 1;
    },

    _emit: function(kind, data, callback) {
        var self = this;

        var packetCorrId = ++self.messageCounter;
        // save callback in packet corr map
        self.packetCorrMap[packetCorrId] = callback;

        var packetJson = { id: packetCorrId, kind: kind, data: data };
        Ext.cf.util.Logger.debug("websocket _emit", packetJson);

        var packet = JSON.stringify(packetJson);


        if(this.isOpen()) {
            this.socket.send(packet);
            // callback will be trigged on ack
        } else {
            // sometimes socket connect takes a few ms, give a little grace period
            setTimeout(function() {
                if(self.isOpen()) {
                    self.socket.send(packet);
                    // callback will be trigged on ack
                } else {
                    // remove the id from map manually
                    delete self.packetCorrMap[packetCorrId];

                    callback(Ext.cf.util.ErrorHelper.get('WEBSOCKET_NOT_READY'), true);
                }
            }, self.getConnectGracePeriod());
        }
    },

    _handleAck: function(packet) {
        var self = this;

        var id = parseInt(packet.id, 10);
        if(id && self.packetCorrMap[id]) {
            // return error, if any. No buffering
            var err = packet.data ? packet.data.error : undefined;
            self.packetCorrMap[id](err, false);
            delete self.packetCorrMap[id];
            // Ext.cf.util.Logger.debug("Got ack for packet", id);
        } else {
            Ext.cf.util.Logger.warn("Packet", id, "not found in ack map, ignoring");
        }

        // fire forbidden event based on status
        if(packet.data && packet.data.error && packet.data.status === 403) {
            self.fireEvent('forbidden', packet.data.error);
        }
    },

    /** 
     * Receive
     *
     * @param {Object} data
     *
     */
    _receive: function(data){
        if(data.envelope) {
            this.fireEvent('receive', data.envelope);
        } else if(data.envelopes && data.envelopes.length > 0) {
             var l = data.envelopes.length;
            for(var i =0; i < l; i++ ) {
                this.fireEvent('receive', data.envelopes[i]);
            }
        }
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
