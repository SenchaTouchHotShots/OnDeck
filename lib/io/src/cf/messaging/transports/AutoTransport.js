/**
 * @private
 *
 * Auto transport builds on XHR and Websocket transports to create 
 * a hybrid transport that starts with XHR requests and upgrades to 
 * the websocket connection if a connection can be established. 
 *
 */
Ext.define('Ext.cf.messaging.transports.AutoTransport', {
    requires: [
        'Ext.cf.util.Logger', 
        'Ext.cf.util.ErrorHelper',
        'Ext.cf.messaging.transports.PollingTransport',
        'Ext.cf.messaging.transports.WebSocketTransport'
    ],

    mixins: {
        observable: "Ext.util.Observable"
    },

    statics: {
       isSupported: function() {
            return true;
        }
    },

    transportClasses: {
           "polling": 'Ext.cf.messaging.transports.PollingTransport',
           "websocket": 'Ext.cf.messaging.transports.WebSocketTransport'
    },

    config: {
        started: false
    },

    
    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this);
        this.activeTransport = null;
        this.pollingTransport = null;
        this.socketTransport = null;
        return this;
    },

    /** 
     * Start
     *
     */
    start: function() {
        if(this.getStarted()){
            Ext.cf.util.Logger.debug("AutoTransport already started");
            return;
        }

        Ext.cf.util.Logger.debug("AutoTransport starting");

        this.setStarted(true);
        
        if(!this.pollingTransport) {
            this.pollingTransport = Ext.create(this.transportClasses["polling"], this.config);
            this.relayEvents(this.pollingTransport, ["receive", "forbidden", "connected", "offline"]);
        }
        
        this.activeTransport = this.pollingTransport;
        this.activeTransport.start();
        
        if(!this.socketTransport){
            if(Ext.cf.messaging.transports.WebSocketTransport.isSupported()) {
                
                this.socketTransport = Ext.create(this.transportClasses["websocket"], this.config);
                this.relayEvents(this.socketTransport, ["receive", "forbidden", "connected", "offline"]);
                
                this.socketTransport.on({connected: {fn: this.onSocketActive, scope: this}});
                
            } else {
                Ext.cf.util.Logger.debug("AutoTransport: websockets not supported, XHR polling only");
            }
            
        }

        this.socketTransport.start();
        
        return true;
    },
    
    
    onSocketActive: function(){
        Ext.cf.util.Logger.debug("AutoTransport: websocket connection established, switching active transport");
        this.pollingTransport.stop(); // stop polling, we have sockets!
        this.activeTransport = this.socketTransport;
    },
    

    /** 
     * Stop
     *
     */
    stop: function() {
        // turn off long polling
        this.setStarted(false);
        //this.activeTransport.stop();
        if(this.pollingTransport){
            this.pollingTransport.stop();
        }
        if(this.socketTransport){
            this.socketTransport.stop();
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
       this.activeTransport.send(message, callback);
    },

    /** 
     * Subscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    subscribe: function(params, callback) {
        this.activeTransport.send(params, callback);
    },

    /** 
     * Unsubscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    unsubscribe: function(params, callback) {
        this.activeTransport.send(params, callback);
    }
});

