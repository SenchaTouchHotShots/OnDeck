/**
 * @class Ext.io.Controller
   @aside guide concepts_controller 
 
 Application controller for Sencha.io.  This controller when added to an application manages the connection to the Sencha.io servers.
 It provides automatic management of user authentication via a login screen that can be customized to meet your application's needs.

 For details on how to use Controllers see [How to use Application Controller](#!/guide/concepts_controller)
 *
 *
 *
 */
Ext.define('Ext.io.Controller', {

    extend: 'Ext.app.Controller',

    requires: [
    'Ext.io.ux.Strings',
    'Ext.io.Io',
    'Ext.io.User',
    "Ext.io.auth.Facebook",
    "Ext.io.auth.Twitter",
    "Ext.io.ux.AuthSencha",
    "Ext.io.ux.AuthFacebook",
    "Ext.io.ux.AuthTwitter",
    "Ext.io.ux.ChooseAuth",
    "Ext.io.ux.ChangePassword"
    ],

        /**
        * @event ioInitComplete
        * Fired when .io has made a connection to the sencha.io servers.
        */
        
         /**
        * @event checkingAuth
        * Fired when {Ext.io.Controller} is attempting to authorize the user.
        * either using an existing session or via explicit login
        * @param {Ext.io.User} user The authenticated user.
        */
    
        /**
        * @event authorized
        * Fired when the user of this application has successfully authenticated
        * either using an existing session or via explicit login
        * @param {Ext.io.User} user The authenticated user.
        */

        /**
         * @event usermessage
         * Fired when the user receives a message.
         * @param {Ext.io.Sender} sender The user who sent the message
         * @param {Object} the message sent.
         */

        /**
         * @event registered
         * Fired when the user had registered a new account. and is successfully authorized 
         * @param {Ext.io.User} user The authenticated user.
         */

        /**
         *@event nouser
         * Fired when there isn't a valid session after an auth attempt but before the user
         * is presented with a login screen.
         */


        /**
         *@event logout
         * Fired when the user removes their session after logout is complete.
         */

         /**
         *@event channelsReady
         * Fired when all channels have been created.
         * @param {Object} channels map of Ext.io.Channel object where keys are the names of each channel. 
         */

        config: {

            /**
             * @private  This value will be set by the Auth controller when the user picks their auth method 
             * @cfg {String} authenticationView
             * Name of the view to display when authenticating the user. 
             * To provide a custom auth screen see {Ext.io.ux.Authenticate} for required interface.
             * @accessor
             */
            authenticationView: "Ext.io.ux.AuthSencha",
            
            /**
             * @private
             * @cfg {String} authenticationView
             * Name of the view to display when authenticating the user. 
             * To provide a custom auth screen see {Ext.io.ux.Authenticate} for required interface.
             * @accessor
             */
            chooseAuthView: "Ext.io.ux.ChooseAuth",
            
            /*
            * @private
            */
            ioInitComplete: false,
            
            
            /*
            * @private
            */
            launchComplete: false,

            control: {
                authButton: {
                    tap: "authButtonTap"
                }

            },

            refs: {
                authButton: ".sioAuthButton"
            }
        },


        /**
         * @private
         *
         */
        init: function() {
           
            var conf = this.getApplication().config.io;

            //TODO cleanup with a proper mixin/library function
            conf.authOnStartup = conf.authOnStartup == undefined ? true: conf.authOnStartup;
            conf.manualLogin = conf.manualLogin == undefined ? false: conf.manualLogin;
            this.ioConf = conf;

            /*
            * add a getter for IO to the application for easy access. 
            */
            this.getApplication().sio = this;
            this.setupIo(conf);

        },
        
        
        /*
        *@private
        */
        setupIo: function(){
            Ext.Io.setup(this.ioConf);
            //console.log("setupIo");
            this.setupButtonEvents();
            var io = this;
            Ext.Io.init(function() {
              io.afterIoInit();
            });
            
        },
        
        /*
        *@private
        */
        afterIoInit: function(){
            var io = this;
            
            io.addAuthMethod("sio", "Ext.io.auth.Base");
            io.addAuthMethod("fb", "Ext.io.auth.Facebook");
            io.addAuthMethod("twitter", "Ext.io.auth.Twitter");
            
            io.setIoInitComplete(true);
        
            if (this.ioConf.authOnStartup) {
                io.auth();
            }
            
            io.channels = {};
            io.setupChannels();

            
            io.fireEvent("ioInitComplete");
        },
        
        /*
        * @private
        */
        setupButtonEvents: function(){
            //console.log("setupButtonEvents");
                    this.on({
                        checkingAuth: this.updateButtonDisable,
                        authorized: this.updateButtonLogin,
                        registered: this.updateButtonLogin,
                        nouser: this.updateButtonLogout,
                        logout: this.updateButtonLogout,
                        scope: this
                    });
            
        },
        
        
        /*
        * @private
        */
        setupChannels: function(){
            var app = this.getApplication();
            if(app.channels){
                //Let the developer say 'MyChannel' and we translate that to the full (default) path.
                //getFullyQualified is a private sdk method so it could change.
                app.channels = this.getFullyQualified(app.channels, "channel");
                Ext.require(app.channels, this.onDependenciesLoaded, this);
                
            }
            
        },
        
        
        /*
        * @private
        */
        onDependenciesLoaded: function() {
            var app = this.getApplication();
            if(app.channels){
                for(var i = 0, l = app.channels.length; i < l; i++){
                    var clsName = app.channels[i];
                    
                    var channel = Ext.create(clsName, {});
                    if(channel) {
                        var name = channel.getName();
                        if(this.channels[name]){
                             Ext.cf.util.Logger.warn("Ext.io.Controller: Found more than channel with the same name", name, channel, this.channels[name] );
                        } else {
                            this.channels[name] = channel;
                        }
                    }
                    
                }
                this.fireEvent("channelsReady", this.channels);
            }
        },
        
        
        /**
        * Get a channel created from the channels array in the application.
        * @param {String} name the name of the channel 
        */
        getChannel: function(name){
            return this.channels[name];
        },

        /**
         * @private
         * updateButtonDisable
         */
        updateButtonDisable: function() {
            var btn = this.getAuthButton();
            if(btn) {
                this.getAuthButton().setDisabled(true);
                this.getAuthButton().setText("---");
            }
            return true;
        },

        /**
         * @private
         * updateButtonLogin
         */
        updateButtonLogin: function() {
            var btn = this.getAuthButton();
            if(btn) {
                this.getAuthButton().setDisabled(false);
                this.getAuthButton().setText("Logout");
            }
            return true;
        },


        /**
         * @private
         * updateButtonLogout
         */
        updateButtonLogout: function() {
            var btn = this.getAuthButton();
            if(btn) {
                this.getAuthButton().setDisabled(false);
                this.getAuthButton().setText("Login");
            }
            return true;
        },

        /**
         * @private
         * authButtonTap
         */
        authButtonTap: function() {
            this.getUser(function(user,errors) {
                if (user) {
                    this.logout();
                } else {
                    this.login();
                }
            });
        },

        /**
         * @private
         */
        launch: function() {
             this.setLaunchComplete(true);
             this.auth();
        },


        /**
        * @private
        */
        auth: function() {
            
            //Don't try and login until after launch and init is complete.  
            if(this.getLaunchComplete() && this.getIoInitComplete()){
                this.login(!this.getApplication().config.io.manualLogin);    
            }
        },

        /**
         * Authenticate the user to the application. 
         *  The user must be a memeber of the application's group.
         *
         * @param {Boolean} showLoginIfNoAuth
         */
        login: function(showLoginIfNoAuth) {
            
            if (Ext.cf.util.ParamValidator.validateApi([
            {
                name: "showLoginIfNoAuth",
                type: "boolean",
                optional: true
            }
            ], arguments, "Ext.io.Controller", "login")) {
                this.checkAuth(showLoginIfNoAuth);
            }

        },

        /**
         * @private
         *  checkAuth gets the group's auth method.  IF one exits then it will call
         *  the 3rd party auth first to see if the user is authenticated.  If not 
         *  then show the login.
         *
         *  If we are using the default auth method (sencha.io login) then we can directly
         *  show the login dialog. 
         *
         *  In either case if showLoginIfNoAuth is set to false then we will do auth only.
         *
         * @param {Boolean} showLoginIfNoAuth
         */
        checkAuth: function(showLoginIfNoAuth) {
              
            this.fireEvent("checkingAuth");


            this.getGroup(function(group) {
                
                if (!group) {
                    Ext.cf.util.Logger.error("Ext.io.Controller: Cannot login, application does not have a group.");
                    return;
                }
                
                this.group = group;
                var methods = group.getEnabledAuthMethods();
                var storedMethod = Ext.io.Io.getIdStore().getId('authMethod');
                if(storedMethod){
                    this.setAuthController(storedMethod);
                } else if(methods){
                    if(methods.length == 1){
                        var authType = methods[0].authType;
                        this.setAuthController(authType);
                    } 
                } 
                this.enabledMethods = methods;
 
                this.getUser(function(user) {
                    
                    var afterAuthCheck = function(isAuth, auth) {
                        //console.log("authMethod.checkAuth", isAuth, auth, user);
                        if (isAuth && user) {
                            //User is both authorized by io and by the external.
                            // user is authorized to use the app.
                            this.onAuth(user);
                        } else if (isAuth && auth) {
                            //User is authneticated with extneral but not with io
                            // attempt to auth after fetching extenal account details.
                            this.authController.onAuth(auth, this.onLoginUser, this);
                        } else {
                            this.fireEvent("nouser");
                            //No user or external user so we must login.
                            if (showLoginIfNoAuth !== false) {
                                this.showLogin();
                            }
                        }

                    };

                    var afterInit = function() {
                        this.authController.checkAuth(this.group, afterAuthCheck, this);
                    };
                    
                    if (user) {
                        //we have a user an no external auth so we are done.
                        this.onAuth(user);
                    } else if (this.authController) {
                        this.authController.init(this.group, afterInit, this);
                    } else {
                        //No user so we must login.
                        this.fireEvent("nouser");
                        if (showLoginIfNoAuth !== false) {
                            this.showLogin();
                        }
                    }

                });


            });

        },

        /**
        * @private
        *
        * @param {Object} user object
        */
        onAuth: function(user) {
            this.user = user;
            
            //listend to user message events, and refire them
            // on the controller. 
            user.on("message", function(sender, message) {
                var userId = sender.getUserId();
                this.fireEvent("usermessage", sender, message);
            }, this);

            this.hideLoginPanel();
            this.fireEvent("authorized", user);
        },

        /**
        *@private
        *
        * @param {Boolean} noReset
        */
        showLogin: function(noReset) {
            //console.log("this.previousActiveItem", this.previousActiveItem, this.authController);
            
            if(!this.previousActiveItem){
                this.previousActiveItem = Ext.Viewport.getActiveItem();    
            }
            
            if(!this.loginContainer) {
                this.loginContainer = Ext.create("Ext.Panel",{layout:"card"});
            }
            Ext.Viewport.setActiveItem(this.loginContainer);
            
            //If auth method count > 1
            
            if(!this.authController) {
                this.showChooseLogin(this.enabledMethods);
                return;
            }
            
             
            if (!this.loginPanel) {
                this.createLogin();
            } else {
                if(noReset !== true){
                    this.loginPanel.resetForm();  
                }
            }
            this.loginContainer.setActiveItem(this.loginPanel);
            
        },
        
        
        
        /**
        *@private
        */
        showChooseLogin: function(methods) {
            this.setAuthController(null);
            if(!this.chooseLoginPanel){
                var authMethods = [];
                for(var i = 0, l = methods.length; i<l;i++){
                    var temp = methods[i];
                    var method = this.authMethods[temp.authType];
                    if(!method) {
                        console.error("Group has method", temp,"with out a loaded controller");
                    } else {
                        authMethods.push(method.getAuthButtonConfig());
                    }
                }
                
                this.chooseLoginPanel = Ext.create(this.getChooseAuthView(),{ authMethods:authMethods});
                this.loginContainer.add(this.chooseLoginPanel);
                
                this.chooseLoginPanel.on({
                    cancel: this.hideLoginPanel,
                    authMethod: this.chooseAuthMethod,
                    scope: this
                });
                
            }
            this.loginContainer.setActiveItem(this.chooseLoginPanel);
        },
        
        
        chooseAuthMethod: function(method){
            //console.log("chooseAuthMethod", method);
            //this.authMethod = method;
            
            this.setAuthController(method.authType);
            this.showLogin();
        },
        
        setAuthController: function(name) {
            console.log("setAuthController", name);
            this.authController = this.authMethods[name];
            if(this.authController) {
                Ext.io.Io.getIdStore().setId('authMethod', name);
                this.setAuthenticationView(this.authController.getLoginView());
                this.authController.init(this.group, function(){console.log("Auth init", name, arguments);}, this);
            } else {
                this.setAuthenticationView(null);
                Ext.io.Io.getIdStore().remove('authMethod','id');
                if(this.loginPanel){
                    this.loginPanel.destroy();
                    delete this.loginPanel;
                }
            }
        },
        
        /**
        *@private
        */
         createLogin: function() {
            if (!this.loginPanel) {
                this.loginPanel = Ext.create(this.getAuthenticationView(), {
                    group: this.group,
                    controller: this.authController 
                });
                this.loginPanel.on({
                    loginUser: this.onLoginUser,
                    cancel: this.chooseLoginPanel ? this.showChooseLogin :  this.hideLoginPanel,
                    registerUser: this.registerUser,
                    scope: this
                });
                this.loginContainer.add(this.loginPanel);
            } 
        },


        /**
         * @private
         *
         * @param {Object} auth
         */
        onLoginUser: function(auth) {
            Ext.io.User.authenticate(
                auth,
                function(user,errors) {
                    if (user) {
                        this.onAuth(user);
                    } else {
                        this.showLogin(true); //make sure the login exists before we attempt to show errors.
                        //edge case that hopefuly won't happen in production 
                        this.loginPanel.showLoginErrors();
                    }
                },
            this);
        },


        /**
         * @private
         *
         * @param {Object} reg object
         */
        registerUser: function(reg) {
            if (reg.email.length > 0 && reg.password.length > 0) {
                Ext.io.User.register({
                    email: reg.email,
                    password: reg.password
                },
                function(user, error) {
                        if (user) {
                        this.hideLoginPanel();
                        this.fireEvent("registered", user);
                        this.onAuth(user);
                    } else {
                        this.loginPanel.showRegisterErrors(error);
                    }
                },
                this
                );
         
            } else {
                this.loginPanel.showRegisterErrors({error: "missing fields"});
            }

        },

        /**
         * @private
         */
        hideLoginPanel: function() {
            this.setAuthController();
            if (this.previousActiveItem) {
                Ext.Viewport.setActiveItem(this.previousActiveItem);
                delete this.previousActiveItem;
            }
        },


        /**
        * Removes all local data about the user and disconnects from the io servers if connected.
        */
        logout: function() {
            this.setAuthController();
            this.getUser(function(user) {
                if (user) {
                    user.logout();
                    this.logoutExternal();
                }
                this.fireEvent("logout");
            });
        },


        /**
        *@private
        */
        logoutExternal: function() {
            //console.log("logout external", this.authMethod);
            if (this.authMethod && this.authMethod.logout) {
                this.authMethod.logout();
            }

        },

        /**
        * Get a reference to the current user.
        * @private  
        * @param {Function} callback The function to be called after execution.
        * The callback is passed the following parameters:
        * @param {Boolean} callback.isAuth true if there is a valid user session
        * @param {Object}  callback.user the current user.
        * @param {Object} scope scope to execute callback in.  Defaults to the controller's scope.
        */
        getUser: function(callback, scope) {
            if (!callback) {
                return;
            }
            scope = scope || this;
            callback = callback || Ext.emptyFn;

            Ext.io.User.getCurrent(function(user, errors) {callback.call(scope, user, errors);});

        },


        /**
        * @private
        * Get a reference to the application's group
        * @param {Function} callback The function to be called after execution.
        * @param {Object} scope scope to execute callback in.  Defaults to the controller's scope.
        */
        getGroup: function(callback, scope) {
            if (!callback) {
                return;
            }
            scope = scope || this;
            callback = callback || Ext.emptyFn;

            Ext.io.Group.getCurrent(
                function(group, errors) {
                    callback.call(scope,  group, errors);
                }
            );

        },

        /**
        * @private
        * Are we connected to the IO servers?
        */
        isConected: function() {
            //console.log("IO.isConected");
            return true;
        },


        /**
        * Add a custom authentication method for this application.
        * See Ext.io.auth.Base for more details on how to add custom 
        * authentication to your application.
        *
        * Calling addAuthMethod more than once with the same name will overrite any previous class. 
        *
        * @param {String} name of the auth method as it appears in the group config.
        * @param {String} className the fully qualified class name of the class that will handle authenticaiton for this type.
        */
        addAuthMethod: function(name, className){
            Ext.cf.util.Logger.debug("Ext.io.Controller setting auth method",name, className);
            var method = Ext.create(className, {controller: this});
            this.authMethods[name] = method;
            
        },

        /*
        * @private
        * Where the authMethod implemenation classes are stored. 
        */
        authMethods: {}

});
