/**
 * @private
 *
 * An Object that can have a channel.
 * 
 */
Ext.define('Ext.io.WithChannel', {

    /**
     * Get Channel Key
     *
     * @param {Function} callback The function to be called after getting the Object's channel.
     * @param {Object} callback.channel The channel key of the object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    getChannelKey: function(callback,scope) {
        var self = this;

        if (self._channelKey) {
            callback.call(scope, self._channelKey);
        } else {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "NamingRpcService"},
                    function(namingRpc,err) {
                        if(namingRpc){
                            namingRpc.getRelatedObjects(function(result) {
                                if(result.status == "success") {
                                    if(result.value && result.value.length) { // it's possible there is no linked object
                                        self._channelKey = result.value[0]._key;
                                        callback.call(scope, result.value[0]._key);
                                    }
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, this.$className, this.getId(), 'Ext.io.Channel', null);
                        }else{
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        }
    }

});
