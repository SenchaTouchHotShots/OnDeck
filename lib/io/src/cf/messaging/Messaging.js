/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.Messaging', {
    requires: [
        'Ext.cf.messaging.Registry',
        'Ext.cf.messaging.Transport',
        'Ext.cf.messaging.Rpc',
        'Ext.cf.messaging.PubSub',
        'Ext.io.Proxy', 
        'Ext.io.MessagingProxy',
        'Ext.cf.util.ErrorHelper'],


    /**
     * @private
     *
     */    
    transport: null,

    /**
     * @private
     *
     */
    rpc: null,

    /**
     * @private
     *
     */
    pubsub: null,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        /* 
         * Instantiate the registry service proxy.
         */
        this.registry = Ext.create('Ext.io.Registry');
        this.transport = Ext.create('Ext.cf.messaging.Transport', config);
        config.transport= this.transport;
        this.rpc = Ext.create('Ext.cf.messaging.Rpc', config);
        this.pubsub = Ext.create('Ext.cf.messaging.PubSub', config);

        return this;
    },

    /**
     * @private
     *
     */
    proxyCache : {},

    /** 
     * Get service
     *
     * @param {Object} options
     * @param {String} options.name
     * @param {Function} callback
     * @param {Object} scope
     */
    getService: function(options,callback,scope) {
        var self = this;
        if(!options.name || options.name === "") {
            Ext.cf.util.Logger.error("Service name is missing");
            var errResponse = Ext.cf.util.ErrorHelper.get('SERVICE_NAME_MISSING');
            callback.call(scope,undefined,errResponse);
        } else {
            var service = this.proxyCache[options.name];
            if(service) {
                callback.call(scope,service);
            } else {
                self.registry.getServiceDescriptor(options.name, function(serviceDescriptor, err) {
                    if(err || typeof(serviceDescriptor) === "undefined" || serviceDescriptor === null) {
                        Ext.cf.util.Logger.error("Unable to load service descriptor for " + options.name);
                        var errResponse = Ext.cf.util.ErrorHelper.get('SERVICE_DESCRIPTOR_LOAD_ERROR', options.name);
                        errResponse.cause = err;
                        callback.call(scope,undefined,errResponse);
                    } else {
                        if(serviceDescriptor.kind == "rpc") {
                            service = Ext.create('Ext.io.Proxy', {name:options.name, descriptor:serviceDescriptor, rpc:self.rpc});
                        } else {
                            service = Ext.create('Ext.io.MessagingProxy', {name:options.name, descriptor:serviceDescriptor, transport:self.transport});
                        }
                        self.proxyCache[options.name] = service;
                        callback.call(scope,service);
                    }
                });
            }
        }
    },

    //options.params.file - it should be a handler for file, for example for client side:
    //document.getElementById("the-file").files[0];
    /** 
     * Send content
     *
     * @param {Object} options
     * @param {String} options.name
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sendContent: function(options,callback,scope) {
        var self  = this;
        var url   = self.config.csUrl || self.config.url || 'https://api.sencha.io';
        if( !options.file ||
            !options.file.name || 
            options.file.name === "" || 
            !options.file.file || 
            !options.file.ftype ||
            !options.containerid) {
            var errResponse = { code: 'PARAMS_MISSING', message: 'Some of parameters are missing' };
            callback.call(scope, null, errResponse);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    var parseResult = function(str) {
                        var res;
                        try {
                            res = JSON.parse(str);
                        } catch (e) {
                            return str;
                        }
                        return res;
                    };
                    var result = parseResult(xhr.responseText);
                    if (result.code == 200) {
                        callback.call(scope, result.reference);
                    } else {
                        var errResponse = { code: 'STORE_ERROR', message: result.message };
                        callback.call(scope, null, errResponse);
                    }
                }
            };
            xhr.open('POST', url + '/sio/content/' + options.containerid + '/' + options.file.ftype + '/', true);
            xhr.setRequestHeader("X-File-Name", encodeURIComponent(options.file.name));
            xhr.setRequestHeader("Content-Type", "application/octet-stream; charset=binary");
            //xhr.overrideMimeType('application/octet-stream; charset=x-user-defined-binary');
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("Content-Encoding", "binary");
            xhr.setRequestHeader("X-Resource-Type", options.file.ftype);
            xhr.setRequestHeader("X-Resource-Id", options.containerid);
            xhr.setRequestHeader("X-Auth-Token", Ext.io.Io.getIdStore().getSid("developer"));

            xhr.send(options.file.file);
        }
    }
});

