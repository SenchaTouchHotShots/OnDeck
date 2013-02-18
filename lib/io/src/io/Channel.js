/**
 *
 *  @aside guide concepts_channel 
 *
 * This class allows the client to make use of message channels.
 * Channels allow for sending messages between users, and groups of users in a application. 
 * For details on how to use Channels see [How to use Channel Services](#!/guide/concepts_channel)
 * 
 */
Ext.define('Ext.io.Channel', {
    extend: 'Ext.io.Object',
    
    mixins: {
        observable: "Ext.util.Observable" //using util instead of mixin for EXT 4 compatibility. 
    },
    
    /**
    * @event message
    * Fired when the channel receives a message.
    * @param {Ext.io.Sender} sender The user/device that sent the message
    * @param {Object} the message sent.
    */

    statics: {
    
        /**
         * @static
         * Get a named channel
         *
         * All instances of an app have access to the same
         * named channels. If an app gets the same named channel on many devices then
         * those devices can communicate by sending messages to each other. Messages 
         * are simple javascript objects, which are sent by publishing them through 
         * a channel, and are received by other devices that have subscribed to the 
         * same channel.
         *
         *          Ext.io.Channel.get(
         *               { name: 'music' },
         *               function(channel){
         *               }
         *           );     
         *
         * @param {Object} options Channel options may contain custom metadata in addition to the name, which is manadatory
         * @param {String} options.name Name of the channel
         *
         * @param {Function} callback The function to be called after getting the channel.
         * @param {Object} callback.channel The named {Ext.io.Channel} if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        get: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "name", type: 'string' }
            ],arguments, "Ext.io.Channel", "get")) { 
                 callback.call(scope, Ext.create('Ext.io.Channel', options));
            }
        },

        /**
         * @static
         * @private
         *
         * Find channels that match a query.
         * 
         * Returns all the channel objects that match the given query. The query is a String
         * of the form name:value. For example, "city:austin", would search for all the
         * channels with a meta data key of city and  value of Austin. 
         * Find uses the metadata supplied when the channel was created. 
         * 
         * 
         *       Ext.io.Channel.find(
         *           { query: 'city:austin' },
         *           function(channels){
         *           }
         *       );
         *
         * @param {Object} options An object which may contain the following properties:
         * @param {Object} options.query
         *
         * @param {Function} callback The function to be called after finding the matching channels.
         * @param {Array} callback.channels An array of  {Ext.io.Channel} objects matching channels found for the App if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        find: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "query", type: 'string' }
            ],arguments, "Ext.io.Channel", "find")) {
                Ext.io.App.getCurrent(function(app,err){
                  if(app){
                      app.findChannels(options,callback,scope);
                  }else{
                      callback.call(scope,app,err);
                  }
                });
            }
        }
    },

    config: {
        name: null,

        /*
        @private
        */
        queueName: null,
        
        /**
        * @cfg {Boolean} subscribeOnStart
        * Channel will automatically subscribe 
        * to channel messages when the channel is created. 
        * @accessor
        */
        subscribeOnStart: true,
        
      /**
        * @cfg {Array} boundStores
        * List of store ids to be bound to this channel.
        *
        * boundStores:{
                messages : {   // Id of the store Ext.getStore("messages")
                    enabled: true,  // enabled by default
                    // transform is called for each new message on the channel. 
                    // execute the callback function and pass an object that 
                    // will be added to the store. 
                    transform: function(callback, sender, message){
                        console.log("channel message transform", sender, message);

                        sender.getUser(function(user){
                            console.log("sender user", user);
                            callback({message: message.message, user: ( user ? user.getData().username : "guest")});
                        });
                    }
                }
            }
        */
        boundStores:{}
    },
    
    /**
     * @private
     *
     * @param {Object} config
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);

        
        this.boundStores = [];
        this._init(function(channelConf, error){
            this.fireEvent("initComplete");
            if(error){
              Ext.cf.util.Logger.error("Unable to create Chanel ", this, error);
            } else {  
                if(channelConf._key){
                    this.setId(channelConf._key);
                }
                
                this.setData(channelConf.data);
                if(this.getSubscribeOnStart()){
                    this.subscribe();
                }
                
                var storesToBind = this.getBoundStores();
                var store;
                for(store in storesToBind){
                    var conf = {
                        enabled: true,
                        transform: undefined
                    };
                    var toBind = storesToBind[store];
                    if(typeof toBind == "boolean") { // true or false
                        conf.enabled = toBind;
                    } else if(!toBind) { // null or undefined
                        conf.enabled = true;
                    } else if(typeof toBind == "function"){ // users passes function
                        conf = {
                            enabled: true,
                            transform: conf
                        };
                    } else {
                        conf.enabled = (typeof toBind.enabled == "boolean" ? toBind.enabled : true);
                        conf.transform = toBind.transform;
                    }
                    
                    storesToBind[store] = conf;
                }            
            }
   
        });
    },
    
    /*
    *@private
    */
    _init: function(callback) {
        var scope = this;
        var appId = Ext.io.Io.getIdStore().getId('app');

        var channelName = this.getName();
        var channel = this.getData();

        var configStore = Ext.io.Io.getConfigStore();

        if(!channelName && channel.name) {
            //we came from getRelatedObject() query and we don't need call AppService again.
            channelName = channel.name;
            this.setSubscribeOnStart(false); // don't want to auto subscribe if we are looking for a channel. 
        } else {
            channel = configStore.getObjectConfig('channel-' + channelName);
        }

        var queueName = appId + "." + channelName;

        this.setQueueName(queueName);
        
  
        if (!channel) {
            Ext.io.Io.getMessagingProxy(function(messaging) {
                messaging.getService({
                    name: "AppService"
                }, function(AppService, err) {
                    var self = this;
                    if (AppService) {
                        AppService.getChannel(function(result) {
                            if (result.status == "success") {
                                configStore.setObjectConfig('channel-' + channelName, result.value);
                                callback.call(scope, result.value);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, appId, {
                            name: channelName
                        });
                    } else {
                        callback.call(scope, undefined, err);
                    }
                }, this);
            }, this);
        } else {
            callback.call(scope, channel);
        }
    },

    
    /**
     * Publish a message to this channel.
     *
     * The message will be delivered to all devices subscribed to the channel.
     *
     *      channel.publish(
     *             { message: { 
     *                 score: 182
     *             }},
     *             function(error) {
     *          
     *             }   
     *       );
     *
     * @param {Object} options
     * @param {Object} options.message A simple Javascript object.
     * @param {number} options.expires  optional time in seconds the message should be buffered on this client when not connected to the server. If the message can not be delivered in the alloted time the message will be discarded. A value of zero will result in the message being discarded immediately if delivery fails.
     * @param {Function} callback The function to be called after sending the message to the server for delivery.
     * @param {Object} callback.err an error object. Will be null/undefined if there wasn't an error.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    publish: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
           { name: "message", type: 'object|string'},
            {name: "expires", type: 'number', optional: true  }
        ],arguments, "Ext.io.Channel", "publish")) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.pubsub.publish(this.getQueueName(), this.getId(), options.message,options.expires, callback, scope);
            },this);
        }
    },

    /**
     * @private
     * This method is called automatically on startup. Use the message event instead.
     *
     * Subscribe to receive messages from this channel.
     *
     * To receive messages from a channel, it is necessary to subscribe to the channel.
     * Subscribing registers interest in the channel and starts delivery of messages
     * published to the channel using the callback.
     *
     *
     *       Ext.io.Channel.get(
     *         { name: "table-123" },
     *         function(channel) {
     *           channel.subscribe(
     *             function(sender, message) {
     *             }
     *           );
     *         }
     *       );
     *
     * @param {Function} callback The function to be called after subscribing to this Channel.
     * @param {String} callback.from The sending Device ID.
     * @param {Object} callback.message A simple Javascript object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    subscribe: function(callback,scope) {
        if(!this.subscribedFn){
            this.subscribedFn = function subscribeCallback(sender, message) {
                sender = Ext.create('Ext.io.Sender', sender);
                this.fireEvent("message", sender, message);
                this.updateStores(sender, message);
            };
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.pubsub.subscribe(this.getQueueName(), this.getId(), this.subscribedFn, this, Ext.emptyFn);
            },this);
        } 
        if(callback) {
            this.on("message", callback, scope);
        }
        
    },

    /**
     * Unsubscribe from receiving messages from this channel.
     *
     * Once a channel has been subscribed to, message delivery will continue until a call to unsubscribe is made.
     * If a device is offline but subscribed, messages sent to the channel will accumulate on the server,
     * to be delivered after the device reconnects at a later point of time.
     *
     * @param {Function} callback The function to be called after unsubscribing from this Channel.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    unsubscribe: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Channel", "unsubscribe")) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.pubsub.unsubscribe(this.getQueueName(), this.getId(), callback, scope);
            },this);
        }
    },
    
    
    /**
    * Bind a store to this queue. All messages will be added as records to the store. 
    * A transform function can be passed to map the sender, and message into the store's model.
    * if the transform returns null|undefined|false then no record will be added to the store.
    *
    * @param {String} storeId the id of the store or the store object itself
    * @param {Function} transform optional function to map message to record.
    * @param {Function} transform.callback callback function to call when the message is ready to be added to the store. 
    * @param {Ext.io.Sender} transform.sender The user/device that sent the message
    * @param {Object} transform.message the message sent.
    * @param {Object} scope The scope in which to execute the transform: The "this" object for
    * 
    * the transform function.
    * 
    */
    bindStore: function(storeId, transform, scope, enabled) {
        if(Ext.cf.util.ParamValidator.validateApi([
                        { name: "store", type: "object|string"}, 
                        { name: "transform", type: "null|function", optional: true }, 
                        { name: "scope", type: "null|object|function", optional: true },
                        { name: "enabled", type: "boolean", optional: true }
                    ], arguments, "Ext.io.Channel", "bindStore")) {
            var store = Ext.getStore(storeId); 
            if(!store) {
                Ext.cf.util.Logger.warn("Ext.io.Channel.bindStore could not find store", store);
            }
            
            var boundStores = this.getBoundStores();
            scope = scope || this;
            if(transform) {
                transform = Ext.bind(transform, scope);    
            }
            boundStores[store] = {
                enabled: typeof enabled == "boolean"  ? enabled : false,
                transform: transform
            };
            
            Ext.cf.util.Logger.debug("Binding store " + storeId + " to channel", this);
            
        } 
    
    },
    
    /**
    * removes a store from the bound stores list.
    * @param {String} store the id of the store or the store object itself
    */
    unbindStore: function(storeId){
        if(Ext.cf.util.ParamValidator.validateApi([
            { name: "store", type: "string"}], arguments, "Ext.io.Channel", "unbindStore")) {
            var boundStores = this.getBoundStores();
            if(boundStores){
                var bound = boundStores[storeId];
                if(bound){                   
                    boundStores[storeId] = undefined;
                } else {
                    Ext.cf.util.Logger.warn("Ext.io.Channel.unbindStore could not find store to unbind", storeId);
                }
            }
            
        }
    },
    
    
    /**
    * suspend or resume the delivery of messages to a store.
    * @param {String} store the id of the store
    * @param {Boolean} disable true to disable delivery or false to re-enable delivery. default is true.
    */
    disableStore: function(storeId, disable) {
        if(Ext.cf.util.ParamValidator.validateApi([
                        { name: "store", type: "string"}, 
                        { name: "disable", type: "boolean", optional:"true"}
                    ], arguments, "Ext.io.Channel", "diableStore")) {
            var boundStores = this.getBoundStores();
            if(typeof disable == "undefined") {
                disable = true;
            }
            
            if(boundStores){
                var bound = boundStores[storeId];
                if(bound){
                    bound.enabled = !disable;
                    return;
                }    
            }
            Ext.cf.util.Logger.error("Could not find store in channel, check store id and channel configuration", {storeId: storeId, disable: disable, channel: this});
        }
        
    },
    
    
    /**
    * @private
    */
    updateStores: function(sender, message){
        var boundStores = this.getBoundStores();
        var storeId;
        for(storeId in boundStores){
            this.updateStore(sender, message, storeId, boundStores[storeId]);
        }    
    },
    updateStore: function (sender, message, storeId, bound) {
            if(bound){
                var store = Ext.getStore(storeId);
                if(!store) {
                    Ext.cf.util.Logger.error("Could not find store in channel, check store id and channel configuration", storeId, bound);
                } else {
                    if(bound.enabled === true) {
                        var cb = function(record){
                            //console.log("callback record", record);
                            if(record){
                                store.add(record);    
                            }   
                        };
                        var record = bound.transform ? bound.transform(cb, sender, message, store, this) : message;
                        if(record){
                            store.add(record);    
                        }  
                    } else {
                        Ext.cf.util.Logger.debug("Ext.io.Channel: skipping store update as it is disabled", storeId, this);
                    }
                }    
            }
    }
    
});
