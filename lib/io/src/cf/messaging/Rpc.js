/**
 * @private
 *
 * Remote Procedure Call
 *
 */
Ext.define('Ext.cf.messaging.Rpc', {
    
    requires: ['Ext.cf.util.Logger', 'Ext.cf.util.ErrorHelper'],

    config: {
        /**
         * @cfg transport
         * @accessor
         */
        transport: null,
        /**
         * @cfg rpcTimeoutDuration
         * @accessor
         */
        rpcTimeoutDuration: 5 * 60 * 1000, // 5 minutes
        /**
         * @cfg rpcTimeoutCheckInterval
         * @accessor
         */        
        rpcTimeoutCheckInterval: 30 * 1000 // check for timeouts every 30 sec
    },

    /**
     * @private
     */
    rpcTimeoutInterval: null,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);

        var transport = this.getTransport();

        transport.on({
            connected: this.handleOnline,
            offline: this.handleOffline,
            scope: this
        });
        this.lastCheck = new Date().getTime();
        this.callCount = 0;

        this.callMap = {};
    
        return this;
    },

    /**
    *@private
    */
    handleOnline: function() {
        this.setNextCheck();
    },


    /**
    *@private
    */
    handleOffline: function() {
        this.cancelNextCheck();
    },

    /**
    *@private
    */
    setNextCheck: function(){
        var self = this;

        Ext.cf.util.Logger.debug("Outstanding RPC requests", this.callCount);

        this.cancelNextCheck();    
            
        if(this.callCount <= 0) {
            return;
        };

        this.rpcTimeout = setTimeout(function() {
                    self.processRpcTimeouts();
        }, this.getRpcTimeoutCheckInterval());

        
    },

    
    /**
    *@private
    */
    cancelNextCheck: function(){
        if(this.rpcTimeout){
            clearTimeout(this.rpcTimeout);
            this.rpcTimeout = undefined;
        }
    },

    /**
    *@private
    */
    removeCall: function(id){
        delete this.callMap[id];
        this.callCount--;
        this.setNextCheck();
    },

    /**
     * Process Rpc timeouts
     *
     */
    processRpcTimeouts: function() {
        var self = this;
        var lastCheck = this.lastCheck;
        var offset = 0;
        var currentTime = new Date().getTime();


        if(this.getTransport().getConnected() != true){
           return;
        }

    
        Ext.cf.util.Logger.debug("Checking for expired PRC calls.");
        
        if(lastCheck + (this.getRpcTimeoutCheckInterval() * 2) < currentTime  ) {
            //We haven't checked in a while probably because we were offline.
            // we need to update the offsets of the RPC requests before doing the time diff.
            // using rpcTimeoutDuration * 2 to account for any minor timing differences in
            // set timeout. 
            offset = currentTime - lastCheck;
        }

        var rpcTimeoutDuration = this.getRpcTimeoutDuration();


       
        this.lastCheck = currentTime;
        var toRemove = [];

        try {
            for(var corrId in this.callMap) {
                var map = this.callMap[corrId];
                if(offset > 0){
                    map.requestTime += offset;
                }
                if(map && map.requestTime && ((currentTime - map.requestTime) > rpcTimeoutDuration)) {
                    toRemove.push(corrId);
                }
            }

            // remove the timed out corrIds, and return a timeout error to the callers
            toRemove.forEach(function(corrId) {
                var map = self.callMap[corrId];
                if(map && map.callback) {
                    self.removeCall(corrId);

                    Ext.cf.util.Logger.warn("RPC request has timed out as there was no reply from the server. Correlation Id:", corrId, map.service, map.method);
                    Ext.cf.util.Logger.warn("See documentation for Ext.io.Io.setup (rpcTimeoutDuration, rpcTimeoutCheckInterval) to configure the timeout check");

                    var err = Ext.cf.util.ErrorHelper.get('RPC_TIMEOUT', corrId);
                    map.callback({ status:"error", error: err });
                }
            });
        } catch(e) {
            Ext.cf.util.Logger.error("Error running RPC timeout checks", e);
        }
        this.setNextCheck();

        
    },


    /** 
     * @private
     *
     */
    currentCallId: 0,

    /** 
     * Generate call id
     *
     */
    generateCallId: function() {
        return ++this.currentCallId;
    },


    /** 
     * Subscribe
     *
     * @param {Object} envelope
     *
     */
    subscribe: function(envelope) {
        // got a response envelope, now handle it
        this.callback(envelope.msg["corr-id"], envelope);
    },


    addCall: function(envelope,callback){

        var corrId = this.generateCallId();

        envelope.msg["corr-id"] = corrId;
        envelope.from = this.getTransport().getDeviceId();


        this.callMap[corrId] = { callback: callback,
            requestTime: (new Date().getTime()),
            service: envelope.service,
            method: envelope.msg.method };

        this.callCount++;

        this.setNextCheck();
        return corrId;

    },

    /** 
     * Dispatch
     *
     * @param {Object} envelope
     * @param {Function} callback
     *
     */
    dispatch: function(envelope, callback) {
        var self = this;

        var corrId = this.addCall(envelope, callback);

        // send the envelope
        this.getTransport().send(envelope, function(err) {
            if(err) { // couldn't even send the envelope
                self.callMap[corrId].callback({ status:"error", error: err });
                self.removeCall(corrId);
            }
        }, this);
    },

    /** 
     * Callback
     *
     * @param {Number} correlation id
     * @param {Object} envelope
     *
     */
    callback: function(corrId, envelope) {
        var id = parseInt(corrId, 10);
        if (!this.callMap[id]) {
            Ext.cf.util.Logger.warn("No callback found for this correspondance id: " + corrId, envelope);
        } else {
            var map = this.callMap[id];
            var currentTime = new Date().getTime();
            var clientTime = currentTime - map.requestTime;
            var serverTime = envelope.debug === true ? (envelope.debugInfo.outTime - envelope.debugInfo.inTime) : 'NA';
            var networkTime = (serverTime === "NA") ? "NA" : (clientTime - serverTime);
            var apiName = envelope.service + "." + map.method;
            Ext.cf.util.Logger.perf(corrId, apiName, "total time", clientTime, 
                "server time", serverTime, "network time", networkTime);

            if(envelope.msg.result.status !== "success") {
                if(!Ext.cf.util.ErrorHelper.isValidError(envelope.msg.result.error)) {
                    Ext.cf.util.Logger.debug('RPC error is of incorrect format:', envelope.msg.result.error);
                    var err = Ext.cf.util.ErrorHelper.get('UNKNOWN_RPC_ERROR');
                    err.details = envelope.msg.result.error;
                    envelope.msg.result.error = err;
                }
            }

            this.removeCall(id);

            map.callback(envelope.msg.result);

        }
    },

    /** 
     * Call
     *
     * @param {Function} callback
     * @param {String} serviceName
     * @param {String} style
     * @param {String} method
     * @param {Array} args
     *
     */
    call: function(callback, serviceName, style, method, args) {

        var envelope;

        // register for serviceName receive calls (subscriber rpc)
        this.getTransport().setListener(serviceName, this.subscribe, this);

        switch(style) {
            case "subscriber":
                envelope = {service: serviceName, from: this.getTransport().getDeviceId(), msg: {method: method, args: args}};
                this.dispatch(envelope, callback);
                break;
            default:
                Ext.cf.util.Logger.error(style + " is an invalid RPC style");
                throw "Invalid RPC style: " + style;
        }
    }

});

