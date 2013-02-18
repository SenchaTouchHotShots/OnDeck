/**
 * @private
 */
Ext.define('Ext.cf.util.ServiceVersionHelper', {
    requires: ['Ext.cf.ServiceDefinitions', 'Ext.cf.util.Logger'],

    statics: {
        get: function(serviceName, callback) {
            var version = Ext.cf.ServiceDefinitions[serviceName];
            if(!version) {
                // ask the registy for the latest version
                Ext.io.Io.getService({name:"RegistryRpcService"}, function(registry) {
                    registry.getLatestServiceVersion(function(result) {
                        if(result.status === 'success') {
                            // store it in the ServiceDefinitions class (caching)
                            Ext.cf.ServiceDefinitions[serviceName] = result.value;
                            
                            callback(result.value);
                        } else {
                            var err = result.error;
                            
                            Ext.cf.util.Logger.error("FATAL", err);

                            callback(null);

                            throw err.code + " " + err.message;
                        }
                    }, serviceName);
                });
            } else {
                callback(version);
            }
        }
    }
});
