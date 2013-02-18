/**
 * @private
 *
 * Publish/Subscribe Messaging
 *
 */
Ext.define('Ext.cf.messaging.PubSub', {
    
    config: {
        /**
         * @cfg transport
         * @accessor
         */
        transport: undefined
    },

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        return this;
    },

    /**
     * @private
     */
    channelCallbackMap: {},

    /** 
     * Handle incoming envelope
     *
     * @param {Object} envelope
     *
     */
    handleIncoming: function(envelope) {
        var channelName = envelope.msg.queue;
        if(channelName && this.channelCallbackMap[channelName]) {
            var item = this.channelCallbackMap[channelName];
            var sender = {
              deviceId: envelope.from,
              userId: envelope.userId,
              developerId: envelope.developerId
            };
            item.callback.call(item.scope,sender,envelope.msg.data);
        } else {
            Ext.cf.util.Logger.warn("PubSub: No callback for channelName " + channelName);
        }
    },

    /** 
     * Publish
     *
     * @param {String} channelName
     * @param {String} qKey
     * @param {Object} data
     * @param {number} expires
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    publish: function(channelName, qKey, data, expires, callback, scope) {
        this.getTransport().send(
            {service:"ChannelService", expires: expires, msg:{api:"publish", queue:channelName, qKey: qKey, data:data}
        }, callback, scope);
    },

    /** 
     * Subscribe
     *
     * @param {String} channelName
     * @param {String} qKey
     * @param {Function} callback
     * @param {Object} scope
     * @param {Function} errCallback
     *
     */
    subscribe: function(channelName, qKey, callback, scope, errCallback) {
        this.getTransport().setListener("ChannelService", this.handleIncoming, this);
        // setting the callback before we are officially subscribed, just in case the server sends us messages on a channel
        // before we get the ACK back from the server.
        //TODO only one 'channel' can have the callback.  this should really just emit events.
        this.channelCallbackMap[channelName] = {callback:callback,scope:scope}; 
        this.getTransport().send(
            {service:"ChannelService", msg:{api:"subscribe", queue:channelName, qKey: qKey}
        }, function(err) {
            if(err) {
                Ext.cf.util.Logger.error("Error subscribing to channel", channelName, err);
                if (errCallback) {
                    errCallback.call(scope, err);
                }
            } else {
                Ext.cf.util.Logger.info("channel: " + this.getTransport().getDeviceId() + " subscribed to " + channelName);
            }
        }, this);
    },

    /** 
     * Unsubscribe
     *
     * @param {String} channelName
     * @param {String} qKey
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    unsubscribe: function(channelName, qKey, callback, scope) {
        delete this.channelCallbackMap[channelName];
        this.getTransport().send(
            {service:"ChannelService", msg:{api:"unsubscribe", queue:channelName, qKey:qKey}
        }, function(err) {
            Ext.cf.util.Logger.info("channel: " + this.getTransport().getDeviceId() + " unsubscribed to " + channelName);
            if(callback){
                callback.call(scope, err);
            }
        }, this);
    }
});

