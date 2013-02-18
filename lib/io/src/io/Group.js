/**
 * @private
 * {@img group.png Class Diagram}
 *
 * The {@link Ext.io.Group} class represents a group of users. There is only one
 * group object, called the current group object, available to the client.
 * If the current app is not associated with a user group then there will
 * be no user group.
 *
 *          Ext.io.Group.getCurrent(
 *             function(group){
 *              
 *             } 
 *          );
 *
 *
 * Methods are provided for navigation through the graph of objects available
 * to the currently running client code. 
 */
Ext.define('Ext.io.Group', {
    extend: 'Ext.io.Object',

    requires: [
        'Ext.cf.messaging.AuthStrategies'
    ],

    statics: {
        
        /**
        * @static
        * @private
        *  Called on bootup by Io with the current group data.
        * 
        */
        setCurrent: function(groupConfig){
            this._currentGroup = Ext.create("Ext.io.Group", {id:groupConfig._key, data:groupConfig.data});
        },

        /**
         * @static
         * Get the current user Group object.
         *
         *          Ext.io.Group.getCurrent(
         *              function(group){
         *              } 
         *          );
         *
         * @param {Function} callback The function to be called after getting the current Group object.
         * @param {Object} callback.group The current {Ext.io.Group} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        getCurrent: function(callback,scope) {
            callback.call(scope, this._currentGroup);
        },


        /**
         * @static
         * Get Group
         *
         * @param {Object} options
         * @param {String} options.id
         *
         * @param {Function} callback The function to be called after getting the Group object.
         * @param {Object} callback.group The current {Ext.io.Group} Object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }
    },

    /**
     * Get the App associated with this user Group.
     *
     * Returns an instance of {@link Ext.io.App} for the current app.
     *
     *      group.getApp(
     *          function(app) {
     *          }
     *      );
     *
     * @param {Function} callback The function to be called after getting the App object.
     * @param {Object} callback.app The {Ext.io.App} associated with this Group if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getApp: function(callback,scope) {
        Ext.io.App.getCurrent(callback,scope);
    },

    /**
     * Find Users that match a query.
     *
     * Returns all the user objects that match the given query. The query is a String
     * of the form name:value. For example, "hair:brown", would search for all the
     * users with brown hair, assuming that the app is adding that attribute to all
     * its users. 
     *
     *       group.findUsers(
     *           {query:'username:bob'},
     *           function(users){
     *           }
     *       );
     *
     * @param {Object} options
     * @param {String} options.query
     *
     * @param {Function} callback The function to be called after finding the users.
     * @param {Object} callback.users The {Ext.io.User[]} matching users found for the Group if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    findUsers: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
             { name: "query", type: 'string' }
          ],arguments, "Ext.io.Group", "findUsers")) {
              this.findRelatedObjects(Ext.io.User, null, null, options.query, callback, scope);
        }
    },

    /**
     * Get all users that belong to this group
     *
     *          group.getUsers(
     *              function(users){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the users that belong to this group.
     * @param {Object} callback.users Array of {Ext.io.User} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getUsers: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Group", "getUsers")) {
            this.getRelatedObjects(Ext.io.User, null, callback, scope);
        }
    },

    /**
     * @private
     * Get all connected users that belong to this group
     *
     *          group.getConnectedUsers(
     *              function(users){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the connected users that belong to this group.
     * @param {Object} callback.users Array of connected {Ext.io.User} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     * A connected user is a user that has a web socket connection open to the server and is logged in.
     *
     */
    getConnectedUsers: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "PresenceService"},
                function(presenceService,err) {
                    if(presenceService){
                        presenceService.getConnectedUsers(function(result) {
                            if (result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(Ext.io.User, {id:result.value[i]._key, data:result.value[i].data}));
                                }
                                callback.call(scope, objects);
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
     * Register a new User.
     * 
     * If the user does not already exist in the group then a new user is created,
     * and is returned as an instance of {@link Ext.io.User}. The same user is now available
     * through the {@link Ext.io.User.getCurrent}.
     *
     *       group.register(
     *           {
     *               email:'bob@isp.com',
     *               password:'secret'
     *           },
     *           function(user){
     *           }
     *      );
     *
     * @param {Object} options User profile attributes.
     * @param {Object} options.email
     * @param {Object} options.password
     *
     * @param {Function} callback The function to be called after registering.
     * @param {Object} callback.user The {Ext.io.User} object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    register: function(options,callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "GroupManager"},
                function(groupManager,err) {
                    if(groupManager){
                        groupManager.registerUser(function(result) {
                            if (result.status == "success") {
                                Ext.io.User.cacheObjectConfig(result.value._key, result.value);
                                Ext.io.Io.getIdStore().setId('user', result.value._key);
                                Ext.io.Io.getIdStore().setSid('user', result.sid);
                                Ext.io.User.getCurrent(callback,scope);
                            } else {
                                callback.call(scope,undefined,result.error);
                            }
                        }, {authuser:options, groupId:this.getId(), provider: "senchaio"});
                    }else{
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        },this);
    },

    /**
     * Authenticate an existing User.
     *
     * Checks if the user is a member of the group. The user provides an email address
     * and password. If the user is a member of the group, and the passwords match,
     * then an instance of {@link Ext.io.User} is returned. The current user object is
     * now available through {@link Ext.io.User.getCurrent}
     *
     *       group.authenticate(
     *           {
     *               email:'bob@isp.com',
     *               password:'secret',
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
     * @param {Function} callback The function to be called after authenticating the developer.
     * @param {Object} callback.developer The {Ext.io.Developer} object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    authenticate: function(options,callback,scope) {
      //  var type = this.getAuthMethod();       
      
        if(!Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
             { name: "provider", type: 'string' }
          ],arguments, "Ext.io.Group", "authenticate")) {
             return;
        }
        
        var auth = Ext.cf.messaging.AuthStrategies.strategies[options.provider];
        if(auth) {
            auth(this, options, function(user, usersid, err) {
                if(user) {
                    Ext.io.User.cacheObjectConfig(user._key,user);
                    Ext.io.Io.getIdStore().setId('user', user._key);
                    Ext.io.Io.getIdStore().setSid('user', usersid);
                    Ext.io.User.getCurrent(callback,scope);
                } else {
                    callback.call(scope,user,err);    
                }
            }, this); 
        } else {
            Ext.cf.util.Logger.error("Unsupported group registration type: " + options.provider + ".  Choose a different type from the managment console.");
        }  
    },
    
    /**
     * Send password recovery code to a user. 
     * @param {String} options.email
     *
     * @param {Function} callback The function to be called after recoverPassword has executed.
     * @param {Boolean} callback.success true if user was found and code was sent.
     * @param {Object} callback.err an error object if there was a problem sending the message
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    recoverPassword: function(options,callback,scope){
         if(!Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
                 { name: "email", type: 'string', optional: true }
              ],arguments, "Ext.io.Group", "recoverPassword")) {
                 return;
            } else {
                
                if(!options.email){
                    var err = Ext.cf.util.ErrorHelper.get('PARAM_MISSING', null, {
                        name: "email",
                        expected: "email must have a non-null value"
                    });
                    callback.call(scope, undefined, err);
                    return;
                } 
                
                
                 Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.getService(
                            {name: "GroupManager"},
                            function(groupManager,err) {
                                if(groupManager){
                                    groupManager.recoverPassword(function(results){
                                        if(results.error){
                                            callback.call(scope, undefined, results.error);   
                                        } else {
                                            callback.call(scope, results.status=="success", undefined);   
                                        }
                                    }, this.getId(), options.email);
                                }
                            }, this);
                    },this);
                
                
            }
        
       
    
    },
    
    
    /**
     * Reset a user's password using a code and a email address
     * @param {String} options.email    the email address the user sent the code to
     * @param {String} options.code     recovery code sent by recoverPassword
     * @param {String} options.newpass  new password 
     *
     * @param {Function} callback The function to be called after recoverPassword has executed.
     * @param {Boolean} callback.success true if user was found and code was sent.
     * @param {Object} callback.err an error object if there was a problem sending the message
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    resetPassword: function(options,callback,scope){
         if(!Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
                 { name: "email", type: 'string'},
                 { name: "code", type: 'string' },
                 { name: "newpass", type: 'string' }
              ],arguments, "Ext.io.Group", "resetPassword")) {
                 return;
            } else {
                
                 Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.getService(
                            {name: "GroupManager"},
                            function(groupManager,err) {
                                if(groupManager){
                                    groupManager.resetPassword(function(results){
                                        if(results.error){
                                            callback.call(scope, undefined, results.error);   
                                        } else {
                                            callback.call(scope, results.status=="success", undefined);   
                                        }
                                    }, this.getId(), options.email, options.code, options.newpass);
                                }
                            }, this);
                    },this);
                
                
            }
        
       
    
    },
    
    
    /**
     * @private
     * returns an array of the enabled auth type objects with the key authType set to the name of the auth method.
     *
     *@param asMap if set to true then a map of the types will be returned instead of an array.
     */
    getEnabledAuthMethods: function(asMap){
        var types = asMap ? {} : [];
        var data = this.getData();
        
        for (var type in data.auth) {
            var method = data.auth[type];
            if(method.enabled === true){
                if(asMap){
                   types[type] = method; 
                } else {
                    var config = Ext.Object.merge(method, {authType: type});
                    types.push(config);                    
                }
            }
        }
        return types;
    },

    /**
     * Find stores that match a query.
     * 
     * Returns all the group's store objects that match the given query. The query is a String
     * of the form name:value. For example, "city:austin", would search for all the
     * stores in Austin, assuming that the app is adding that attribute to all
     * its stores. 
     *
     *       group.findStores(
     *           {query:'city:austin'},
     *           function(stores){
     *           }
     *       );
     *
     * @param {Object} options
     * @param {String} options.query
     *
     * @param {Function} callback The function to be called after finding the stores.
     * @param {Object} callback.stores The {Ext.io.Store[]} matching stores found for the Group if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    findStores: function(options,callback,scope) {
        this.findRelatedObjects(Ext.io.Store, this.getId(), null, options.query, callback, scope);    
    },

    /**
     * Get all stores that belong to this group
     *
     *          group.getStores(
     *              function(stores){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the stores that belong to this group.
     * @param {Object} callback.stores Array of {Ext.io.Store} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getStores: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Group", "getStores")) {
            this.getRelatedObjects(Ext.io.Store, null, callback, scope);
        }
    }

});
