/**
*  The sender of a message. Used by Ext.io.User.message,  Ext.io.Device.message, Ext.io.Channel.message and Ext.io.Controller.usermessage events.
*/
Ext.define('Ext.io.Sender', {
    config: {
        userId: null,
        deviceId: null,
        developerId: null
    },
    
    constructor: function(config) {
        this.initConfig(config);
    },
    
    /**
    * Get the user object for the sender. A message does not have to have a user as the sender.
    *  A message that only has a device is valid.  
    *
    * @param {Function} callback The function to be called after getting the User object.
    * @param {Object} callback.user The {Ext.io.User} object if the call succeeded.
    * @param {Object} callback.err an error object.
    *
    * @param {Object} scope The scope in which to execute the callback. The "this" object for
    * the callback function.
    */
    getUser: function(callback, scope){
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Sender", "getUser")) {
            var userId = this.getUserId();
            if(!userId){
                callback.call(scope, null);
            } else {
                Ext.io.User.get({id: userId}, callback, scope);    
            }   
        }
    },

    /**
    * Get the developer object for the sender. A message does not have to have a developer as the sender.
    *  A message that only has a device is valid.  
    *
    * @param {Function} callback The function to be called after getting the Developer object.
    * @param {Object} callback.developer The {Ext.io.Developer} object if the call succeeded.
    * @param {Object} callback.err an error object.
    *
    * @param {Object} scope The scope in which to execute the callback. The "this" object for
    * the callback function.
    */
    getDeveloper: function(callback, scope){
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Sender", "getDeveloper")) {
            var developerId = this.getDeveloperId();
            if(!developerId){
                callback.call(scope, null);
            } else {
                Ext.io.Developer.get({id: developerId}, callback, scope);    
            }   
        }
    },
    
    
    /**
    * Get the device object for the sender. A message must have a device to be valid. 
    *
    * @param {Function} callback The function to be called after getting the User object.
    * @param {Object} callback.user The {Ext.io.User} object if the call succeeded.
    * @param {Object} callback.err an error object.
    *
    * @param {Object} scope The scope in which to execute the callback. The "this" object for
    * the callback function.
    */
    getDevice: function(callback, scope){
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Sender", "getDevice")) {
            var deviceId = this.getDeviceId();
            if(!deviceId){
                callback.call(scope, null);
            } else {
                Ext.io.Device.get({id: deviceId}, callback, scope);    
            }
        }        
    },

    getService: function(callback, scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Sender", "getService")) {
            var deviceId = this.getDeviceId();
            if(!deviceId) {
                callback.call(scope, null);
            } else {
                // extract serviceId from the deviceId
                var serviceId = deviceId;
                var versionIndex = deviceId.lastIndexOf("-");
                if(versionIndex > -1) {
                    serviceId = deviceId.substr(0, versionIndex);
                }

                Ext.io.Io.getService({ name: serviceId }, callback, scope);
            }
        }        
    }
});