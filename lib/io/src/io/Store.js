/** 
 * @private
 * @aside guide concepts_store
 *
 */
Ext.define('Ext.io.Store', {
    extend: 'Ext.io.Object',

    statics: {

        /** 
         * @private
         * @static 
         *
         * @param {Object} options
         *  
         * @param {Function} callback The function to be called after getting store.
         * @param {Object} error object
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }
    },

    /**
     * @private
     * @param {Object} options
     *  
     * @param {Function} callback The function to be called after finding replicas.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    findReplicas: function(options,callback,scope) {
        this.findRelatedObjects(Ext.io.Replica, this.getId(), null, options.query, callback, scope);    
    }

});

