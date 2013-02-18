/**
 * @private
 * Developer 
 *
 */
Ext.define('Ext.io.Developer', {
    extend: 'Ext.io.Object',
    requires: [
        'Ext.io.Sender',
        'Ext.cf.util.Md5', 
        'Ext.cf.util.ErrorHelper'
    ],
    
    mixins: {
        observable: "Ext.util.Observable", //using util instead of mixin for EXT 4 compatibility. 
        withchannel: "Ext.io.WithChannel"
    },
        
    statics: {

        /**
         * @static
         * Authenticate developer
         *
         * @param {Object} options
         * @param {String} options.username
         * @param {String} options.password
         *
         * @param {Function} callback The function to be called after authenticating the developer.
         * @param {Object} callback.developer The {Ext.io.Developer} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        authenticate: function(options,callback,scope) {
            var self = this;

            Ext.io.Io.getService(
                {name: "TeamManager"},
                function(devService,err) {
                    if(devService){
                        devService.authenticate(function(result) {
                            if (result.status == "success") {
                                var developer = Ext.create('Ext.io.Developer', {id:result.value._key, data:result.value.data});                            
                                Ext.io.Io.getIdStore().setSid('developer', result.session.sid);
                                Ext.io.Io.getIdStore().setId('developer', result.value._key);
                                callback.call(scope,developer);
                            } else {
                                callback.call(scope,undefined,result.error);
                            }
                        }, {username : options.username, password : options.password, provider:"sencha"});
                    }else{
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        },

        /**
         * @static
         * Get current developer
         *
         * @param {Function} callback The function to be called after getting the current Developer object.
         * @param {Object} callback.developer The current {Ext.io.Developer} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        getCurrent: function(callback,scope) {
            if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Developer", "getCurrent")) {
                var idstore = Ext.io.Io.getIdStore();
                var developerId = idstore.getId('developer');
                var developerSid = idstore.getSid('developer');

                if (!developerId || !developerSid) {
                    var err = Ext.cf.util.ErrorHelper.get('DEVELOPER_NOT_LOGGED_IN');
                    callback.call(scope,undefined,err);
                } else {
                    this.getObject(developerId, function(developer, error) {
                        if(developer) {
                            developer.receive();
                        }
                        callback.call(scope, developer, error);
                    }, this);
                }
            }
        },

        /**
         * @static
         * Get Developer
         *
         * @param {Object} options
         * @param {String} options.id
         *
         * @param {Function} callback The function to be called after getting the current Developer object.
         * @param {Object} callback.developer The {Ext.io.Developer} object if the call succeeded.
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
     * @private
     *
     * Constructor
     *
     *
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);


        if (Ext.getVersion('extjs')) {
            this.mixins.observable.constructor.call(this, config);
        }

        this.developerChannelName =  'Developers/' + this.getId();
        // name of the developer channel (inbox)
    },

    /**
     * Send a message to this Developer.
     *
     *
     *        developer.send(
     *            {message:{fromDisplayName: 'John', text: 'Hello'}},
     *            function(error) {
     *              console.log("send callback", error);
     *            }
     *        );
     * 
     *  *Note that the callback fires when the server accepts the message, not when the message
     *  is delivered to the developer.*
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
            {name: "expires", type: 'number', optional: true }],arguments, "Ext.io.Developer", "send")) {
            self.getChannelKey(function(channel, err) {
                if (channel) {
                    Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.pubsub.publish(self.developerChannelName, channel, options.message, options.expires, callback, scope);
                    },self);
                } else {
                    Ext.cf.util.Logger.error("Unable to get developer Channel");
                }
            });
        }
    },

    /**
     * @private
     * Called by Ext.io.Developer.getCurrent to get messages delivered to this developer see Ext.io.Developer.message
     * 
     * Receive messages for this Developer.
     *
     *      developer.receive(
     *          function(sender, message) {
     *              console.log("received a message:", sender, message);
     *          }
     *      );
     *
     *
     * @param {Function} callback The function to be called after a message is received for this Developer.
     * @param {Ext.io.Sender} callback.sender  The developer/device that sent the message
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
                        messaging.pubsub.subscribe(self.developerChannelName, channel, self.subscribedFn, self, Ext.emptyFn);
                    },self);
                } else {
                    Ext.cf.util.Logger.error("Unable to get developer Channel");
                }
            });
        } 
      
    },

    /**
     * Get Teams
     *
     * @param {Object} options
     *
     * @param {Function} callback The function to be called after getting the Developer's teams.
     * @param {Object} callback.teams The {Ext.io.Team[]} teams of the developer if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    getTeams: function(options,callback,scope) {
        var tag = (typeof(options.owner) != "undefined") ? ((options.owner === 'owner') ? 'owner' : 'member') : null;
        this.getRelatedObjects(Ext.io.Team, tag, callback, scope);
    },

    /**
     * Create Team
     *
     * @param {Object} options
     *
     * @param {Function} callback The function to be called after creating a team.
     * @param {Object} callback.team The {Ext.io.Team} object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    createTeam: function(options,callback,scope) {
        this.createRelatedObject("createTeam", Ext.io.Team, options, callback, scope);
    },

    /**
     * Logout

     * Removes the developer's session and id from local storage. This will 
     * keep the developer from having further access to the authenticated parts
     * of the application.
     * 
     * Also calls server to delete the developer's session.
     * 
     * @param {Function} callback Optional function to be called developer is logged out
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    logout: function(callback,scope) {
        var self = this;
        Ext.io.Io.getService({name: "TeamManager"}, function(teamManager, err) {
            if (!err && teamManager){
                teamManager.logoutDeveloper(function(result, err) {
                    if (err) {
                        Ext.cf.util.Logger.warn("Team Manager logoutDeveloper failed" , err);
                    }
                    self._clearDeveloper(callback,scope);
                });
            } else {
                Ext.cf.util.Logger.warn("Unable to get TeamManager service" , err);
                self._clearDeveloper(callback,scope);
            }
        }, this);
    },

    _clearDeveloper: function(callback,scope) {
        Ext.io.Io.getIdStore().remove('developer','sid');
        Ext.io.Io.getIdStore().remove('developer','id');
        if (callback) callback.call(scope);
    },

    /**
     * @private
     * Determine whether developer is connected.
     *
     *          developer.isConnected(
     *              function(isConnected){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after determining whether developer is connected.
     * @param {Object} callback.isConnected Boolean indicating whether developer is connected.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     * A connected developer is a developer that has a web socket connection open to the server and is logged in.
     *
     */
    isConnected: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "PresenceService"},
                function(presenceService,err) {
                    if(presenceService){
                        presenceService.isConnectedDeveloper(function(result) {
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
    }
    
});