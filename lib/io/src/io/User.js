/**
 * @aside guide concepts_user
 *
 * The Ext.io.User class represents the person using the app on the device.
 * It has a one-to-many relationship with the Ext.io.Device class. 
 * A full description of the Ext.io.User class can be found in [How to use User Services](#!/guide/concepts_user).
 *
 * User authentication and registration is handled by Ext.io.Controller.  More details can be found in [How to use Application Controller](#!/guide/concepts_controller).
 *
 * Once the user has been registered or authenticated then the current user 
 * object will always be available using Ext.io.User.getCurrent.
 *
 *      Ext.io.User.getCurrent(
 *          function(user){
 *              
 *          } 
 *      );
  *
  * ## User Messaging
 *
 * Applications can send messages to other users by calling Ext.io.User.send.
 *
 *          user.send({
 *              from: 'John', text: 'Hey!'
 *          });
 *
 * A user can listen for messages from other users by listening for the message event.
 *
 *          Ext.io.User.getCurrent(
 *             function(user){
 *
 *                user.on("message"
 *                    function(sender, message) {
 *                        console.log("user message", sender, message);
 *                    }
 *                );
 *
 *             } 
 *          );
 *
 * If the user has multiple devices running the same app, then the same message will be received by all those
 * app instances. 
 *
 *
 * Sending a message to all of current user's devices
 * ----
 * If an application calls send on the current user a message will be delivered to all of users devices in that application
 * As with other channel messages the message will not echo back to the device that actually sent the message.
 *          Ext.io.User.getCurrent(
 *             function(user){
 *
 *                user.send(...)
 *
 *             } 
 *          );
 *  
 * 
 * To send a message to all devices running the same app the client would use Ext.io.Channel.
 *
 * To send a message to a specific device the client would use Ext.io.Device
 * 
 * ## User Logout
 *
 * The Ext.io.User.logout method will end the user's session.
 *
 * 
 */
