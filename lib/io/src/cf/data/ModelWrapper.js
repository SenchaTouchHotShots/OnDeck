/**
 *
 * @private
 *
 * Model Wrapper
 *
 */
Ext.define("Ext.cf.data.ModelWrapper", {
    override: "Ext.data.Model",
    /**
     * Get Object Identifier
     */
    getOid: function() {
        return this.eco.getOid();
    },

    /**
     * Get Change Stamp for the path
     *
     * @param {String/Array} path
     *
     * @return {Ext.cf.ds.CS}
     *
     */
    getCS: function(path) {
        return this.eco.getCS(path);
    },

    /**
     * Get the Change Stamp Vector of the Object
     *
     * @return {Ext.cf.ds.CSV}
     */
    getCSV: function(){
        return this.eco.getCSV();
    },

    /**
     * Set the Value and Change Stamp
     *
     * @param {Ext.cf.data.Transaction} t
     * @param {String/Array} path
     * @param {Array} values
     * @param {Ext.cf.ds.CS} new_cs
     *
     */
    setValueCS: function(t,path,values,new_cs){
        return this.eco.setValueCS(t,path,values,new_cs);
    },

    /**
     * Change Replica id
     *
     * @param {String} old_replica_id Old Id
     * @param {String} new_replica_id New Id
     *
     */
    changeReplicaId: function(old_replica_id,new_replica_id) {
        return this.eco.changeReplicaId(this.getIdProperty(),old_replica_id,new_replica_id);
    },

    /**
     * Set update state
     *
     * @param {Ext.cf.data.Transaction} t Transaction
     *
     */
    setUpdateState: function(t) {
        var changes= this.getChanges();
        for (var name in changes) {
            this.setUpdateStateValue(t,[name],this.modified[name],changes[name]);
        }
    },
    
    /**
     * Set update state value
     *
     * @param {Ext.cf.data.Transaction} t
     * @param {String/Array} path
     * @param {Object} old value
     * @param {Object} new value
     *
     */
    setUpdateStateValue: function(t,path,before_value,after_value) {
        //console.log('setUpdateStateValue',path,before_value,after_value)
        if (this.eco.isComplexValueType(after_value)) {
            var added, name2;
            if (before_value) {
                added= {};
                if (this.eco.isComplexValueType(before_value)) {
                    if (this.eco.valueType(before_value)===this.eco.valueType(after_value)) {
                        added= Ext.Array.difference(after_value,before_value);
                        var changed= Ext.Array.intersect(after_value,before_value);
                        for(name2 in changed) {
                            if (changed.hasOwnProperty(name2)) {
                                if (before_value[name2]!==after_value[name2]) {
                                    added[name2]= after_value[name2];
                                }
                            }
                        }
                    } else {
                        added= after_value;
                        this.eco.setCS(t,path,t.generateChangeStamp()); // value had a different type before, a complex type
                    }
                } else {
                    added= after_value;
                    this.eco.setCS(t,path,t.generateChangeStamp()); // value had a different type before, a primitive type
                }
            } else {
                added= after_value;
                this.eco.setCS(t,path,t.generateChangeStamp()); // value didn't exist before
            }
            for(name2 in added) {
                if (added.hasOwnProperty(name2)) {
                    var next_before_value= before_value ? before_value[name2] : undefined;
                    this.setUpdateStateValue(t,path.concat(name2),next_before_value,after_value[name2]);
                }
            }
        } else {
            this.eco.setCS(t,path,t.generateChangeStamp()); // value has a primitive type
        }
    },

    /**
     * Set destroy state
     *
     * @param {Ext.cf.data.Transaction} t
     *
     */
    setDestroyState: function(t) {
        var cs= t.generateChangeStamp();
        this.eco.setValueCS(t,'_ts',cs.asString(),cs);
    },
    
    /**
     * Get updates
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     * @return {Ext.io.data.Updates}
     *
     */
    getUpdates: function(csv) {
        return this.eco.getUpdates(csv);
    },
    
    /**
     * Put update
     *
     * @param {Ext.cf.data.Transaction} t
     * @param {Object} update
     *
     */
    putUpdate: function(t,update) {
        return this.eco.setValueCS(t,update.p,update.v,update.c);
    }
    
});


