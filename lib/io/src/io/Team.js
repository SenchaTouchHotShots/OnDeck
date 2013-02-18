/**
 * @private
 * Team
 */
Ext.define('Ext.io.Team', {
    extend: 'Ext.io.Object',

    mixins: {
        withpicture: 'Ext.io.WithPicture'
    },
        
    statics: {

        /**
         * @static
         * Get Team
         *
         * @param {Object} options
         * @param {String} options.id
         *  
         * @param {Function} callback The function to be called after getting team.
         * @param {Object} callback.team The {Ext.io.Team} Team object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }
    },

    /**
     *
     * Create App
     *
     * @param {Object} options
     *  
     * @param {Function} callback The function to be called after creating App.
     * @param {Object} callback.app The {Ext.io.App} App object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    createApp: function(options,callback,scope) {
        this.createRelatedObject("createApp", Ext.io.App, options, callback, scope);
    },

    /**
     *
     * Create Group
     *
     * @param {Object} options
     * 
     * @param {Function} callback The function to be called after creating Group.
     * @param {Object} callback.group The {Ext.io.Group} Group object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    createGroup: function(options,callback,scope) {
        this.createRelatedObject("createGroup", Ext.io.Group, options, callback, scope);
    },

    /**
     * @private
     *
     * Get Developers
     *
     * @param {Object} options
     * @param {Boolean} options.owner
     * 
     * @param {Function} callback The function to be called after getting developers.
     * @param {Object} callback.developers The {Ext.io.Developer[]} developers object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getDevelopers: function(options,callback,scope) {
        var tag = (typeof(options.owner) != "undefined") ? ((options.owner === 'owner') ? 'owner' : 'member') : null;
        this.getRelatedObjects(Ext.io.Developer, tag, callback, scope);
    },

    /**
     *
     * Get Apps
     *
     * @param {Object} options
     * 
     * @param {Function} callback The function to be called after getting apps.
     * @param {Object} callback.apps The {Ext.io.App[]} apps object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getApps: function(callback,scope) {
        this.getRelatedObjects(Ext.io.App, null, callback, scope);
    },

    /**
     *
     * Get Groups
     *
     * @param {Object} options
     * 
     * @param {Function} callback The function to be called after getting groups.
     * @param {Object} callback.group The {Ext.io.Group[]} groups object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getGroups: function(callback,scope) {
        this.getRelatedObjects(Ext.io.Group, null, callback, scope);
    },

    /**
     *
     * Manage Developer
     *
     * @param {String} method
     *
     * @param {Object} options
     * @param {Object} options.id
     * 
     * @param {Function} callback The function to be called after managing developer.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    manageDeveloper: function(method,options,callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "TeamService"},
                function(teamService,err) {
                    if(teamService){
                        teamService[method](function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.getId(), options.id);
                    }else{
                        callback.call(scope,err);
                    }
                },
                this
            );
        },this);
    },

    /**
     *
     * Add Developer
     *
     * @param {Object} options
     * 
     * @param {Function} callback The function to be called after adding developer.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    addDeveloper: function(options,callback,scope) {
        this.manageDeveloper('addDeveloper',options,callback,scope);
    },

    /**
     *
     * Remove Developer
     *
     * @param {Object} options
     *
     * @param {Function} callback The function to be called after removing developer.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    removeDeveloper: function(options,callback,scope) {
        // need to be able remove self even if not team owner, so use different method in that case (has different authz policy)
        var method = (Ext.io.Io.getIdStore().getId('developer') === options.id) ? 'removeSelf' : 'removeDeveloper';
        this.manageDeveloper(method,options,callback,scope);
    },

    /**
     *
     * Invite Developer
     *
     * @param {Object} options
     * @param {String} options.username
     *
     * @param {Function} callback The function to be called after inviting developer.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    inviteDeveloper: function(options,callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "TeamManager"},
                function(devService,err) {
                    if(devService){
                        devService.inviteDeveloper(function(result) {
                            if (result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, {username : options.username, org : this.getId()});
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
     * Get all connected developers that belong to this team
     *
     *          team.getConnectedDevelopers(
     *              function(developers){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the connected developers that belong to this team.
     * @param {Object} callback.developers Array of connected {Ext.io.Developer} objects that belonging to this Team.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     * A connected devloper is a developer that has a web socket connection open to the server and is logged in.
     *
     */
    getConnectedDevelopers: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "PresenceService"},
                function(presenceService,err) {
                    if(presenceService){
                        presenceService.getConnectedDevelopers(function(result) {
                            if (result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(Ext.io.Developer, {id:result.value[i]._key, data:result.value[i].data}));
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
     * @private
     * Find services that match a query.
     * 
     * Returns all the service objects that match the given query. The query is a String
     * of the form name:value. For example, "name:NamingService", would search for services
     * with the name "NamingService.
     * 
     *       team.findServices(
     *           {query:'name:NamingService'},
     *           function(services){
     *           }
     *       );
     *
     * @param {Object} options An object which may contain the following properties:
     * @param {Object} options.query
     *
     * @param {Function} callback The function to be called after finding the matching services.
     * @param {Object} callback.services The {Ext.io.Service[]} matching services found for the Team if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    findServices: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
                 { name: "query", type: 'string'}
            ],arguments, "Ext.io.Team", "findServices")) {
            this.findRelatedObjects(Ext.io.Service, this.getId(), null, options.query, callback, scope);    
        }
    }

});