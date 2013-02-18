Ext.setVersion('sio', '0.7.10');

//Figure out where IO is located and add CF to the loader
//so that the developer doesn't have to manually include something 
//they should never have to know about. 
(function() {
    var ioPath = Ext.Loader.getPath("Ext.io");
    if(ioPath){
        var cfPath = ioPath.substring(0, ioPath.lastIndexOf("/")) + "/cf";
        Ext.Loader.setPath('Ext.cf',cfPath);    
    }
})();

/**
 * @class Ext.io.Io
 * @singleton
 * @aside guide intro
 *
 *
 * Ext.io is the name space for the Sencha.io SDK. The Ext.io.Io class is a singleton that
 * initializes the Sencha.io client.
 *
 * Note
 * ----
 * We highly recommend that your application use Ext.io.Controller to manage the connection to sencha.io  
 * If your application uses Ext.io.Controller then calling Ext.io.Io directly will not be needed.
 *
 * For applications not using Ext.io.Controller
 * ---
 *
 * At the start of your app you should call the Ext.Io.setup method. 
 * Calling Ext.Io.setup is not mandatory if the app is being served by Sencha.io, as it
 * will provide the app with its configuration information when it is served. But
 * for development purposes, and for app deployment through other services, both
 * the App Id and App Secret should be passed through the Ext.Io.setup method.
 *
 *     Ext.Io.setup({
 *         //logLevel: 'debug',
 *         appId: 'DsmMwW3b0hrUT5SS2n2TYwSR6nY',
 *         appSecret: 'WucvCx3Wv1P3'
 *     })
 *
 */
