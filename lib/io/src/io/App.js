/**
 * @private
 * {@img app.png Class Diagram}
 *
 * The {@link Ext.io.App} class represents the web app itself. There is only one
 * app object, called the current app object. It is always available.
 *
 *          Ext.io.App.getCurrent(
 *             function(app){
 *              
 *             } 
 *          );
 *
 * Methods are provided for navigation through the graph of objects available
 * to the currently running client code. 
 *
 */
Ext.define('Ext.io.App', {
    extend: 'Ext.io.Object',
    requires: [
        'Ext.io.Channel',
        'Ext.cf.util.ErrorHelper'
    ],

    mixins: {
        withpicture: 'Ext.io.WithPicture'
    },

    statics: {
        
        
        /**
        * @static
        * @private
        *  Called on bootup by Io with the current group data.
        * 
        */
        setCurrent: function(appConfig){
             this._currentApp = Ext.create("Ext.io.App", {id:appConfig._key, data:appConfig.data});
        },
        
        

        /**
         * @static
         * Get the current App object.
         *
         *          Ext.io.App.getCurrent(
         *              function(app){
         *              } 
         *          );
         *
         * The current App object is an instance of the {@link Ext.io.App} class. It represents
         * the web app itself. It is always available, and serves as the root of
         * the server side objects available to this client.
         *
         * @param {Function} callback The function to be called after getting the current App object.
         * @param {Object} callback.app The current {Ext.io.App} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        getCurrent: function(callback,scope) {
            if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.App", "getCurrent")) {
                callback.call(scope, this._currentApp);
            }
        },

        /** 
         * @static
         * Get App Object
         *
         * @param {Object} options
         * @param {Object} options.id
         *
         * @param {Function} callback The function to be called after getting the current App object.
         * @param {Object} callback.app The current {Ext.io.App} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        get: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "id", type: 'string|number' }
            ],arguments, "Ext.io.App", "get")) {
                this.getObject(options.id, callback, scope);
            }
        }
    },

    /**
     * Get the current user Group, if any.
     *
     * The current user Group object is an instance of {@link Ext.io.Group}. It represents
     * the group associated with the app. If the app is not associated with a group,
     * then there will no current group.
     *
     *          app.getGroup(
     *              function(group){
     *              } 
     *          );
     *
     * The group is used for registering and authenticating users, and for searching
     * for other users.
     *
     * @param {Function} callback The function to be called after getting the Group object.
     * @param {Object} callback.group The {Ext.io.Group} object for the App if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getGroup: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.App", "getGroup")) {
            this.getRelatedObject(Ext.io.Group, null, null, callback, scope);
        }
    },


    /**
     * Find devices that match a query.
     * 
     * Returns all the device objects that match the given query. The query is a String
     * of the form name:value. For example, "city:austin", would search for all the
     * devices in Austin, assuming that the app is adding that attribute to all
     * its devices.
     * 
     *       user.findDevices(
     *           {query:'city:austin'},
     *           function(devices){
     *           }
     *       );
     *
     * @param {Object} options An object which may contain the following properties:
     * @param {Object} options.query
     *
     * @param {Function} callback The function to be called after finding the matching devices.
     * @param {Object} callback.devices The {Ext.io.Device[]} matching devices found for the App if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    findDevices: function(options,callback,scope) {
        // JCM this could/should be this.getRelatedObject, but we don't have links from Apps to Devices
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "query", type: 'string' }
            ],arguments, "Ext.io.App", "findDevices")) {
            Ext.io.Device.findObjects(options.query, 0, 1000, callback, scope);
        }
    },

     /**
     * Find channels that match a query.
     * 
     * Returns all the channel objects that match the given query. The query is a String
     * of the form name:value. For example, "city:austin", would search for all the
     * channels in Austin, assuming that the app is adding that attribute to all
     * its channels. 
     * its devices.
     * 
     *       user.findChannels(
     *           {query:'city:austin'},
     *           function(channels){
     *           }
     *       );
     *
     * @param {Object} options An object which may contain the following properties:
     * @param {Object} options.query
     *
     * @param {Function} callback The function to be called after finding the matching channels.
     * @param {Object} callback.channels The {Ext.io.Channel[]} matching channels found for the App if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    findChannels: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
                 { name: "query", type: 'string'}
            ],arguments, "Ext.io.App", "findChannels")) {
            this.findRelatedObjects(Ext.io.Channel, this.getId(), null, options.query, callback, scope);    
        }
    },




    /** 
     *@private
     * Create Version
     *
     * @param {Object} options
     * @param {Object} options.file
     * @param {Object} options.data
     *
     * @param {Function} callback
     * @param {Object} callback.version
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    createVersion: function(options,callback,scope) {
        var self = this;

        if (typeof options.file != "undefined" && typeof options.data != "undefined") {
            options.file.ftype = 'package';
            options.containerid = self.getId();
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.sendContent(
                    options,
                    function(csId,err) {
                        if(csId){
                            options.data['package'] = csId; 
                            var tmp = options.file.name.split('.');
                            options.data.ext = "."+tmp[tmp.length - 1];
                            options.data.namespace = options.file.ftype;
                            self.createRelatedObject("createVersion", Ext.io.Version, options.data, callback, scope);
                        }else{
                            callback.call(scope,undefined,err);
                        }
                    },this
                );
            });
        } else {
            var err = Ext.cf.util.ErrorHelper.get('FILE_PARAMS_MISSING');
            callback.call(scope,undefined,err);
        }
    },

    /** 
     * Get Team
     * @private
     * @param {Function} callback
     * @param {Object} callback.team
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getTeam: function(callback,scope) {
        this.getRelatedObject(Ext.io.Team, null, null,callback, scope);
    },

    /*
    *@private
    *       
    * Gets all of the versions of this application uploaded to sencha.io
    *  (DEVELOPER only)
    * @param {Array} callback.versions an array of Ext.io.Version objects
    * @param {Object} callback.err an error object.
    */
    getVersions: function(callback, scope){
        Ext.require("Ext.io.Version", function(){
            this.getRelatedObjects(Ext.io.Version, null, callback, scope);
        }, this);
    },

    /** 
     * Get deployed version
     * @private
     *
     * @param {Function} callback
     * @param {Object} callback.version
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getDeployedVersion: function(callback,scope) {
        var self = this;
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "AppService"},
                function(service,err) {
                    if(service){
                        service.getDeployedVersion(function(result) {
                            if(result.status == "success") {
                                var object = null;
                                if(result.value && result.value !== null) {
                                    object = Ext.create(Ext.io.Version, {id:result.value._key, data:result.value.data});
                                }
                                callback.call(scope, object);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, self.getId());
                    }else{
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        });
    },

    /** 
     * @private       
     * Regenerate app secret
     *
     * @param {Function} callback
     * @param {Object} callback.secret new secret
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    regenerateSecret: function(callback,scope) {
        var self = this;

        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "AppService"},
                function(service,err) {
                    if(service){
                        service.regenerateSecret(function(result) {
                            callback.call(scope,result.value,result.error);
                        }, self.getId());
                    }else{
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        });
    },

    /**
    *@private
    */
    getStatistics: function(options, callback, scope) {
        var self = this;

        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "InstrumentationRpcService"},
                function(service,err) {
                    if(service){
                        service.getEvents(function(result) {
                            callback.call(scope,result.value,result.error);
                        }, options);
                    } else {
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        });
    }
});

