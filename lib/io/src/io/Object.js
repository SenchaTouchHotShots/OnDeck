/**
 * @private
 *
 * An Object... but a special one.
 * 
 */

Ext.define('Ext.io.Object', {

    mixins: {
        observable: "Ext.util.Observable" //using util instead of mixin for EXT 4 compatibility. 
    },

    /**
    * @event updated
    * Fired when the user receives a message.
    * This event is fired for both local updates (after calls to object.update(...))
    * and when the server sends object updates.
    *  
    * To get remote updates call {Ext.io.Object.watch} first.
    *
    * @param {Object} updated the fields that have changed in this update. 
    * @param {boolean} remote update. true if update was triggered remotely. 
    */
    


    inheritableStatics: {

        /**
         * @private
         * Get a specific Object.
         *
         * @param {Object} messaging
         * @param {String} key
         *
         * @param {Function} callback The function to be called after getting the object.
         * @param {Object} error object
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         *
         */
        getObject: function(key, callback, scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "NamingRpcService"},
                    function(namingRpc,err) {
                        if(namingRpc){
                            var self= this;
                            namingRpc.get(function(result) {
                                if(result.status == "success") {
                                    callback.call(scope, self.objectFactory(result.value),undefined, result.value);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, self.$className, key);
                        }else{
                            callback.call(scope, undefined, err);    
                        }
                    },
                    this
                );
            },this);
        },
        
        /**
        *@private
        * Checks the config store for local copies of the object config.
        *  if not found then call {Ext.io.Object.getObject} if the object 
        *  is created then store the config in the cache for later use.
        */
        getCachedObject: function(key, callback, scope){
            var configStore = Ext.io.Io.getConfigStore();
            var cacheKey = [this.$className, key];
            var objConf = configStore.getObjectConfig(cacheKey);
            if(objConf){
                callback.call(scope,this.objectFactory(objConf));
            } else {
                var cb = function(obj, err, conf) {
                    if(obj){
                         configStore.setObjectConfig(cacheKey,conf);
                    }
                    callback.call(scope, obj, err);
                };
                this.getObject(key, cb, scope);
            }
        },
        
        cacheObjectConfig: function(key, conf) {
            var cacheKey = [this.$className, key];
            var configStore = Ext.io.Io.getConfigStore();
            configStore.setObjectConfig(cacheKey,conf);
        },
        
        
        
        /**
         *@private
         * returns an instance of an object of type this.$className for given conf.
         */
        objectFactory: function(conf){
           return Ext.create(this.$className, {id:conf._key, data:conf.data});
        }, 
        
        /**
        * @private
        * Removes the cached object form the store.
        */
        removeCachedObject: function(key){
                var configStore = Ext.io.Io.getConfigStore();
                var cacheKey = [this.$className, key];
                var objConf = configStore.remove(cacheKey);
        },

        /**
         * @private
         * Get a set of Objects that match a query.
         *
         * @param {Object} messaging
         * @param {String} query
         * @param {Number} start
         * @param {Number} rows
         * 
         * @param {Function} callback The function to be called after finding objects.
         * @param {Object} error object
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         *
         */
        findObjects: function(query, start, rows, callback, scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "NamingRpcService"},
                    function(namingRpc,err) {
                        if(namingRpc){
                            var self= this;
                            namingRpc.find(function(result) {
                                if(result.status == "success") {
                                    var objects = [];
                                    for(var i = 0; i < result.value.length; i++) {
                                        objects.push(Ext.create(self.$className, {id:result.value[i]._key, data:result.value[i].data}));
                                    }
                                    callback.call(scope, objects);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, self.$className, query, start, rows);
                        }else{
                            callback.call(scope, undefined, err);    
                        }
                    },
                    this
                );
            },this);
        }

    },

    config: {
        id: null,
        data: null
    },

    /**
     * @private
     *
     * Constructor
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        if(config._key){
            this.setId(config._key);
        }
    },

    /**
     *
     * Watches an object for remote changes. Any changes object will be pushed to this copy of the object automatically. 
     * The {Ext.io.Object.updated} event will fire after the object has been updated.
     *
     * @param {Array} optional array of strings of property names to observe. If properties is missing all object fields will be 
     */
    watch: function(properties) {
        var self = this;
        Ext.io.Io.registerForNamingEvents(self, properties);  
        self.registeredForNamingEvents = true; //TODO this should be a map of watched properties. 
        return self;
    },

    /**
     * Notifies the server that we no-longer want to know about changes to this object.
     */
    ignore: function(properties) {
        var self = this;
        Ext.io.Io.unregisterForNamingEvents(self, properties);
        self.registeredForNamingEvents = false;
        return self;
    },

    /**
     * @private
     * @inheritable
     *
     * Update the object.
     *
     * @param {Object} data The data to be set on the object.
     *
     * @param {Function} callback The function to be called after updating the object.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *     
     */
    update: function(data,callback,scope) {
        this._update(data, false);
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.update(function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.$className, this.getId(), data);
                    }else{
                        callback.call(scope,err);
                    }
                },
                this
            );
        },this);
    },

    /**
    * @private
    * merge the current config with the new data and fire the updated event.
    *
    * @param {Object} updated the fields that have changed in this update. 
    * @param {boolean} isRemote update. true if update was triggered remotely. 
    *
    */
    _update: function(data, isRemote){
        var merged = Ext.Object.merge(this.getData(), data);
        this.setData(merged);
        
        var configStore = Ext.io.Io.getConfigStore();
        var cacheKey = [this.$className, this.getId()];
        var objConf = configStore.getObjectConfig(cacheKey);
        if(objConf) {
            objConf.data = merged;
            configStore.setObjectConfig(cacheKey,objConf);
        }
        this.fireEvent("updated", data, isRemote);
    },

    /**
    * @private
    * Removes the config for this object from persistant cache.
    */
    removeCached: function(){
            var configStore = Ext.io.Io.getConfigStore();
            var cacheKey = [this.$className, this.getId()];
            var objConf = configStore.remove(cacheKey);
    },


    /** 
     * @private
     *
     * Destroy
     *
     * @param {Function} callback The function to be called after destroying the object.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    destroy: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.destroy(function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.$className, this.getId());
                    }else{
                        callback.call(scope,err);                    
                    }
                },
                this
            );
        },this);
    },

    /** 
     * @private
     *
     * Create Related Entity
     *
     * @param {String} method
     * @param {String} klass
     * @param {Object} data
     * 
     * @param {Function} callback The function to be called after creating related entities.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    createRelatedObject: function(method, klass, data, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.createRelatedObject(function(result) {
                            if(result.status == "success") {
                                var object = Ext.create(klass, {id:result.value._key, data:result.value.data});
                                callback.call(scope, object);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), method, data);
                    }else{
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        },this);
    },

    /** 
     * @private
     *
     * Get Related Object
     *
     * @param {String} klass
     * @param {String} key
     * @param {String} tag
     * 
     * @param {Function} callback The function to be called after getting related object.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    getRelatedObject: function(klass, key, tag, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.getRelatedObject(function(result) {
                            if(result.status == "success") {
                                var object = null;
                                if(result.value && result.value !== null) { // it's possible there is no linked object
                                    object = Ext.create(klass, {id:result.value._key, data:result.value.data});
                                }
                                callback.call(scope, object);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), klass.$className, key, tag);
                    }else{
                        callback.call(scope, undefined, err);
                    }
                },
                this
            );
        },this);
    },

    /** 
     * @private
     *
     * Get Related Objects
     *
     * @param {String} klass
     * @param {String} tag
     *  
     * @param {Function} callback The function to be called after getting related objects.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    getRelatedObjects: function(klass, tag, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.getRelatedObjects(function(result) {
                            if(result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(klass, {id:result.value[i]._key, data:result.value[i].data}));
                                }
                                callback.call(scope, objects);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), klass.$className, tag);
                    }else{
                        callback.call(scope, undefined, err);
                    }
                },
                this
            );
        },this);
    },

    /** 
     * @private
     *
     * Find Related Objects
     *
     * @param {String} klass
     * @param {String} key
     * @param {String} tag
     * @param {String} query
     *  
     * @param {Function} callback The function to be called after finding related objects.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    findRelatedObjects: function(klass, key, tag, query, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.findRelatedObjects(function(result) {
                            if(result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(klass, {id:result.value[i]._key, data:result.value[i].data}));
                                }
                                callback.call(scope, objects);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), klass.$className, key, tag, query);
                    }else{
                        callback.call(scope, undefined, err);
                    }
                },
                this
            );
        },this);
    }
});