Ext.define('Ext.io.Io', {
    requires: [
            'Ext.util.Observable',
            'Ext.cf.ServiceDefinitions',
            'Ext.cf.Overrides',
            'Ext.cf.messaging.DeviceAllocator',
            'Ext.cf.messaging.Messaging',
            'Ext.cf.util.Logger',
            'Ext.cf.util.ParamValidator',
            'Ext.io.Group',
            'Ext.io.User',
            'Ext.io.App',
            'Ext.io.Device',
            'Ext.io.Channel',
            'Ext.io.Service',
            'Ext.io.data.Proxy',
            'Ext.cf.naming.IDStore',
            'Ext.cf.naming.ConfigStore',
            'Ext.io.data.Directory'
    ],

    alternateClassName: "Ext.Io",

    singleton: true,
    
    mixins: {
           observable: "Ext.util.Observable" //using util instead of mixin for EXT 4 compatibility. 
    },

    config: {
        url: 'https://api.sencha.io',
        csUrl: 'https://api.sencha.io',
        logLevel: "error",
        sessionExpiry: 365
    },


    /**
     * Setup Ext.io for use.
     *
     *     Ext.setup({
     *         logLevel: 'debug'
     *     })     
     *
     * @param {Object} config
     * @param {String} config.appId
     * @param {String} config.appSecret 
     * @param {String} config.logLevel logging level. Should be one of "none", "debug", "info", "warn" or "error". Defaults to "error".
     *
     * Calling this method is optional. We assume the above defaults otherwise.
     */
    setup: function(config) {  
        if(Ext.cf.util.ParamValidator.validateApi([
            { name: "options", type: "object",
                keys: [
                    { name: "appId", type: 'string' , optional: true },
                    { name: "appSecret", type: 'string', optional: true },
                    { name: "url", type: 'string', optional: true },
                    { name: "csUrl", type: 'string', optional: true },
                    { name: "logLevel", type: 'string', optional: true },
                    { name: "sessionExpiry", type: 'number', optional: true }
                ]
              }
            ], arguments, "Ext.io.Io", "setup")) {
            
            Ext.apply(Ext.io.Io.config, config);
           
            this.setLogLevel();
           
            if(config.trace){
                var name;
                for(name in Ext.io){
                    Ext.cf.Utilities.wrapClass(Ext.io[name],'trace',function(m,a){
                        Ext.cf.util.Logger.trace(m.displayName,a);
                    });
                }
            }

        }
    },

    callbacks: [], // Nothing much can happen until Ext.io.Io.init completes, so we queue up all the requests until after it has completed
    
    initializing: false,
    initialized: false,
    bootupComplete: false,
    bootupExecuting: false,

    /**
     * @private
     *
     *  Initialize Sencha.io
     *
     *     Ext.io.Io.init(function(){
     *         // your app code
     *     });
     *
     * @param {Function} callback The function to be called after initializing.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    init: function(callback,scope) {
        var me = this;

        this.mixins.observable.constructor.call(this);

        
        me.setLogLevel();
       
        if(me.initialized) {
            if(callback){
                callback.call(scope);
            } else {
                Ext.cf.util.Logger.warn("Ext.io.Io.init can be called without a callback, but calls made into Ext.io before init has completed, may fail.");
            }
            return;
        }

        //
        // queue the callback until init is complete.
        //
        if(callback){
            me.callbacks.push([callback,scope]); // call this callback once initialization is complete
        }else{
            Ext.cf.util.Logger.warn("A call to Ext.io.Io.init is already in progress. It's better to always provide a init with a callback, otherwise calls into Ext.io may fail.");
        }
        
        
        if(me.initializing){
            return;
        }

        me.initializing= true;
        this.initDeveloper();
        this.initUser();

        var idstore = Ext.io.Io.getIdStore();

        /*
         * Every App has a messaging endpoint URL. 
         * The URL is provided by senchafy.com when the App is served,
         * or is passed through Ext.Io.setup({url:url}), or it defaults
         * to 'https://api.sencha.io'
         */
        Ext.io.Io.config.url = idstore.stash("api", "server", Ext.io.Io.config.url);



        var appId = this.initApp();
        var device = this.initDevice();
        if(appId && device.deviceId && device.deviceSid) {
            Ext.cf.util.Logger.debug("App has app id, and device id checking chache for objects.", appId, device.deviceId, device.deviceSid);
            this.restoreConfig(appId,device);   
        } else {
            Ext.cf.util.Logger.debug("device id, or device session id missing, can't start offline, must complete online bootup", appId, device.deviceId, device.deviceSid);
            me.bootup();
        }

        

    },
    
    /**
    * Set the logging level. 
    * @param {String} level 'error', 'warn', 'info', 'debug' false/null/undfined value will reset log level to the config passed to setup.
    *
    */
    setLogLevel: function(level){
        Ext.cf.util.Logger.setLevel(level ? level : Ext.io.Io.config.logLevel);
    },
    

    /**
     * @private
     *
     */
    bootup: function() {
        var idstore = Ext.io.Io.getIdStore();
        var appId = idstore.getId('app');
        var deviceId = idstore.getId('device');
        var deviceSid = idstore.getSid('device');
       
        if(this.bootupComplete === true || this.bootupExecuting === true) {
            return;
        }

        this.bootupExecuting = true;
        Ext.cf.messaging.DeviceAllocator.bootup({
              url: Ext.io.Io.config.url,
              appId: appId,
              authDevice: true,
              deviceId: deviceId,
              deviceSid: deviceSid
        }, Ext.bind(this._onBootup, this));
    },
    
    restoreConfig: function(appId, device){
        var store = this.getConfigStore();
        
        var appConfig = store.getObjectConfig('currentApp');
        var grpConfig = store.getObjectConfig('currentGroup');
        if(appConfig){
            Ext.cf.util.Logger.debug("using cached app and group", appConfig, grpConfig);
            Ext.io.App.setCurrent(appConfig);
            if(grpConfig) {
                Ext.io.Group.setCurrent(grpConfig);
            }
            var self = this;
            this.initMessaging(function(){
               self.onInitComplete();
            });
        }
    },
    
    
    /**
    * @private
    */
    _onBootup: function(response){
      
        var self = this;

        self.bootupComplete = true;
        this.bootupExecuting = false;
        
        var configStore = this.getConfigStore();
        Ext.cf.util.Logger.debug("bootup request complete", response);
       
        //check for network errors....
        if(response.status === "success") {
            var idstore = Ext.io.Io.getIdStore();
            var result = response.result;

            if(result.checkVersion && result.checkVersion.code === 'INCOMPATIBLE_VERSIONS') {
             Ext.cf.util.Logger.error(result.checkVersion);
             throw result.checkVersion.message;
            }

            self.registerDevice(result.device);

            
            if(result.objects){
                
                if(result.objects.group && result.objects.group.value && result.objects.group.status=="success"){
                   idstore.setId('group', result.objects.group.value.id);
                   configStore.setObjectConfig('currentGroup', result.objects.group.value);
                   Ext.io.Group.setCurrent(result.objects.group.value);
                   
                }

                if(result.objects.app && result.objects.app.value && result.objects.app.status=="success"){
                    configStore.setObjectConfig('currentApp', result.objects.app.value);
                    Ext.io.App.setCurrent(result.objects.app.value);
                }
            }
            
            self.initMessaging(function(){
               self.onInitComplete();
            });

        } else {
            var errorMessage = "Client bootup failed due to " + 
                (response.error.code === 'NETWORK_ERROR' ? "network": "server") + 
                " error";

            this.initialized= false;
            this.initializing= false;
            
            self.fireEvent("offline");
            Ext.cf.util.Logger.error(errorMessage, response.error);
        }
    
        
    },
    
    onInitComplete: function(){
        this.initialized= true;
        this.initializing= false;
        var callback;
        for(var i=0;i<this.callbacks.length;i++){
           callback = this.callbacks[i];
           if(callback){
               callback[0].call(callback[1]); 
           }
        }
        this.callbacks = [];
    },
    

    /**
     * @private
     *
     * @param {Function} callback The function to be called after initializing developer.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    initDeveloper: function() {
        var idstore = Ext.io.Io.getIdStore();
        idstore.stash('developer','id');
    },

    /**
     * @private
     *
     * Every App has an id
     *
     */
    initApp: function() {
        var idstore = Ext.io.Io.getIdStore();
        
        var appId = idstore.getId('app');
        var cookie = idstore.getCookieStore().getItem('app.id');
        var config = Ext.io.Io.config.appId;
        

        if(!this.verifyAppId(appId,config,cookie)){
            Ext.cf.util.Logger.warn('AppId has changed from saved app Id');
            this.nukeStoredIds();            
        }
        
        appId = idstore.stash('app','id',config);
        
        if (!appId) {
            Ext.cf.util.Logger.error('Could not find App Id.');
            Ext.cf.util.Logger.error('The App Id is either provided by senchafy.com when the App is served, or can be passed through Ext.Io.setup({appId:id})');
        }
        return appId;
    },

    /**
    * @private
    * in the event of an auth error we need to wipe the stored ids and start over.
    */
    nukeStoredIds: function(){
        var idstore = Ext.io.Io.getIdStore();
   
     // device is linked to the group. if the app id has changed we need a new device id.
        idstore.remove('device', 'id');
        idstore.remove('device', 'sid');
        // group is linked to the app id. If app id changes, force a check on group ID.
        idstore.remove('group', 'id');
        //Users are linked to apps/groups so rest them too.
        idstore.remove('user', 'sid');
        //TODO What else needs to be dropped?  All sio local storage data?

        //delete all keys from config cache... 
        //config cache needs an index so everything can be deleted...

    },

    /**
    * @private
    *
    * We can get appId from either config or cookie.
    *
    * Cookie will take precedence over config. 
    *
    *  This function will return true if the cookie matches current
    *  or absent the cookie config matches current
    *
    */
    verifyAppId: function(current, config, cookie){
        return (cookie && cookie == current) || (!cookie && current == config);
    },

    /**
     * @private
     *
     * If a device id and sid were passed through the call to setup, then we use them.
     * Otherwise we check for them in the id store, as they may have been stashed there
     * during a previous app instantiation, or provided they were provided in cookies
     * by the web server. If we do have a device id and sid then we authenticate those
     * with the server, and if don't have them then we register the device using the
     * app id and app secret to get a new id and sid. 
     *
     * @return {Object} 
     */
    initDevice: function() {
        var idstore = Ext.io.Io.getIdStore();
        var deviceSid;
        var deviceId;
        if(this.config.deviceId) {
            idstore.setId('device', this.config.deviceId);
            if(this.config.deviceSid) {
                idstore.setSid('device', this.config.deviceSid);
            }
            Ext.cf.util.Logger.debug("Ext.Io.setup provided the device id",this.config.deviceId);
            deviceId = this.config.deviceId;
            deviceSid = this.config.deviceSid;
        } else {
            deviceId = idstore.getId('device');
            deviceSid = idstore.getSid('device');
        }
        return {deviceId: deviceId, deviceSid: deviceSid};
    },

    /**
     * @private
     *
     * initMessaging
     *
     * @param {Function} callback The function to be called after initializing messaging.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    initMessaging: function(callback,scope) {

        var self = this;


        if(!Ext.io.Io.messaging){
            this.fireEvent("connecting");
     
            var idstore = Ext.io.Io.getIdStore();
            /* 
             * Instantiate the messaging service proxies.
             */
            this.config.deviceId= idstore.getId('device');
            this.config.deviceSid= idstore.getSid('device');
            Ext.io.Io.messaging = Ext.create('Ext.cf.messaging.Messaging', this.config);
            
            Ext.io.Io.messaging.transport.on("invalidsession", function(err){
                Ext.cf.util.Logger.error("Invalid Session, will attempt to re-authorize", err);
                //If we have an invalid session, call bootup to get new device session.
                self.bootupComplete = false;
                self.bootup();
            });

            Ext.io.Io.messaging.transport.on("connected", function(type){
                self.fireEvent("online", type);
            });

        } else {
            Ext.io.Io.messaging.transport.start();
        }
        self.bootup();
        

        self.receiveNamingEvents();
           

        callback.call(scope);
    },



    /**
     * @private
     *
     * 
     * If an App is associated with a Group which is configured for on-the-web user auth
     * then senchafy.com provides the user id.
     *
     */
    initUser: function() {
        var idstore = Ext.io.Io.getIdStore();
        idstore.stash('user','id');
    },

    /**
     * @private
     *
     * stashes device id and device session id locally 
     *
     */
    registerDevice: function(device) {
        var self = this;
        var idstore = Ext.io.Io.getIdStore();
       
        var deviceId = null;
        var deviceSid = null;
        
        if(device.authenticate && !device.authenticate.error){
            deviceSid = device.authenticate.result;
            idstore.setSid("device", deviceSid);
        } else if (device.register && !device.register.error) {
            deviceId = device.register.result.deviceId;
            deviceSid = device.register.result.deviceSid;
            idstore.setId("device", deviceId);
            idstore.setSid("device", deviceSid);
        } else {
            var err = device.register.error;
            var errorMessage = "Registering device failed. " + err.code +  ": " + err.message;
            Ext.cf.util.Logger.error("registerDevice", errorMessage, err);
            throw errorMessage;
        }
    },

    /**
     * @private
     */
    idStore: undefined,

    /**
     * @private
     */
    getIdStore: function() {
        Ext.io.Io.idStore= Ext.io.Io.idStore || Ext.create('Ext.cf.naming.IDStore', {sessionExpiry:  Ext.io.Io.config.sessionExpiry});
        return Ext.io.Io.idStore;
    },

    /**
     * @private
     */
    getConfigStore: function() {
        Ext.io.Io.configStore= Ext.io.Io.configStore || Ext.create('Ext.cf.naming.ConfigStore');
        return Ext.io.Io.configStore;
    },

    /**
     * @private
     */
    messaging: undefined,

    /**
     * @private
     */
    getMessagingProxy: function(callback,scope) {
        if(Ext.io.Io.messaging){
            callback.call(scope,Ext.io.Io.messaging);
        }else{
            Ext.io.Io.init(function(){
                callback.call(scope,Ext.io.Io.messaging);
            },this);
        }
    },

    /**
     * @private
     */
    storeDirectory: undefined,

    /**
     * @private
     * The Store Directory contains a list of all known stores,
     * both local and remote.
     */
    getStoreDirectory: function() {
        Ext.io.Io.storeDirectory= Ext.io.Io.storeDirectory || Ext.create('Ext.io.data.Directory', {});
        return Ext.io.Io.storeDirectory;
    },

    /**
     * @private
     * Get a proxy interface for a service.
     *
     * For RPC services, an instance of {@link Ext.io.Proxy} is returned, whereas for
     * async message based services, an instance of {@link Ext.io.MessagingProxy} is returned.
     *
     * @param {Object} options 
     *
     * @param {Function} callback The function to be called after getting service.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getService: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
           { name: "name", type: 'string' }
           ], arguments, "Ext.io.Io", "getService")) {
            if(Ext.io.Io.messaging){
                Ext.io.Io.messaging.getService(options,callback,scope);
            } else {
               Ext.io.Io.init(function() {
                   Ext.io.Io.messaging.getService(options,callback,scope);
               });                
            }
        }
    },

    /*
    * Map of naming objects registered to receive naming events.
    */
    registeredNamingObjects: {},

    /**
     * @private
     * Register a naming object to receive naming events.
     *
     * @param {Object} object A naming object.
     *
     */
    registerForNamingEvents: function(object, attributes) {
        var self = this;
        if (object.getId()) {
            self.registeredNamingObjects[object.getId()] = object;
            self._on(object.$className, object.getId(), "update", attributes || null, function(err) {
                if (err) {
                    Ext.cf.util.Logger.error("registerForNamingEvents", "Registering for naming events with server failed", err);
                }
            }, this);
        }
    },

    /**
     * @private
     * Register a naming object to receive naming events.
     *
     * @param {Object} object A naming object.
     *
     */
    unregisterForNamingEvents: function(object, attributes) {
        var self = this;
        if (object.getId()) {
            delete self.registeredNamingObjects[object.getId()];
            self._un(object.$className, object.getId(), "update", attributes || null, function(err) {
                if (err) {
                    Ext.cf.util.Logger.error("registerForNamingEvents", "Registering for naming events with server failed", err);
                }
            }, this);
        }
    },

    /**
     * @private
     * Fire an event on a registered naming object.
     *
     * For RPC services, an instance of {@link Ext.io.Proxy} is returned, whereas for
     * async message based services, an instance of {@link Ext.io.MessagingProxy} is returned.
     *
     * @param {String} id The id of the naming object on which to fore the event
     * @param {String} eventName The name of the event to fire.
     * @param {Object} data Data passed to event, interpretted in context of eventName 
     *
     */
    fireNamingEvent: function(id, data) {
        if (this.registeredNamingObjects[id]) {
            this.registeredNamingObjects[id]._update(data, true);//.fireEvent(eventName, data);
        }
    },

    /**
     * @private
     * Start receiving event messages from NamingEventService.
     *
     */
    receiveNamingEvents: function() {
        if(!this.subscribedEventFn){
            this.subscribedEventFn = function(envelope) {
                var message = envelope.msg;
                this.fireNamingEvent(message.objectId, message.data);
            };
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.transport.setListener("NamingEventService", this.subscribedEventFn, this);
            },this);
        } 
    },

    _on: function(klass, id, eventName, attributes, callback, scope) {
        this._sendNamingEventMessage("on", klass, id, eventName, attributes, callback, scope);
    },

    _un: function(klass, id, eventName, attributes, callback, scope) {
        this._sendNamingEventMessage("un", klass, id, eventName, attributes, callback, scope);
    },

    _sendNamingEventMessage: function(op, klass, id, eventName, attributes, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            var msg = {op:op, klass: klass, id: id, eventName: eventName, attributes: attributes};
            messaging.transport.sendToService("NamingEventService", msg, function() {
                Ext.cf.util.Logger.debug("Sent message to NamingEventService", msg);
            }, scope);
        },scope);
    }
});