Ext.define('Ext.io.User', {
    extend: 'Ext.io.Object',

    requires: [
            'Ext.io.Sender',
            'Ext.io.Store',
            'Ext.io.Device'
        ],

    mixins: {
        observable: "Ext.util.Observable", //using util instead of mixin for EXT 4 compatibility. 
        withchannel: "Ext.io.WithChannel"
    },
    
    /**
    * @event message
    * Fired when the user receives a message.
    * @param {Ext.io.Sender} sender The user/device that sent the message
    * @param {Object} the message sent.
    */



    /**
    * @event connected
    * Fired when this user's connection status changes.
    * Must call {Ext.io.Object.watch} to receive this event.
    * @param {boolean} isConnected true when the user is connected.
    */
    

    
    statics: {
        /**
         * @static  
         * Register a new User.
         * 
         * If the user does not already exist in the group then a new user is created,
         * and is returned as an instance of {@link Ext.io.User}.
         *
         *       Ext.io.User.register(
         *           {
         *               email:'bob@isp.com',
         *               password:'secret'
         *           }
         *           function(user){
         *           }
         *      );
         *
         * @param {Object} options User profile attributes.
         * @param {Object} options.email
         * @param {Object} options.password
         *
         * @param {Function} callback The function to be called after registering the user.
         * @param {Object} callback.user The {Ext.io.User} if registration succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        register: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "email", type: 'string' },
               { name: "password", type: 'string' }
               ],arguments, "Ext.io.User", "register")) {
              Ext.io.Group.getCurrent(function(group,err){
                  if(group){
                      group.register(options,callback,scope);
                  }else{
                      callback.call(scope,group,err);
                  }
              });
            }
        },

        /**
         * @static  
         * Authenticate an existing User.
         *
         * Checks if the user is a member of the group. The user provides an email address
         * and password. If the user is a member of the group, and the passwords match,
         * then an instance of {@link Ext.io.User} is returned. The current user object is
         * now available through {@link Ext.io.User.getCurrent}
         *
         *       Ext.io.User.authenticate(
         *           {
         *               uemail:'bob@isp.com',
         *               password:'secret'
         *           },
         *           function(user){
         *           }
         *      );
         *
         * We use a digest based authentication mechanism to ensure that no
         * sensitive information is passed over the network.
         *
         * @param {Object} options Authentication credentials
         * @param {Object} options.email
         * @param {Object} options.password
         *
         * @param {Function} callback The function to be called after authenticating the user.
         * @param {Object} callback.user The {Ext.io.User} if authentication succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        authenticate: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope(null,arguments, "Ext.io.User", "authenticate")) {
                Ext.io.Group.getCurrent(function(group,err){
                    if(group){
                        //Once we have user, before we return it to the caller
                        // enable recieve so that we will get user messages.
                        var cb = function(user,errors){
                            if(user) {
                                user.receive();
                            }
                            callback.call(scope, user, errors);
                        };
                        group.authenticate(options,cb,scope);
                    }else{
                        callback.call(scope,group,err);
                    }
                });
            }
        },

        /**
         * @static  
         * @private
         * Find Users that match a query.
         *
         * Returns all the user objects that match the given query. The query is a String
         * of the form name:value. For example, "hair:brown", would search for all the
         * users with brown hair, assuming that the app is adding that attribute to all
         * its users. 
         *
         *       Ext.io.User.find(
         *           {query:'username:bob'},
         *           function(users){
         *           }
         *       );
         *
         * @param {Object} options An object which may contain the following properties:
         * @param {Object} options.query
         *
         * @param {Function} callback The function to be called after finding the matching users.
         * @param {Array} callback.users Array of {Ext.io.User} objects that match the query. 
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        find: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([{ name: "query", type: 'string' }],arguments, "Ext.io.User", "find")) {
                Ext.io.Group.getCurrent(function(group,err){
                    if(group){
                        group.findUsers(options,callback,scope);
                    }else{
                        callback.call(scope,group,err);
                    }
                });
            }
        },

        /**
         * @static        
         * Get the current User, if any.
         *
         * The current User object is an instance of {@link Ext.io.User}. It represents
         * the user of the web app. If there is no group associated with the app,
         * then there will not be a current user object. If there is a group, and
         * it has been configured to authenticate users before download then the
         * current user object will be available as soon as the app starts running.
         * If the group has been configured to authenticate users within the app
         * itself then the current user object will not exist until after a
         * successful call to Ext.io.User.authenticate has been made.
         *
         *          Ext.io.User.getCurrent(
         *              function(user){
         *              } 
         *          );
         *
         * @param {Function} callback The function to be called after getting the current User object.
         * @param {Object} callback.user The current {Ext.io.User} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        getCurrent: function(callback,scope) {
            if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.User", "getCurrent")) {
                var idstore = Ext.io.Io.getIdStore();
                var userId = idstore.getId('user');
                var userSid = idstore.getSid('user');
                var err = null;
                if (!userId) {
                    err = Ext.cf.util.ErrorHelper.get('NO_CURRENT_USER');
                    callback.call(scope,undefined,err);
                } else if (!userSid) {
                    Ext.io.User.removeCachedObject(userId);
                    idstore.remove('user', 'id');
                    err = Ext.cf.util.ErrorHelper.get('USER_NOT_AUTHENTICATED');
                    callback.call(scope,undefined,err);
                } else {
                    if(this.currentUser){
                        callback.call(scope, this.currentUser, null);
                    } else {
                        this.getCachedObject(userId,function(user,errors){
                            if(user) {
                                //
                                // Once we have the user, but before we return it to the caller
                                // we call recieve so that message events will start firing.
                                //
                                user.receive();

                                //
                                // Automatically watch the current user for changes so
                                // we will always have the latest.
                                user.watch();


                                this.currentUser = user;
                            }
                            callback.call(scope, user, errors);
                        },this);
                    }
                   
                }
            }
        },

        /**
         * @static
         * Get User
         *
         * @param {Object} options
         * @param {String} options.id
         *
         * @param {Function} callback The function to be called after getting the User object.
         * @param {Object} callback.user The Ext.io.User object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }

    },


    config: {

    },
    
    
    /**
     * @private
     *
     * Constructor
     *
     *
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);


        this.userChannelName =  'Users/' + this.getId();

        this.on("updated",
            function(changed, remote) {
                if(remote && typeof changed.connected == "boolean"){
                    this.fireEvent("connected", changed.connected);
                }
        }, this);
        // name of the user channel (inbox)
    },
    
    
    
    /**
     * Reset a user's password
     * @param {String} options.oldpass  new password 
     * @param {String} options.newpass  new password
     *
     * @param {Function} callback The function to be called after changePassword has executed.
     * @param {Boolean} callback.success true if user was found and code was sent.
     * @param {Object} callback.err an error object if there was a problem sending the message
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    changePassword: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([{ name: "oldpass", type: 'string' }, { name: "newpass", type: 'string' }],arguments, "Ext.io.User", "changePassword")) {
             Ext.io.Io.getMessagingProxy(function(messaging){
                    messaging.getService(
                        {name: "GroupManager"},
                        function(groupManager,err) {
                            if(groupManager){
                                groupManager.changePassword(function(results){
                                    if(results.error){
                                        callback.call(scope, undefined, results.error);   
                                    } else {
                                        callback.call(scope, results.status=="success", undefined);   
                                    }
                                }, this.getId(), options.oldpass, options.newpass);
                            }
                        }, this);
                },this);
        }
    },
    

    /**
     * Get all devices that belong to this user
     *
     *          user.getDevices(
     *              function(devices){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the devices that belong to this user.
     * @param {Object} callback.devices Array of {Ext.io.Device} objects that belonging to this User.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getDevices: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.User", "getDevices")) {
            this.getRelatedObjects(Ext.io.Device, null, callback, scope);
        }
    },

    /**
     * @private
     * Get the user group that this user is a member of.
     *
     *          user.getGroup(
     *              function(group){
     *              } 
     *          });
     *
     * @param {Function} callback The function to be called after getting the Group object.
     * @param {Object} callback.group The {Ext.io.Group} object for this User if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getGroup: function(callback,scope) {
        Ext.io.Group.getCurrent(callback,scope);
        //this.getRelatedObject(Ext.io.Group, this.getData().group, null, callback, scope);
    },

    /**
     * Send a message to this User.
     *
     *
     *        user.send(
     *            {message:{fromDisplayName: 'John', text: 'Hello'}},
     *            function(error) {
     *              console.log("send callback", error);
     *            }
     *        );
     *
     *  *Note that the callback fires when the server accepts the message, not when the message
     *  is delivered to the user.*
     *
     * @param {Object} options
     * @param {Object} options.message A simple Javascript object.
     * @param {number} options.expires optional time in seconds the message should be buffered on this client when not connected to the server. If the message can not be delivered in the alloted time the message will be discarded. A value of zero will result in the message being discarded immediately if delivery fails.
     *
     * @param {Function} callback The function to be called after sending the message to the server for delivery.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    send: function(options,callback,scope) {
        var self = this;
        
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([{ name: "message", type: 'string|object'},
            {name: "expires", type: 'number', optional: true }],arguments, "Ext.io.User", "send")) {
            self.getChannelKey(function(channel, err) {
                if (channel) {
                    Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.pubsub.publish(self.userChannelName, channel, options.message, options.expires, callback, scope);
                    },self);
                } else {
                    Ext.cf.util.Logger.error("Unable to get user Channel");
                }
            });
        }
    },

    /**
     * @private
     * Called by Ext.io.User.getCurrent to get messages delivered to this user see Ext.io.User.message
     * 
     * Receive messages for this User.
     *
     *      user.receive(
     *          function(sender, message) {
     *              console.log("received a message:", sender, message);
     *          }
     *      );
     *
     *
     * @param {Function} callback The function to be called after a message is received for this User.
     * @param {Ext.io.Sender} callback.sender  The user/device that sent the message
     * @param {Object} callback.message A simple Javascript object.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    receive: function(callback,scope) {

        var self = this;
        
        if(callback) {
            self.on("message", callback, scope);
        }
        
        if(!self.subscribedFn){
            self.subscribedFn = function receiveCallback(from, message) {
                var sender = Ext.create('Ext.io.Sender', from);
                self.fireEvent("message", sender, message);
            };
            self.getChannelKey(function(channel, err) {
                if (channel) {
                    Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.pubsub.subscribe(self.userChannelName, channel, self.subscribedFn, self, Ext.emptyFn);
                    },self);
                } else {
                    Ext.cf.util.Logger.error("Unable to get user Channel");
                }
            });
        } 
      
    },

    /**
     * Logout

     * Removes the user's session and id from local storage.  This will 
     * keep the user from having further access to the authenticated parts
     * of the application.  However this does not clear copies of sync stores.
     * To do that the application must call `store.getProxy().clear()` on every 
     * user or application store. The application is also responsible for removing 
     * any other user data it has stored elsewhere.
     * 
     * Also calls server to delete the user's session.
     *
     * @param {Function} callback Optional function to be called user is logged out
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    logout: function(callback,scope) {
        var self = this;
        Ext.io.Io.getService({name: "GroupManager"}, function(groupManager, err) {
            if (!err && groupManager) {
                self.getGroup(function(group, err) {
                    if (!err && group) {
                        groupManager.logoutUser(function(result, err) {
                            if (err) {
                                Ext.cf.util.Logger.warn("Group Manager logoutUser failed" , err);
                            }
                            self._clearUser(callback,scope);
                        }, {groupId:group.getId()});
                    } else {
                        Ext.cf.util.Logger.warn("Unable to get group for user" , err);
                        self._clearUser(callback,scope);
                    }
                });
            } else {
                Ext.cf.util.Logger.warn("Unable to get GroupManager service" , err);
                self._clearUser(callback,scope);
            }
        }, this);
    },

    _clearUser: function(callback,scope) {
        Ext.io.User.currentUser = undefined;
        this.removeCached();
        Ext.io.Io.getIdStore().remove('user','sid');
        Ext.io.Io.getIdStore().remove('user','id');
        if (callback) callback.call(scope);
    },

    /**
     * Checks to see if the User has an active connection to the server.
     *
     *          user.isConnected(
     *              function(isConnected){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after determining whether user is connected.
     * @param {Object} callback.isConnected Boolean indicating whether user is connected.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     * A connected user is a user that has a web socket connection open to the server and is logged in.
     *
     */
    isConnected: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "PresenceService"},
                function(presenceService,err) {
                    if(presenceService){
                        presenceService.isConnectedUser(function(result) {
                            if (result.status == "success") {
                                callback.call(scope, result.value);
                            } else {
                                callback.call(scope,undefined,result.error);
                            }
                        }, this.getId());
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
     * Get a Store
     *
     * All instances of a user have access to the same stores. 
     *
     *          user.getStore(
     *               {
     *                   name:music,
     *                   city:austin
     *               },
     *               function(store){
     *               }
     *           );     
     *
     * @param {Object} options Store options may contain custom metadata in addition to the name, which is manadatory
     * @param {String} options.name Name of the store
     *
     * @param {Function} callback The function to be called after getting the store.
     * @param {Object} callback.store The named {Ext.io.Channel} if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getStore: function(options,callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.getStore(function(result) {
                            if(result.status == "success") {
                                var store = Ext.create('Ext.io.Store', {id:result.value._key, data:result.value.data});
                                callback.call(scope,store);
                            } else {
                                callback.call(scope,undefined,result.error);
                            }
                        }, this.getId(), options);
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
     * Find stores that match a query.
     * 
     * Returns all the store objects that match the given query. The query is a String
     * of the form name:value. For example, "city:austin", would search for all the
     * stores in Austin, assuming that the app is adding that attribute to all
     * its stores. 
     *
     *       user.findStores(
     *           {query:'city:austin'},
     *           function(stores){
     *           }
     *       );
     *
     * @param {Object} options An object which may contain the following properties:
     * @param {Object} options.query
     *
     * @param {Function} callback The function to be called after finding the matching stores.
     * @param {Object} callback.stores The {Ext.io.Store[]} matching stores found for the App if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    findStores: function(options,callback,scope) {
        this.findRelatedObjects(Ext.io.Store, this.getId(), null, options.query, callback, scope);    
    },

    /**
     * Get all stores that belong to this user
     *
     *          user.getStores(
     *              function(stores){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the stores that belong to this user.
     * @param {Object} callback.stores Array of {Ext.io.Store} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getStores: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.User", "getStores")) {
            this.getRelatedObjects(Ext.io.Store, null, callback, scope);
        }
    }

});
