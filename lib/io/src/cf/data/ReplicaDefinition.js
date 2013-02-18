/**
 * 
 * @private
 *
 * Replica Definition
 *
 */
Ext.define('Ext.cf.data.ReplicaDefinition', { 
    requires: ['Ext.cf.Utilities'],

    config: {
        /**
         * @cfg deviceId
         * @accessor
         */
        deviceId: undefined,
        /**
         * @cfg replicaId
         * @accessor
         */
        replicaId: undefined
    },
    
    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        var validated = Ext.cf.util.ParamValidator.validateApi([
            { name: "config", type: "object",
                keys: [
                    { name: "replicaId", type: "string" }
                ]
            }
        ], arguments, 'ReplicaDefinition', 'constructor');
        this.initConfig(config);
    },

    /** 
     * Change replica id
     *
     * @param {String} replicaId
     *
     * return {Boolean} True/False
     *
     */
    changeReplicaId: function(replicaId) {
        var changed= (this.getReplicaId()!=replicaId); 
        this.setReplicaId(replicaId);
        return changed;
    },
        
    /**
     * Return as data
     */
    as_data: function() {
        return {
            deviceId: this.getDeviceId(),
            replicaId: this.getReplicaId()
        };
    }

});
