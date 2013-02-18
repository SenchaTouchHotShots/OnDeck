/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.Registry', {
    requires: ['Ext.cf.util.ServiceVersionHelper'],

    alternateClassName: 'Ext.io.Registry',

    /**
     * Get service descriptor
     *
     * @param {String} serviceName
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    getServiceDescriptor: function(serviceName, callback, scope) {
        Ext.cf.util.ServiceVersionHelper.get(serviceName, function(version) {
            if(serviceName === "RegistryRpcService") {
                callback.call(scope, {
                    kind: "rpc",
                    style: ["subscriber"],
                    access: ["clients", "servers"],
                    depends: ["MessagingService", "RegistryService"],
                    methods: ["getServiceDescriptor", "getLatestServiceVersion"]
                });
            } else {
                var configStore = Ext.io.Io.getConfigStore();
                var serviceConfig = configStore.getObjectConfig(serviceName+version);
                // If we have the version of the service cached 
                if(serviceConfig) {
                    callback.call(scope, serviceConfig);
                } else {
                    Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.getService(
                            {name: "RegistryRpcService"},
                            function(namingRpc,err) {
                                if(namingRpc){
                                    namingRpc.getServiceDescriptor(function(result) {
                                        if(result.status == "success") {
                                            configStore.setObjectConfig(serviceName+version, result.value);
                                            callback.call(scope, result.value);
                                        } else {
                                            callback.call(scope, undefined, result.error);
                                        }
                                    }, serviceName, version);
                                }else{
                                    callback.call(scope, undefined, err);
                                }
                            },this
                        );
                    },this);                
                }
            }
        });
    }
});
