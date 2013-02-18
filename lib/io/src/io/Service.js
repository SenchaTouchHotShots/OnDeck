/**
 * @private
 *
 * The {@link Ext.io.Service} class represents a Service.
 *
 * Methods are provided for navigation through the graph of objects available
 * to the currently running client code. 
 *
 */
Ext.define('Ext.io.Service', {
    extend: 'Ext.io.Object',

    statics: {
        
        /** 
         * @private
         * @static
         * Get Service Object
         * 
         * @param {Object} options
         * @param {Object} options.id
         *
         * @param {Function} callback The function to be called after getting the Service object.
         * @param {Object} callback.service The current {Ext.io.Service} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        get: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "id", type: 'string|number' }
            ],arguments, "Ext.io.Service", "get")) {
                this.getObject(options.id, callback, scope);
            }
        }
    },

    /** 
     * @private
     * Get Team
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
    }

});

