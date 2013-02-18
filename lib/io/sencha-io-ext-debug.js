/*

Sencha.io
Copyright (c) 2011, 2012, 2013, Sencha Inc.
All rights reserved.
licensing@sencha.com

License details available at

http://www.sencha.com/legal/sencha-io-terms-of-service

This software is distributed WITHOUT ANY WARRANTY, without the implied 
warranty of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
NON-INFRINGEMENT OF THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS.  

*/
Ext.define('Ext.cf.Overrides', {
    requires: [
        'Ext.data.Store'
    ]
}, function() {
    var patch_st2= function(){
        Ext.data.Store.prototype.storeSync= Ext.data.Store.prototype.sync;

        Ext.data.Store.override({
            /**
             * Synchronizes the Store with its Proxy. This asks the Proxy to batch together any new, updated
             * and deleted records in the store, updating the Store's internal representation of the records
             * as each operation completes.
             */
            sync: function(callback,scope) {
                if (typeof(this.getProxy().sync) === "undefined") {
                    return this.storeSync();
                }else{
                    return this.getProxy().sync(this,callback,scope);
                }
            }
        });

     
    };

    var patch_ext41_b2= function(){

        Ext.io_Observable= 'Ext.util.Observable';

        Ext.data.Store.prototype.storeSync= Ext.data.AbstractStore.prototype.sync;

        Ext.data.Store.override({
            /**
             * Synchronizes the Store with its Proxy. This asks the Proxy to batch together any new, updated
             * and deleted records in the store, updating the Store's internal representation of the records
             * as each operation completes.
             */
            sync: function(callback,scope) {
                if (typeof(this.getProxy().sync) === "undefined") {
                    return this.storeSync();
                }else{
                    return this.getProxy().sync(this,callback,scope);
                }
            }
        });
        
        Ext.data.Model.getFields= function(){return this.prototype.fields;};
        Ext.data.Field.override({
            getName: function(){return this.name;},
            getEncode: function(){return this.encode;},
            getDecode: function(){return this.decode;},
            getType: function(){return this.type;}
        });
        Ext.data.Operation.override({
            setResultSet: function(x){this.resultSet=x;}
        });
        Ext.data.ResultSet.override({
            getRecords: function(x){return this.records;}
        });

    };
    
    var m= "ERROR: The Sencha.io SDK requires either the Sencha Touch SDK or the Sencha Ext JS SDK.";
    if(typeof Ext==='undefined'){
        console.log(m);
        throw m;
    }else{
        var coreVersion= Ext.getVersion('core'), t;
        if(!coreVersion){
            t= m+" Ext is defined, but getVersion('core') did not return the expected version information.";
            console.log(t);
            throw t;
        }else{
            var version= coreVersion.version;
            var touchVersion= Ext.getVersion('touch');
            var extjsVersion= Ext.getVersion('extjs');
            var patch_push_notifications = false;
            if(touchVersion && extjsVersion){
                t= "WARNING: Both the Sencha Touch SDK and the Sencha Ext JS SDK have been loaded. This could lead to unpredictable behavior.";
                console.warn(t);
            }
            if(!touchVersion && !extjsVersion){
                t= m+" The Ext Core SDK is on its own is not sufficient.";
                console.warn(t);
                throw t;
            }
            if(extjsVersion){
                console.warn("Sencha.io does not officially support Extjs.  Full compatibility is planned for a future release. Proceed with caution.");
                patch_ext41_b2();
                /*version= extjsVersion.version;
                patch_push_notifications = true; // push notifications are not supported on any extJS version
                if(version === "4.1.0") {
                    console.log("WARNING: Disabling Sencha.io data stores, since we seem to be running the ExtJS SDK, version", extjsVersion.version);
                    patch_ext41_b2();
                } else {
                    t= m+" Version "+version+" of the Sencha Ext SDK and this version of the Sencha.io SDK are not fully compatible.";
                    console.log(t);
                    throw t;
                }*/
            }else if(touchVersion){
                if(touchVersion.major >=2){
                    patch_st2();
                } else {
                    patch_push_notifications = true;
                    t= m+" Version "+version+" of the Sencha Touch SDK and this version of the Sencha.io SDK are not fully compatible.";
                    console.log(t);
                }
            }else{
                t= m+" They were here, but now I can't find them.";
                console.log(t);
                throw t;
            }
        }
    }
});

// THIS IS AN AUTO GENERATED FILE (sio-server gendefs)
// DO NOT MODIFY MANUALLY
Ext.define('Ext.cf.ServiceDefinitions', {
    statics: {
        'AppService': '0.7',
        'AuthorizationService': '0.7',
        'AuthProvider': '0.7',
        'ChannelService': '0.7',
        'CnameVerifierService': '0.7',
        'ContentService': '0.7',
        'CourierService': '0.7',
        'DeployService': '0.7',
        'DeviceAllocatorService': '0.7',
        'DynectService': '0.7',
        'EmailService': '0.7',
        'ExtSvcLifecycleService': '0.1',
        'ExtSvcSubscriberService': '0.1',
        'ExtSvcWebhookService': '0.1',
        'FileService': '0.7',
        'GraphvizService': '0.7',
        'GroupManager': '0.7',
        'GroupService': '0.7',
        'InstrumentationRpcService': '0.7',
        'InstrumentationService': '0.7',
        'MessagingService': '0.7',
        'MockAsyncService': '0.7',
        'MockRpcService': '0.7',
        'NamingEventService': '0.7',
        'NamingRpcService': '0.7',
        'NamingService': '0.7',
        'NotificationService': '0.7',
        'PresenceService': '0.7',
        'ReaperService': '0.7',
        'RegistryRpcService': '0.7',
        'RegistryService': '0.7',
        'RpcRelayService': '0.7',
        'RpcStubService': '0.7',
        'RpcSubscriberService': '0.7',
        'SeedDataService': '0.7',
        'SessionService': '0.7',
        'StatusService': '0.7',
        'SyncRpcService': '0.7',
        'SyncService': '0.7',
        'TeamManager': '0.7',
        'TeamService': '0.7',
        'VersionService': '0.7'
    }
});

/**
 * @private
 */
Ext.define('Ext.cf.util.LoggerConstants', {
    statics: {
        NONE: 10,
        ERROR: 5,
        WARNING: 4,
        INFO: 3,
        DEBUG: 2,
        PERF: 1,
 
        STR_TO_LEVEL: {
          "perf": 1,
          "debug": 2,
          "info": 3,
          "warn": 4,
          "error": 5,
          "none": 10
        }
    }
});
 
Ext.define('Ext.cf.util.Logger', {
    statics: {
        level: Ext.cf.util.LoggerConstants.ERROR,
 
        /**
        * Set logger level
        *
        * @param {String} level as a string
        *
        */
        setLevel: function(levelString) {
            if(Ext.cf.util.LoggerConstants.STR_TO_LEVEL[levelString]) {
                Ext.cf.util.Logger.level = Ext.cf.util.LoggerConstants.STR_TO_LEVEL[levelString];
            } else {
                Ext.cf.util.Logger.level = Ext.cf.util.LoggerConstants.NONE;
            }
        },

        /**
        * Perf
        *
        */
        perf: function() {
            if(Ext.cf.util.Logger.level <= Ext.cf.util.LoggerConstants.PERF) {
                Ext.cf.util.Logger.message('PERF:',arguments);
            }
        },

        /**
        * Debug
        *
        */
        debug: function() {
            if(Ext.cf.util.Logger.level <= Ext.cf.util.LoggerConstants.DEBUG) {
                Ext.cf.util.Logger.message('DEBUG:',arguments);
            }
        },
 
        /**
        * Info
        *
        */
        info: function() {
            if(Ext.cf.util.Logger.level <= Ext.cf.util.LoggerConstants.INFO) {
                Ext.cf.util.Logger.message('INFO:',arguments);
            }
        },
 
        /**
        * Warn
        *
        */
        warn: function() {
            if(Ext.cf.util.Logger.level <= Ext.cf.util.LoggerConstants.WARNING) {
                Ext.cf.util.Logger.message('WARNING:',arguments);
            }
        },
 
        /**
        * Error
        *
        */
        error: function() {
            if(Ext.cf.util.Logger.level <= Ext.cf.util.LoggerConstants.ERROR) {
                Ext.cf.util.Logger.message('ERROR:',arguments);
            }
        },
 
        /**
        * Trace
        *
        */
        trace: function(name,params) {
            var t= [];
            var l= params.length;
            for(var i=0;i<l;i++){
                var p= params[i];
                if(p==global){
                    t.push('global');
                }else if (p==Ext.io.Io){
                    t.push('Ext.io.Io');
                }else if(typeof p==='function'){
                    t.push('function');
                }else{
                    try{
                        t.push(JSON.stringify(p));
                    }catch(e){
                        t.push('unknown');
                    }
                }
            }
            this.debug('TRACE',name,'(',t.join(', '),')');
        },

        /**
        * Message
        *
        * @param {String/Number} level
        * @param @param {Array} args
        *
        */
        message: function(level,a){
            var b= Array.prototype.slice.call(a);
            b.unshift(level);

            if (typeof console != "undefined") {
                switch (typeof console.log) {
                    case 'function':
                        console.log.apply(console,b);
                    break;
                    case 'object':
                        console.log(b.join(" "));
                    break;
                }
            }
        }
 
    }
});
 

/**
 * @private
 *
 */
Ext.define('Ext.cf.Utilities', {
    requires: ['Ext.cf.util.Logger'],

    statics: {

        /**
         * Delegate
         *
         * @param {Object} from_instance
         * @param {Object} to_instance
         * @param {Array} methods
         *
         */
        delegate: function(from_instance, to_instance, methods) {
            if (to_instance===undefined) { 
                var message= "Error - Tried to delegate '"+methods+"' to undefined instance.";
                Ext.cf.util.Logger.error(message);
                throw message;
            }
            methods.forEach(function(method){
                var to_method= to_instance[method];
                if (to_method===undefined) { 
                    message= "Error - Tried to delegate undefined method '"+method+"' to "+to_instance;
                    Ext.cf.util.Logger.error(message);
                    throw message;
                }
                from_instance[method]= function() {
                    return to_method.apply(to_instance, arguments);
                };
            });
        },

        /**
         * Check
         *
         * @param {String} class_name for reporting
         * @param {String} method_name for reporting
         * @param {String} instance_name for reporting
         * @param {Object} instance of the object we are checking
         * @param {Array} properties that we expect to find on the instance 
         *
         */
        check: function(class_name, method_name, instance_name, instance, properties) {
            if (instance===undefined) {
                var message= "Error - "+class_name+"."+method_name+" - "+instance_name+" not provided.";
                Ext.cf.util.Logger.error(message);
            } else {
                properties.forEach(function(property) {
                    var value= instance[property];
                    if (value===undefined) {
                        var message= "Error - "+class_name+"."+method_name+" - "+instance_name+"."+property+" not provided.";
                        Ext.cf.util.Logger.error(message);
                    }
                });
            }
        },

        /**
         *
         * Wrap a Method
         *
         * @param {Function} m The method to wrap.
         * @param {String} key A flag so that we know when the method has already been wrapped.
         * @param {Function} before The function to call before the method.
         * @param {Function} after The function to call after the method.
         */
        wrapMethod: function(m,key,before,after){
            if(m[key]){
                return m;
            }else{
                var nm= function(){
                    if(before) { before.call(this,m,arguments); }
                    m.apply(this,arguments);
                    if(after) { after.call(this,m,arguments); }
                };
                nm[key]= true;
                nm.displayName= m.displayName;
                return nm;
            }
        },

        /**
         *
         * Wrap all the Methods of a Class
         *
         * @param {Object} klass 
         * @param {String} key
         * @param {Function} f
         * @param {Function} before The function to call before the method.
         * @param {Function} after The function to call after the method.
         */
        wrapClass: function(klass,key,before,after) {
            for (var name in klass) {
                if (klass.hasOwnProperty(name)) {
                    var m= klass[name];
                    if(m.displayName){ // limit the wrapping to sencha style methods... JCM probably there's a better way. 
                        klass[name]= this.wrapMethod(m,key,before,after);
                    }
                }
            }
        }

    }

});


/**
 * 
 * @private
 *
 * Database Definition
 *
 */
Ext.define('Ext.cf.data.DatabaseDefinition', {
   requires: ['Ext.cf.Utilities'],

    config: {
        /**
         * @cfg groupId
         * @accessor
         */
        groupId: undefined,
        /**
         * @cfg userId
         * @accessor
         */
        userId: undefined,
        /**
         * @cfg databaseName
         * @accessor
         */
        databaseName: undefined,
        /**
         * @cfg generation
         * @accessor
         */
        generation: undefined, // of the database
        /**
         * @cfg idProperty
         * @accessor
         */
        idProperty: undefined,
        /**
         * @cfg version
         * The version of the client side storage scheme.
         * @accessor
         */
        version: 2
        // JCM include the epoch of the clock here?
    },  
    
    /** 
     * @private
     *
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        var validated = Ext.cf.util.ParamValidator.validateApi([
            { name: "config", type: "object",
                keys: [
                    { name: "databaseName", type: 'string' },
                    { name: "generation", type: 'number|string' }
                ]
            }
        ], arguments, 'DatabaseDefinition', 'constructor');
        this.initConfig(config);
    },

    /** 
     * hasOwner
     *
     * @return {Boolean} True/False
     *
     */
    hasOwner: function() {
        return this.getUserId()!==undefined || this.getGroupId()!==undefined;
    }

});

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



/** 
 * @private
 *
 * Change Stamp
 *
 * It represents a point in 'time' for a single replica.
 * It's used like a timestamp, but has more components than time.
 */
Ext.define('Ext.cf.ds.CS', {

    r: '0', // replica_id
    t: 0, // time, in seconds since the epoch, as defined by the CS Generator 
    s: 0, // sequence number

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.set(config);
    },
    
    /** 
     * Set
     *
     * @param {String/Object} x
     *
     */
    set: function(x) {
        if (typeof x === 'string' || x instanceof String) {
            this.from_s(x);
        } else if (typeof x === 'object') {
            this.r= String(x.r||'0');
            this.t= x.t||0;
            this.s= x.s||0;
        }
    },

    /** 
     * Change replica id
     *
     * @param {String} old_replica_id
     * @param {String} new_replica_id
     *
     */
    changeReplicaId: function(old_replica_id,new_replica_id) {
        if (this.r==old_replica_id) {
            this.r= new_replica_id;
            return true;
        }
        return false;
    },

    /** 
     * Greater than
     *
     * @param {Object} x
     *
     */
    greaterThan: function(x) {
        return this.compare(x)>0;
    },
    
    /** 
     * Less than
     *
     * @param {Object} x
     *
     */
    lessThan: function(x) { 
        return this.compare(x)<0; 
    },

    /** 
     * Equals
     *
     * @param {Object} x
     *
     */
    equals: function(x) { 
        return this.compare(x)===0;
    },

    /** 
     * Compare
     *
     * @param {Object} x
     *
     */
    compare: function(x) {
        var r= this.t-x.t;
        if (r===0) {
            r= this.s-x.s;
            if (r===0) {
                r= this.r.localeCompare(x.r);
            }
        }
        return r;
    },
    
    cs_regex: /([^-]+)-(\d+)-?(\d+)?/,
    
    /** 
     * From Stamp 
     *
     * @param {String/Number} t
     *
     */
    from_s: function(t) {
        var m= t.match(this.cs_regex);
        if (m && m.length>0) {
            this.r= m[1];
            this.t= parseInt(m[2], 10);
            this.s= m[3] ? parseInt(m[3], 10) : 0;
        } else {
            throw "Error - CS - Bad change stamp '"+t+"'.";
        }
        return this;
    },
    
    /** 
     * To stamp
     *
     */
    asString: function() {
        return this.r+"-"+this.t+(this.s>0 ? "-"+this.s : "");      
    }

});

/**
 * 
 * @private
 *
 * Updates
 *
 * An ordered list of updates, where an update is an assertion of 
 * an attribute's value at a point in time, defined by a Change
 * Stamp.
 */
Ext.define('Ext.cf.data.Updates', {
    requires: ['Ext.cf.ds.CS'], 

    updates: undefined,
    
    /** 
     * Constructor
     *
     * @param {Array} updates
     *
     */
    constructor: function(x) {
        //
        // sort the updates into change stamp order,
        // as they have to be transmitted this way
        //
        this.updates= x||[];
        this.updates.forEach(function(update) {
            if (!(update.c instanceof Ext.cf.ds.CS)) {
                update.c= new Ext.cf.ds.CS(update.c);
            }
        });
        this.updates.sort(function(a,b) {return a.c.compare(b.c);});
    },
    
    /** 
     * Push
     *
     * @param {Object} update
     *
     */
    push: function(update) {
        // assert - update must have a cs greater than the last element
        var last= this.updates[this.updates.length];
        if (!update.c.greaterThan(last.c)) { throw "Error - Updates - Tried to push updates in wrong order. "+JSON.stringify(update)+" <= "+JSON.stringify(last); }
        this.updates.push(update);
    },
    
    /** 
     * isEmpty?
     *
     * @return {Boolean} True/False
     *
     */
    isEmpty: function() {
        return this.updates.length<1;
    },
    
    /** 
     * length
     *
     * @return {Number} length
     *
     */
    length: function() {
        return this.updates.length;
    },

    /** 
     * oids
     *
     * @return {Array} oids
     *
     */
    oids: function() {

        return Ext.Array.unique(Ext.Array.pluck(this.updates,'i'));
    },

    /** 
     * forEach
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    forEach: function(callback,scope) {
        this.updates.forEach(callback,scope);
    },

    /**
     * Optimization- If a subsequent update has the same Object Identifier
     * as the preceeding update then we omit the OID.
     */
    encode: function() {
        // JCM optimize - "" around i and p and cs is not needed
        // JCM optimize - diff encode cs 1-123, +1-0, +0-1, 1-136-4, +1-0, ...
        var r= [];
        var l= this.updates.length;
        var prev_i, update, cs;
        for(var i=0;i<l;i++) {
            update= this.updates[i];
            cs= ((update.c instanceof Ext.cf.ds.CS) ? update.c.asString() : update.c);
            if (update.i===prev_i) {
                r.push([update.p, update.v, cs]);
            } else {
                r.push([update.i, update.p, update.v, cs]);
                prev_i= update.i;
            }
        }
        return r;
    },
        
    /** 
     * Decode
     *
     * @param {Array} x
     *
     */
    decode: function(x) {
        this.updates= [];
        if (x) {
            var l= x.length;
            var update, prev_i, id, p, v, c;
            for(var i=0;i<l;i++) {
                update= x[i];
                switch(update.length) {
                    case 3:
                        id= prev_i;
                        p= update[0];
                        v= update[1];
                        c= update[2];
                        break;
                    case 4:
                        id= update[0];
                        p= update[1];
                        v= update[2];
                        c= update[3];
                        prev_i= id;
                        break;
                }
                c= ((c instanceof Ext.cf.ds.CS) ? c : new Ext.cf.ds.CS(c));
                this.updates.push({i:id,p:p,v:v,c:c});
            }
        }
        return this;
    }
    
});

  
  

/**
 * @private
 *
 * Real Clock
 */
Ext.define('Ext.cf.ds.RealClock', {
    
    /** 
     * Constructor
     *
     */
    constructor: function() {
        this.epoch = new Date('01 Jan 2011 00:00:00 GMT');
    },
    
    /** 
     * now
     *
     * @return {Number} seconds
     */
    now: function() {
        return this.ms_to_s(new Date().getTime()-this.epoch);   
    },
    
    /**
     * @private
     *
     * Milliseconds to seconds
     *
     * @param {Number} milliseconds
     *
     * @return {Number} seconds
     */
    ms_to_s: function(ms) {
        return Math.floor(ms/1000);
    }
 
});

/**
 * @private
 *
 * Logical Clock
 *
 * Generates Change Stamps.
 * It is Monotonic.
 * It never goes backwards.
 *
 */
Ext.define('Ext.cf.ds.LogicalClock', {
    requires: [
        'Ext.cf.ds.RealClock',
        'Ext.cf.ds.CS'
    ],

    r: undefined, // replica_id
    t: undefined, // time, in seconds since epoch
    s: undefined, // sequence number
    
    clock: undefined, // a real clock, it provides the time
    local_offset: undefined,
    global_offset: undefined,
    
    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.set(config);
    },
    
    /** 
     * Set
     *
     * @param {Object} data
     *
     */
    set: function(data) {
        if(data){
            this.clock= data.clock || Ext.create('Ext.cf.ds.RealClock');
            this.r= data.r;
            this.t= data.t || this.clock.now();
            this.s= data.s!==undefined ? data.s : -1; // so that the next tick gets us to 0
            this.local_offset= data.local_offset || 0;
            this.global_offset= data.global_offset || 0;
        }
    },

    /** 
     * Set clock
     *
     * @param {Object} clock
     *
     */
    setClock: function(clock) {
        this.clock= clock;
        this.t= this.clock.now();
        this.s= -1; // so that the next tick gets us to 0
    },
    
    /** 
     * Generate change stamp
     *
     */
    generateChangeStamp: function() { // the next change stamp
        var current_time= this.clock.now();
        this.update_local_offset(current_time);
        this.s+= 1;
        if (this.s>255) { // JCM This is totally arbitrary, and it's hard coded too....
            this.t= current_time;
            this.local_offset+= 1;
            this.s= 0;
        }
        return new Ext.cf.ds.CS({r:this.r,t:this.global_time(),s:this.s});
    },

    /** 
     * Seen CSV
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     */
    seenCSV: function(csv) { // a change stamp vector we just received
        return this.seenChangeStamp(csv.maxChangeStamp());
    },

    /** 
     * Seen change stamp
     *
     * @param {Ext.cf.ds.CS} cs
     *
     */
    seenChangeStamp: function(cs) { // a change stamp we just received
        var changed= false;
        if(cs){
            var current_time= this.clock.now();
            if (current_time>this.t) {
                changed= this.update_local_offset(current_time);
            }
            changed= changed||this.update_global_offset(cs);
        }
        return changed;
    },
  
    /** 
     * Set replica id
     *
     * @param {String} replica_id
     *
     */
    setReplicaId: function(replica_id) {
        var changed= this.r!==replica_id;
        this.r= replica_id;
        return changed;
    },

    /** 
     * Update local offset
     *
     * @param {Number} current_time
     *
     * @private
     *
     */
    update_local_offset: function(current_time) {
        var changed= false;
        var delta= current_time-this.t;
        if (delta>0) { // local clock moved forwards
            var local_time= this.global_time();
            this.t= current_time;
            if (delta>this.local_offset) {
                this.local_offset= 0;
            } else {
                this.local_offset-= delta;
            }
            var local_time_after= this.global_time();
            if (local_time_after>local_time) {
                this.s= -1;
            }
            changed= true;
        } else if (delta<0) { // local clock moved backwards
            // JCM if delta is too big, then complain
            this.t= current_time;
            this.local_offset+= -delta;
            changed= true;
        }
        return changed;
    },

    /** 
     * Update global offset
     *
     * @param {Ext.cf.ds.CS} remote_cs
     *
     * @private
     *
     */
    update_global_offset: function(remote_cs) {
        var changed= false;
        var local_cs= new Ext.cf.ds.CS({r:this.r,t:this.global_time(),s:this.s+1});
        var local_t= local_cs.t;
        var local_s= local_cs.s;
        var remote_t= remote_cs.t;
        var remote_s= remote_cs.s;
        if (remote_t==local_t && remote_s>=local_s) {
            this.s= remote_s;
            changed= true;
        } else if (remote_t>local_t) {
            var delta= remote_t-local_t;
            if (delta>0) { // remote clock moved forwards
                // JCM guard against moving too far forward
                this.global_offset+= delta;
                this.s= remote_s;
                changed= true;
            }
        }
        return changed; 
    },

    /** 
     * Global time
     *
     * @private
     *
     */
    global_time: function() {
        return this.t+this.local_offset+this.global_offset;
    },
    
    /** 
     * As data
     *
     * @return {Object}
     *
     */
    as_data: function() {
        return {
            r: this.r,
            t: this.t,
            s: this.s,
            local_offset: this.local_offset,
            global_offset: this.global_offset
        };
    }
    
});

/**
 * @private
 *
 * Change Stamp Vector
 *
 * Represents a global point in 'time'.
 */
Ext.define('Ext.cf.ds.CSV', {
    requires: ['Ext.cf.ds.CS'],

    v: undefined, // change stamps, replica id => change stamp

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.v= {};
        if (config===undefined){
        }else if (config instanceof Ext.cf.ds.CSV) {
            this.addX(config);
        }else{
            this.addX(config.v);
        }
    },
    
    /** 
     * Get
     *
     * @param {Ext.cf.ds.CS/Number} x
     *
     */
    get: function(x) {
        if (x instanceof Ext.cf.ds.CS) {
            return this.v[x.r];
        }else{
            return this.v[x];
        }
    },

    /** 
     * SetCS
     *
     * @param {Ext.cf.ds.CS} x
     *
     */
    setCS: function(x) {
        this.v[x.r]= Ext.create('Ext.cf.ds.CS',{r:x.r,t:x.t,s:x.s});
    },
    
    /** 
     * Set replica id
     *
     * @param {String} replica_id
     *
     */
    setReplicaId: function(replica_id) {
        this.addReplicaIds([replica_id]);
    },
    
    /** 
     * Add replica ids
     *
     * @param {Array/Object} x
     *
     */
    addReplicaIds: function(x) {
        var t= [];
        if (x instanceof Array) {
            if(x[0] instanceof Ext.cf.ds.CS){
                t= Ext.Array.map(x,function(r){return this.addX(Ext.create('Ext.cf.ds.CS',{r:x.r}));},this);
            }else{
                t= Ext.Array.map(x,function(r){return this.addX(Ext.create('Ext.cf.ds.CS',{r:r}));},this);
            }
        } else if (x instanceof Ext.cf.ds.CSV) {
            t= x.collect(function(cs){return this.addX(Ext.create('Ext.cf.ds.CS',{r:cs.r}));},this);
        }
        return Ext.Array.contains(t,true);
    },

    /** 
     * Add X
     *
     * @param {Ext.cf.ds.CSV/Ext.cf.ds.CS/Array/String} x
     *
     */
    addX: function(x) { // CSV, CS, '1-2-3', [x]
        var changed= false;
        if (x===undefined){
        } else if (x instanceof Ext.cf.ds.CSV) {
            changed= this.addCSV(x);
        } else if (x instanceof Array) {
            var t= Ext.Array.map(x,this.addX,this);
            changed= Ext.Array.contains(t,true);
        } else if (x instanceof Ext.cf.ds.CS) {
            changed= this.addCS(x);
        } else if (typeof x == 'string' || x instanceof String) {
            changed= this.addX(Ext.create('Ext.cf.ds.CS',x));
        }
        return changed;
    },

    /** 
     * Add CS
     *
     * @param {Ext.cf.ds.CS} x
     *
     */
    addCS: function(x) {
        var changed= false;
        if (x!==undefined){
            var r= x.r;
            var t= this.v[r];
            if (!t || x.greaterThan(t)) {
                this.v[r]= Ext.create('Ext.cf.ds.CS',{r:x.r,t:x.t,s:x.s});
                changed= true;
            }
        }
        return changed;
    },

    /** 
     * Add CSV
     *
     * @param {Ext.cf.ds.CSV} x
     *
     */
    addCSV: function(x) {
        var changed= false;
        if (x!==undefined){
            var t= x.collect(this.addCS,this);
            changed= Ext.Array.contains(t,true);
        }
        return changed;
    },

    /** 
     * Set CSV
     *
     * @param {Ext.cf.ds.CSV} x
     *
     */
    setCSV: function(x) {
        x.collect(this.setCS,this);
    },

    /** 
     * Change replica id
     *
     * @param {String} old_replica_id
     * @param {String} new_replica_id
     *
     */
    changeReplicaId: function(old_replica_id,new_replica_id) {
        var t= this.v[old_replica_id];
        var changed= false;
        if (t) {
            t.r= new_replica_id;
            delete this.v[old_replica_id];
            this.v[new_replica_id]= t;
            changed= true;
        }
        return changed;
    },

    /** 
     * isEmpty?
     *
     * @return {Boolean} True/False
     *
     */
    isEmpty: function() {
        for(var i in this.v) {
            return false;
        }
        return true;
    },
        
    /** 
     * Max change stamp
     *
     * @return {Ext.cf.ds.CS} Changestamp
     *
     */
    maxChangeStamp: function() {
        if (!this.isEmpty()) {
            var r= Ext.create('Ext.cf.ds.CS');
            for (var i in this.v) {
                r = (this.v[i].greaterThan(r) ? this.v[i] : r);
            }
            return r;
        }
    },

    /** 
     * Min change stamp
     *
     * @return {Ext.cf.ds.CS} Changestamp
     *
     */
    minChangeStamp: function() {
        if (!this.isEmpty()) {
            var r;
            for (var i in this.v) {
                r = (!r || this.v[i].lessThan(r) ? this.v[i] : r);
            }
            return r;
        }
    },
    
    /** 
     * Intersect
     *
     * @param {Ext.cf.ds.CSV} x
     *
     */
    intersect: function(x) {
        for (var i in x.v) {
            if (this.v[i]!==undefined) {
                this.v[i]=x.v[i];
            }
        }
    },

    /** 
     * Dominates
     *
     * @param {Ext.cf.ds.CSV} x
     *
     * @return {Boolean} true if this csv dominates x
     *
     */
    dominates: function(x) { // true if this csv dominates x
        return Ext.Array.some(this.compare(x),function(i){ return i>0; });
    },
    
    /** 
     * Dominated
     *
     * @param {Ext.cf.ds.CSV} x
     *
     * @return {Array} returns a list of the dominated cs in x
     *
     */
    dominated: function(x) { // returns a list of the dominated cs in x
        var r = [];
        for (var i in this.v) {
            if(this.v[i]!==undefined && this.compare(this.v[i])>0) {
                r.push(this.v[i]);
            }
        }
        return r;
    },

    /** 
     * Dominant
     *
     * @param {Ext.cf.ds.CSV} x
     *
     * @return {Object} dominant and dominated arrays
     *
     */
    dominant: function(x) { // this dominates over that
        var dominated= [];
        var dominant= []; 
        for (var i in this.v) {
            var v= this.v[i];
            if (v!==undefined){
                var r= x.compare(v);
                if(r<0) {
                    dominant.push(v);
                }else if(r>0){
                    dominated.push(v);
                }
            }
        }
        return {dominant:dominant,dominated:dominated};
    },
    
    /** 
     * Equals
     *
     * @param {Ext.cf.ds.CSV} x
     *
     * @return {Boolean} True/False
     *
     */
    equals: function(x) {
        return Ext.Array.every(this.compare(x),function(i){ return i===0; });
    },
    
    /** 
     * Compare
     *
     * @param {Ext.cf.ds.CSV} x
     *
     */
    compare: function(x) {
        var cs, cs2;
        if (x instanceof Ext.cf.ds.CS) {
            cs= this.get(x);
            cs2= x;
            return [cs ? cs.compare(cs2) : -1];
        } else if (x instanceof Ext.cf.ds.CSV) {        
            var r= [];
            for(var i in this.v) {
                cs= this.v[i];
                if (cs instanceof Ext.cf.ds.CS) {
                    cs2= x.get(cs);
                    r.push(cs2 ? cs.compare(cs2) : 1);
                }
            }
            return r;
        } else {
            throw "Error - CSV - compare - Unknown type: "+(typeof x)+": "+x;
        }
        return [-1];
    },
    
    /** 
     * Encode
     *
     */
    encode: function() { // for the wire
        return this.collect(function(cs){
            // JCM can we safely ignore replicas with CS of 0... except for the highest known replica id...
            return cs.asString();
        }).join('.');
    },
    
    /** 
     * Decode
     *
     * @param {Object} x
     *
     */
    decode: function(x) { // from the wire
        if(x){
            this.addX(x.split('.'));
        }
        return this;
    },
    
    /** 
     * To Stamp
     *
     * @param {Object} indent
     *
     * @return {String}
     *
     */
    asString: function(indent) {
        return "CSV: "+this.collect(function(cs){return cs.asString();}).join(', ');
    },

    /** 
     * As data
     *
     * @return {Object} 
     *
     */
    as_data: function() { // for the disk
        return {
            v: this.collect(function(cs){return cs.asString();}),
            id: 'csv'
        };
    },

    // private

    /** 
     * Collect
     *
     * @param {Function} fn
     * @param {Object} scope
     *
     * @return {Array}
     *
     * @private
     *
     */
    collect: function(fn,scope) {
        var r= [];
        for(var i in this.v){
            if(this.v.hasOwnProperty(i)){
                r.push(fn.call(scope||this,this.v[i]));
            }
        }
        return r;
    }
        
});

/**
 * 
 * @private
 *
 * Transaction
 *
 * A Transaction wraps an implementation of the proxy, 
 * providing for caching of reads, and group commit of writes.
 */ 
Ext.define('Ext.cf.data.Transaction', { 
    requires: [
        'Ext.cf.ds.LogicalClock',
        'Ext.cf.ds.CSV',
        'Ext.cf.util.Logger'
    ],

    /** 
     * Constructor
     *
     * @param {Object} proxy
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    constructor: function(proxy,callback,scope) {
        this.proxy= proxy;
        this.store= proxy.getStore();
        this.generatorChanged= false;
        this.originalGenerator= proxy.generator;
        this.modifiedGenerator= Ext.create('Ext.cf.ds.LogicalClock',proxy.generator);
        this.csvChanged= false;
        this.originalCSV= proxy.csv;
        this.modifiedCSV= Ext.create('Ext.cf.ds.CSV',proxy.csv); // copy the csv
        this.cache= {}; // read cache of records
        this.toCreate= []; // records to create
        this.toUpdate= []; // records to update
        this.toDestroy= []; // records to destroy
        this.store.getCSIndex(function(csiv){
            this.csivChanged= false;
            this.csiv= csiv;
            callback.call(scope,this);
        },this);
    },
    
    /** 
     * Generate change stamp
     *
     * return {Ext.cf.ds.CS}
     *
     */
    generateChangeStamp: function() {
        var cs= this.modifiedGenerator.generateChangeStamp();
        this.modifiedCSV.addCS(cs);
        this.generatorChanged= true;
        this.csvChanged= true;
        return cs;
    },

    /** 
     * Create
     *
     * @param {Array} records
     *
     */
    create: function(records) {
        this.addToCache(records);
        this.addToList(this.toCreate,records);
     },

    /** 
     * Read by oid
     *
     * @param {Number/String} oid
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readByOid: function(oid, callback, scope) {
        var record= this.cache[oid];
        //console.log('readByOid',oid,'=>',record)
        if(record){
            callback.call(scope,record);
        }else{
            this.store.readByOid(oid,function(record){
                if(record){
                    this.addToCache(record);
                }
                callback.call(scope,record);
            },this);
        }
    },

    /** 
     * Read cache by oid
     *
     * @param {String} oid
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readCacheByOid: function(oid, callback, scope) {
        var record= this.cache[oid];
        callback.call(scope,record);
    },

    /** 
     * Read by oids
     *
     * @param {Array} oids
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readByOids: function(oids, callback, scope) {
        //console.log('readByOids',oids)
        var records= [];
        var readOids= [];
        var i, l= oids.length;
        for(i=0;i<l;i++){
            var oid= oids[i];
            var record= this.cache[oid];
            if(record){
                records.push(record);
            }else{
                readOids.push(oid);
            }
        }
        this.store.readByOids(readOids,function(records2){
            this.addToCache(records2);
            records= records.concat(records2);
            callback.call(scope,records);
        },this);
    },

    /** 
     * Update
     *
     * @param {Array} records
     *
     */
    update: function(records) {
        this.addToCache(records);
        this.addToList(this.toUpdate,records);
    },

    /** 
     * Destroy
     *
     * @param {String} oid
     *
     */
    destroy: function(oid) {
        this.toDestroy.push(oid);
    },

    /** 
     * Update CS
     *
     * @param {Ext.cf.ds.CS} from
     * @param {Ext.cf.ds.CS} to
     * @param {String} oid
     *
     */
    updateCS: function(from,to,oid) {
        if(from && to){
            if(!from.equals(to)){
                this.csvChanged= this.modifiedCSV.addX(to) || this.csvChanged;
                this.csivChanged= true;
                //this.csiv.remove(from,oid);
                this.csiv.add(to,oid);
            }
        }else if(from){
            //this.csivChanged= true;
            //this.csiv.remove(from,oid);
        }else if(to){
            this.csvChanged= this.modifiedCSV.addX(to) || this.csvChanged;
            this.csivChanged= true;
            this.csiv.add(to,oid);
        }
    },
    
    /** 
     * Update CSV
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     */
    updateCSV: function(csv) {
        this.csvChanged= this.modifiedCSV.addX(csv) || this.csvChanged;
    },
    
    /** 
     * Update Replica ids
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     */
    updateReplicaIds: function(csv) {
        this.csvChanged= this.modifiedCSV.addReplicaIds(csv) || this.csvChanged;
    },
    
    /** 
     * Update generator
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     */
    updateGenerator: function(csv) {
        this.generatorChanged= this.originalGenerator.seenCSV(csv);
    },
    
    /** 
     * Commit
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    commit: function(callback, scope) {
        //
        // Work out which records are to be created or updated.
        //
        this.toCreate= Ext.Array.unique(this.toCreate);
        this.toUpdate= Ext.Array.unique(this.toUpdate);
        this.toUpdate= Ext.Array.difference(this.toUpdate,this.toCreate);
        var createRecords= this.getRecordsForList(this.toCreate);
        var updateRecords= this.getRecordsForList(this.toUpdate);
        this.store.create(createRecords,function(){
            this.store.update(updateRecords,function(){
                this.store.destroy(this.toDestroy,function(){
                    this.store.setCSIndex(this.csivChanged ? this.csiv : undefined,function(){
                        this.writeConfig_CSV(function(){
                            this.writeConfig_Generator(function(){
                                callback.call(scope,createRecords,updateRecords);
                            },this);
                        },this);
                    },this);
                },this);
            },this);
        },this);
    },
    
    /** 
     * Write config generator
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     * @private
     *
     */
    writeConfig_Generator: function(callback,scope){
        if(this.generatorChanged){
            this.originalGenerator.set(this.modifiedGenerator);
            this.proxy.writeConfig_Generator(callback,scope);
        }else{
            callback.call(scope);
        }
    },

    /** 
     * Write config csv
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     * @private
     *
     */
    writeConfig_CSV: function(callback,scope){
        if(this.csvChanged){
            this.originalCSV.addCSV(this.modifiedCSV);
            this.generatorChanged= this.originalGenerator.seenCSV(this.originalCSV);
            this.proxy.writeConfig_CSV(callback,scope);
        }else{
            callback.call(scope);
        }
    },

    /** 
     * Add to cache
     *
     * @param {Array} records
     *
     * @private
     *
     */
    addToCache: function(records) {
        if(records){
            if(Ext.isArray(records)){
                var l= records.length;
                for(var i=0;i<l;i++){
                    var record= records[i];
                    this.addToCache(record);
                }
            }else{
                var oid= records.getOid();
                //console.log('addToCache',oid,records)
                if(oid!==undefined){
                    this.cache[oid]= records;
                }else{
                    Ext.cf.util.Logger.error('Transaction.addToCache: Tried to add a record without an oid.',records);
                }
            }
        }
    },
    
    /** 
     * Add to list
     *
     * @param {Array} list
     * @param {Array} records
     *
     * @private
     *
     */
    addToList: function(list,records) {
        if(records){
            if(Ext.isArray(records)){
                var l= records.length;
                for(var i=0;i<l;i++){
                    var record= records[i];
                    var oid= record.getOid();
                    list.push(oid);
                }
            }else{
                list.push(records.getOid());
            }
        }
    },
    
    /** 
     * Get records for list
     *
     * @param {Array} list
     *
     * @private
     *
     */
    getRecordsForList: function(list) {
        var records= [];
        var l= list.length;
        for(var i=0;i<l;i++){
            var id= list[i];
            records.push(this.cache[id]);
        }
        return records;
    }
        
});

  
  

/**
 * Errors generated by the SDK
 *
 */
Ext.define('Ext.io.Errors', {
    statics: {

        /**
        *
        */
        'SERVICE_VERSION_UNKNOWN': {
            code: 'SERVICE_VERSION_UNKNOWN',
            message: "The SDK doesn't know which version of the service is to be used",
            kind: 'sio',
            suggest: 'If the service name is not misspelt, contact support@sencha.io'
        },

        /**
        *
        */
        'NETWORK_ERROR': {
            code: 'NETWORK_ERROR',
            message: 'The request could not be made due to the network being down',
            suggest: 'Check network connectivity from your device'
        },

        /**
        *
        */
        'WEBSOCKET_NOT_READY': {
            code: 'WEBSOCKET_NOT_READY',
            message: 'The request could not be made as the websocket is not ready yet',
            suggest: 'The websocket should connect automatically within some time'
        },

        /**
        *
        */
        'UNKNOWN_ERROR': {
            code: 'UNKNOWN_ERROR',
            message: 'Unknown error',
            kind: 'sio',
            suggest: 'Contact support@sencha.io with a description of what caused the error'
        },


        /**
        *
        */
        'UNKNOWN_RPC_ERROR': {
            code: 'UNKNOWN_RPC_ERROR',
            message: 'Unknown RPC error',
            kind: 'sio',
            suggest: 'Fix the RPC service to return a valid error object'
        },

        /**
        *
        */
        'PARAM_MISSING': {
            code: 'PARAM_MISSING',
            message: "Mandatory parameter ':name' is missing",
            kind: 'developer',
            suggest: 'Provide the required parameter during the method call'
        },

        /**
        *
        */
        'PARAMS_LENGTH_MISMATCH': {
            code: 'PARAMS_LENGTH_MISMATCH',
            message: 'The method was passed :actual params instead of the expected :expected',
            kind: 'developer',
            suggest: 'Check the number of parameters you are passing to the method'
        },

        /**
        *
        */
        'PARAM_TYPE_MISMATCH': {
            code: 'PARAM_TYPE_MISMATCH',
            message: "Parameter ':name' data type mismatch. Expected ':expected', actual ':actual'",
            kind: 'developer',
            suggest: 'Correct the data type of the parameter'
        },

        /**
        *
        */
        'RPC_PARAM_FUNCTION_ERROR': {
            code: 'RPC_PARAM_FUNCTION_ERROR',
            message: "Parameter number :index (:name) is a function, but only the first parameter must be a function",
            kind: 'developer',
            suggest: 'Ensure that only the first parameter is a function'
        },

        /**
        *
        */
        'RPC_TIMEOUT': {
            code: 'RPC_TIMEOUT',
            message: 'RPC request has timed out as there was no reply from the server',
            kind: 'developer',
            suggest: 'Check if this was caused by network connectivity issues. If not, the service might be down.' +
                ' Also, see documentation for Ext.Io.setup (rpcTimeoutDuration, rpcTimeoutCheckInterval) to configure the timeout check'
        },

        /**
        *
        */
        'AUTH_REQUIRED': {
            code: 'AUTH_REQUIRED',
            message: 'This request requires an authenticated :kind session',
            kind: 'developer',
            suggest: 'Retry the request with a valid session'
        },

        /**
        *
        */
        'CHANNEL_NAME_MISSING': {
            code: 'CHANNEL_NAME_MISSING',
            message: 'Channel name is missing',
            kind: 'developer',
            suggest: 'Provide the channel name'
        },

        /**
        *
        */
        'CHANNEL_APP_ID_MISSING': {
            code: 'CHANNEL_APP_ID_MISSING',
            message: 'Channel appId is missing',
            kind: 'sio',
            suggest: 'Potential bug in the SIO SDK, attempting to get a channel without an appId'
        },

        /**
        *
        */
        'SERVICE_NAME_MISSING': {
            code: 'SERVICE_NAME_MISSING',
            message: 'Service name is missing',
            kind: 'developer',
            suggest: 'Provide the service name'
        },

        /**
        *
        */
        'SERVICE_DESCRIPTOR_LOAD_ERROR': {
            code: 'SERVICE_DESCRIPTOR_LOAD_ERROR',
            message: 'Error loading service descriptor from the server',
            kind: 'developer',
            suggest: 'Service name is most likely misspelt. If not, contact support@sencha.io'
        },

        /**
        *
        */
        'MESSAGE_NOT_JSON': {
            code: 'MESSAGE_NOT_JSON',
            message: 'message is not a JSON object',
            kind: 'developer',
            suggest: 'Use a valid JSON object instead of basic data types'
        },

        /**
        *
        */
        'NO_APP_ID': {
            code: 'NO_APP_ID',
            message: 'App ID not found',
            kind: 'developer',
            suggest: 'Use a valid App ID'
        },

        /**
        *
        */
        'FILE_PARAMS_MISSING': {
            code: 'FILE_PARAMS_MISSING',
            message: 'File or data parameters are missing',
            kind: 'developer',
            suggest: 'File or data parameters are missing'
        },

        /**
        *
        */
        'DEVELOPER_NOT_LOGGED_IN': {
            code: 'DEVELOPER_NOT_LOGGED_IN',
            message: 'Developer is not logged in',
            kind: 'developer',
            suggest: 'Retry the request after Developer login'
        },

        /**
        *
        */
        'NO_DEVICE_ID': {
            code: 'NO_DEVICE_ID',
            message: 'Device ID not found',
            kind: 'sio',
            suggest: 'Might be a bug in device allocation'
        },

        /**
        *
        */
        'NO_CURRENT_USER': {
            code: 'NO_CURRENT_USER',
            message: 'User ID not found',
            kind: 'developer',
            suggest: 'Retry with a valid User ID'
        },

        /**
        *
        */
        'USER_NOT_AUTHENTICATED': {
            code: 'USER_NOT_AUTHENTICATED',
            message: 'User not authenticated',
            kind: 'developer',
            suggest: 'Retry the request after User login'
        },

        /**
        *
        */
        'PIC_OP_NOT_SUPPORTED': {
            code: 'PIC_OP_NOT_SUPPORTED',
            message: 'This class of object does not support picture operations',
            kind: 'developer',
            suggest: 'This class of object does not support picture operations'
        },

        /**
        *
        */
        'PUSH_NOTIFICATIONS_NOT_SUPPORTED': {
            code: 'PUSH_NOTIFICATIONS_NOT_SUPPORTED',
            message: 'Push Notifications are not supported in this execution environment',
            kind: 'developer',
            suggest: 'Try building this application as a Packaged ST2 + SIO iOS Application'
        },

        /**
        *
        */
        'UNABLE_READ_FILE': {
            code: 'UNABLE_READ_FILE',
            message: 'Unable to read selected file',
            kind: 'developer',
            suggest: 'File is not provided or your browser does not support this operation'
        }
    }
});

/**
 * @private
 */
Ext.define('Ext.cf.util.ErrorHelper', {
    requires: ['Ext.cf.util.Logger', 'Ext.io.Errors'],

    statics: {
        /**
        * A valid error object MUST have at minimum a 'code' and 'message'
        *
        * @param {Object} error
        *
        */
        isValidError: function(err) {
            if(typeof(err) === "object" &&
                err !== null &&
                typeof(err.code) === "string" &&
                typeof(err.message) === "string") {

                return true;
            }

            return false;
        },

        /**
        * Get error
        *
        * @param {String} code
        * @param {String} details
        * @param {Array} params
        *
        */
        get: function(code, details, params) {
            var err = Ext.clone(Ext.io.Errors[code] ? Ext.io.Errors[code] : Ext.io.Errors['UNKNOWN_ERROR']);

            if(details) {
                err.details = details;
            }

            for(var key in params) {
                if(params.hasOwnProperty(key)) {
                    err.message = err.message.replace(":" + key, params[key]);
                }
            }

            return err;
        },

        /**
        * Get error object for 'UNKNOWN_ERROR'
        *
        * @param {String} details
        *
        */
        getUnknownError: function(details) {
            var unknownError = this.get('UNKNOWN_ERROR');
            unknownError.details = details;
            return unknownError;
        },

        /**
        * Decode error
        *
        * @param {Object} error
        *
        */
        decode: function(err) {
            if(err === null || err === "null" || err === "") {
                return null;
            }

            // if already an error object, return as is
            if(this.isValidError(err)) {
                return err;
            }

            try {
                err = Ext.decode(err);
                if(this.isValidError(err)) {
                    return err;
                } else {
                    Ext.cf.util.Logger.debug('Could not decode error:', err);
                    return this.getUnknownError(err);
                }
            } catch(e) {
                Ext.cf.util.Logger.debug('Could not decode error:', err);
                return this.getUnknownError(err);
            }
        }
    }
});

/**
 * @private
 */
Ext.define('Ext.cf.util.ParamValidator', {
    requires: ['Ext.cf.util.ErrorHelper', 'Ext.cf.util.Logger'],

    statics: {        
        /**
        * Get type of param
        *
        * @param {Undefined/Null/Boolean/Number/String/Function/Array} param
        *
        * @return {String} type of param
        *
        */
        getType: function(arg) {
            var type = typeof(arg);

            if(type !== "object") {
                // undefined, boolean, number, string, function
                return type;
            } else {
                if(arg === null) {
                    return "null";
                }

                if(Object.prototype.toString.call(arg) === "[object Array]") {
                    return "array";
                }

                return "object";
            }
        },

        /**
        * Validate param
        *
        * @param {Undefined/Null/Boolean/Number/String/Function/Array} param
        * @param {Undefined/Null/Boolean/Number/String/Function/Array} actual param that is passed
        * @param {Number} index of param
        * @param {Boolean} isRpc
        * @param {String} parent param name
        *
        */
        validateParam: function(param, actualArg, index, isRpc, parentParamName) {
            var actualType = this.getType(actualArg);

            if(isRpc && (actualType === "function" && index !== 0)) {
                return Ext.cf.util.ErrorHelper.get('RPC_PARAM_FUNCTION_ERROR', null, {
                    name: param.name,
                    index: index + 1
                });
            } else {
                var types = param.type.split("|");
                var matchFound = false;
                for(var i = 0; i < types.length; i++) {
                    if( (types[i] === actualType) || 
                        (param.optional && actualType === "undefined")) {
                        
                        matchFound = true;
                        break;
                    }
                }

                if(!matchFound) {
                    return Ext.cf.util.ErrorHelper.get('PARAM_TYPE_MISMATCH', null, {
                        name: (parentParamName ? (parentParamName + ".") : "") + param.name,
                        expected: param.type,
                        actual: actualType
                    });
                }

                if(actualType === "object" && param.hasOwnProperty('keys')) {
                    // validate the keys now
                    for(var k = 0; k < param.keys.length; k++) {
                        var nestedParam = param.keys[k];
                        var nestedArg = actualArg[nestedParam.name];
                        var nestedArgType = this.getType(nestedArg);

                        if(nestedArgType === "undefined" && !nestedParam.optional) {
                            return Ext.cf.util.ErrorHelper.get('PARAM_MISSING', null, {
                                name: (parentParamName ? (parentParamName + ".") : "") + param.name + "." + nestedParam.name
                            });
                        }

                        var err = this.validateParam(nestedParam, nestedArg, k, false, (parentParamName ? (parentParamName + ".") : "") + param.name);
                        if(err) {
                            return err;
                        }
                    }
                }
            }

            return null;
        },

        /**
        * Get number of mandatory params
        *
        * @param {Array} params
        *
        */
        getMandatoryParamsLength: function(params) {
            var count = 0;

            for(var i = 0; i < params.length; i++) {
                if(!params[i].optional) {
                    count++;
                }
            }

            return count;
        },

        /**
        * Validate params
        *
        * @param {Array} params
        * @param {Array} actual params that are passed
        * @param {Boolean} isRpc
        *
        */
        validateParams: function(params, actualArgs, isRpc) {
            if(params.length !== actualArgs.length) { // length mismatch
                // check mandatory params length
                var mandatoryParamsLength = this.getMandatoryParamsLength(params);
                if(actualArgs.length <= params.length && actualArgs.length >= mandatoryParamsLength) {
                    // ok, some optional params may not have been passed
                } else {
                    // actual args cannot be more than those declared
                    // actual args cannot be less than the mandatory ones
                    return Ext.cf.util.ErrorHelper.get('PARAMS_LENGTH_MISMATCH', null, {
                        expected: params.length,
                        actual: actualArgs.length
                    });
                }
            }

            var i, err;
            for(i = 0; i < params.length; i++) {
                err = this.validateParam(params[i], actualArgs[i], i, isRpc);
                if(err) {
                    return err;
                }
            }


            return null;
        },

        /**
        * Get Api signature
        *
        * @param {String} class name
        * @param {String} method name
        * @param {Array} params
        *
        */
        getApiSignature: function(className, methodName, params) {
            var signature = className + "#" + methodName + "(";

            for(var i = 0; i < params.length; i++) {
                signature += params[i].name;

                if(i !== params.length - 1) {
                    signature += ", ";
                }
            }

            signature += ")";

            return signature;
        },

        /**
        * Validate Api
        *
        * @param {Array} params
        * @param {Array} actual params that are passed
        * @param {String} class name
        * @param {String} method name
        *
        */
        validateApi: function(params, actualArgs, className, methodName) {
            var err = this.validateParams(params, actualArgs, false);
            if(err) {
                var msg = err.code + " " + err.message;
                if(className && methodName) {
                    msg += ". Expected signature " + this.getApiSignature(className, methodName, params);
                    msg += ". Also see http://docs.sencha.io/" + Ext.getVersion('sio').toString() + "/index.html#!/api/" + 
                        className + "-method-" + methodName;
                }

                Ext.cf.util.Logger.error(msg, err);
                throw msg;
            }

            return true;
        },
        
        /**
        * Validate Standard API method signature of (callback, scope)
        *
        * @param {Array} actual params that are passed
        * @param {String} class name
        * @param {String} method name
        *
        */
        validateCallbackScope: function(actualArgs, className, methodName){
          return Ext.cf.util.ParamValidator.validateApi([
                        { name: "callback", type: "function" }, 
                        { name: "scope", type: "null|object|function", optional: true }
                    ], actualArgs,  className, methodName);
        },
        
        
        /**
        * Validate Standard API method signature of (options, callback, scope)
        *
        * @param {Array} option keys
        * @param {Array} actual params that are passed
        * @param {String} class name
        * @param {String} method name
        *
        */
        validateOptionsCallbackScope: function(optionKeys, actualArgs, className, methodName){
          
          var options = { name: "options", type: "object"};
          if(optionKeys) {
            options.keys = optionKeys;
          }
          
          return Ext.cf.util.ParamValidator.validateApi([
                        options, 
                        { name: "callback", type: "function" }, 
                        { name: "scope", type: "null|object|function", optional: true }
                    ], actualArgs, className, methodName);
        }
    }
});

/**
 * @private
 * Instances of {@link Ext.io.Proxy} represent proxy objects to services running in the backend. Any
 * RPC method defined by the service can be invoked on the proxy as if it were a local method.
 *
 * The first parameter to any RPC method is always a callback function, followed by the parameters
 * to the method being called on the server.
 *
 * For example:
 *
 *     Ext.io.getService("calculator", function(calculator) {
 *         calculator.add(
 *             function(result) { // callback
 *                 display("Calculator: " + number1 + " + " + number2 + " = " + result.value);
 *             },
 *             number1, number2 // arguments
 *         );
 *     });
 *
 * The callback function to the RPC method is passed the result of the RPC call.
 */
Ext.define('Ext.io.Proxy', {
    requires: ['Ext.cf.util.ParamValidator', 'Ext.cf.util.ErrorHelper'],

    config: {
        /**
         * @cfg name
         * @accessor
         */
        name: null,

        /**
         * @cfg descriptor
         * @accessor
         * @private
         */
        descriptor: null,

        /**
         * @cfg descriptor
         * @accessor
         * @private
         */
        rpc: null
    },

    /**
     * @private
     *
     * Constructor
     *
     * @param {Object} config The name of the service.
     * @param {String} config.name The name of the service.
     * @param {Object} config.descriptor The service descriptor
     * @param {Object} config.rpc 
     *
     */
    constructor: function(config) {
        if(config.descriptor.kind != 'rpc') {
            Ext.cf.util.Logger.error(config.name + " is not a RPC service");
            throw "Error, proxy does not support non-RPC calls";
        }
        this.initConfig(config);
        this._createMethodProxies();
        return this;
    },

    /**
     * @private
     *
     * Creates proxy functions for all the methods described in the service descriptor.
     */
    _createMethodProxies: function() {
        var descriptor= this.getDescriptor();

        var methodDescriptorIsArray = (Object.prototype.toString.call(descriptor.methods) === "[object Array]");
        var methodName;

        if(methodDescriptorIsArray) {
            for(var i = 0; i < descriptor.methods.length; i++) {
                methodName = descriptor.methods[i];
                this[methodName] = this._createMethodProxy(methodName);
            }
        } else {
            // new style of method descriptor
            for(methodName in descriptor.methods) {
               this[methodName] = this._createMethodProxyNew(methodName, descriptor.methods[methodName]);
            }
        }
    },

    /**
     * @private
     *
     * Create a function that proxies a calls to the method to the server.
     *
     * @param {String} methodName
     * @param {Array} params
     *
     */
    _createMethodProxyNew: function(methodName, params) {
        var self = this;

        var contextParam = params.shift(); // the context param is not passed explicitly from the client side

        return function() {
            // perform checks on params and return an error if there is a problem
            var err = Ext.cf.util.ParamValidator.validateParams(params, arguments, true);
            if(err) {
                self.handleValidationError(err, "Invalid parameters to RPC method", methodName, arguments);
            } else {
                err = self.performAuthChecks(contextParam);
                if(err) {
                    self.handleValidationError(err, "Authentication checks failed", methodName, arguments);
                } else {
                    var descriptor= self.getDescriptor();
                    var serviceArguments = Array.prototype.slice.call(arguments, 0);
                    var style = descriptor.style[0];
                    if(descriptor.style.indexOf("subscriber") > 0) {
                        style = "subscriber"; // prefer subscriber style if available
                    }
                    self.getRpc().call(serviceArguments[0], self.getName(), style, methodName, serviceArguments.slice(1));
                }
            }
        };
    },

    handleValidationError: function(err, msg, methodName, args) {
        Ext.cf.util.Logger.error(msg, this.config.name+'.'+methodName, err);
        if(typeof(args[0]) === "function") {
            args[0].call(null, { status: 'error', error: err });
        } else {
            throw (err.code + " " + err.message);
        }
    },

    performAuthChecks: function(contextParam) {
        var err = null;

        var idstore = Ext.io.Io.getIdStore();
        var context = {
            developerSid: idstore.getSid('developer'),
            userSid: idstore.getSid('user')
        };
        var descriptor = this.getDescriptor();

        
        err = this.validateAuthentication(descriptor.authenticate, context);
        if(!err) {
            err = this.validateAuthentication(contextParam.authenticate, context);
        }

        return err;
    },

    validateAuthentication: function(authType, context) {
        var err = null;

        if(authType) {
            if((authType === "developer" && !context.developerSid) ||
               (authType === "user" && !context.userSid)) {
                err = Ext.cf.util.ErrorHelper.get('AUTH_REQUIRED', null, { kind: authType });
            }
        }

        return err;        
    },

    /**
     * @private
     *
     * Create a function that proxies a calls to the method to the server.
     *
     * @param {String} methodName
     *
     */
    _createMethodProxy: function(methodName) {
        var self = this;

        return function() {
            var descriptor= self.getDescriptor();
            var serviceArguments = Array.prototype.slice.call(arguments, 0);
            var style = descriptor.style[0];
            if(descriptor.style.indexOf("subscriber") > 0) {
                style = "subscriber"; // prefer subscriber style if available
            }
            self.getRpc().call(serviceArguments[0], self.getName(), style, methodName, serviceArguments.slice(1));
        };
    }

});

/**
 * 
 * @private
 *
 * Replication Protocol
 *
 */
Ext.define('Ext.cf.data.Protocol', {
    requires: [
        'Ext.cf.data.Updates', 
        'Ext.cf.data.Transaction',
        'Ext.cf.ds.CSV',
        'Ext.cf.data.Updates',
        'Ext.io.Proxy'
    ],

    config: {
        proxy: undefined,
        owner: 'user',
        access: 'private',
        version: 2,
        userId: undefined,
        groupId: undefined,
        deviceId: undefined
    },
    
    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.logger = Ext.cf.util.Logger;
        this.initConfig(config);
    },

    /** 
     * Sync
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sync: function(callback,scope) {
        var self= this;
        var proxy= this.getProxy();
        self.logger.debug('Protocol.sync: start');
        //
        // We delay mapping the owner to an id until the very last moment.
        // This allows a sync store to be statically declared, without it
        // triggering a call to Ext.io.Io.init 
        //
        var databaseDefinition= proxy.getDatabaseDefinition();
        if(!databaseDefinition.hasOwner()){
            this.mapOwnerToId(this.getOwner(),this.getAccess(),databaseDefinition);
        }
        var replicaDefinition= proxy.getReplicaDefinition();
        if(!replicaDefinition.getDeviceId()){
            replicaDefinition.setDeviceId(this.config.deviceId||Ext.io.Io.getIdStore().getId('device'));
        }
        this.sendGetUpdate({},function(r){
            self.logger.debug('Protocol.sync: end',r);
            callback.call(scope,r);
        });
    },

    /**
     * @private
     *
     * map owner to Id
     *
     * @param {String} owner
     * @param {Object} databaseDefinition
     *
     */
     mapOwnerToId: function(owner,access,databaseDefinition){
        if(!owner || owner==='user'){
            if(!access || access==='private'){
                databaseDefinition.setUserId(this.config.userId || Ext.io.Io.getIdStore().getId('user'));
            } else if (access==='public') {
                databaseDefinition.setGroupId(this.config.groupId || Ext.io.Io.getIdStore().getId('group'));
            } else {
                this.logger.error('Ext.cf.data.Protocol: Unknown owner:',owner);
            }
        } else {
            this.logger.error('Ext.cf.data.Protocol: Unknown access:',access);
        }
    },

    /** 
     * @private
     * 
     * @param {Object} r
     * @param {Function} callback
     *
     */
    sendGetUpdate: function(r,callback) {
        this.logger.debug('Protocol.sendGetUpdate');
        var self= this;
        Ext.io.Io.getService(
            {name: "SyncRpcService"},
            function(service,err) {
                if(service){
                    var proxy= this.getProxy();
                    var message= {
                        dd: proxy.getDatabaseDefinition().getCurrentConfig(),
                        rd: proxy.getReplicaDefinition().getCurrentConfig(),
                        csv: proxy.csv.encode()
                    };
                    service.getUpdates(
                        function(response){
                            if(!response.r) {
                                response= response.value; // JCM the sync server integration tests need this.... some bug in the mock transport that i don't understand
                            }
                            self.receiveResponse(response,r,function(r){
                                if(response.r==='ok'){
                                    var updates_csv= Ext.create('Ext.cf.ds.CSV').decode(response.updates_csv);
                                    var required_csv= Ext.create('Ext.cf.ds.CSV').decode(response.required_csv);
                                    self.updateLocalState(self.getProxy(),updates_csv,function(){
                                        var updates= Ext.create('Ext.cf.data.Updates').decode(response.updates);
                                        r.received= updates.length();
                                        self.getProxy().putUpdates(updates,updates_csv,function(response){
                                            self.sendPutUpdate(required_csv,response,callback);
                                        },this);
                                    },this);
                                }else{
                                    callback(r);
                                }
                            });
                        },
                        message
                    );
                }else{
                    callback(err);
                }
            },
            this
        );
    },

    /** 
     * @private
     *
     * Receive response
     * 
     * @param {Object} response 
     * @param {Object} r
     * @param {Function} callback
     *
     */
    receiveResponse: function(response,r,callback){
        this.logger.debug('Protocol.receiveResponse',response);
        var proxy= this.getProxy();
        switch(response.r||response.value.r){ // JCM the sync server integration tests need this.... some bug in the mock transport that i don't understand
        case 'ok':
            callback(response);
            break;
        case 'set_replica_id':
        case 'new_replica_id':
            //
            // A replica id collision, or re-initialization, has occured. 
            // In either case we must change our local replica id.
            //
            if(r.new_replica_id==response.replicaId){
                this.logger.error("Protocol.receiveResponse: The server returned the same replica id '",response,"'");
                callback.call({r:'error_same_replica_id'});
            }else{
                r.new_replica_id= response.replicaId;
                this.logger.info('Protocol.receiveResponse: Change local replica id to',response.replicaId);
                proxy.setReplicaId(response.replicaId,function(){
                    this.sendGetUpdate(r,callback);
                },this);
            }
            break;
        case 'new_generation_version':
            //
            // The database generation has changed. We clear out the database,
            // and update the definition. 
            //
            var currentGeneration = proxy.getDatabaseDefinition().getGeneration();
            if (new Ext.Version(currentGeneration).isLessThan(response.generation)) {
                r.new_generation_version= response.generation;
                proxy.getDatabaseDefinition().setGeneration(response.generation);
                proxy.reset(function(){
                    this.sendGetUpdate(r,callback);
                },this);
            } else {
                // local is the same, or greater than the server.
                this.logger.error("Protocol.receiveResponse: The server returned the same generation version '",response,"'");
            }
            break;
        case 'error':
            this.logger.error("Protocol.receiveResponse: The server returned the error '",response.error,"'");
            callback(response);
            break;
        default:
            this.logger.error('Protocol.receiveResponse: Received unknown message:',response);
            callback(response);
        }
    },

    /** 
     * @private
     * 
     * @param {Ext.cf.ds.CSV} required_csv 
     * @param {Object} r
     * @param {Function} callback
     *
     */
    sendPutUpdate: function(required_csv,r,callback) {
        this.logger.debug('Protocol.sendPutUpdate',required_csv);
        var proxy= this.getProxy();
        r.sent= 0;
        r.r= 'ok';
        if(!required_csv.isEmpty()){
            //
            // The required CSV contains only the difference between the local
            // CSV and the remote CSV. We combine the local and required CSV to
            // get the remote CSV.
            //
            var remote_csv= Ext.create('Ext.cf.ds.CSV',proxy.csv);
            remote_csv.setCSV(required_csv);
            proxy.getUpdates(remote_csv,function(updates,local_csv){
                if((updates && !updates.isEmpty()) || (local_csv && !local_csv.isEmpty())){
                    Ext.io.Io.getService(
                        {name:"SyncRpcService"},
                        function(service,err) {
                            if(service){
                                r.sent= updates.length();
                                var message= {
                                    dd: proxy.getDatabaseDefinition().getCurrentConfig(),
                                    rd: proxy.getReplicaDefinition().getCurrentConfig(),
                                    csv: proxy.csv.encode(),
                                    updates: JSON.stringify(updates.encode())
                                };
                                service.putUpdates(
                                    function(r2){
                                        Ext.apply(r,r2);
                                        callback(r);
                                    },
                                    message
                                );
                            }else{
                                callback(err);
                            }
                        },
                        this
                    );
                }else{
                    this.logger.debug('Protocol.sendPutUpdate: no work');
                    callback(r);
                }
            },this);
        }else{
            this.logger.debug('Protocol.sendPutUpdate: no work');
            callback(r);
        }
    },

    /** 
     * @private
     * 
     * @param {Object} proxy  
     * @param {Ext.cf.ds.CSV} csv 
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    updateLocalState: function(proxy,csv,callback,scope) {
        Ext.create('Ext.cf.data.Transaction',proxy,function(t){
            //
            // The remote CSV describes the state of updated-ness of the
            // server this client is talking to. We add any replica ids
            // that are new to us to our local CSV.
            //
            t.updateReplicaIds(csv);
            //
            // And we update the CS generator with the maximum CS in the
            // CSV, so that the local time is bumped forward if one of 
            // the other replicas is ahead of us.
            //
            // We do this ahead of receiving updates to ensure that any
            // updates we generate will be ahead of the updates that
            // were just received. 
            //
            t.updateGenerator(csv);
            t.commit(callback,scope);
        },this);
    }

});


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

/**
 * 
 * @private
 *
 * Sync Model
 *
 */
Ext.define('Ext.cf.data.SyncModel', {   
  statics:{
    /**
     * @param {Array} records
     * @return {Boolean}
     */
    areDecorated: function(records) {
        return Ext.Array.every(records,function(record){
            return (record.eco!==undefined && record.eco!==null);
        });
    },

    /**
     * Test if a record has been deleted (check for is deleted)
     *
     * @param {Object} record
     * @return {Boolean}
     */
    isDestroyed: function(r) { // test if a record has been deleted
        var t= (r||this).data._ts;
        return (t!==null && t!==undefined && t!=='');
    },

    /**
     * Test if a record has been deleted (check for is not deleted)
     *
     * @param {Object} record
     * @return {Boolean}
     *
     */
    isNotDestroyed: function(r) { // test if a record has been deleted
        var t= (r||this).data._ts;
        return (t===null || t===undefined || t==='');
    }
  }
});


/**
 * 
 * @private
 *
 * Eventually Consistent Object
 *
 * It's an object of name-value-changestamp tuples,
 * A value can be of a simple or complex type.
 * Complex types are either an Object or an Array
 */
Ext.define('Ext.cf.ds.ECO', {
    requires: [
        'Ext.cf.ds.CSV',
        'Ext.cf.ds.CS'
    ],

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        config= config||{};
        this.oid= config.oid;
        this.data= config.data||{};
        this.state= config.state||{};
    },

    /** 
     * Set oid
     *
     * @param {String} oid
     *
     */
    setOid: function(oid) {
        this.oid= oid;  
    },

    /** 
     * Get oid
     *
     * @return {String} oid
     *
     */
    getOid: function() {
        return this.oid;
    },

    /** 
     * Get state
     *
     * @return {Object} state
     *
     */
    getState: function() {
        return this.state;
    },

    /**
     * Get the value for the path
     *
     * @param {Object} path
     *
     */
    get: function(path) {
        return this.getValue(path);
    },

    /**
     * Set the value for a path, with a new change stamp.
     *
     * @param {String/Array} path
     * @param {Object} value
     * @param {Ext.cf.data.Transaction} t
     *
     * @return {Boolean} True/False
     *
     */
    set: function(path,value,t) {
        var updates= this.valueToUpdates(path,value);
        var l= updates.length;
        for(var i=0;i<l;i++) {
            var update= updates[i];
            this.setValueCS(t,update.n,update.v,t.generateChangeStamp());
        }
    },

    /**
     * Apply an update to this Object.
     *
     * @param {Ext.cf.data.Transaction} t
     * @param {Object} update
     *
     * @return {Boolean} True/False
     *
     */
    applyUpdate: function(t,update) {
        return this.setValueCS(t,update.p,update.v,update.c);
    },

    /**
     * Get all the updates that have occured since CSV.
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     * @return {Array} updates
     *
     */
    getUpdates: function(csv) {
        var updates= []; // JCM should be Ext.x.Updates?
        this.forEachValueCS(function(path,values,cs){
            if (cs) {
                var cs2= csv.get(cs);
                if (!cs2 || cs2.lessThan(cs)) {
                    updates.push({
                        i: this.getOid(),
                        p: path.length==1 ? path[0] : path, 
                        v: values.length==1 ? values[0] : values, 
                        c: cs
                    });
                }
            }
        },this);
        return updates;
    },

    /**
     * Get a CSV for this Object.
     *
     * @return {Ext.cf.ds.CSV} csv
     *
     */
    getCSV: function() {
        var csv= Ext.create('Ext.cf.ds.CSV');
        this.forEachCS(function(cs) {
            csv.addCS(cs);
        },this);
        return csv;
    },

    /**
     * Get a list of all the Change Stamps in this Object.
     *
     * @return {Array}
     *
     */
    getAllCS: function() {
        var r= [];
        this.forEachCS(function(cs) {
            r.push(new Ext.cf.ds.CS(cs));
        },this);
        return r;
    },

    /**
     * Change a replica id.
     *
     * @param {String} idProperty
     * @param {String} old_replica_id
     * @param {String} new_replica_id
     *
     */
    changeReplicaId: function(idProperty,old_replica_id,new_replica_id) {
        var changed= false;
        this.forEachCS(function(cs) {
            var t= cs.changeReplicaId(old_replica_id,new_replica_id);
            changed= changed || t;
            return cs;
        },this);
        if (this.oid) {
            var id_cs= Ext.create('Ext.cf.ds.CS',this.oid);
            if (id_cs.changeReplicaId(old_replica_id,new_replica_id)) {
                var oid= id_cs.asString();
                this.data[idProperty]= oid; // warning: don't call record.set, it'll cause an update after the add
                this.oid= id_cs.asString();
                changed= true;
            }
        }
        return changed;
    },

    /**
     * For each Value and Change Stamp of this Object.
     *
     * @param {Function} callback
     * @param {Object} scope
     * @param {Object} data
     * @param {Object} state
     * @param {String/Array} path
     * @param {Array} values
     *
     */
    forEachValueCS: function(callback,scope,data,state,path,values) {
        data= data||this.data;
        state= state||this.state;
        path= path||[];
        values= values||[];
        for(var name in state) {
            if (state.hasOwnProperty(name)) {
                var new_state= state[name];
                var new_data= data[name];
                var new_path= path.concat(name);
                var new_data_type= this.valueType(new_data);
                var new_value;
                switch (new_data_type) {
                    case 'object':
                        switch(new_data){
                            case undefined:
                                new_value= undefined;
                                break;
                            case null:
                                new_value= null;
                                break;
                            default:
                                new_value= {};
                                break;
                            }
                        break;
                    case 'array':
                        new_value= [[]];
                        break;
                    default:
                        new_value= new_data;
                }
                var new_values= values.concat(new_value);
                switch (this.valueType(new_state)) {
                    case 'string':
                        callback.call(scope,new_path,new_values,new Ext.cf.ds.CS(new_state));
                        break;
                    case 'array':
                        switch (new_data_type) {
                            case 'undefined':
                                Ext.cf.util.Logger.warn('ECO.forEachValueCS: There was no data for the state at path',new_path);
                                Ext.cf.util.Logger.warn('ECO.forEachValueCS: ',this.data);
                                break;
                            case 'object':
                            case 'array':
                                callback.call(scope,new_path,new_values,new Ext.cf.ds.CS(new_state[0])); // [cs,state]
                                this.forEachValueCS(callback,scope,new_data,new_state[1],new_path,new_values); // [cs,state]
                                break;
                            default:
                                callback.call(scope,new_path,new_values,new Ext.cf.ds.CS(new_state[0])); // [cs,state]
                                break;
                        }
                    break;
                }
            }
        }
    },  
    
    /**
     * @private
     *
     * For each Value of this Object.
     *
     * @param {Function} callback
     * @param {Object} scope
     * @param {Object} data
     * @param {String/Array} path
     *
     */
    forEachValue: function(callback,scope,data,path) {
        data= data || this.data;
        path= path || [];
        var n, v;
        for(n in data) {
            if (data.hasOwnProperty(n)) {
                v= data[n];
                if (v!==this.state) {
                    var path2= path.concat(n);
                    callback.call(scope,path2,v);
                    if (this.isComplexValueType(v)) {
                        this.forEachValue(callback,scope,v,path2);
                    }
                }
            }
        }
    },


    /**
     * @private
     *
     * For each Change Stamp of this Object
     *
     * @param {Function} callback
     * @param {Object} scope
     * @param {Object} state
     *
     */
    forEachCS: function(callback,scope,state) {
        state= state || this.state;
        for(var name in state) {
            if (state.hasOwnProperty(name)) {
                var next_state= state[name];
                var cs;
                switch (this.valueType(next_state)) {
                    case 'string':
                        cs= callback.call(scope,Ext.create('Ext.cf.ds.CS',next_state));
                        if (cs) { state[name]= cs.asString(); }
                        break;
                    case 'array':
                        cs= callback.call(scope,Ext.create('Ext.cf.ds.CS',next_state[0]));
                        if (cs) { state[name][0]= cs.asString(); } // [cs,state]
                        this.forEachCS(callback,scope,next_state[1]); // [cs,state]
                        break;
                }
            }
        }
    },


    /**
     * @private
     * 
     * Return Value and Change Stamp for the path, {v:value, c:cs}
     *
     * @param {String/Array} path
     *
     */
    getValueCS: function(path) {
        var data= this.data;
        var state= this.state;
        if (Ext.isArray(path)) {
            var l= path.length;
            var e= l-1;
            for(var i=0;i<l;i++) {
                var name= path[i];
                if (i===e) {
                    return {
                        v: data ? data[name] : data,
                        c: this.extractCS(state,name)
                    };
                } else {
                    state= this.extractState(state,name);
                    data= data ? data[name] : data;
                }
            }
        } else {
            return {
                v: data[path],
                c: this.extractCS(state,path)
            };
        }
    },

    /**
     * @private
     *
     * Get value
     *
     * @param {String/Array} path
     *
     */
    getValue: function(path) {
        var data= this.data;
        if (Ext.isArray(path)) {
            var l= path.length;
            var e= l-1;
            for(var i=0;i<l;i++) {
                var name= path[i];
                if (i===e) {
                    return data[name];
                } else {
                    data= data[name];
                }
            }
        } else {
            return this.data[path];
        }
    },

    /**
     * @private
     *
     * Set value of CS
     *
     * @param {Ext.cf.data.Transaction} t
     * @param {String/Array} path
     * @param {Array} values
     * @param {Ext.cf.ds.CS} new_cs
     *
     * @return {Boolean} True/False
     *
     */
    setValueCS: function(t,path,values,new_cs) {
        var self= this;
    
        var assignValueCS= function(t,data,state,name,value,to_cs) {
            var changed= false;
            if (value!==undefined) {
                data[name]= value;
                changed= true;
            }
            if (to_cs!==undefined) {
                var from_cs= self.extractCS(state,name);
                self.assignCS(state,name,to_cs);
                t.updateCS(from_cs,to_cs,self.getOid());
                changed= true;
            }
            return changed;
        };

        var changed= false;
        if (!Ext.isArray(path)) {
            path= [path];
            values= [values];
        }
        var data= this.data;
        var state= this.state;
        var l= path.length;
        var e= l-1;
        for(var i=0;i<l;i++) {
            var name= path[i];
            var new_value= values[i]; 
            var old_cs= this.extractCS(state,name);
            var old_value= data[name];
            var old_value_type= this.valueType(old_value);
            var new_value_type= this.valueType(new_value);
            var sameComplexType= 
                ((old_value_type==='object' && new_value_type==='object') ||
                (old_value_type==='array' && new_value_type==='array'));
            if (old_cs) {
                if (new_cs.greaterThan(old_cs)) {
                    if (sameComplexType) {
                        new_value= undefined; // re-assert, don't overwrite
                    }
                    // new_cs is gt old_cs, so accept update
                    if (assignValueCS(t,data,state,name,new_value,new_cs)) {
                        changed= true;
                    }
                } else {
                    // new_cs is not gt old_cs
                    if (sameComplexType) {
                        // but this value type along the path is the same, so keep going... 
                    } else {
                        // and this type along the path is not the same, so reject the update.
                        return changed;
                    }
                }
            } else {
                // no old_cs, so accept update
                if (assignValueCS(t,data,state,name,new_value,new_cs)) {
                    changed= true;
                }
                //console.log('X',new_cs,'no old',data,state)
            }
            if (i!==e) {
                data= data[name];
                state= this.extractState(state,name,new_cs);
            }
        }
        return changed;
    },

    /**
     * @private
     *
     * Get the Change Stamp for the path
     *
     * @param {String/Array} path
     *
     */
    getCS: function(path) {
        var state= this.state;
        if (Ext.isArray(path)) {
            var l= path.length;
            var e= l-1;
            for(var i=0;i<l;i++) {
                var name= path[i];
                if (i===e) {
                    return this.extractCS(state,name);
                } else {
                    state= this.extractState(state,name);
                }
            }
        } else {
            return this.extractCS(state,path);
        }
    },
    
    /**
     * @private
     *
     * Set the Change Stamp for the Path.
     *
     * @param {Ext.cf.data.Transaction} t
     * @param {String/Array} path
     * @param {Ext.cf.ds.CS} cs
     *
     */
    setCS: function(t,path,cs) {
        var self= this;

        var setNameCS= function(t,state,name,to_cs) {
            var from_cs= self.extractCS(state,name);
            self.assignCS(state,name,to_cs);
            t.updateCS(from_cs,to_cs,self.getOid());
        };

        var state= this.state;
        if (Ext.isArray(path)) {
            var l= path.length;
            var e= l-1;
            for(var i=0;i<l;i++) {
                var name= path[i];
                if (i===e) {
                    setNameCS(t,state,name,cs);
                } else {
                    state= this.extractState(state,name);
                }
            }
        } else {
            setNameCS(t,state,path,cs);
        }
    },

    /**
     * @private
     *
     * Extract the next state for this name from the state
     *
     * @param {Object} state
     * @param {String} name
     * @param {Ext.cf.ds.CS} cs
     *
     * @return {Object} state
     *
     */
    extractState: function(state,name,cs) {
        var next_state= state[name];
        var new_state;
        switch (this.valueType(next_state)) {
            case 'undefined':
                new_state= {};
                state[name]= [cs,new_state];
                state= new_state;
                break;
            case 'string':
                new_state= {};
                state[name]= [next_state,new_state];
                state= new_state;
                break;
            case 'array':
                state= next_state[1];
                break;
        }
        return state;
    },

    /**
     * @private
     * 
     * Extract the Change Stamp from the state for this name
     *
     * @param {Object} state
     * @param {String} name
     *
     * @return {Object}
     *
     */
    extractCS: function(state,name) {
        var cs;
        state= state[name];
        if (state) {
            switch (this.valueType(state)) {
                case 'string':
                    cs= new Ext.cf.ds.CS(state);
                    break;
                case 'array':
                    cs= new Ext.cf.ds.CS(state[0]); // [cs,state]
                    break;
            }
        } // else undefined
        return cs;
    },

    /**
     * @private
     *
     * Assign the Change Stamp for this name
     *
     * @param {Object} state
     * @param {String} name
     * @param {Ext.cf.ds.CS} cs
     *
     */
    assignCS: function(state,name,cs) {
        var cs_s= (cs instanceof Ext.cf.ds.CS) ? cs.asString() : cs;
        var state2= state[name];
        if (state2) {
            switch (this.valueType(state2)) {
                case 'string':
                    state[name]= cs_s;
                    break;
                case 'array':
                    state2[0]= cs_s; // [cs,state]
                    break;
            }
        } else {
            state[name]= cs_s;
        }
    },

    /**
     * @private
     *
     * Returns undefined, number, boolean, string, object, array.
     *
     * @param {Array/Object} value
     *
     * @return {String} typeof value
     *
     */
    valueType: function(value) { // 
        var t= typeof value;
        if (t==='object' && (value instanceof Array)) {
            t= 'array';
        }
        return t;
    },
    
    /**
     * @private
     *
     * Returns true for an object or an array.
     *
     * @param {Array/Object} value
     *
     * @return {Boolean} True/False
     *
     */
    isComplexValueType: function(value) {
        return (value!==null && typeof value==='object');
    },

    /** 
     * @private
     *
     * Create a list of updates from a value, either simple or complex.
     *
     * @param {String} name
     * @param {Array/Object} value
     *
     * @return {Object}
     *
     */
    valueToUpdates: function(name,value) {
        if(this.isComplexValueType(value)) {
            var parent_value;
            switch(this.valueType(value)) {
                case 'object':
                    parent_value= {};
                    break;
                case 'array':
                    parent_value= [];
                    break;
            }
            var parent_update= {n: [name], v: [parent_value]};
            var updates= [parent_update];
            for(var key in value) {
                if (value.hasOwnProperty(key)) {
                    var children= this.valueToUpdates(key,value[key]);
                    var l= children.length;
                    for(var i=0;i<l;i++){
                        var update= children[i];
                        updates= updates.concat({n:parent_update.n.concat(update.n),v:parent_update.v.concat(update.v)});
                    }
                }
            }
            return updates;
        } else {
            return [{n: name, v: value}];
        }
    }
        
});


/**
 * 
 * @private
 *
 */
Ext.define('Ext.cf.data.Update', {

    statics: {

        /**
         * As string
         *
         * @param {Object} u
         *
         */
        asString: function(u) {
            if(Ext.isArray(u)){
                return '['+Ext.Array.map(u,Ext.cf.data.Update.asString).join(', ')+']';
            }else if(u instanceof Ext.cf.data.Updates){
                return Ext.cf.data.Update.asString(u.updates);
            }else{
                var p= Ext.isArray(u.p) ? u.p.join() : u.p;
                var v= u.v;
                if (typeof u.v==='object'){
                        v= JSON.stringify(u.v);
                }
                return '('+u.i+' . '+p+' = \''+v+'\' @ '+u.c.asString()+')';
            }
        }

    }
    
});

/** 
 * @private
 *
 */ 
Ext.define('Ext.cf.data.SyncProxy', {
    extend: 'Ext.data.proxy.Proxy',
    requires: [
        'Ext.data.proxy.Proxy',
        'Ext.cf.data.Transaction',
        'Ext.cf.data.Updates',
        'Ext.cf.data.DatabaseDefinition',
        'Ext.cf.data.ReplicaDefinition',
        'Ext.cf.ds.CS',
        'Ext.cf.ds.CSV',
        'Ext.cf.ds.ECO',
        'Ext.cf.Utilities',
        'Ext.cf.data.SyncModel',
        'Ext.cf.data.Update',
        'Ext.cf.data.ModelWrapper',
        'Ext.cf.util.Logger'
    ],

    config: {
        store: undefined,
        databaseDefinition: undefined,
        replicaDefinition: undefined
    },

    databaseName: undefined,
    csv: undefined,
    generator: undefined,
    userModel: undefined,
    idProperty: undefined,
    
    /** 
     * ASync Initialize
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    asyncInitialize: function(config,callback,scope) {
        //
        var validated = Ext.cf.util.ParamValidator.validateApi([
            { name: "config", type: "object",
                keys: [
                    { name: "store", type: 'object' },
                    { name: "databaseDefinition", type: 'object' },
                    { name: "replicaDefinition", type: 'object' }
                ]
            }, 
            { name: "callback", type: "null|function", optional: true }, 
            { name: "scope", type: "null|object|function", optional: true }
        ], arguments, 'SyncProxy', 'asyncInitialize');
        //
        this.databaseName= config.databaseDefinition.databaseName;
        this.setStore(config.store);
        this.initConfig(config);
        this.setDatabaseDefinition(Ext.create('Ext.cf.data.DatabaseDefinition',config.databaseDefinition));
        this.setReplicaDefinition(Ext.create('Ext.cf.data.ReplicaDefinition',config.replicaDefinition));
        this.loadConfig(config,function(){
            Ext.cf.util.Logger.info("SyncProxy.asyncInitialize: Opened database '"+this.databaseName+"'");
            callback.call(scope,{r:'ok'});
        },this);
    },

    /** 
     * Create
     *
     * @param {Object} operation
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    create: function(operation, callback, scope) {
        Ext.create('Ext.cf.data.Transaction',this,function(t){
            var records= operation.getRecords();
            records.forEach(function(record) {
                var cs= t.generateChangeStamp();
                var oid= cs.asString();
                var eco= record.eco= Ext.create('Ext.cf.ds.ECO',{
                    oid: oid,
                    data: Ext.getVersion("extjs") ? record.data : record.getData(),
                    state: {}
                });
                eco.setValueCS(t,'_oid',oid,cs);
                eco.forEachValue(function(path,value) {
                    if (path[0]!=='_oid') {
                        eco.setCS(t,path,t.generateChangeStamp());
                    }
                },eco);
                // the user id is the oid.
                record.data[this.idProperty]= record.getOid(); // warning: don't call record.set, it'll cause an update after the add
            },this);
            t.create(records);
            t.commit(function(){
                records.forEach(function(record) {
                    record.commit();
                },this);
                operation.setSuccessful();
                operation.setCompleted();
                this.doCallback(callback,scope,operation);
            },this);
        },this);
    },

    /** 
     * Read
     *
     * @param {Object} operation
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    read: function(operation, callback, scope) {
    
        function makeResultSet(records) {
            records= Ext.Array.filter(records,function(record){
                return record!==undefined && Ext.cf.data.SyncModel.isNotDestroyed(record);
            },this);
            operation.setResultSet(Ext.create('Ext.data.ResultSet', {
                records: records,
                total  : records.length,
                loaded : true
            }));
            operation.setSuccessful();
            operation.setCompleted();
            this.doCallback(callback,scope,operation);
        }
        
        if (operation.id!==undefined) {
            this.getStore().readByOid(operation.id,function(record) {
                makeResultSet.call(this,[record]);
            },this);
        } else if (operation._oid!==undefined) {
            this.getStore().readByOid(operation._oid,function(record) {
                makeResultSet.call(this,[record]);
            },this);
        } else {
            this.getStore().readAll(function(records) {
                makeResultSet.call(this,records);
            },this);
        }
    },

    /** 
     * Update
     *
     * @param {Object} operation
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    update: function(operation, callback, scope) {
        if(Ext.cf.data.SyncModel.areDecorated(operation.getRecords())){
            Ext.create('Ext.cf.data.Transaction',this,function(t){
                var records= operation.getRecords();
                records.forEach(function(record) {
                    record.setUpdateState(t);
                },this);
                t.update(records);
                t.commit(function(){
                    records.forEach(function(record) {
                        record.commit();
                    },this);
                    operation.setSuccessful();
                    operation.setCompleted();
                    this.doCallback(callback,scope,operation);
                },this);
            },this);
        }else{
            Ext.cf.util.Logger.warn('SyncProxy.update: Tried to update a model that had not been read from the store.');
            this.doCallback(callback,scope,operation);
        }
    },

    /** 
     * Destroy
     *
     * @param {Object} operation
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    destroy: function(operation, callback, scope) {
        //Ext.cf.util.Logger.info('SyncProxy.destroy:',operation)
        if(Ext.cf.data.SyncModel.areDecorated(operation.getRecords())){
            Ext.create('Ext.cf.data.Transaction',this,function(t){
                var records= operation.getRecords();
                records.forEach(function(record) {
                    record.setDestroyState(t);
                },this);
                t.update(records);
                t.commit(function(){
                    records.forEach(function(record) {
                        record.commit();
                    },this);
                    operation.setSuccessful();
                    operation.setCompleted();
                    operation.action= 'destroy';
                    this.doCallback(callback,scope,operation);
                },this);
            },this);
        }else{
            Ext.cf.util.Logger.warn('SyncProxy.destroy: Tried to destroy a model that had not been read from the store.');
            this.doCallback(callback,scope,operation);
        }
    },

    /** 
     * Clear
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    clear: function(callback,scope) {
        var store= this.getStore();
        store.clear(function(){
            store.removeConfig('databaseDefinition',function(){
                store.removeConfig('replicaDefinition',function(){
                    store.removeConfig('csv',function(){
                        store.removeConfig('generator',callback,scope);
                    },this);
                },this);
            },this);
        },this);
    },

    /** 
     * Reset
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    reset: function(callback,scope) {
        var store= this.getStore();
        store.clear(function(){
            store.removeConfig('csv',function(){
                this.readConfig_CSV({},callback,scope);
            },this);
        },this);
    },

    /** 
     * Set Model
     *
     * @param {Object} userModel
     * @param {Object} setOnStore
     *
     */
    setModel: function(userModel, setOnStore) {
        this.userModel= userModel;
        var extjsVersion = Ext.getVersion("extjs");
        if(extjsVersion) {
            this.idProperty= userModel.prototype.idProperty;
        }else{
            this.idProperty= userModel.getIdProperty();
        }
        // JCM write the definition?
        this.getStore().setModel(this.userModel);
    },

    /** 
     * Replica Id
     *
     */
    replicaId: function() {
        return this.generator.r;
    },

    /** 
     * Add Replica ids
     *
     * @param {Object} csv
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    addReplicaIds: function(csv,callback,scope) {
        this.csv.addReplicaIds(csv);
        this.writeConfig_CSV(callback,scope);
    },

    /** 
     * Set Replica id
     *
     * @param {String} new_replica_id
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    setReplicaId: function(new_replica_id,callback,scope) {
        var old_replica_id= this.replicaId();
        Ext.cf.util.Logger.info('SyncProxy.setReplicaId: change from',old_replica_id,'to',new_replica_id);
        this.getStore().changeReplicaId(old_replica_id,new_replica_id,function(){
            this.getReplicaDefinition().changeReplicaId(new_replica_id);
            this.csv.changeReplicaId(old_replica_id,new_replica_id);
            this.generator.setReplicaId(new_replica_id);
            this.writeConfig_Replica(function(){
                this.writeConfig_Generator(function(){
                    this.writeConfig_CSV(callback,scope);
                },this);
            },this);
        },this);
    },

    /** 
     * Get updates
     *
     * @param {Object} csv
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    getUpdates: function(csv,callback,scope) {
        //
        // The server might know about more replicas than the client,
        // so we add those unknown replicas to the client's csv, so 
        // that we will take account of them in the following.
        //
        csv.addReplicaIds(this.csv);
        //
        // Check if we have any updates for the server.
        // We will do if our CVS dominate their CVS.
        //
        var r= this.csv.dominant(csv);
        if(r.dominant.length===0){
            //
            // We have no updates for the server.
            //
            var updates_csv= Ext.create('Ext.cf.ds.CSV');
            //
            // Check if the server has any updates for us. 
            //
            var required_csv= Ext.create('Ext.cf.ds.CSV');
            var i, l= r.dominated.length;
            for(i=0;i<l;i++){
                required_csv.addCS(this.csv.get(r.dominated[i]));
            }
            callback.call(scope,Ext.create('Ext.cf.data.Updates'),updates_csv,required_csv);
        }else{
            if(!csv.isEmpty()){
                Ext.cf.util.Logger.info('SyncProxy.getUpdates: Get updates from',csv.asString());
                Ext.cf.util.Logger.info('SyncProxy.getUpdates: Dominated Replicas:',Ext.Array.pluck(r.dominated,'r').join(', '));
            }
            //
            // Get a list of updates that have been seen since the point
            // described by the csv.
            //
            var updates= [];
            this.getStore().readByCSV(csv, function(records){
                var i, l= records.length;
                for(i=0;i<l;i++){
                    updates= updates.concat(records[i].getUpdates(csv));
                }
                //
                // This sequence of updates will bring the client up to the point
                // described by the csv received plus the csv here. Note that there
                // could be no updates, but that the csv could have still been brought
                // forward, so we might need to send the resultant csv, even though
                // updates is empty. 
                //
                var updates_csv= Ext.create('Ext.cf.ds.CSV');
                updates_csv.addX(r.dominant); // we only need to send the difference in the csv's
                //
                // We also compute the csv that will bring the server up to the
                // point described by the csv received. The client uses this to
                // determine the updates to send to the server.
                //
                var required_csv= Ext.create('Ext.cf.ds.CSV');
                required_csv.addX(r.dominated); // we only need to send the difference in the csv's
                //
                callback.call(scope,Ext.create('Ext.cf.data.Updates',updates),updates_csv,required_csv);
            }, this);
        }        
    },

    /** 
     * Put updates
     *
     * @param {Array} updates
     * @param {Object} updates_csv
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    putUpdates: function(updates,updates_csv,callback,scope) {
        Ext.create('Ext.cf.data.Transaction',this,function(t){
            if(updates.isEmpty()){
                //
                // Even though updates is empty, the received csv could still be more
                // recent than the local csv, so the local csv still needs to be updated.
                //
                t.updateCSV(updates_csv);
                t.commit(function(){
                    callback.call(scope,{r:'ok'});
                },this);
            }else{
                var computed_csv= Ext.create('Ext.cf.ds.CSV');
                var oids= updates.oids();
                t.readByOids(oids,function(){ // prefetch
                    updates.forEach(function(update) {
                        this.applyUpdate(t,update,function(){},this); // read from memory
                        computed_csv.addCS(update.c);
                    },this);
                    this.putUpdates_done(t,updates,updates_csv,computed_csv,callback,scope);
                },this);
            }
        },this);
    },
    
    /** 
     * Put updates done
     *
     * @param {Object} t
     * @param {Array} updates
     * @param {Object} updates_csv
     * @param {Object} computed_csv
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    putUpdates_done: function(t,updates,updates_csv,computed_csv,callback,scope) {
        //
        // This sequence of updates will bring the client up to the point
        // described by the csv received plus the csv here. Note that there
        // could be no updates, but that the csv could have still been brought
        // forward. 
        //
        // We also compute a new csv from all the updates received, just in
        // case the peer didn't send one, or sent a bad one.
        //
        // Make sure to bump forward our clock, just in case one of our peers 
        // has run ahead.
        //
        t.updateCSV(computed_csv);
        t.updateCSV(updates_csv);
        t.commit(function(createdRecords,updatedRecords){
            // discard the created, then deleted
            createdRecords= Ext.Array.filter(createdRecords,Ext.cf.data.SyncModel.isNotDestroyed);
            // move the updated, then deleted
            var x= Ext.Array.partition(updatedRecords,Ext.cf.data.SyncModel.isDestroyed);
            var destroyedRecords= x[0];
            updatedRecords= x[1];
            callback.call(scope,{
                r: 'ok',
                created: createdRecords,
                updated: updatedRecords,
                removed: destroyedRecords
            });
        },this);
    },
    
    /** 
     * Apply update
     *
     * @param {Object} t
     * @param {Object} update
     * @param {Function} callback
     * @param {Object} scope
     * @param {Object} last_ref
     *
     */
    applyUpdate: function(t,update,callback,scope,last_ref) { // Attribute Value - Conflict Detection and Resolution
        t.readCacheByOid(update.i,function(record) {
            if (record) {
                this.applyUpdateToRecord(t,record,update);
                callback.call(scope);
            } else {
                Ext.cf.util.Logger.debug('SyncProxy.applyUpdate:',Ext.cf.data.Update.asString(update),'accepted, creating new record');
                this.applyUpdateCreatingNewRecord(t,update);
                callback.call(scope);
            }
        },this);
    },

    /** 
     * Apply update - create new record
     *
     * @param {Object} t
     * @param {Object} update
     *
     */
    applyUpdateCreatingNewRecord: function(t,update) {
        var record;
        // no record with that oid is in the local store...
        if (update.p==='_oid') {
            // ...which is ok, because the update is intending to create it
            record= this.createModelFromOid(t,update.v,update.c);
            //console.log('applyUpdate',JSON.stringify(record.eco),'( create XXX )');
        } else {
            // ...which is not ok, because given the strict ordering of updates
            // by change stamp the update creating the object must be sent first.
            // But, let's be forgiving and create the record to receive the update. 
            Ext.cf.util.Logger.warn("Update received for unknown record "+update.i,Ext.cf.data.Update.asString(update));
            record= this.createModelFromOid(t,update.i,update.i);
            record.setValueCS(t,update.p,update.v,update.c);
        }
        t.create([record]);
    },

    /** 
     * Create model from Oid
     *
     * @param {Object} t
     * @param {Number/String} oid
     * @param {Object} cs
     *
     * @return {Object} record
     *
     */
    createModelFromOid: function(t,oid,cs) {
        Ext.cf.util.Logger.info('SyncProxy.createModelFromOid:',oid,cs);
        var record= new this.userModel({});
        record.phantom= false; // this prevents the bound Ext.data.Store from re-adding this record
        var eco= record.eco= Ext.create('Ext.cf.ds.ECO',{
            oid: oid,
            data: record.data,
            state: {}
        });
        record.setValueCS(t,'_oid',oid,cs);
        return record;
    },

    /** 
     * Apply update to record
     *
     * @param {Object} t
     * @param {Object} record
     * @param {Object} update
     *
     * @return {Boolean} True/False => Accepted/Rejected
     *
     */
    applyUpdateToRecord: function(t,record,update) {
        if (record.putUpdate(t,update)) {
            t.update([record]);
            Ext.cf.util.Logger.info('SyncProxy.applyUpdateToRecord:',Ext.cf.data.Update.asString(update),'accepted');
            return true;
        } else {
            Ext.cf.util.Logger.info('SyncProxy.applyUpdateToRecord:',Ext.cf.data.Update.asString(update),'rejected');
            return false;
        }
    },

    // read and write configuration

    /** 
     * Load config
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    loadConfig: function(config,callback,scope) {
        this.readConfig_Database(config,function(){
            this.readConfig_Replica(config,function(){
                this.readConfig_CSV(config,function(){
                    this.readConfig_Generator(config,function(){
                        callback.call(scope);
                    },this);
                },this);
            },this);
        },this);
    },

    /** 
     * Read config database
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readConfig_Database: function(config,callback,scope) {
        this.readConfig(Ext.cf.data.DatabaseDefinition,'databaseDefinition',config.databaseDefinition,{},function(r,definition) {
            this.setDatabaseDefinition(definition);
            callback.call(scope,r,definition);
        },this);
    },

    /** 
     * Read config replica
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readConfig_Replica: function(config,callback,scope) {
        this.readConfig(Ext.cf.data.ReplicaDefinition,'replicaDefinition',config.replicaDefinition,{},function(r,definition) {
            this.setReplicaDefinition(definition);
            callback.call(scope,r,definition);
        },this);
    },

    /** 
     * Read config generator
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readConfig_Generator: function(config,callback,scope) {
        this.readConfig(Ext.cf.ds.LogicalClock,'generator',{},{},function(r,generator){
            this.generator= generator;
            if(this.generator.r===undefined){
                this.generator.r= config.replicaDefinition.replicaId; 
            }
            if(config.clock){
                this.generator.setClock(config.clock);
            }
            callback.call(scope,r,generator);
        },this); 
    },

    /** 
     * Read config csv
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readConfig_CSV: function(config,callback,scope) {
        this.readConfig(Ext.cf.ds.CSV,'csv',{},{},function(r,csv){
            this.csv= csv;
            callback.call(scope,r,csv);
        },this); 
    },

    /** 
     * Write config replica
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    writeConfig_Replica: function(callback,scope) {
        this.writeConfig('replicaDefinition',this.getReplicaDefinition(),callback,scope);
    },
    
    /** 
     * Write config generator
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    writeConfig_Generator: function(callback,scope) {
        this.writeConfig('generator',this.generator,callback,scope);
    },

    /** 
     * Write config csv
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    writeConfig_CSV: function(callback,scope) {
        this.writeConfig('csv',this.csv,callback,scope);
    },
                
    /** 
     * Write config
     *
     * @param {Number/String} id
     * @param {Object} object
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    writeConfig: function(id, object, callback, scope) {
        if(object){
            this.getStore().writeConfig(id,object.as_data(),callback,scope);
        }else{
            callback.call(scope);
        }
    },

    /** 
     * Read config
     *
     * @param {String} klass
     * @param {Number/String} id
     * @param {Object} default_data
     * @param {Object} overwrite_data
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readConfig: function(Klass, id, default_data, overwrite_data, callback, scope) {
        this.getStore().readConfig(id,function(data) {
            var name;
            var r= (data===undefined) ? 'created' : 'ok';
            if (default_data!==undefined) {
                if (data===undefined) {
                    data= default_data;
                } else {
                    for(name in default_data) {
                        if (data[name]===undefined) {
                            data[name]= default_data[name];
                        }
                    }
                }
            }
            if (overwrite_data!==undefined) {
                if (data===undefined) {
                    data= overwrite_data;
                } else {
                    for(name in overwrite_data) {
                        if (data[name]!==overwrite_data[name]) {
                            data[name]= overwrite_data[name];
                        }
                    }
                }
            }

            callback.call(scope,r,new Klass(data));
        },this);
    },

    /** 
     * Callback
     *
     * @param {Function} callback
     * @param {Object} scope
     * @param {String} operation
     *
     */
    doCallback: function(callback, scope, operation) {
        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    }

});


Ext.Array.partition= function(a,fn,scope) {
    var r1= [], r2= [];
    if (a) {
        var j, l= a.length;
        for(var i= 0;i<l;i++) {
            j= a[i];
            if (j!==undefined) {
                if (fn.call(scope||j,j)) {
                    r1.push(j);
                } else {
                    r2.push(j);
                }
            }
        }
    }
    return [r1,r2];
};


/**
 * @private
 *
 * Change Stamp Index
 *
 * Index of a set of Object Identifiers for a single replica, by time, t.
 */
Ext.define('Ext.cf.ds.CSI', {
    
    map: {}, // t => set of oids
    v: [],   // t, in order
    dirty: false, // if v needs rebuild
    
    /** 
     * Constructor
     *
     */
    constructor: function() {
        this.clear();
    },
    
    /** 
     * Clear
     *
     */
    clear: function() {
        this.map= {};
        this.v= [];
        this.dirty= false;
    },
    
    /** 
     * Add
     *
     * @param {String/Number} t
     * @param {String} oid
     *
     */
    add: function(t,oid) {
        var l= this.map[t];
        if(l){
            l[oid]= true;
        }else{
            l= {};
            l[oid]= true;
            this.map[t]= l;
            this.dirty= true;
        }
    },

    /** 
     * Remove
     *
     * @param {String/Number} t
     * @param {String} oid
     *
     */
    remove: function(t,oid) {
        var l= this.map[t];
        if(l){
            delete l[oid];
            this.dirty= true;
        }
    },

    /** 
     * Oids from
     *
     * @param {String/Number} t
     *
     */
    oidsFrom: function(t) {
        var r= [];
        var keys= this.keysFrom(t);
        var l= keys.length;
        for(var i=0;i<l;i++){
            r= r.concat(this.oToA(this.map[keys[i]]));
        }
        return r;
    },
    
    /** 
     * Keys from
     *
     * @param {String/Number} t
     *
     */
    keysFrom: function(t) {
        var r= [];
        var keys= this.keys();
        var l= keys.length;
        for(var i=0;i<l;i++){ // JCM should be a binary search, or reverse iteration
            var j= keys[i];
            if(j>=t){ // '=' because we only index by t, there could be updates with the same t and greater s
                r.push(j);
            }
        }
        return r;
    },
    
    /** 
     * Encode
     *
     */
    encode: function() {
        var r= {};
        for(var i in this.map){
            if (this.map.hasOwnProperty(i) && !this.isEmpty(this.map[i])) {
                r[i]= this.oToA(this.map[i]);
            }
        }
        return r;
    },
    
    /** 
     * Decode
     *
     * @param {Object} v
     *
     */
    decode: function(v) {
        this.clear();
        for(var i in v){
            if (v.hasOwnProperty(i)) {
                var oids= v[i];
                for(var j=0;j<oids.length;j++){
                    this.add(i,oids[j]);
                }
            }
        }
        return this;
    },
    
    /** 
     * Keys
     *
     */
    keys: function() {
        if(this.dirty){
            this.v= [];
            for(var i in this.map){
                if (this.map.hasOwnProperty(i) && !this.isEmpty(this.map[i])) {
                    this.v.push(i);
                }
            }
            this.dirty= false; 
        }
        return this.v;
    },
    
    /** 
     * isEmpty?
     *
     * @param {Object} object
     *
     * @return {Boolean} True/False
     *
     */
    isEmpty: function(o) {
        for(var i in o) {
            return false;
        }
        return true;
    },

    /** 
     * Object to Array
     *
     * @param {Object} object
     *
     * @return {Array}
     *
     * @private
     *
     */ 
    oToA: function(o){
        var r= [];
        if(o){
            for(var i in o){
                if (o.hasOwnProperty(i)) {
                    r.push(i);
                }
            }
        }
        return r;
    },
    
    /** 
     * To stamp
     *
     */
    asString: function(){
        var r= "";
        for(var i in this.map){
            if (this.map.hasOwnProperty(i) && !this.isEmpty(this.map[i])) {
                r= r+i+':'+this.oToA(this.map[i]);
            }
            r= r+", ";
        }
        return r;
    }
    
    
});

/**
 * @private
 *
 * Change Stamp Index Vector
 * 
 * In index for a set of Object Identifiers for all replicas, by Change Stamp.
 */
Ext.define('Ext.cf.ds.CSIV', {
    requires: ['Ext.cf.ds.CSI'],

    v: {}, // r => Change Stamp Index
    
    /** 
     * Constructor
     *
     */
    constructor: function() {
        this.v= {};
    },
    
    /** 
     * Oids from
     *
     * @param {Ext.cf.ds.CSV} csv
     *
     */
    oidsFrom: function(csv) {
        var r= csv.collect(function(cs){
            var csi= this.v[cs.r];
            if(csi){
                return csi.oidsFrom(cs.t);
            }
        },this);
        r= Ext.Array.flatten(r);
        r= Ext.Array.unique(r);
        r= Ext.Array.clean(r);
        return r;
    },
    
    /** 
     * Add
     *
     * @param {Ext.cf.ds.CS} cs
     * @param {String} oid
     *
     */
    add: function(cs,oid) {
        var csi= this.v[cs.r];
        if(csi===undefined){
            csi= this.v[cs.r]= Ext.create('Ext.cf.ds.CSI');
        }
        csi.add(cs.t,oid);
    },

    /** 
     * Add Array
     *
     * @param {Array} a
     * @param {String} oid
     *
     */
    addArray: function(a,oid) {
        var l= a.length;
        for(var i=0;i<l;i++){
            var cs= a[i];
            if(cs){
                this.add(a[i],oid);
            }
        }
    },

    /** 
     * Remove
     *
     * @param {Ext.cf.ds.CS} cs
     * @param {String} oid
     *
     */
    remove: function(cs,oid) {
        var csi= this.v[cs.r];
        if(csi){
            csi.remove(cs.t,oid);
        }
    },  

    /** 
     * Remove array
     *
     * @param {Array} a
     * @param {String} oid
     *
     */
    removeArray: function(a,oid) {
        var l= a.length;
        for(var i=0;i<l;i++){
            var cs= a[i];
            if(cs){
                this.remove(a[i],oid);
            }
        }
    },

    /** 
     * Encode
     *
     */
    encode: function() {
        var r= {};
        for(var i in this.v){
            if (this.v.hasOwnProperty(i)) {
                r[i]= this.v[i].encode();
            }
        }
        return {r:r};
    },
        
    /** 
     * Decode
     *
     * @param {Object} v
     *
     */
    decode: function(v) {
        this.v= {};
        if(v){
            for(var i in v.r){
                if (v.r.hasOwnProperty(i)) {
                    this.v[i]= Ext.create('Ext.cf.ds.CSI').decode(v.r[i]);
                }
            }       
        }
        return this;
    },
    
    /** 
     * To stamp
     *
     */
    asString: function() {
        var r= "";
        for(var i in this.v){
            if (this.v.hasOwnProperty(i)) {
                r= r+i+"=>["+this.v[i].asString()+"], ";
            }
        }
        return r;
    }
            
});

/**
 * 
 * @private
 *
 * SyncStore
 *
 * It maintains...
 *
 *  - a Change Stamp to OID index
 *
 */
Ext.define('Ext.cf.data.SyncStore', {
    requires: [
        'Ext.cf.Utilities',
        'Ext.cf.ds.CSIV'
    ],
    

    /** 
     * Async initialize
     *
     * @param {Object} config
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    asyncInitialize: function(config,callback,scope) {
        var validated = Ext.cf.util.ParamValidator.validateApi([
            { name: "config", type: "object",
                keys: [
                    { name: "databaseName", type: 'string' }
                ]
            },
            { name: "callback", type: "null|function", optional: true }, 
            { name: "scope", type: "null|object|function", optional: true }
        ], arguments, 'SyncStore', 'initialize');
        this.logger = Ext.cf.util.Logger;
        this.store= config.localStorageProxy || window.localStorage;
        this.id= config.databaseName;

// JCM check data version number

        var hasRecords= this.getIds().length>0;
        this.readConfig('databaseDefinition',function(data) {
            if(hasRecords && !data){
                this.logger.error('Ext.cf.data.SyncStore.initialize: Tried to use an existing store,',config.databaseName,', as a syncstore.');
                callback.call(scope,{r:'error'});
            }else{
                // ok
                this.readConfig('csiv',function(data) {
                    this.csiv= data ? Ext.create('Ext.cf.ds.CSIV').decode(data) : undefined;
                    if(!this.csiv){
                        this.reindex(function(){
                            callback.call(scope,{r:'ok'});
                        },this);
                    }else{
                        callback.call(scope,{r:'ok'});
                    }
                },this);
            }
        },this);
    },

    // crud

    /** 
     * Create
     *
     * @param {Array} records
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    create: function(records, callback, scope) {
        var ids= this.getIds();
        records.forEach(function(record){
            ids.push(record.getOid());
            this.setRecord(record);
        },this);
        this.setIds(ids);
        if(callback){
            callback.call(scope);
        }
    },

    /** 
     * Read by Oid
     *
     * @param {Number/String} oid
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readByOid: function(oid, callback, scope) {
        var record= this.getRecord(oid);
        callback.call(scope,record);
    },

    /** 
     * Read by Oids
     *
     * @param {Array} oids
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readByOids: function(oids, callback, scope) {
        var records= [];
        var i, l= oids.length;
        var f= function(record){ records.push(record); };
        for(i=0;i<l;i++){
            this.readByOid(oids[i],f,this);
        }
        callback.call(scope,records);
    },

    /** 
     * Read by CSV
     *
     * @param {Object} csv
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readByCSV: function(csv, callback, scope) {
        //
        // Use the CS index to get a list of records that have changed since csv
        //
        var oids= this.csiv.oidsFrom(csv);
        this.readByOids(oids,callback,scope);
    },

    /** 
     * Read all
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readAll: function(callback, scope){
        this.readByOids(this.getIds(),callback,scope);
    },

    /** 
     * Update
     *
     * @param {Array} records
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    update: function(records, callback, scope) {
        records.forEach(function(record){
            this.setRecord(record);
        },this);
        if(callback){
            callback.call(scope);
        }
    },

    /** 
     * Destroy
     *
     * @param {Number/String} oid
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    destroy: function(oid, callback, scope) {
        if(Ext.isArray(oid)){
            var ids= this.getIds();
            var i, l= oid.length;
            for(i=0;i<l;i++){
                var id= oid[i];
                Ext.Array.remove(ids, id);
                var key = this.getRecordKey(id);
                this.store.removeItem(key);
            }
            this.setIds(ids);
            if(callback){
                callback.call(scope);
            }
        }else{
            this.destroy([oid],callback,scope);
        }
    },

    /** 
     * Clear
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    clear: function(callback, scope) {
        var ids = this.getIds(), len = ids.length, i;
        for (i = 0; i < len; i++) {
            var key = this.getRecordKey(ids[i]);
            this.store.removeItem(key);
        }
        this.store.removeItem(this.id);
        this.store.removeItem(this.getRecordKey('csiv'));
        this.csiv= Ext.create('Ext.cf.ds.CSIV');
        callback.call(scope);
    },

    /** 
     * Set Model
     *
     * @param {Object} userModel
     *
     */
    setModel: function(userModel) {
        this.model= userModel;
    },

    // config

    /** 
     * Read config
     *
     * @param {Number/String} oid
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    readConfig: function(oid, callback, scope) {
        var item= this.store.getItem(this.getRecordKey(oid));
        var data= item ? Ext.decode(item) : {};
        callback.call(scope,data);
    },
    
    /** 
     * Write config
     *
     * @param {Number/String} oid
     * @param {Object} data
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    writeConfig: function(oid, data, callback, scope) {
        this.store.setItem(this.getRecordKey(oid),JSON.stringify(data));
        callback.call(scope,data);
    },
    
    /** 
     * Remove config
     *
     * @param {Number/String} oid
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    removeConfig: function(oid, callback, scope) {
        this.store.removeItem(this.getRecordKey(oid));
        callback.call(scope);
    },
    
    // cs to oid index
    
    /** 
     * Get CS Index
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    getCSIndex: function(callback,scope) {
        callback.call(scope,this.csiv);
    },

    /** 
     * Set CS Index
     *
     * @param {Object} csiv
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    setCSIndex: function(csiv,callback,scope) {
        if(csiv){
            this.csiv= csiv;
            this.writeConfig('csiv',this.csiv.encode(),callback,scope);
        }else{
            callback.call(scope);
        }
    },

    // change replica id

    /** 
     * Change replica id
     *
     * @param {String} old_replica_id
     * @param {String} new_replica_id
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    changeReplicaId: function(old_replica_id,new_replica_id,callback,scope) {
        this.readAll(function(records){
            var i, l= records.length;
            for(i=0;i<l;i++){
                var record= records[i];    
                var oid= record.getOid();
                if (record.changeReplicaId(old_replica_id,new_replica_id)) {
                    if(record.getOid()!=oid){
                        record.phantom= false;
                        this.create([record]);
                        this.destroy(oid);
                    }else{
                        this.update([record]);
                    }
                }
            }
            this.reindex(callback,scope);            
        },this);
    },

    // reindex

    /** 
     * Reindex
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    reindex: function(callback,scope){
        this.csiv= Ext.create('Ext.cf.ds.CSIV');
        this.readAll(function(records){
            var i, l= records.length;
            for(i=0;i<l;i++){
                var record= records[i];
                var oid= record.getOid();
                record.eco.forEachCS(function(cs){
                    this.csiv.add(cs,oid);
                },this);
            }
            callback.call(scope);
        },this);
    },  

    /** 
     * Get Id's
     *
     */
    getIds: function(){
        var ids= [];
        var item= this.store.getItem(this.id);
        if(item){
            ids= item.split(',');
        }
        //console.log('getIds',ids)
        return ids;
    },

    /** 
     * Set Id's
     *
     * @param {Array} ids
     *
     */
    setIds: function(ids) {
        //iPad bug requires that we remove the item before setting it
        this.store.removeItem(this.id);
        this.store.setItem(this.id, ids.join(','));
        //console.log('setIds',ids)
    },

    /** 
     * Get record key
     *
     * @param {Number/String} id
     *
     */
    getRecordKey: function(id) {
        return Ext.String.format("{0}-{1}", this.id, id);
    },

    /** 
     * Get record
     *
     * @param {Number/String} id
     *
     */
    getRecord: function(id) {
        var record;
        var key= this.getRecordKey(id);
        var item= this.store.getItem(key);
        if(item!==null){
            var x= Ext.decode(item);
            var raw = x.data;
            var data= {};
            var fields= this.model.getFields().items;
            var length= fields.length;
            var i = 0, field, name, obj;
            for (i = 0; i < length; i++) {
                field = fields[i];
                name  = field.getName();
                if (typeof field.getDecode() == 'function') {
                    data[name] = field.getDecode()(raw[name]);
                } else {
                    if (field.getType().type == 'date') {
                        data[name] = new Date(raw[name]);
                    } else {
                        data[name] = raw[name];
                    }
                }
            }
            record= new this.model(data);
            record.data._oid= raw._oid;
            if(raw._ref!==null && raw._ref!==undefined) { record.data._ref= raw._ref; }
            if(raw._ts!==null && raw._ts!==undefined) { record.data._ts= raw._ts; }
            record.eco= Ext.create('Ext.cf.ds.ECO',{oid:raw._oid,data:record.data,state:x.state});
        }
        return record;
    },

    /** 
     * Set record
     *
     * @param {Object} record
     *
     */
    setRecord: function(record) {
        //console.log('set',JSON.stringify(record))

        var raw = record.eco.data,
            data    = {},
            fields  = this.model.getFields().items,
            length  = fields.length,
            i = 0,
            field, name, obj, key;

        for (; i < length; i++) {
            field = fields[i];
            name  = field.getName();

            if (typeof field.getEncode() == 'function') {
                data[name] = field.getEncode()(raw[name], record);
            } else {
                if (field.getType().type == 'date') {
                    data[name] = raw[name].getTime();
                } else {
                    data[name] = raw[name];
                }
            }
            if(data[name]===null || data[name]===undefined){
                data[name]= field.getDefaultValue();
            }
        }

        data._oid= record.getOid();
        if(raw._ref!==null && raw._ref!==undefined) { data._ref= raw._ref; }
        if(raw._ts!==null && raw._ts!==undefined) { data._ts= raw._ts; }

        //iPad bug requires that we remove the item before setting it
        var eco= record.eco;
        var oid= record.getOid();
        key = this.getRecordKey(oid);
        this.store.removeItem(key);
        var item= JSON.stringify({data:data,state:eco.state});
        this.store.setItem(key,item);
        //console.log('set',key,item);
    }
    
});

/**
 * @private
 *
 */
Ext.define('Ext.cf.fs.FilesClient', {

    requires: ['Ext.cf.util.ErrorHelper'],
    
    statics: {
        /*
        *@private
        */
        _readFile: function(file, callback, scope) {
            try {
                var reader = new FileReader();
                reader.onload = function (result) {
                    callback.call(scope, result.target.result);
                };

                reader.readAsDataURL(file);
            } catch (e) {
                var err = Ext.cf.util.ErrorHelper.get('UNABLE_READ_FILE');
                callback.call(scope, undefined, err);
            }
        },

        /*
        *@private
        */
        _createFileObject: function(file) {
            var result = {path:file.data.path, name:file.data.name, folder:(file.data.dir) ? file.data.dir : false};
            if (file.data.namespace) {result.namespace = file.data.namespace;}
            return result;
        },


        /**
        * Create a file
        * @param {Object} options.file
        * @param {Object} options.namespace
        * @param {Object} options.path
        * @param {Object} options.name
        * @param {Object} options.folder
        * @param {Object} options.content
        */

        create: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(//dude?
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            var createFile = function(content) {
                                fileService.create(function(result) {
                                    if (result.status == "success") {
                                        var file = self._createFileObject(result.value);
                                        callback.call(scope, file);
                                    } else {
                                        callback.call(scope, undefined, result.error);
                                    }
                                }, options.namespace, options.path, options.name, options.folder, content);
                            };
                            if(options.content){
                                createFile(options.content);
                            } else if (!options.folder && options.file) { //it is a file
                                self._readFile(options.file, function(content, err) {
                                    if (!err) {
                                        createFile(content);
                                    } else {
                                        callback.call(scope, undefined, err);
                                    }
                                }, scope);
                            } else {
                                createFile(null);
                            }
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        read: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.read(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope, result.value);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        write: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            self._readFile(options.file, function(content, err) {
                                if (!err) {
                                    fileService.write(function(result) {
                                        if (result.status == "success") {
                                            callback.call(scope);
                                        } else {
                                            callback.call(scope, undefined, result.error);
                                        }
                                    }, options.namespace, options.path, options.name, content);
                                } else {
                                    callback.call(scope, undefined, err);
                                }
                            }, scope);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        remove: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.remove(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        list: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.list(function(result) {
                                if (result.status == "success") {
                                    var files = [];
                                    for(var i = 0; i < result.value.length; i++) {
                                        files.push(self._createFileObject(result.value[i]));
                                    }
                                    callback.call(scope, files);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        share: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.share(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name, options.klass, options.id, options.actions);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        rename: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.rename(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name, options.new_name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        getFileInfo: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.getFileInfo(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope, result.value);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        }

    }

});

/*
* @private
*/
Ext.define('Ext.cf.util.UuidGenerator', {

    statics: {
        /**
         * @private
         *
         * Generate
         *
         * @return {String} UUID
         *
         */
        generate: function() { // totally random uuid
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    }
    
});

Ext.define('Ext.cf.util.Md5', {

    statics: {

        hash: function (s,raw,hexcase,chrsz) {
            raw = raw || false; 
            hexcase = hexcase || false;
            chrsz = chrsz || 8;

            function safe_add(x, y){
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }
            function bit_rol(num, cnt){
                return (num << cnt) | (num >>> (32 - cnt));
            }
            function md5_cmn(q, a, b, x, s, t){
                return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
            }
            function md5_ff(a, b, c, d, x, s, t){
                return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
            }
            function md5_gg(a, b, c, d, x, s, t){
                return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
            }
            function md5_hh(a, b, c, d, x, s, t){
                return md5_cmn(b ^ c ^ d, a, b, x, s, t);
            }
            function md5_ii(a, b, c, d, x, s, t){
                return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
            }

            function core_md5(x, len){
                x[len >> 5] |= 0x80 << ((len) % 32);
                x[(((len + 64) >>> 9) << 4) + 14] = len;
                var a =  1732584193;
                var b = -271733879;
                var c = -1732584194;
                var d =  271733878;
                for(var i = 0; i < x.length; i += 16){
                    var olda = a;
                    var oldb = b;
                    var oldc = c;
                    var oldd = d;
                    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
                    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
                    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
                    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
                    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
                    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
                    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
                    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
                    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
                    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
                    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
                    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
                    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
                    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
                    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
                    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
                    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
                    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
                    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
                    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
                    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
                    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
                    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
                    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
                    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
                    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
                    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
                    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
                    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
                    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
                    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
                    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
                    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
                    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
                    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
                    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
                    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
                    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
                    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
                    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
                    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
                    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
                    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
                    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
                    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
                    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
                    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
                    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
                    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
                    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
                    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
                    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
                    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
                    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
                    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
                    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
                    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
                    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
                    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
                    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
                    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
                    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
                    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
                    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
                    a = safe_add(a, olda);
                    b = safe_add(b, oldb);
                    c = safe_add(c, oldc);
                    d = safe_add(d, oldd);
                }
                return [a, b, c, d];
            }
            function str2binl(str){
                var bin = [];
                var mask = (1 << chrsz) - 1;
                for(var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
                }
                return bin;
            }
            function binl2str(bin){
                var str = "";
                var mask = (1 << chrsz) - 1;
                for(var i = 0; i < bin.length * 32; i += chrsz) {
                    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
                }
                return str;
            }
            
            function binl2hex(binarray){
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for(var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
                }
                return str;
            }
            return (raw ? binl2str(core_md5(str2binl(s), s.length * chrsz)) : binl2hex(core_md5(str2binl(s), s.length * chrsz)) );  
        }
    }

});

/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.AuthStrategies', {
    requires: [
        'Ext.cf.util.UuidGenerator',
        'Ext.cf.util.Md5'
    ],

    statics: {
        nc: 0, // request counter used in Digest auth

        /**
         * Get request counter
         *
         */
        getRequestCounter: function () {
            return ++Ext.cf.messaging.AuthStrategies.nc;
        },

        strategies: {
            /**
             * Digest strategy
             *
             * @param {Object} group
             * @param {Object} params
             * @param {Function} callback
             * @param {Object} scope
             *
             */
            'senchaio': function (group, params, callback, scope) {
                var parameters = {
                    email: params.email,
                    password: params.password,
                    groupId: group.getId(),
                    provider: "senchaio"
                };

                Ext.io.Io.getMessagingProxy(function (messaging) {
                    messaging.getService(
                        {name: "GroupManager"},
                        function (groupManager, err) {
                            if (groupManager) {
                                groupManager.loginUser(function (result) {
                                    if (result.status == "success" && result.value._bucket && result.value._bucket == "Users") {
                                        callback.call(scope, result.value, result.sid);
                                    } else {
                                        callback.call(scope, null, null, result.error);
                                    }
                                }, parameters);
                            } else {
                                callback.call(scope, null, null, err);
                            }
                        },
                        this
                    );
                }, this);
            },


            /**
             * Facebook
             *
             * @param {Object} group
             * @param {Object} params
             * @param {Function} callback
             * @param {Object} scope
             *
             */
            facebook: function (group, params, callback, scope) {

                var fn = function (result) {
                    if (result.status == "success" && result.value._bucket && result.value._bucket == "Users") {
                        callback.call(scope, result.value, result.sid);
                    } else {
                        callback.call(scope, null, null, result.error);
                    }
                };


                params.groupId = group.getId();
                params.provider = "facebook";

                Ext.io.Io.getMessagingProxy(function (messaging) {
                    messaging.getService(
                        { name: "GroupManager" },
                        function (groupManager, err) {
                            if (groupManager) {
                                groupManager.loginUser(fn, params);
                            } else {
                                callback.call(scope, null, null, err);
                            }
                        },
                        this
                    );
                }, this);
            },

            twitter: function (group, params, callback, scope) {

                var fn = function (result) {
                    if (result.status == "success" && result.value._bucket && result.value._bucket == "Users") {
                        callback.call(scope, result.value, result.sid);
                    } else if (result.status == "authToken") {
                        callback.call(scope, null, result.sid, null);
                    } else {
                        callback.call(scope, null, null, result.error);
                    }
                };

                params.groupId = group.getId();
                params.provider = "twitter";

                Ext.io.Io.getMessagingProxy(function (messaging) {
                    messaging.getService(
                        { name: "GroupManager" },
                        function (groupManager, err) {
                            if (groupManager) {
                                groupManager.loginUser(fn, params);
                            } else {
                                callback.call(scope, null, null, err);
                            }
                        },
                        this
                    );
                }, this);
            }

        }
    }
});

/**
 * @private
 *
 * Registers or Authenticates a device with the Sencha.io servers.
 *
 */
Ext.define('Ext.cf.messaging.DeviceAllocator', {
    
    requires: ['Ext.cf.util.Logger', 'Ext.cf.util.ErrorHelper'],

    statics: {
        bootup: function(params, callback) {
            
            
            params.v = Ext.getVersion("sio").toString();


            var platforms = ["touch", "extjs"];

            for(var i =0, done = false; !done && i < platforms.length; i++) {

                var platformName = platforms[i];
                var platform = Ext.getVersion(platformName);
                if(platform){
                    params.platform = platformName;
                    params.platformVersion = platform.toString();
                    done == true;
                }

            }

            params.platformVersion 

            var ext = Ext.getVersion("extjs");
            if(ext){
                params.extVersion = ext.toString();
            }
            
            // one server call will do the following
            // 0. check version
            // 1. device auth, if auth fails, try device register
            // 2. get app
            // 3. get group
            // 4. get service descriptors? (maybe)
            this.callServer(params.url, "/device/bootup", params, callback);
        },

        /** 
         * Register
         *
         * @param {String} url
         * @param {String/Number} appId
         * @param {Function} callback
         *
         */      
        register: function(url, appId, callback) {
            this.callServer(url, "/device/register", {appId: appId}, callback);
        },

        /** 
         * Authenticate
         *
         * @param {String} url
         * @param {String/Number} deviceSid
         * @param {String/Number} deviceId
         * @param {Function} callback
         *
         */      
        authenticate: function(url, deviceSid, deviceId, callback) {
            this.callServer(url, "/device/authenticate", {deviceSid: deviceSid, deviceId: deviceId}, callback);
        },

        /** 
         * Call server
         *
         * @param {String} url
         * @param {String} api
         * @param {Object} data
         * @param {Function} callback
         *
         */      
        callServer: function(url, api, data, callback) {
            Ext.Ajax.request({
                method: "POST",
                url: url + api,
                params: {},
                jsonData: data,
                scope: this,
                callback: function(options, success, response) {
                    if(response && response.status === 0) {
                        // network is down
                        callback({status:'error', error: Ext.cf.util.ErrorHelper.get('NETWORK_ERROR') });
                    } else {
                        if(success) {
                            callback(Ext.decode(response.responseText));
                        } else {
                            callback({status:'error', error: {code: 'API_ERROR', message:'Error during API call' + api + ' Status ' + response.status }});
                        }
                    }
                }
            });            
        }
    }
});

/**
 * @private
 *
 * Wraps an envelope and its contained message in a Model so
 * that it can be stored in a Store.
 *
 */
Ext.define('Ext.cf.messaging.EnvelopeWrapper', {
    extend: 'Ext.data.Model',
    config: {
        identifier: 'uuid',
        fields: [
            {name: 'e', type: 'auto'}, // envelope
            {name: 'ts', type: 'integer'} // timestamp
        ]
    }
});

/**
 * @private
 */
Ext.define('Ext.cf.util.ServiceVersionHelper', {
    requires: ['Ext.cf.ServiceDefinitions', 'Ext.cf.util.Logger'],

    statics: {
        get: function(serviceName, callback) {
            var version = Ext.cf.ServiceDefinitions[serviceName];
            if(!version) {
                // ask the registy for the latest version
                Ext.io.Io.getService({name:"RegistryRpcService"}, function(registry) {
                    registry.getLatestServiceVersion(function(result) {
                        if(result.status === 'success') {
                            // store it in the ServiceDefinitions class (caching)
                            Ext.cf.ServiceDefinitions[serviceName] = result.value;
                            
                            callback(result.value);
                        } else {
                            var err = result.error;
                            
                            Ext.cf.util.Logger.error("FATAL", err);

                            callback(null);

                            throw err.code + " " + err.message;
                        }
                    }, serviceName);
                });
            } else {
                callback(version);
            }
        }
    }
});

/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.Registry', {
    requires: ['Ext.cf.util.ServiceVersionHelper'],

    alternateClassName: 'Ext.io.Registry',

    /**
     * Get service descriptor
     *
     * @param {String} serviceName
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    getServiceDescriptor: function(serviceName, callback, scope) {
        Ext.cf.util.ServiceVersionHelper.get(serviceName, function(version) {
            if(serviceName === "RegistryRpcService") {
                callback.call(scope, {
                    kind: "rpc",
                    style: ["subscriber"],
                    access: ["clients", "servers"],
                    depends: ["MessagingService", "RegistryService"],
                    methods: ["getServiceDescriptor", "getLatestServiceVersion"]
                });
            } else {
                var configStore = Ext.io.Io.getConfigStore();
                var serviceConfig = configStore.getObjectConfig(serviceName+version);
                // If we have the version of the service cached 
                if(serviceConfig) {
                    callback.call(scope, serviceConfig);
                } else {
                    Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.getService(
                            {name: "RegistryRpcService"},
                            function(namingRpc,err) {
                                if(namingRpc){
                                    namingRpc.getServiceDescriptor(function(result) {
                                        if(result.status == "success") {
                                            configStore.setObjectConfig(serviceName+version, result.value);
                                            callback.call(scope, result.value);
                                        } else {
                                            callback.call(scope, undefined, result.error);
                                        }
                                    }, serviceName, version);
                                }else{
                                    callback.call(scope, undefined, err);
                                }
                            },this
                        );
                    },this);                
                }
            }
        });
    }
});

/**
 * @private
 *
 * Polling Transport
 *
 */
Ext.define('Ext.cf.messaging.transports.PollingTransport', {
    requires: ['Ext.cf.util.Logger', 'Ext.cf.util.ErrorHelper'],

    mixins: {
        observable: "Ext.util.Observable"
    },

    statics: {
       isSupported: function() {
            // all modern browsers support xhr
            return true;
        }
    },

    config: {
        url: 'http://api.sencha.io',
        maxEnvelopesPerReceive: 25,
        started: true,
        reconnectBackoffInterval: 5000,
        connected: false
    },

    backoffCounter: 0,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this);

        return this;
    },

    /** 
     * Trigger xhr long-poll
     *
     */
    invokeReceiver: function() {
        var self = this;

        if(self.getStarted()) {
           var params = { deviceId: self.getDeviceId(), max: self.config.maxEnvelopesPerReceive} ;
            
            params.deviceSid = self.getDeviceSid();
           
            self.ajaxRequest("/receive", params, {}, function(err, response) {
                self.responseHandler(err, response);
            });
        }
    },

    /** 
     * Start
     *
     */
    start: function() {
        var self = this;
        this.setStarted(true);
        Ext.cf.util.Logger.debug("Starting polling transport");
   
        // start long poll
        this.invokeReceiver();

        return true;
    },

    /**
     * Stop
     *
     */
    stop: function() {
        // turn off long polling
        this.setStarted(false);  
        this.setConnected(false);
    },

    /** 
     * Response handler
     *
     * @param {Object} err
     * @param {Object} response
     *
     */
    responseHandler: function(err, response) {
        var self = this;

        var backoffDuration = 0;
        if(err && err.code === 'NETWORK_ERROR') {
            // n/w error, increment backoff counter
            self.backoffCounter++;
            backoffDuration = self.getReconnectBackoffInterval() * self.backoffCounter;
        } else {
            // not a n/w problem, reset backoff counter
            self.backoffCounter = 0;
        }

       // start the next long poll
        if(backoffDuration > 0) {
            Ext.cf.util.Logger.debug("polling trying reconnect in", backoffDuration, "ms");
        }

        setTimeout(function() {
            self.invokeReceiver();
        }, backoffDuration);

        if(!err) {
            Ext.cf.util.Logger.debug("PollingTransport",this.config.url,"response:",response.responseText);

            if(!this.getConnected() && this.getStarted()){
                //checking if we are still started because if we were stopped while 
                // waiting for this request to complete we don't want to broadcast 
                // a connected event when we are actually in the process of shutting down.
                this.setConnected(true);
                this.fireEvent("connected", "polling");
            }

            var data = Ext.decode(response.responseText);
            if(data) {
                var envelopes = data.envelopes;
                var hasMore = data.hasMore;
                if(envelopes && envelopes.length) {
                    for(var i = 0; i < envelopes.length; i++) {
                         this.fireEvent('receive', envelopes[i]);
                    }
                }
            } else {
                Ext.cf.util.Logger.warn("PollingTransport",this.config.url,"response text is null",response.status);  
            }
        } else {
            Ext.cf.util.Logger.warn("PollingTransport",this.config.url,"response error:",err,response);
            this.setConnected(false);
            if(err.code=="NETWORK_ERROR"){
                self.fireEvent("offline", err);
            }
            if(response && response.status === 403) {
                self.fireEvent('forbidden', err);
            }
        }
    },

    /** 
     * Send message
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    send: function(message, callback) {
        var self = this;

        this.ajaxRequest("/send", { max: this.config.maxEnvelopesPerReceive }, message, function(err, response, doBuffering) {
            callback(err, doBuffering);

            if(err && err.code=="NETWORK_ERROR"){
                self.fireEvent("offline", err);
            }

            if(err && response && response.status === 403) {
                 this.setConnected(false);
                self.fireEvent('forbidden', err);
            }
        });
    },

    /** 
     * Subscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    subscribe: function(params, callback) {
        var self = this;

        params.deviceSid = self.getDeviceSid();
        
        this.ajaxRequest("/subscribe", params, {}, callback);
    },

    /** 
     * Unsubscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    unsubscribe: function(params, callback) {
        var self = this;

        params.deviceSid = self.getDeviceSid();
        
        this.ajaxRequest("/unsubscribe", params, {}, callback);
    },

    /** 
     * AJAX Request
     *
     * @param {String} path
     * @param {Object} params
     * @param {Object} jsonData
     * @param {Function} callback
     *
     */
    ajaxRequest: function(path, params, jsonData, callbackFunction) {
        Ext.Ajax.request({
            method: "POST",
            url: this.config.url + path,
            params: params,
            jsonData: jsonData,
            scope: this,

            callback: function(options, success, response) {
                if(callbackFunction) {
                    if(response && response.status === 0) { // status 0 = server down / network error
                        callbackFunction(Ext.cf.util.ErrorHelper.get('NETWORK_ERROR'), null, true); // request can be buffered
                    } else {
                        if(success) {
                            callbackFunction(null, response);
                        } else {
                            var err = Ext.cf.util.ErrorHelper.decode(response.responseText);
                            callbackFunction(err, response, false); // no buffering, server replied
                        }
                    }
                }
            }
        });
    },

    /** 
     * Get Device sid
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceSid: function() {
        return Ext.io.Io.getIdStore().getSid('device');
    },

    /** 
     * Get Device id
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceId: function() {
        return Ext.io.Io.getIdStore().getId('device');
    }
});


/**
 * @private
 *
 * Web Socket Transport
 *
 */
Ext.define('Ext.cf.messaging.transports.WebSocketTransport', {
    requires: [
        'Ext.cf.util.Logger', 
        'Ext.cf.util.ErrorHelper'],

    mixins: {
        observable: "Ext.util.Observable"
    },

    statics: {
       isSupported: function() {
            return (typeof(WebSocket) !== "undefined");
        }
    },
     
    config: {
        url: 'https://api.sencha.io',
        webSocketUrl: null,
        reconnectBackoffInterval: 5000,
        connectGracePeriod: 500,
        reconnect: true, // by default, tries reconnecting after socket close
        started: false
    },

    backoffCounter: 0,

    // need to correlate sent packets with ack replies so that 
    // we can return appropriate status to the original callback
    packetCorrMap: {},

    // acts as the correlation counter for the packet corr map
    messageCounter: 0,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */  
    constructor : function(config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this);

        this.deriveWebSocketUrl();

        return this;
    },

    deriveWebSocketUrl: function() {
        // takes care of both http, https -> ws, wss
        var httpUrl = this.getUrl();
        var socketUrl = httpUrl.replace(/^http/,'ws');
        if(socketUrl[socketUrl.length - 1] !== "/") {
            socketUrl += "/";
        }
        socketUrl += "ws";

        this.setWebSocketUrl(socketUrl);
    },

    start: function() {
        var self = this;

        if(this.getStarted()){
            Ext.cf.util.Logger.debug("WebsocketTransport already started");
            return;
        }
        this.setReconnect(true);
        this.setStarted(true);

        // see if websockets are supported in the browser
        if(!self.self.isSupported()) {
            Ext.cf.util.Logger.error("WebSocket constructor not found, your browser may not support websockets");
            return false;
        }

        Ext.cf.util.Logger.debug("websocket connecting to", this.getWebSocketUrl());

        this.socket = new WebSocket(this.getWebSocketUrl());

        this.socket.onopen = function() {
            self.backoffCounter = 0;

            Ext.cf.util.Logger.debug("websocket connected");
           
            var params = { deviceId: self.getDeviceId() };
            if(self.getDeviceSid()) {
                params.deviceSid = self.getDeviceSid();
            }

            self._emit('start', params, function(err) {
                if(err) {
                    Ext.cf.util.Logger.debug("websocket start error", err);
                    if(err && err.code === 'INVALID_SID') {
                        self.fireEvent('forbidden', err);
                    }
                } else {
                    self.fireEvent("connected", "websocket");
                }
            });
        };

        this.socket.onmessage = function(event) {
            var packet;

            try {
                packet = JSON.parse(event.data);
            } catch(e) {
               Ext.cf.util.Logger.error("websocket got illegal packet", event.data, e); 

               // don't continue further
               return;
            }

            Ext.cf.util.Logger.debug("websocket got", packet);

            switch(packet.kind) {
                case 'data': {
                    self._receive(packet.data);
                }
                break;

                case 'ack': {
                    self._handleAck(packet);
                }
                break;

                case 'error': {
                    Ext.cf.util.Logger.error("websocket error", packet);
                }
                break;

                case 'settings': {
                    self.processSettings(packet.data);
                }
                break;
            }
        };

        this.socket.onclose = function() {
            Ext.cf.util.Logger.debug("websocket closed");
            self.setStarted(false);
            clearInterval(self.heartbeatTimer);
            self.fireEvent('offline');

            if(self.getReconnect()) {
                self.backoffCounter++;

                var tryReconnectInterval = self.getReconnectBackoffInterval() * self.backoffCounter;
                Ext.cf.util.Logger.debug("websocket trying reconnect in", tryReconnectInterval, "ms");
                setTimeout(function() {
                    self.start();
                }, tryReconnectInterval);
            }
        };

        return true;
    },

    stop: function() {
        var self = this;

        // turn off reconnect & close the socket
        this.setReconnect(false);
        this.setStarted(false);

        clearInterval(self.heartbeatTimer);

        if(self.socket){
            // clear out the old close function handler 
            // if the network connection is down the socket won't cleanly disconnect
            // an onclose won't fire. When the connection comes back onclose will fire
            // and cause problems.
            this.socket.onclose = function(){}; 
            self.socket.close();
        }
        
        Ext.cf.util.Logger.debug("websocket stopped");
    },

    processSettings: function(settings) {
        var self = this;

        Ext.cf.util.Logger.debug("websocket got settings from server", settings);

        // setup heartbeat
        this.heartbeatTimer = setInterval(function() {
            var now = new Date().getTime();
            self._emit('heartbeat', { time: now }, function(err) {
                if(err) {
                    Ext.cf.util.Logger.warn("websocket could not send heartbeat", now, err);
                } else {
                    Ext.cf.util.Logger.debug("websocket sent heartbeat", now); 
                }
            });
        }, settings.heartbeatInterval);
    },

    send: function(message, callback) {
        var self = this;

        self._emit('data', message, function(err, doBuffering) {
            if(callback) {
                callback(err, doBuffering);
            }
        });
    },

    /** 
     * Subscribe
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    subscribe: function(message, callback) {
        this._emit('subscribe', message, function(err) {
            if(callback) {
                callback(err);
            }
        });
    },

    /** 
     * Unsubscribe
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    unsubscribe: function(message, callback) {
        this._emit('unsubscribe', message, function(err) {
            if(callback) {
                callback(err);
            }
        });
    },

    isOpen: function() {
        return this.socket && this.socket.readyState === 1;
    },

    _emit: function(kind, data, callback) {
        var self = this;

        var packetCorrId = ++self.messageCounter;
        // save callback in packet corr map
        self.packetCorrMap[packetCorrId] = callback;

        var packetJson = { id: packetCorrId, kind: kind, data: data };
        Ext.cf.util.Logger.debug("websocket _emit", packetJson);

        var packet = JSON.stringify(packetJson);


        if(this.isOpen()) {
            this.socket.send(packet);
            // callback will be trigged on ack
        } else {
            // sometimes socket connect takes a few ms, give a little grace period
            setTimeout(function() {
                if(self.isOpen()) {
                    self.socket.send(packet);
                    // callback will be trigged on ack
                } else {
                    // remove the id from map manually
                    delete self.packetCorrMap[packetCorrId];

                    callback(Ext.cf.util.ErrorHelper.get('WEBSOCKET_NOT_READY'), true);
                }
            }, self.getConnectGracePeriod());
        }
    },

    _handleAck: function(packet) {
        var self = this;

        var id = parseInt(packet.id, 10);
        if(id && self.packetCorrMap[id]) {
            // return error, if any. No buffering
            var err = packet.data ? packet.data.error : undefined;
            self.packetCorrMap[id](err, false);
            delete self.packetCorrMap[id];
            // Ext.cf.util.Logger.debug("Got ack for packet", id);
        } else {
            Ext.cf.util.Logger.warn("Packet", id, "not found in ack map, ignoring");
        }

        // fire forbidden event based on status
        if(packet.data && packet.data.error && packet.data.status === 403) {
            self.fireEvent('forbidden', packet.data.error);
        }
    },

    /** 
     * Receive
     *
     * @param {Object} data
     *
     */
    _receive: function(data){
        if(data.envelope) {
            this.fireEvent('receive', data.envelope);
        } else if(data.envelopes && data.envelopes.length > 0) {
             var l = data.envelopes.length;
            for(var i =0; i < l; i++ ) {
                this.fireEvent('receive', data.envelopes[i]);
            }
        }
    },

    /** 
     * Get Device sid
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceSid: function() {
        return Ext.io.Io.getIdStore().getSid('device');
    },

    /** 
     * Get Device id
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceId: function() {
        return Ext.io.Io.getIdStore().getId('device');
    }


});

/**
 * @private
 *
 * Auto transport builds on XHR and Websocket transports to create 
 * a hybrid transport that starts with XHR requests and upgrades to 
 * the websocket connection if a connection can be established. 
 *
 */
Ext.define('Ext.cf.messaging.transports.AutoTransport', {
    requires: [
        'Ext.cf.util.Logger', 
        'Ext.cf.util.ErrorHelper',
        'Ext.cf.messaging.transports.PollingTransport',
        'Ext.cf.messaging.transports.WebSocketTransport'
    ],

    mixins: {
        observable: "Ext.util.Observable"
    },

    statics: {
       isSupported: function() {
            return true;
        }
    },

    transportClasses: {
           "polling": 'Ext.cf.messaging.transports.PollingTransport',
           "websocket": 'Ext.cf.messaging.transports.WebSocketTransport'
    },

    config: {
        started: false
    },

    
    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this);
        this.activeTransport = null;
        this.pollingTransport = null;
        this.socketTransport = null;
        return this;
    },

    /** 
     * Start
     *
     */
    start: function() {
        if(this.getStarted()){
            Ext.cf.util.Logger.debug("AutoTransport already started");
            return;
        }

        Ext.cf.util.Logger.debug("AutoTransport starting");

        this.setStarted(true);
        
        if(!this.pollingTransport) {
            this.pollingTransport = Ext.create(this.transportClasses["polling"], this.config);
            this.relayEvents(this.pollingTransport, ["receive", "forbidden", "connected", "offline"]);
        }
        
        this.activeTransport = this.pollingTransport;
        this.activeTransport.start();
        
        if(!this.socketTransport){
            if(Ext.cf.messaging.transports.WebSocketTransport.isSupported()) {
                
                this.socketTransport = Ext.create(this.transportClasses["websocket"], this.config);
                this.relayEvents(this.socketTransport, ["receive", "forbidden", "connected", "offline"]);
                
                this.socketTransport.on({connected: {fn: this.onSocketActive, scope: this}});
                
            } else {
                Ext.cf.util.Logger.debug("AutoTransport: websockets not supported, XHR polling only");
            }
            
        }

        this.socketTransport.start();
        
        return true;
    },
    
    
    onSocketActive: function(){
        Ext.cf.util.Logger.debug("AutoTransport: websocket connection established, switching active transport");
        this.pollingTransport.stop(); // stop polling, we have sockets!
        this.activeTransport = this.socketTransport;
    },
    

    /** 
     * Stop
     *
     */
    stop: function() {
        // turn off long polling
        this.setStarted(false);
        //this.activeTransport.stop();
        if(this.pollingTransport){
            this.pollingTransport.stop();
        }
        if(this.socketTransport){
            this.socketTransport.stop();
        }
    },


    /** 
     * Send message
     *
     * @param {Object} message
     * @param {Function} callback
     *
     */
    send: function(message, callback) {
       this.activeTransport.send(message, callback);
    },

    /** 
     * Subscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    subscribe: function(params, callback) {
        this.activeTransport.send(params, callback);
    },

    /** 
     * Unsubscribe
     *
     * @param {Object} params
     * @param {Function} callback
     *
     */
    unsubscribe: function(params, callback) {
        this.activeTransport.send(params, callback);
    }
});


/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.Transport', {
    requires: [
        'Ext.data.proxy.LocalStorage',
        'Ext.cf.messaging.EnvelopeWrapper',
        'Ext.cf.messaging.transports.PollingTransport',
        'Ext.cf.messaging.transports.WebSocketTransport',
        'Ext.cf.messaging.transports.AutoTransport',
        'Ext.cf.util.ErrorHelper',
        'Ext.cf.ServiceDefinitions',
        'Ext.cf.util.ServiceVersionHelper'
    ],
    
    mixins: {
        observable: "Ext.util.Observable"
    },

    transport: null,

    listeners: {},

    undeliveredIncomingStore: null,

    retryIncomingInProgress: false,

    undeliveredOutgoingStore: null,

    retryOutgoingInProgress: false,

    /** @private
    * Mapping of transport classes to short name
    * transportName provided by config used for transport lookup.
    */
    transportClasses: {
        "polling": 'Ext.cf.messaging.transports.PollingTransport',
        "websocket": 'Ext.cf.messaging.transports.WebSocketTransport',
        "auto": 'Ext.cf.messaging.transports.AutoTransport'
    },

    config: {
        url: 'https://api.sencha.io',
        piggybacking: true,
        maxEnvelopesPerReceive: 10,
        transportName: "auto",
        debug: false, /* pass debug flag to server in envelope */

        connected: false,

        undeliveredIncomingExpiryInterval: 60 * 60 * 24 * 1000, // 24 hours
        undeliveredIncomingMaxCount: 100, // max queue size after which we start dropping new messages

        undeliveredOutgoingExpiryInterval: 60 * 60 * 24 * 1000, // 24 hours
        undeliveredOutgoingMaxCount: 100, // max queue size after which we start dropping new messages

        waitAfterBrowserOnline: 5000 //network requests will fail if started inside online event handler.
    },

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        var self = this;

        this.initConfig(config);

        this.mixins.observable.constructor.call(this);

        this.listeners= {};

        Ext.cf.util.Logger.info("Transport type ", this.getTransportName());

        var directory= Ext.io.Io.getStoreDirectory(); 
        this.undeliveredIncomingStore = Ext.create('Ext.data.Store', {
            model: 'Ext.cf.messaging.EnvelopeWrapper',
            proxy: {
                type: 'localstorage', 
                id: 'sencha-io-undelivered-incoming-envelopes'
            },
            autoLoad: true,
            autoSync: false
        });

        this.undeliveredOutgoingStore = Ext.create('Ext.data.Store', {
            model: 'Ext.cf.messaging.EnvelopeWrapper',
            proxy: {
                type: 'localstorage', 
                id: 'sencha-io-undelivered-outgoing-envelopes'
            },
            autoLoad: true,
            autoSync: false
        });

        directory.update("sencha-io-undelivered-incoming-envelopes", "queue", { direction: "in" });
        directory.update("sencha-io-undelivered-outgoing-envelopes", "queue", { direction: "out" });

        Ext.cf.util.Logger.debug("Transport config", this.config);
        var transportName = this.getTransportName();
        var transportClassName =this.transportClasses[transportName];
        if(!transportClassName){
            Ext.cf.util.Logger.error("No transport class for " + transportName + " defaulting to 'auto' transport."); 
            transportClassName =this.transportClasses["auto"];   
        }
        
        this.transport = Ext.create(transportClassName, this.config);
        
        this.setupEventHandlersHandler();

        /* Only attempt to redeliver messages when we have a confirmed connection. */
        this.on("connected", function(){ self.retryUndeliveredOutgoingMessages();});

        this.transport.start();

        return this;
    },

    start: function(){
        if(this.transport){
            this.transport.start();
        } else {
            Ext.cf.util.Logger.error("Transport: attempted to start without a valid transport class."); 
            
        }
    },

    /** 
     * Setup transport event handlers.
     *
     */      
    setupEventHandlersHandler: function() {
        var self = this;

        this.transport.on('receive', function(envelope) { self.receive(envelope); });

        this.transport.on('offline', function(envelope) { 
            self.setConnected(false);
            self.fireEvent("offline");
         });

        window.addEventListener("offline", function (evt) {
            Ext.cf.util.Logger.warn("Browser fired offline event. Stopping connection; assuming offline", evt);
            self.setConnected(false);
            self.transport.stop();
            self.fireEvent("offline");
        }, false);

        window.addEventListener("online", function () {
            Ext.cf.util.Logger.info("Browser fired online event. Will attempt to restart connection.");
            //wait a few seconds because network requests can fail
            //if you start right away.
            setTimeout(function(){
                self.transport.start();
            }, self.getWaitAfterBrowserOnline());
        }, false);


        this.transport.on('connected', function(type) {
            self.setConnected(true);
            self.fireEvent('connected', type);
        });

        this.transport.on('forbidden', function(err) {
            if(err && err.code === 'INVALID_SID') {
                self.setConnected(false);
                self.transport.stop();
                self.fireEvent('invalidsession', err);
            }
        });
    },


    /** 
     * Retry undelivered outgoing messages
     *
     */
    retryUndeliveredOutgoingMessages: function() {
        var self = this;

        if(self.retryOutgoingInProgress) {
            Ext.cf.util.Logger.debug("Another retry (outgoing) already in progress, skipping...");
            return;
        }

        var pendingCount = this.undeliveredOutgoingStore.getCount();
        if(pendingCount > 0) {
            Ext.cf.util.Logger.debug("Transport trying redelivery for outgoing envelopes:", pendingCount);
        } else {
            return;
        }

        self.retryOutgoingInProgress = true;

        try {
            var now = new Date().getTime();
            var expiryInterval = self.getUndeliveredOutgoingExpiryInterval();

            // get the first envelope for redelivery
            var record = this.undeliveredOutgoingStore.getAt(0);
            var envelope = record.data.e;


            if(envelope.expires) {
                Ext.cf.util.Logger.debug("Transport: envelope has expires value of ", envelope.expires);
                expiryInterval = envelope.expires * 1000;
            }

            // Expiry based on age
            if((now - record.data.ts) > expiryInterval) {
                Ext.cf.util.Logger.warn("Buffered outgoing envelope is too old, discarding", record);
                this.undeliveredOutgoingStore.remove(record);
                self.undeliveredOutgoingStore.sync();
                self.retryOutgoingInProgress = false;
                setTimeout(function(){
                    self.retryUndeliveredOutgoingMessages();
                },1);
            } else {
                if(self.getConnected()) { // attempt redelivery only if transport says we're online
                    Ext.cf.util.Logger.debug("Transport trying redelivery for outgoing envelope: " + record);
                    self.transport.send(envelope, function(err, doBuffering) {
                        if(doBuffering) {
                            // could not be delivered again, do nothing
                            Ext.cf.util.Logger.debug("Redelivery failed for outgoing envelope, keeping it queued", record, err);

                            self.retryOutgoingInProgress = false;
                        } else {
                            // sent to server, now remove it from the queue
                            Ext.cf.util.Logger.debug("Transport: Delivered outgoing envelope on retry", record);
                            self.undeliveredOutgoingStore.remove(record);
                            self.undeliveredOutgoingStore.sync();
                            self.retryOutgoingInProgress = false;
                            if(self.undeliveredOutgoingStore.getCount() > 0){
                                Ext.cf.util.Logger.debug("Transport: there are outgoing messages left to deliver:", self.undeliveredOutgoingStore.getCount());
                                setTimeout(function(){
                                    self.retryUndeliveredOutgoingMessages();
                                },1);
                            } else {
                                Ext.cf.util.Logger.debug("Transport: All queued outgoing messages delivered ");
                            }
                        }
                    });
                } else {
                    Ext.cf.util.Logger.debug("Browser still offline, not retrying delivery for outgoing envelope", record);  
                    self.retryOutgoingInProgress = false;
                }
            }
        } catch(e) {
            // if an exception occurs, ensure retryOutgoingInProgress is false
            // otherwise future retries will be skipped!
            self.retryOutgoingInProgress = false;

            Ext.cf.util.Logger.debug("Error during retryUndeliveredOutgoingMessages", e);
        }
    },

    /** 
     * Retry undelivered incoming messages
     *
     */
    retryUndeliveredIncomingMessages: function() {
        var self = this;

        if(self.retryIncomingInProgress) {
            Ext.cf.util.Logger.debug("Another retry (incoming) already in progress, skipping...");
            return;
        }

        self.retryIncomingInProgress = true;
        try {
            var now = new Date().getTime();
            var expiryInterval = self.getUndeliveredIncomingExpiryInterval();

            var undelivered = this.undeliveredIncomingStore.getRange();
            if(undelivered.length > 0) {
                Ext.cf.util.Logger.debug("Transport trying redelivery for incoming envelopes:", undelivered.length);
            }

            for(var i = 0; i < undelivered.length; i++) {
                var record = undelivered[i];
                var envelope = record.data.e;

                var map = this.listeners[envelope.service];

                if(map) {
                    map.listener.call(map.scope, envelope);
                    Ext.cf.util.Logger.debug("Delivered incoming envelope on retry", record);
                    this.undeliveredIncomingStore.remove(record);
                } else {
                    // Still can't deliver the message... see if the message is eligible for expiry
                    
                    // Expiry based on age
                    if((now - record.data.ts) > expiryInterval) {
                        Ext.cf.util.Logger.warn("Buffered incoming envelope is too old, discarding", record);
                        this.undeliveredIncomingStore.remove(record);
                    }
                }
            }
        } finally {
            // even if an exception occurs, sync the store and ensure retryIncomingInProgress is false
            // otherwise future retries will be skipped!
            this.undeliveredIncomingStore.sync();
            self.retryIncomingInProgress = false;
        }
    },

    /** 
     * Get Developer sid
     *
     * @return {String/Number} Developer Sid
     *
     */
    getDeveloperSid: function() {
        return Ext.io.Io.getIdStore().getSid('developer');
    },

    /** 
     * Get Device sid
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceSid: function() {
        return Ext.io.Io.getIdStore().getSid('device');
    },

    /** 
     * Get user sid
     *
     * @return {String/Number} User Sid
     *
     */
    getUserSid: function() {
        return Ext.io.Io.getIdStore().getSid('user');
    },

    /** 
     * Get Device id
     *
     * @return {String/Number} Device Sid
     *
     */
    getDeviceId: function() {
        return Ext.io.Io.getIdStore().getId('device');
    },

    /** 
     * Set listener
     *
     * @param {String} serviceName
     * @param {Object} listener
     * @param {Object} scope
     *
     */
    setListener: function(serviceName, listener, scope) {
        Ext.cf.util.Logger.debug("Transport Adding listener for service", serviceName);
        this.listeners[serviceName] = {listener:listener, scope:scope};
        //New listener registered, check to see if there are any queued messages
        //for them.
        var self = this;
        setTimeout(function(){
            self.retryUndeliveredIncomingMessages();
        },1);
        
    },

    /** 
     * Remove listener
     *
     * @param {String} serviceName
     *
     */
    removeListener: function(serviceName) {
        delete this.listeners[serviceName];
    },

    /** 
     * Send to service
     *
     * @param {String} serviceName
     * @param {Object} payload
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sendToService: function(serviceName, payload, callbackFunction, scope) {
        this.send({service: serviceName, msg: payload}, callbackFunction, scope);
    },

    /** 
     * Send to client
     *
     * @param {String/Number} targetClientId
     * @param {Object} payload
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sendToClient: function(targetClientId, payload, expires, callbackFunction, scope) {
        if(payload && typeof(payload) === "object") {
            payload.to = targetClientId;
            this.send({service: "CourierService", msg: payload, expires: expires}, callbackFunction, scope);
        } else {
            Ext.cf.util.Logger.error("Message is not a JSON object");
            callbackFunction.call(scope, Ext.cf.util.ErrorHelper.get('MESSAGE_NOT_JSON', payload));
        }
    },

    /** 
     * Send
     *
     * @param {Object} envelope
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    send: function(envelope, callbackFunction, scope) {
        var self = this;

        Ext.cf.util.ServiceVersionHelper.get(envelope.service, function(sv) {
            // service version
            envelope.sv = sv;

            if(self.getDebug()) {
                envelope.debug = true;
            }

            envelope.from = self.getDeviceId();

            // pass deviceSid if available
            var deviceSid = self.getDeviceSid();
            if(deviceSid) {
                envelope.deviceSid = deviceSid;  
            }

            // pass developerSid if available
            var developerSid = self.getDeveloperSid();
            if(developerSid) {
                envelope.developerSid = developerSid;  
            }
            
            // pass userSid if available
            var userSid = self.getUserSid();
            if(userSid) {
                envelope.userSid = userSid;  
            }
            
            Ext.cf.util.Logger.debug("Transport.send " + JSON.stringify(envelope));

            if(self.getConnected()) {
                self.transport.send(envelope, function(err, doBuffering) {
                    if(callbackFunction) {
                        if(!doBuffering) {
                            callbackFunction.call(scope, err);    
                        }

                        if(err && doBuffering) {
                            // could not send outgoing envelope. Buffer it!
                            Ext.cf.util.Logger.warn("Error delivering outgoing envelope", envelope, err);
                            self.bufferOutgoingEnvelope(envelope);
                        }
                    }
                });
            } else {
                self.bufferOutgoingEnvelope(envelope);
            }
        });
    },

    /** 
     * Buffer outgoing envelope
     *
     * @param {Object} envelope
     *
     */
    bufferOutgoingEnvelope: function(envelope) {
        if(this.undeliveredOutgoingStore) {

            if(envelope.expires == 0){
                Ext.cf.util.Logger.debug("Dropping undelivered message with an expiry of zero.", envelope);
                return;
            }

            if(this.undeliveredOutgoingStore.getCount() < this.getUndeliveredOutgoingMaxCount()) {
                var record = this.undeliveredOutgoingStore.add(Ext.create('Ext.cf.messaging.EnvelopeWrapper', {e: envelope, ts: (new Date().getTime())}));
                this.undeliveredOutgoingStore.sync();
                Ext.cf.util.Logger.debug("Added to outgoing queue, will retry delivery later", record);
            } else {
                // queue is full, start dropping messages now
                Ext.cf.util.Logger.warn("Queue full, discarding undeliverable outgoing message!", envelope);
            }
        }
    },

    /** 
     * Receive
     *
     * @param {Object} envelope
     *
     */
    receive: function(envelope) {
        Ext.cf.util.Logger.debug("Transport.receive " + JSON.stringify(envelope));

        // Check 1: Is the service known?
        // Check 2: Is the service version the same as in CF?
        var expected = Ext.cf.ServiceDefinitions[envelope.service];
        if(!expected) {
            Ext.cf.util.Logger.error("Unknown service", envelope.service, ". Envelope discarded", envelope);
        } else if(expected !== envelope.sv) {
            Ext.cf.util.Logger.error("Expected service", envelope.service, "version", expected, ", actual ", envelope.sv, ". Envelope discarded", envelope);
        } else {
            // dispatch it to the correct service listener
            if(this.listeners[envelope.service]) {
                var map = this.listeners[envelope.service];
                map.listener.call(map.scope, envelope);
            } else {
                Ext.cf.util.Logger.error("Transport.receive no listener for service '",envelope.service,"'.",this.listeners);

                // check current length of queue
                if(this.undeliveredIncomingStore) {
                    if(this.undeliveredIncomingStore.getCount() < this.getUndeliveredIncomingMaxCount()) {
                        // add it to the undelivered store for trying delivery later
                        var record = this.undeliveredIncomingStore.add(Ext.create('Ext.cf.messaging.EnvelopeWrapper', {e: envelope, ts: (new Date().getTime())}));
                        Ext.cf.util.Logger.debug("Added to incoming queue, will retry delivery later", record);
                        
                        this.undeliveredIncomingStore.sync();      
                    } else {
                        // queue is full, start dropping messages now
                        Ext.cf.util.Logger.warn("Queue full, discarding undeliverable incoming message!", envelope);
                    }
                }
            }
        }
    },

    /** 
     * Subscribe
     *
     * @param {String} serviceName
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    subscribe: function(serviceName, callbackFunction, scope) {
        var self = this;

        Ext.cf.util.Logger.debug("Transport.subscribe " + serviceName);

        Ext.cf.util.ServiceVersionHelper.get(serviceName, function(sv) {
            var params = { 
                deviceId: self.getDeviceId(), 
                service: serviceName,
                sv: sv
            };

            self.transport.subscribe(params, function(err) {
                if(callbackFunction){
                    callbackFunction.call(scope, err);
                }
            });
        });
    },

    /** 
     * Unsubscribe
     *
     * @param {String} serviceName
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    unsubscribe: function(serviceName, callbackFunction, scope) {
        var self = this;

        Ext.cf.util.Logger.debug("Transport.unsubscribe " + serviceName);

        Ext.cf.util.ServiceVersionHelper.get(serviceName, function(sv) {
            var params = { 
                deviceId: self.getDeviceId(), 
                service: serviceName,
                sv: sv
            };

            self.transport.unsubscribe(params, function(err) {
                if(callbackFunction){
                    callbackFunction.call(scope, err);
                }
            });
        });
    }
});

/**
 * @private
 *
 * Remote Procedure Call
 *
 */
Ext.define('Ext.cf.messaging.Rpc', {
    
    requires: ['Ext.cf.util.Logger', 'Ext.cf.util.ErrorHelper'],

    config: {
        /**
         * @cfg transport
         * @accessor
         */
        transport: null,
        /**
         * @cfg rpcTimeoutDuration
         * @accessor
         */
        rpcTimeoutDuration: 5 * 60 * 1000, // 5 minutes
        /**
         * @cfg rpcTimeoutCheckInterval
         * @accessor
         */        
        rpcTimeoutCheckInterval: 30 * 1000 // check for timeouts every 30 sec
    },

    /**
     * @private
     */
    rpcTimeoutInterval: null,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);

        var transport = this.getTransport();

        transport.on({
            connected: this.handleOnline,
            offline: this.handleOffline,
            scope: this
        });
        this.lastCheck = new Date().getTime();
        this.callCount = 0;

        this.callMap = {};
    
        return this;
    },

    /**
    *@private
    */
    handleOnline: function() {
        this.setNextCheck();
    },


    /**
    *@private
    */
    handleOffline: function() {
        this.cancelNextCheck();
    },

    /**
    *@private
    */
    setNextCheck: function(){
        var self = this;

        Ext.cf.util.Logger.debug("Outstanding RPC requests", this.callCount);

        this.cancelNextCheck();    
            
        if(this.callCount <= 0) {
            return;
        };

        this.rpcTimeout = setTimeout(function() {
                    self.processRpcTimeouts();
        }, this.getRpcTimeoutCheckInterval());

        
    },

    
    /**
    *@private
    */
    cancelNextCheck: function(){
        if(this.rpcTimeout){
            clearTimeout(this.rpcTimeout);
            this.rpcTimeout = undefined;
        }
    },

    /**
    *@private
    */
    removeCall: function(id){
        delete this.callMap[id];
        this.callCount--;
        this.setNextCheck();
    },

    /**
     * Process Rpc timeouts
     *
     */
    processRpcTimeouts: function() {
        var self = this;
        var lastCheck = this.lastCheck;
        var offset = 0;
        var currentTime = new Date().getTime();


        if(this.getTransport().getConnected() != true){
           return;
        }

    
        Ext.cf.util.Logger.debug("Checking for expired PRC calls.");
        
        if(lastCheck + (this.getRpcTimeoutCheckInterval() * 2) < currentTime  ) {
            //We haven't checked in a while probably because we were offline.
            // we need to update the offsets of the RPC requests before doing the time diff.
            // using rpcTimeoutDuration * 2 to account for any minor timing differences in
            // set timeout. 
            offset = currentTime - lastCheck;
        }

        var rpcTimeoutDuration = this.getRpcTimeoutDuration();


       
        this.lastCheck = currentTime;
        var toRemove = [];

        try {
            for(var corrId in this.callMap) {
                var map = this.callMap[corrId];
                if(offset > 0){
                    map.requestTime += offset;
                }
                if(map && map.requestTime && ((currentTime - map.requestTime) > rpcTimeoutDuration)) {
                    toRemove.push(corrId);
                }
            }

            // remove the timed out corrIds, and return a timeout error to the callers
            toRemove.forEach(function(corrId) {
                var map = self.callMap[corrId];
                if(map && map.callback) {
                    self.removeCall(corrId);

                    Ext.cf.util.Logger.warn("RPC request has timed out as there was no reply from the server. Correlation Id:", corrId, map.service, map.method);
                    Ext.cf.util.Logger.warn("See documentation for Ext.io.Io.setup (rpcTimeoutDuration, rpcTimeoutCheckInterval) to configure the timeout check");

                    var err = Ext.cf.util.ErrorHelper.get('RPC_TIMEOUT', corrId);
                    map.callback({ status:"error", error: err });
                }
            });
        } catch(e) {
            Ext.cf.util.Logger.error("Error running RPC timeout checks", e);
        }
        this.setNextCheck();

        
    },


    /** 
     * @private
     *
     */
    currentCallId: 0,

    /** 
     * Generate call id
     *
     */
    generateCallId: function() {
        return ++this.currentCallId;
    },


    /** 
     * Subscribe
     *
     * @param {Object} envelope
     *
     */
    subscribe: function(envelope) {
        // got a response envelope, now handle it
        this.callback(envelope.msg["corr-id"], envelope);
    },


    addCall: function(envelope,callback){

        var corrId = this.generateCallId();

        envelope.msg["corr-id"] = corrId;
        envelope.from = this.getTransport().getDeviceId();


        this.callMap[corrId] = { callback: callback,
            requestTime: (new Date().getTime()),
            service: envelope.service,
            method: envelope.msg.method };

        this.callCount++;

        this.setNextCheck();
        return corrId;

    },

    /** 
     * Dispatch
     *
     * @param {Object} envelope
     * @param {Function} callback
     *
     */
    dispatch: function(envelope, callback) {
        var self = this;

        var corrId = this.addCall(envelope, callback);

        // send the envelope
        this.getTransport().send(envelope, function(err) {
            if(err) { // couldn't even send the envelope
                self.callMap[corrId].callback({ status:"error", error: err });
                self.removeCall(corrId);
            }
        }, this);
    },

    /** 
     * Callback
     *
     * @param {Number} correlation id
     * @param {Object} envelope
     *
     */
    callback: function(corrId, envelope) {
        var id = parseInt(corrId, 10);
        if (!this.callMap[id]) {
            Ext.cf.util.Logger.warn("No callback found for this correspondance id: " + corrId, envelope);
        } else {
            var map = this.callMap[id];
            var currentTime = new Date().getTime();
            var clientTime = currentTime - map.requestTime;
            var serverTime = envelope.debug === true ? (envelope.debugInfo.outTime - envelope.debugInfo.inTime) : 'NA';
            var networkTime = (serverTime === "NA") ? "NA" : (clientTime - serverTime);
            var apiName = envelope.service + "." + map.method;
            Ext.cf.util.Logger.perf(corrId, apiName, "total time", clientTime, 
                "server time", serverTime, "network time", networkTime);

            if(envelope.msg.result.status !== "success") {
                if(!Ext.cf.util.ErrorHelper.isValidError(envelope.msg.result.error)) {
                    Ext.cf.util.Logger.debug('RPC error is of incorrect format:', envelope.msg.result.error);
                    var err = Ext.cf.util.ErrorHelper.get('UNKNOWN_RPC_ERROR');
                    err.details = envelope.msg.result.error;
                    envelope.msg.result.error = err;
                }
            }

            this.removeCall(id);

            map.callback(envelope.msg.result);

        }
    },

    /** 
     * Call
     *
     * @param {Function} callback
     * @param {String} serviceName
     * @param {String} style
     * @param {String} method
     * @param {Array} args
     *
     */
    call: function(callback, serviceName, style, method, args) {

        var envelope;

        // register for serviceName receive calls (subscriber rpc)
        this.getTransport().setListener(serviceName, this.subscribe, this);

        switch(style) {
            case "subscriber":
                envelope = {service: serviceName, from: this.getTransport().getDeviceId(), msg: {method: method, args: args}};
                this.dispatch(envelope, callback);
                break;
            default:
                Ext.cf.util.Logger.error(style + " is an invalid RPC style");
                throw "Invalid RPC style: " + style;
        }
    }

});


/**
 * @private
 *
 * Publish/Subscribe Messaging
 *
 */
Ext.define('Ext.cf.messaging.PubSub', {
    
    config: {
        /**
         * @cfg transport
         * @accessor
         */
        transport: undefined
    },

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        return this;
    },

    /**
     * @private
     */
    channelCallbackMap: {},

    /** 
     * Handle incoming envelope
     *
     * @param {Object} envelope
     *
     */
    handleIncoming: function(envelope) {
        var channelName = envelope.msg.queue;
        if(channelName && this.channelCallbackMap[channelName]) {
            var item = this.channelCallbackMap[channelName];
            var sender = {
              deviceId: envelope.from,
              userId: envelope.userId,
              developerId: envelope.developerId
            };
            item.callback.call(item.scope,sender,envelope.msg.data);
        } else {
            Ext.cf.util.Logger.warn("PubSub: No callback for channelName " + channelName);
        }
    },

    /** 
     * Publish
     *
     * @param {String} channelName
     * @param {String} qKey
     * @param {Object} data
     * @param {number} expires
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    publish: function(channelName, qKey, data, expires, callback, scope) {
        this.getTransport().send(
            {service:"ChannelService", expires: expires, msg:{api:"publish", queue:channelName, qKey: qKey, data:data}
        }, callback, scope);
    },

    /** 
     * Subscribe
     *
     * @param {String} channelName
     * @param {String} qKey
     * @param {Function} callback
     * @param {Object} scope
     * @param {Function} errCallback
     *
     */
    subscribe: function(channelName, qKey, callback, scope, errCallback) {
        this.getTransport().setListener("ChannelService", this.handleIncoming, this);
        // setting the callback before we are officially subscribed, just in case the server sends us messages on a channel
        // before we get the ACK back from the server.
        //TODO only one 'channel' can have the callback.  this should really just emit events.
        this.channelCallbackMap[channelName] = {callback:callback,scope:scope}; 
        this.getTransport().send(
            {service:"ChannelService", msg:{api:"subscribe", queue:channelName, qKey: qKey}
        }, function(err) {
            if(err) {
                Ext.cf.util.Logger.error("Error subscribing to channel", channelName, err);
                if (errCallback) {
                    errCallback.call(scope, err);
                }
            } else {
                Ext.cf.util.Logger.info("channel: " + this.getTransport().getDeviceId() + " subscribed to " + channelName);
            }
        }, this);
    },

    /** 
     * Unsubscribe
     *
     * @param {String} channelName
     * @param {String} qKey
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    unsubscribe: function(channelName, qKey, callback, scope) {
        delete this.channelCallbackMap[channelName];
        this.getTransport().send(
            {service:"ChannelService", msg:{api:"unsubscribe", queue:channelName, qKey:qKey}
        }, function(err) {
            Ext.cf.util.Logger.info("channel: " + this.getTransport().getDeviceId() + " unsubscribed to " + channelName);
            if(callback){
                callback.call(scope, err);
            }
        }, this);
    }
});


/**
 * @private
 * Instances of {@link Ext.io.MessagingProxy} represent proxy object to async message based services running in the backend.
 * You can use the proxy to send async messages to the service, to receive async messages from the service,
 * and if the service is a PubSub type of service, to subscribe/unsubscribe to updates from the service.
 *
 * For example:
 *
 *     Ext.io.getService("weather", function(weatherService) {
 *         weatherService.send({temperature: temperature}, function() {
 *             display("Weather Sensor: sent temperature update " + temperature);
 *         }, this);
 *     });
 *
 *
 *     Ext.io.getService("weather", function(weatherService) {
 *         weatherService.subscribe(function(service, msg) {
 *             display(service + " got temperature update: " + msg.temperature);
 *         }, this, function(err) {
 *             console.log("Error during subscribe!");
 *         });
 *     });
 *
 */
Ext.define('Ext.io.MessagingProxy', {

    config: {
        /**
         * @cfg name
         * @accessor
         */
        name: null,

        /**
         * @cfg descriptor
         * @accessor
         * @private
         */
        descriptor: null,

        /**
         * @cfg transport
         * @accessor
         * @private
         */
        transport: null
    },

    /**
     * @private
     *
     * Constructor
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        return this;
    },

    /**
     * Send an async message to the service
     *
     * @param {Object} options An object which may contain the following properties:
     *
     * @param {Object} options.message A simple Javascript object.
     *
     * @param {Function} callback The function to be called after sending the message to the server for delivery.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    send: function(options,callback,scope) {
        this.getTransport().sendToService(this.getName(), options.message, callback, scope);
    },

    /**
     * Receive async messages from the service
     *
     * For PubSub type of services, which need subscription to start getting messages, see the 'subscribe' method.
     *
     * @param {Function} callback The function to be called after receiving a message from this service.
     * @param {String} callback.from the service the message originated from, i.e. the name of this service.
     * @param {Object} callback.message A simple Javascript object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    receive: function(callback,scope) {
        this.getTransport().setListener(this.getName(), function(envelope) {
            callback.call(scope,envelope.from,envelope.msg);
        }, this);
    },

    /**
     * Subscribe to receive messages from this service.
     *
     * This method must be used only for PubSub type of services.
     * Some services do not need subscription for delivering messages. Use 'receive' to get messages
     * from such services.
     *
     * @param {Function} callback The function to be called after receiving a message from this service.
     * @param {String} callback.from the service the message originated from, i.e. the name of this service.
     * @param {Object} callback.message A simple Javascript object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    subscribe: function(callback,scope) {
        var self = this;
        self.getTransport().subscribe(self.getName(), function(err) {
            if(err) {
                callback.call(scope,err);
            } else {
                self.getTransport().setListener(self.getName(), function(envelope) {
                    callback.call(scope,envelope.service,envelope.msg);
                }, self);
            }
        }, self);
    },

    /**
     * Unsubscribe from receiving messages from this service.
     *
     * This method must be used only for PubSub type of services.
     */
    unsubscribe: function(callback, scope) {
        this.getTransport().unsubscribe(this.getName(), callback, scope);
    }
});

/**
 * @private
 *
 */
Ext.define('Ext.cf.messaging.Messaging', {
    requires: [
        'Ext.cf.messaging.Registry',
        'Ext.cf.messaging.Transport',
        'Ext.cf.messaging.Rpc',
        'Ext.cf.messaging.PubSub',
        'Ext.io.Proxy', 
        'Ext.io.MessagingProxy',
        'Ext.cf.util.ErrorHelper'],


    /**
     * @private
     *
     */    
    transport: null,

    /**
     * @private
     *
     */
    rpc: null,

    /**
     * @private
     *
     */
    pubsub: null,

    /** 
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        /* 
         * Instantiate the registry service proxy.
         */
        this.registry = Ext.create('Ext.io.Registry');
        this.transport = Ext.create('Ext.cf.messaging.Transport', config);
        config.transport= this.transport;
        this.rpc = Ext.create('Ext.cf.messaging.Rpc', config);
        this.pubsub = Ext.create('Ext.cf.messaging.PubSub', config);

        return this;
    },

    /**
     * @private
     *
     */
    proxyCache : {},

    /** 
     * Get service
     *
     * @param {Object} options
     * @param {String} options.name
     * @param {Function} callback
     * @param {Object} scope
     */
    getService: function(options,callback,scope) {
        var self = this;
        if(!options.name || options.name === "") {
            Ext.cf.util.Logger.error("Service name is missing");
            var errResponse = Ext.cf.util.ErrorHelper.get('SERVICE_NAME_MISSING');
            callback.call(scope,undefined,errResponse);
        } else {
            var service = this.proxyCache[options.name];
            if(service) {
                callback.call(scope,service);
            } else {
                self.registry.getServiceDescriptor(options.name, function(serviceDescriptor, err) {
                    if(err || typeof(serviceDescriptor) === "undefined" || serviceDescriptor === null) {
                        Ext.cf.util.Logger.error("Unable to load service descriptor for " + options.name);
                        var errResponse = Ext.cf.util.ErrorHelper.get('SERVICE_DESCRIPTOR_LOAD_ERROR', options.name);
                        errResponse.cause = err;
                        callback.call(scope,undefined,errResponse);
                    } else {
                        if(serviceDescriptor.kind == "rpc") {
                            service = Ext.create('Ext.io.Proxy', {name:options.name, descriptor:serviceDescriptor, rpc:self.rpc});
                        } else {
                            service = Ext.create('Ext.io.MessagingProxy', {name:options.name, descriptor:serviceDescriptor, transport:self.transport});
                        }
                        self.proxyCache[options.name] = service;
                        callback.call(scope,service);
                    }
                });
            }
        }
    },

    //options.params.file - it should be a handler for file, for example for client side:
    //document.getElementById("the-file").files[0];
    /** 
     * Send content
     *
     * @param {Object} options
     * @param {String} options.name
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sendContent: function(options,callback,scope) {
        var self  = this;
        var url   = self.config.csUrl || self.config.url || 'https://api.sencha.io';
        if( !options.file ||
            !options.file.name || 
            options.file.name === "" || 
            !options.file.file || 
            !options.file.ftype ||
            !options.containerid) {
            var errResponse = { code: 'PARAMS_MISSING', message: 'Some of parameters are missing' };
            callback.call(scope, null, errResponse);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    var parseResult = function(str) {
                        var res;
                        try {
                            res = JSON.parse(str);
                        } catch (e) {
                            return str;
                        }
                        return res;
                    };
                    var result = parseResult(xhr.responseText);
                    if (result.code == 200) {
                        callback.call(scope, result.reference);
                    } else {
                        var errResponse = { code: 'STORE_ERROR', message: result.message };
                        callback.call(scope, null, errResponse);
                    }
                }
            };
            xhr.open('POST', url + '/sio/content/' + options.containerid + '/' + options.file.ftype + '/', true);
            xhr.setRequestHeader("X-File-Name", encodeURIComponent(options.file.name));
            xhr.setRequestHeader("Content-Type", "application/octet-stream; charset=binary");
            //xhr.overrideMimeType('application/octet-stream; charset=x-user-defined-binary');
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("Content-Encoding", "binary");
            xhr.setRequestHeader("X-Resource-Type", options.file.ftype);
            xhr.setRequestHeader("X-Resource-Id", options.containerid);
            xhr.setRequestHeader("X-Auth-Token", Ext.io.Io.getIdStore().getSid("developer"));

            xhr.send(options.file.file);
        }
    }
});


/**
 * @private
 *
 */
Ext.define('Ext.cf.naming.LocalStore', {
    /**
    * Get item
    *
    * @param {String/Number} key
    *
    */
    getItem: function(key) {
        var store= window.localStorage;
        if (store) {
            var value = store.getItem(key);
            if(value === "null") {
                return null;
            } else if(value === "undefined") {
                return undefined;
            } else {
                return value;
            }
        }
    },

    /**
    * Set item
    *
    * @param {String/Number} key
    * @param {String/Number} value
    *
    */
    setItem: function(key,value) {
        var store= window.localStorage;
        if (store) {
            store.setItem(key,value);
        }
    },

    /**
    * Remove item
    *
    * @param {String/Number} key
    *
    */
    removeItem: function(key) {
        var store= window.localStorage;
        if (store) {
            store.removeItem(key);
        }
    }
});

/**
 *  Stores the config for Naming service objects locally.
 *
 *  Config is stored in JS memory for fast access and 
 *  on a browser's local storage system for long term access.
 *
 * @private
 *
 */
 Ext.define('Ext.cf.naming.ConfigStore', {
    requires: [
        'Ext.cf.naming.LocalStore'
    ],

    config: {
        localStore: null
    },
    
    memCache: {},

    /**
     * Constructor
     */
    constructor: function(){
        this.setLocalStore(Ext.create('Ext.cf.naming.LocalStore'));
    },
    
    
    getStoreKey: function(key){
        if(key.join){
            key = key.join("-");
        }
        return 'sencha-io-config-'+key;
    },
    
    /**
     * Get the config for the current object of a class.
     *
     * @param {String} klass
     *
     */
    getObjectConfig: function(key) {
        key = this.getStoreKey(key);
        var config = this.memCache[key];
        if(!config){
            config = this.getLocalStore().getItem(key);
            if(config) {
                config = JSON.parse(config);    
            }
            this.memCache[key] = config;
        }
        return config;
    },
    
    /**
     * Set the config for the current object of a class.
     *
     * @param {String} klass
     *
     */
    setObjectConfig: function(key, config) {
        key = this.getStoreKey(key);
        this.memCache[key] = config;
        config = JSON.stringify(config);
        this.getLocalStore().setItem(key,config);
    },
    
    remove: function(key){
        key = this.getStoreKey(key);
        delete this.memCache[key];
        this.getLocalStore().removeItem(key);
    }
    
});

/**
 * @private
 *
 * Cookie class to read a key from cookie
 * https://developer.mozilla.org/en/DOM/document.cookie
 */
Ext.define('Ext.cf.naming.CookieStore', {
    /**
     * Has cookie item?
     *
     * @param {String} sKey
     *
     * @return {Boolean} True/False
     *
     */
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },

    /**
     * Get cookie item
     *
     * @param {String} sKey
     *
     * @return {String} Cookie value
     *
     */
    getItem: function (sKey) {
        if (!sKey || !this.hasItem(sKey)) { return null; }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },

    /**
     * Set cookie item
     *
     * @param {String} sKey
     * @param {String} sValue
     *
     */
    setItem: function (sKey, sValue, expiry) {
        var exp  = "";
        if(expiry && expiry > 0){
            var d = new Date();
            d.setTime(d.getTime() + expiry*24*60*60*1000);
            exp = " expires=" + d.toUTCString() + ";";
        }
        document.cookie= escape(sKey)+'='+escape(sValue) + "; path=/;" + exp;

        var count = this.countSubStrings(document.cookie, sKey);
        if(count > 1) {
            Ext.cf.util.Logger.error("Found", count, "cookies with the name", sKey);
        }
    },

    /**
     * @private
     * Count no. of substrings in a string
     *
     * @param {String} string
     * @param {String} substring
     *
     */
    countSubStrings: function(string, substring){
        var n = 0;
        var index = 0;

        while(true) {
            index = string.indexOf(substring, index);
            if(index != -1) {
                n++; 
                index += substring.length;
            } else {
                break;
            }
        }

        return n;
    },

    /**
     * Remove cookie item
     *
     * @param {String} sKey
     * @param {String} domain
     *
     */
    removeItem: function (sKey, domain) {
        domain = domain || window.location.host || '';

        if (!sKey || !this.hasItem(sKey)) { return; }  
        var oExpDate = new Date();  
        oExpDate.setDate(oExpDate.getDate() - 1);  

        // remove cookie without path
        document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + ";";  
        
        // remove cookie with path but without domain
        document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/;";  

        // remove cookie set with path, domain
        document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/;" + "domain=" + domain + ";";  
        
        var indexOfDot = domain.indexOf(".");
        if(indexOfDot != -1) {
            // remove cookie from base domain too (cleans cross-domain cookies)
            domain = domain.substr(indexOfDot);

            // remove cookie without path
            document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; " + "domain=" + domain + ";";    

            // remove cookie with path
            document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/;" + "domain=" + domain + ";";    
        }        
    }
});


/**
 * @private
 *
 */
Ext.define('Ext.cf.naming.SessionStore', {
    /**
    * Get item
    *
    * @param {String/Number} key
    *
    */
    getItem: function(key) {
        var store= window.sessionStorage;
        if (store) {
            return store.getItem(key);
        }
    },

    /**
    * Set item
    *
    * @param {String/Number} key
    * @param {String/Number} value
    *
    */
    setItem: function(key,value) {
        var store= window.sessionStorage;
        if (store) {
            store.setItem(key,value);
        }
    },

    /**
    * Remove item
    *
    * @param {String/Number} key
    *
    */
    removeItem: function(key) {
        var store= window.sessionStorage;
        if (store) {
            store.removeItem(key);
        }
    }
});

/**
 * @private
 *
 */
 Ext.define('Ext.cf.naming.IDStore', {
    requires: [
        'Ext.cf.naming.CookieStore',
        'Ext.cf.naming.LocalStore',
        'Ext.cf.naming.SessionStore'
    ],

    config: {
        cookieStore: null,
        localStore: null,
        sessionStore: null,
        sessionExpiry: 0,
        prefix: 'sencha.io.'
    },

    /**
     * Constructor
     */
    constructor: function(config){
        this.sidCache = {};
        
        this.initConfig(config);
        this.setCookieStore(Ext.create('Ext.cf.naming.CookieStore'));
        this.setLocalStore(Ext.create('Ext.cf.naming.LocalStore'));
        this.setSessionStore(Ext.create('Ext.cf.naming.SessionStore'));
    },

    /**
     * Get the id for the current object of a class.
     *
     * @param {String} klass
     *
     */
    getId: function(klass) {
        var store_key= this.getPrefix()+klass+'.id';
        return this.getLocalStore().getItem(store_key);
    },

    /**
     * Get the key for the current object of a class.
     *
     * @param {String} klass
     *
     */
    getKey: function(klass) {
        var store_key= this.getPrefix()+klass+'.key';
        return this.getLocalStore().getItem(store_key);
    },

    /**
     * Get the session id for the current object of a class.
     *
     * @param {String} klass
     *
     */
    getSid: function(klass) {
        var cookie_key = klass+'.sid';
        var val = this.sidCache[cookie_key];
        if(!val){
            val = this.getCookieStore().getItem(cookie_key);
            if(!val){
                // we we don't find the cookie then set the local store.
                val = this.getLocalStore().getItem(this.getPrefix()+cookie_key);
            } else {
                // update local store with latest id.
                this.getLocalStore().setItem(this.getPrefix()+cookie_key,val);
            }
            this.sidCache[cookie_key] = val;
        } 
        return val;
    },

    /**
     * Set the id for the current object of a class.
     *
     * @param {String} klass
     * @param {Number/String} id
     *
     */
    setId: function(klass,id) {
        var store_key= this.getPrefix()+klass+'.id';
        return this.getLocalStore().setItem(store_key,id);
    },

    /**
     * Set the key for the current object of a class.
     *
     * @param {String} klass
     * @param {Number/String} key
     *
     */
    setKey: function(klass,key) {
        var store_key= this.getPrefix()+klass+'.key';
        return this.getLocalStore().setItem(store_key,key);
    },

    /**
     * Set the session id for the current object of a class.
     *
     * @param {String} klass
     * @param {Number/String} sid
     * @param {Number} optional expiry in days. defaults to zero (session)
     */
    setSid: function(klass,sid, expiry) {
        var cookie_key = klass+'.sid';
        expiry = expiry ? expiry : this.getSessionExpiry();
        this.sidCache[cookie_key] = sid;
        this.getLocalStore().setItem(this.getPrefix()+cookie_key,sid);// keep all session ids in local storage too.
        this.getCookieStore().setItem(cookie_key,sid, expiry);
    },

    /**
     * Remove
     *
     * @param {String} klass
     * @param {String} thing
     *
     */
    remove: function(klass,thing) {
        var cookie_key = klass+'.'+thing;
        var store_key= this.getPrefix()+cookie_key;
        this.sidCache[cookie_key] = undefined;
        this.getCookieStore().removeItem(cookie_key);
        this.getSessionStore().removeItem(cookie_key);
        this.getLocalStore().removeItem(store_key);            
    },

    /**
     * Stash
     *
     * @param {String} klass
     * @param {String} thing
     * @param {String/Number} default_value
     *
     */
    stash: function(klass,thing,default_value) {
        var cookie_key = klass+'.'+thing;
        var store_key= this.getPrefix()+cookie_key;
        var id_in_cookie = this.getCookieStore().getItem(cookie_key) || default_value;
        var id_in_store = this.getLocalStore().getItem(store_key);
        if (id_in_cookie) {
            if (id_in_store) {
                // it's in the cookie, and in the store...
                if (id_in_cookie!=id_in_store) {
                    // ...but it isn't the same, this shouldn't happen. Fix it.
                    this.getLocalStore().setItem(store_key,id_in_cookie);
                } else {
                    // ...and they are the same.
                }
            } else {
                // it's in the cookie, but not in the store.
                this.getLocalStore().setItem(store_key,id_in_cookie);
            }
        } else {
            
        }
        return id_in_cookie || id_in_store;
    }

});




/**
 * @private
 *
 * An Object... but a special one.
 * 
 */

Ext.define('Ext.io.Object', {

    mixins: {
        observable: "Ext.util.Observable" //using util instead of mixin for EXT 4 compatibility. 
    },

    /**
    * @event updated
    * Fired when the user receives a message.
    * This event is fired for both local updates (after calls to object.update(...))
    * and when the server sends object updates.
    *  
    * To get remote updates call {Ext.io.Object.watch} first.
    *
    * @param {Object} updated the fields that have changed in this update. 
    * @param {boolean} remote update. true if update was triggered remotely. 
    */
    


    inheritableStatics: {

        /**
         * @private
         * Get a specific Object.
         *
         * @param {Object} messaging
         * @param {String} key
         *
         * @param {Function} callback The function to be called after getting the object.
         * @param {Object} error object
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         *
         */
        getObject: function(key, callback, scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "NamingRpcService"},
                    function(namingRpc,err) {
                        if(namingRpc){
                            var self= this;
                            namingRpc.get(function(result) {
                                if(result.status == "success") {
                                    callback.call(scope, self.objectFactory(result.value),undefined, result.value);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, self.$className, key);
                        }else{
                            callback.call(scope, undefined, err);    
                        }
                    },
                    this
                );
            },this);
        },
        
        /**
        *@private
        * Checks the config store for local copies of the object config.
        *  if not found then call {Ext.io.Object.getObject} if the object 
        *  is created then store the config in the cache for later use.
        */
        getCachedObject: function(key, callback, scope){
            var configStore = Ext.io.Io.getConfigStore();
            var cacheKey = [this.$className, key];
            var objConf = configStore.getObjectConfig(cacheKey);
            if(objConf){
                callback.call(scope,this.objectFactory(objConf));
            } else {
                var cb = function(obj, err, conf) {
                    if(obj){
                         configStore.setObjectConfig(cacheKey,conf);
                    }
                    callback.call(scope, obj, err);
                };
                this.getObject(key, cb, scope);
            }
        },
        
        cacheObjectConfig: function(key, conf) {
            var cacheKey = [this.$className, key];
            var configStore = Ext.io.Io.getConfigStore();
            configStore.setObjectConfig(cacheKey,conf);
        },
        
        
        
        /**
         *@private
         * returns an instance of an object of type this.$className for given conf.
         */
        objectFactory: function(conf){
           return Ext.create(this.$className, {id:conf._key, data:conf.data});
        }, 
        
        /**
        * @private
        * Removes the cached object form the store.
        */
        removeCachedObject: function(key){
                var configStore = Ext.io.Io.getConfigStore();
                var cacheKey = [this.$className, key];
                var objConf = configStore.remove(cacheKey);
        },

        /**
         * @private
         * Get a set of Objects that match a query.
         *
         * @param {Object} messaging
         * @param {String} query
         * @param {Number} start
         * @param {Number} rows
         * 
         * @param {Function} callback The function to be called after finding objects.
         * @param {Object} error object
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         *
         */
        findObjects: function(query, start, rows, callback, scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "NamingRpcService"},
                    function(namingRpc,err) {
                        if(namingRpc){
                            var self= this;
                            namingRpc.find(function(result) {
                                if(result.status == "success") {
                                    var objects = [];
                                    for(var i = 0; i < result.value.length; i++) {
                                        objects.push(Ext.create(self.$className, {id:result.value[i]._key, data:result.value[i].data}));
                                    }
                                    callback.call(scope, objects);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, self.$className, query, start, rows);
                        }else{
                            callback.call(scope, undefined, err);    
                        }
                    },
                    this
                );
            },this);
        }

    },

    config: {
        id: null,
        data: null
    },

    /**
     * @private
     *
     * Constructor
     *
     */
    constructor: function(config) {
        this.initConfig(config);
        if(config._key){
            this.setId(config._key);
        }
    },

    /**
     *
     * Watches an object for remote changes. Any changes object will be pushed to this copy of the object automatically. 
     * The {Ext.io.Object.updated} event will fire after the object has been updated.
     *
     * @param {Array} optional array of strings of property names to observe. If properties is missing all object fields will be 
     */
    watch: function(properties) {
        var self = this;
        Ext.io.Io.registerForNamingEvents(self, properties);  
        self.registeredForNamingEvents = true; //TODO this should be a map of watched properties. 
        return self;
    },

    /**
     * Notifies the server that we no-longer want to know about changes to this object.
     */
    ignore: function(properties) {
        var self = this;
        Ext.io.Io.unregisterForNamingEvents(self, properties);
        self.registeredForNamingEvents = false;
        return self;
    },

    /**
     * @private
     * @inheritable
     *
     * Update the object.
     *
     * @param {Object} data The data to be set on the object.
     *
     * @param {Function} callback The function to be called after updating the object.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *     
     */
    update: function(data,callback,scope) {
        this._update(data, false);
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.update(function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.$className, this.getId(), data);
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
    * merge the current config with the new data and fire the updated event.
    *
    * @param {Object} updated the fields that have changed in this update. 
    * @param {boolean} isRemote update. true if update was triggered remotely. 
    *
    */
    _update: function(data, isRemote){
        var merged = Ext.Object.merge(this.getData(), data);
        this.setData(merged);
        
        var configStore = Ext.io.Io.getConfigStore();
        var cacheKey = [this.$className, this.getId()];
        var objConf = configStore.getObjectConfig(cacheKey);
        if(objConf) {
            objConf.data = merged;
            configStore.setObjectConfig(cacheKey,objConf);
        }
        this.fireEvent("updated", data, isRemote);
    },

    /**
    * @private
    * Removes the config for this object from persistant cache.
    */
    removeCached: function(){
            var configStore = Ext.io.Io.getConfigStore();
            var cacheKey = [this.$className, this.getId()];
            var objConf = configStore.remove(cacheKey);
    },


    /** 
     * @private
     *
     * Destroy
     *
     * @param {Function} callback The function to be called after destroying the object.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    destroy: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.destroy(function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.$className, this.getId());
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
     *
     * Create Related Entity
     *
     * @param {String} method
     * @param {String} klass
     * @param {Object} data
     * 
     * @param {Function} callback The function to be called after creating related entities.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    createRelatedObject: function(method, klass, data, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.createRelatedObject(function(result) {
                            if(result.status == "success") {
                                var object = Ext.create(klass, {id:result.value._key, data:result.value.data});
                                callback.call(scope, object);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), method, data);
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
     *
     * Get Related Object
     *
     * @param {String} klass
     * @param {String} key
     * @param {String} tag
     * 
     * @param {Function} callback The function to be called after getting related object.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    getRelatedObject: function(klass, key, tag, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.getRelatedObject(function(result) {
                            if(result.status == "success") {
                                var object = null;
                                if(result.value && result.value !== null) { // it's possible there is no linked object
                                    object = Ext.create(klass, {id:result.value._key, data:result.value.data});
                                }
                                callback.call(scope, object);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), klass.$className, key, tag);
                    }else{
                        callback.call(scope, undefined, err);
                    }
                },
                this
            );
        },this);
    },

    /** 
     * @private
     *
     * Get Related Objects
     *
     * @param {String} klass
     * @param {String} tag
     *  
     * @param {Function} callback The function to be called after getting related objects.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    getRelatedObjects: function(klass, tag, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.getRelatedObjects(function(result) {
                            if(result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(klass, {id:result.value[i]._key, data:result.value[i].data}));
                                }
                                callback.call(scope, objects);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), klass.$className, tag);
                    }else{
                        callback.call(scope, undefined, err);
                    }
                },
                this
            );
        },this);
    },

    /** 
     * @private
     *
     * Find Related Objects
     *
     * @param {String} klass
     * @param {String} key
     * @param {String} tag
     * @param {String} query
     *  
     * @param {Function} callback The function to be called after finding related objects.
     * @param {Object} error object
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    findRelatedObjects: function(klass, key, tag, query, callback, scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.findRelatedObjects(function(result) {
                            if(result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(klass, {id:result.value[i]._key, data:result.value[i].data}));
                                }
                                callback.call(scope, objects);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, this.$className, this.getId(), klass.$className, key, tag, query);
                    }else{
                        callback.call(scope, undefined, err);
                    }
                },
                this
            );
        },this);
    }
});


/**
 *
 *  @aside guide concepts_channel 
 *
 * This class allows the client to make use of message channels.
 * Channels allow for sending messages between users, and groups of users in a application. 
 * For details on how to use Channels see [How to use Channel Services](#!/guide/concepts_channel)
 * 
 */
Ext.define('Ext.io.Channel', {
    extend: 'Ext.io.Object',
    
    mixins: {
        observable: "Ext.util.Observable" //using util instead of mixin for EXT 4 compatibility. 
    },
    
    /**
    * @event message
    * Fired when the channel receives a message.
    * @param {Ext.io.Sender} sender The user/device that sent the message
    * @param {Object} the message sent.
    */

    statics: {
    
        /**
         * @static
         * Get a named channel
         *
         * All instances of an app have access to the same
         * named channels. If an app gets the same named channel on many devices then
         * those devices can communicate by sending messages to each other. Messages 
         * are simple javascript objects, which are sent by publishing them through 
         * a channel, and are received by other devices that have subscribed to the 
         * same channel.
         *
         *          Ext.io.Channel.get(
         *               { name: 'music' },
         *               function(channel){
         *               }
         *           );     
         *
         * @param {Object} options Channel options may contain custom metadata in addition to the name, which is manadatory
         * @param {String} options.name Name of the channel
         *
         * @param {Function} callback The function to be called after getting the channel.
         * @param {Object} callback.channel The named {Ext.io.Channel} if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        get: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "name", type: 'string' }
            ],arguments, "Ext.io.Channel", "get")) { 
                 callback.call(scope, Ext.create('Ext.io.Channel', options));
            }
        },

        /**
         * @static
         * @private
         *
         * Find channels that match a query.
         * 
         * Returns all the channel objects that match the given query. The query is a String
         * of the form name:value. For example, "city:austin", would search for all the
         * channels with a meta data key of city and  value of Austin. 
         * Find uses the metadata supplied when the channel was created. 
         * 
         * 
         *       Ext.io.Channel.find(
         *           { query: 'city:austin' },
         *           function(channels){
         *           }
         *       );
         *
         * @param {Object} options An object which may contain the following properties:
         * @param {Object} options.query
         *
         * @param {Function} callback The function to be called after finding the matching channels.
         * @param {Array} callback.channels An array of  {Ext.io.Channel} objects matching channels found for the App if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        find: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "query", type: 'string' }
            ],arguments, "Ext.io.Channel", "find")) {
                Ext.io.App.getCurrent(function(app,err){
                  if(app){
                      app.findChannels(options,callback,scope);
                  }else{
                      callback.call(scope,app,err);
                  }
                });
            }
        }
    },

    config: {
        name: null,

        /*
        @private
        */
        queueName: null,
        
        /**
        * @cfg {Boolean} subscribeOnStart
        * Channel will automatically subscribe 
        * to channel messages when the channel is created. 
        * @accessor
        */
        subscribeOnStart: true,
        
      /**
        * @cfg {Array} boundStores
        * List of store ids to be bound to this channel.
        *
        * boundStores:{
                messages : {   // Id of the store Ext.getStore("messages")
                    enabled: true,  // enabled by default
                    // transform is called for each new message on the channel. 
                    // execute the callback function and pass an object that 
                    // will be added to the store. 
                    transform: function(callback, sender, message){
                        console.log("channel message transform", sender, message);

                        sender.getUser(function(user){
                            console.log("sender user", user);
                            callback({message: message.message, user: ( user ? user.getData().username : "guest")});
                        });
                    }
                }
            }
        */
        boundStores:{}
    },
    
    /**
     * @private
     *
     * @param {Object} config
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);

        
        this.boundStores = [];
        this._init(function(channelConf, error){
            this.fireEvent("initComplete");
            if(error){
              Ext.cf.util.Logger.error("Unable to create Chanel ", this, error);
            } else {  
                if(channelConf._key){
                    this.setId(channelConf._key);
                }
                
                this.setData(channelConf.data);
                if(this.getSubscribeOnStart()){
                    this.subscribe();
                }
                
                var storesToBind = this.getBoundStores();
                var store;
                for(store in storesToBind){
                    var conf = {
                        enabled: true,
                        transform: undefined
                    };
                    var toBind = storesToBind[store];
                    if(typeof toBind == "boolean") { // true or false
                        conf.enabled = toBind;
                    } else if(!toBind) { // null or undefined
                        conf.enabled = true;
                    } else if(typeof toBind == "function"){ // users passes function
                        conf = {
                            enabled: true,
                            transform: conf
                        };
                    } else {
                        conf.enabled = (typeof toBind.enabled == "boolean" ? toBind.enabled : true);
                        conf.transform = toBind.transform;
                    }
                    
                    storesToBind[store] = conf;
                }            
            }
   
        });
    },
    
    /*
    *@private
    */
    _init: function(callback) {
        var scope = this;
        var appId = Ext.io.Io.getIdStore().getId('app');

        var channelName = this.getName();
        var channel = this.getData();

        var configStore = Ext.io.Io.getConfigStore();

        if(!channelName && channel.name) {
            //we came from getRelatedObject() query and we don't need call AppService again.
            channelName = channel.name;
            this.setSubscribeOnStart(false); // don't want to auto subscribe if we are looking for a channel. 
        } else {
            channel = configStore.getObjectConfig('channel-' + channelName);
        }

        var queueName = appId + "." + channelName;

        this.setQueueName(queueName);
        
  
        if (!channel) {
            Ext.io.Io.getMessagingProxy(function(messaging) {
                messaging.getService({
                    name: "AppService"
                }, function(AppService, err) {
                    var self = this;
                    if (AppService) {
                        AppService.getChannel(function(result) {
                            if (result.status == "success") {
                                configStore.setObjectConfig('channel-' + channelName, result.value);
                                callback.call(scope, result.value);
                            } else {
                                callback.call(scope, undefined, result.error);
                            }
                        }, appId, {
                            name: channelName
                        });
                    } else {
                        callback.call(scope, undefined, err);
                    }
                }, this);
            }, this);
        } else {
            callback.call(scope, channel);
        }
    },

    
    /**
     * Publish a message to this channel.
     *
     * The message will be delivered to all devices subscribed to the channel.
     *
     *      channel.publish(
     *             { message: { 
     *                 score: 182
     *             }},
     *             function(error) {
     *          
     *             }   
     *       );
     *
     * @param {Object} options
     * @param {Object} options.message A simple Javascript object.
     * @param {number} options.expires  optional time in seconds the message should be buffered on this client when not connected to the server. If the message can not be delivered in the alloted time the message will be discarded. A value of zero will result in the message being discarded immediately if delivery fails.
     * @param {Function} callback The function to be called after sending the message to the server for delivery.
     * @param {Object} callback.err an error object. Will be null/undefined if there wasn't an error.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    publish: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
           { name: "message", type: 'object|string'},
            {name: "expires", type: 'number', optional: true  }
        ],arguments, "Ext.io.Channel", "publish")) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.pubsub.publish(this.getQueueName(), this.getId(), options.message,options.expires, callback, scope);
            },this);
        }
    },

    /**
     * @private
     * This method is called automatically on startup. Use the message event instead.
     *
     * Subscribe to receive messages from this channel.
     *
     * To receive messages from a channel, it is necessary to subscribe to the channel.
     * Subscribing registers interest in the channel and starts delivery of messages
     * published to the channel using the callback.
     *
     *
     *       Ext.io.Channel.get(
     *         { name: "table-123" },
     *         function(channel) {
     *           channel.subscribe(
     *             function(sender, message) {
     *             }
     *           );
     *         }
     *       );
     *
     * @param {Function} callback The function to be called after subscribing to this Channel.
     * @param {String} callback.from The sending Device ID.
     * @param {Object} callback.message A simple Javascript object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    subscribe: function(callback,scope) {
        if(!this.subscribedFn){
            this.subscribedFn = function subscribeCallback(sender, message) {
                sender = Ext.create('Ext.io.Sender', sender);
                this.fireEvent("message", sender, message);
                this.updateStores(sender, message);
            };
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.pubsub.subscribe(this.getQueueName(), this.getId(), this.subscribedFn, this, Ext.emptyFn);
            },this);
        } 
        if(callback) {
            this.on("message", callback, scope);
        }
        
    },

    /**
     * Unsubscribe from receiving messages from this channel.
     *
     * Once a channel has been subscribed to, message delivery will continue until a call to unsubscribe is made.
     * If a device is offline but subscribed, messages sent to the channel will accumulate on the server,
     * to be delivered after the device reconnects at a later point of time.
     *
     * @param {Function} callback The function to be called after unsubscribing from this Channel.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    unsubscribe: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Channel", "unsubscribe")) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.pubsub.unsubscribe(this.getQueueName(), this.getId(), callback, scope);
            },this);
        }
    },
    
    
    /**
    * Bind a store to this queue. All messages will be added as records to the store. 
    * A transform function can be passed to map the sender, and message into the store's model.
    * if the transform returns null|undefined|false then no record will be added to the store.
    *
    * @param {String} storeId the id of the store or the store object itself
    * @param {Function} transform optional function to map message to record.
    * @param {Function} transform.callback callback function to call when the message is ready to be added to the store. 
    * @param {Ext.io.Sender} transform.sender The user/device that sent the message
    * @param {Object} transform.message the message sent.
    * @param {Object} scope The scope in which to execute the transform: The "this" object for
    * 
    * the transform function.
    * 
    */
    bindStore: function(storeId, transform, scope, enabled) {
        if(Ext.cf.util.ParamValidator.validateApi([
                        { name: "store", type: "object|string"}, 
                        { name: "transform", type: "null|function", optional: true }, 
                        { name: "scope", type: "null|object|function", optional: true },
                        { name: "enabled", type: "boolean", optional: true }
                    ], arguments, "Ext.io.Channel", "bindStore")) {
            var store = Ext.getStore(storeId); 
            if(!store) {
                Ext.cf.util.Logger.warn("Ext.io.Channel.bindStore could not find store", store);
            }
            
            var boundStores = this.getBoundStores();
            scope = scope || this;
            if(transform) {
                transform = Ext.bind(transform, scope);    
            }
            boundStores[store] = {
                enabled: typeof enabled == "boolean"  ? enabled : false,
                transform: transform
            };
            
            Ext.cf.util.Logger.debug("Binding store " + storeId + " to channel", this);
            
        } 
    
    },
    
    /**
    * removes a store from the bound stores list.
    * @param {String} store the id of the store or the store object itself
    */
    unbindStore: function(storeId){
        if(Ext.cf.util.ParamValidator.validateApi([
            { name: "store", type: "string"}], arguments, "Ext.io.Channel", "unbindStore")) {
            var boundStores = this.getBoundStores();
            if(boundStores){
                var bound = boundStores[storeId];
                if(bound){                   
                    boundStores[storeId] = undefined;
                } else {
                    Ext.cf.util.Logger.warn("Ext.io.Channel.unbindStore could not find store to unbind", storeId);
                }
            }
            
        }
    },
    
    
    /**
    * suspend or resume the delivery of messages to a store.
    * @param {String} store the id of the store
    * @param {Boolean} disable true to disable delivery or false to re-enable delivery. default is true.
    */
    disableStore: function(storeId, disable) {
        if(Ext.cf.util.ParamValidator.validateApi([
                        { name: "store", type: "string"}, 
                        { name: "disable", type: "boolean", optional:"true"}
                    ], arguments, "Ext.io.Channel", "diableStore")) {
            var boundStores = this.getBoundStores();
            if(typeof disable == "undefined") {
                disable = true;
            }
            
            if(boundStores){
                var bound = boundStores[storeId];
                if(bound){
                    bound.enabled = !disable;
                    return;
                }    
            }
            Ext.cf.util.Logger.error("Could not find store in channel, check store id and channel configuration", {storeId: storeId, disable: disable, channel: this});
        }
        
    },
    
    
    /**
    * @private
    */
    updateStores: function(sender, message){
        var boundStores = this.getBoundStores();
        var storeId;
        for(storeId in boundStores){
            this.updateStore(sender, message, storeId, boundStores[storeId]);
        }    
    },
    updateStore: function (sender, message, storeId, bound) {
            if(bound){
                var store = Ext.getStore(storeId);
                if(!store) {
                    Ext.cf.util.Logger.error("Could not find store in channel, check store id and channel configuration", storeId, bound);
                } else {
                    if(bound.enabled === true) {
                        var cb = function(record){
                            //console.log("callback record", record);
                            if(record){
                                store.add(record);    
                            }   
                        };
                        var record = bound.transform ? bound.transform(cb, sender, message, store, this) : message;
                        if(record){
                            store.add(record);    
                        }  
                    } else {
                        Ext.cf.util.Logger.debug("Ext.io.Channel: skipping store update as it is disabled", storeId, this);
                    }
                }    
            }
    }
    
});

/**
 * @private
 *
 * An Object that can have a picture.
 * 
 */
Ext.define('Ext.io.WithPicture', {

    /** 
     *
     * Upload Picture
     *
     * @param {Object} options
     * 
     * @param {Function} callback
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    uploadPicture: function(options,callback,scope) {
        if (typeof options.file != "undefined") {
            options.file.ftype = 'icon';
            options.containerid = this.getId();
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.sendContent(
                    options,
                    function(csId,err) {
                        if(csId){
                            var tmp = options.file.name.split('.');
                            var ext = "."+tmp[tmp.length - 1];
                            this.setPicture(csId, ext, function(fileName, err) {
                                callback.call(scope,fileName,err);
                            }, this);
                        }else{
                            callback.call(scope,undefined,err);
                        }
                    },
                    this
                );
            },this);
        } else {
            var err = Ext.cf.util.ErrorHelper.get('FILE_PARAMS_MISSING');
            callback.call(scope,undefined,err);
        }
    },

    /** 
     *
     * Set Picture
     *
     * @param {String} csKey
     * @param {String} ext
     *
     * @param {Function} callback
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    setPicture: function(csKey, ext, callback, scope) {
        this.getServiceName(function(err, name) {
            if (!err) {
                Ext.io.Io.getMessagingProxy(function(messaging){
                    messaging.getService(
                        {name: name},
                        function(managerService,err) {
                            if(managerService){
                                managerService.setPicture(function(result) {
                                    if(result.status == "success") {
                                        callback.call(scope, result.value);
                                    } else {
                                        callback.call(scope, undefined, result.error);
                                    }
                                }, this.$className, this.getId(), csKey, ext);
                            }else{
                                callback.call(scope, undefined, err);
                            }
                        },
                        this
                    );
                },this);
            } else {
                callback.call(scope, undefined, err);
            }
        },this);
    },

    /** 
     *
     * Remove Picture
     *
     * @param {Function} callback
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    removePicture: function(callback,scope) {
        this.getServiceName(function(err, name) {
            if (!err) {
                Ext.io.Io.getMessagingProxy(function(messaging){
                    messaging.getService(
                        {name: name},
                        function(managerService,err) {
                            if(managerService){
                                managerService.removePicture(function(result) {
                                    if(result.status == "success") {
                                        callback.call(scope);
                                    } else {
                                        callback.call(scope,result.error);
                                    }
                                }, this.$className, this.getId());
                            }else{
                                callback.call(scope,err);
                            }
                        },
                        this
                    );
                },this);
            } else {
                callback.call(scope,err);
            }
        },this);
    },

    /** 
     * @private
     *
     * @param {Function} callback
     *
     */
    getServiceName: function(callback,scope) {
        var name;
        switch(this.$className) {
            case 'Ext.io.App':
                name = 'AppService';
                break;
            case 'Ext.io.Team':
                name = 'TeamService';
                break;
        }
        if (name) {
            callback.call(scope,null, name);
        } else {
            callback.call(scope,Ext.cf.util.ErrorHelper.get('PIC_OP_NOT_SUPPORTED'), null);
        }
    }

});


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


/**
 * @private
 * {@img group.png Class Diagram}
 *
 * The {@link Ext.io.Group} class represents a group of users. There is only one
 * group object, called the current group object, available to the client.
 * If the current app is not associated with a user group then there will
 * be no user group.
 *
 *          Ext.io.Group.getCurrent(
 *             function(group){
 *              
 *             } 
 *          );
 *
 *
 * Methods are provided for navigation through the graph of objects available
 * to the currently running client code. 
 */
Ext.define('Ext.io.Group', {
    extend: 'Ext.io.Object',

    requires: [
        'Ext.cf.messaging.AuthStrategies'
    ],

    statics: {
        
        /**
        * @static
        * @private
        *  Called on bootup by Io with the current group data.
        * 
        */
        setCurrent: function(groupConfig){
            this._currentGroup = Ext.create("Ext.io.Group", {id:groupConfig._key, data:groupConfig.data});
        },

        /**
         * @static
         * Get the current user Group object.
         *
         *          Ext.io.Group.getCurrent(
         *              function(group){
         *              } 
         *          );
         *
         * @param {Function} callback The function to be called after getting the current Group object.
         * @param {Object} callback.group The current {Ext.io.Group} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        getCurrent: function(callback,scope) {
            callback.call(scope, this._currentGroup);
        },


        /**
         * @static
         * Get Group
         *
         * @param {Object} options
         * @param {String} options.id
         *
         * @param {Function} callback The function to be called after getting the Group object.
         * @param {Object} callback.group The current {Ext.io.Group} Object if the call succeeded.
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
     * Get the App associated with this user Group.
     *
     * Returns an instance of {@link Ext.io.App} for the current app.
     *
     *      group.getApp(
     *          function(app) {
     *          }
     *      );
     *
     * @param {Function} callback The function to be called after getting the App object.
     * @param {Object} callback.app The {Ext.io.App} associated with this Group if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getApp: function(callback,scope) {
        Ext.io.App.getCurrent(callback,scope);
    },

    /**
     * Find Users that match a query.
     *
     * Returns all the user objects that match the given query. The query is a String
     * of the form name:value. For example, "hair:brown", would search for all the
     * users with brown hair, assuming that the app is adding that attribute to all
     * its users. 
     *
     *       group.findUsers(
     *           {query:'username:bob'},
     *           function(users){
     *           }
     *       );
     *
     * @param {Object} options
     * @param {String} options.query
     *
     * @param {Function} callback The function to be called after finding the users.
     * @param {Object} callback.users The {Ext.io.User[]} matching users found for the Group if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    findUsers: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
             { name: "query", type: 'string' }
          ],arguments, "Ext.io.Group", "findUsers")) {
              this.findRelatedObjects(Ext.io.User, null, null, options.query, callback, scope);
        }
    },

    /**
     * Get all users that belong to this group
     *
     *          group.getUsers(
     *              function(users){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the users that belong to this group.
     * @param {Object} callback.users Array of {Ext.io.User} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getUsers: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Group", "getUsers")) {
            this.getRelatedObjects(Ext.io.User, null, callback, scope);
        }
    },

    /**
     * @private
     * Get all connected users that belong to this group
     *
     *          group.getConnectedUsers(
     *              function(users){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the connected users that belong to this group.
     * @param {Object} callback.users Array of connected {Ext.io.User} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     * A connected user is a user that has a web socket connection open to the server and is logged in.
     *
     */
    getConnectedUsers: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "PresenceService"},
                function(presenceService,err) {
                    if(presenceService){
                        presenceService.getConnectedUsers(function(result) {
                            if (result.status == "success") {
                                var objects = [];
                                for(var i = 0; i < result.value.length; i++) {
                                    objects.push(Ext.create(Ext.io.User, {id:result.value[i]._key, data:result.value[i].data}));
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
     * Register a new User.
     * 
     * If the user does not already exist in the group then a new user is created,
     * and is returned as an instance of {@link Ext.io.User}. The same user is now available
     * through the {@link Ext.io.User.getCurrent}.
     *
     *       group.register(
     *           {
     *               email:'bob@isp.com',
     *               password:'secret'
     *           },
     *           function(user){
     *           }
     *      );
     *
     * @param {Object} options User profile attributes.
     * @param {Object} options.email
     * @param {Object} options.password
     *
     * @param {Function} callback The function to be called after registering.
     * @param {Object} callback.user The {Ext.io.User} object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    register: function(options,callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "GroupManager"},
                function(groupManager,err) {
                    if(groupManager){
                        groupManager.registerUser(function(result) {
                            if (result.status == "success") {
                                Ext.io.User.cacheObjectConfig(result.value._key, result.value);
                                Ext.io.Io.getIdStore().setId('user', result.value._key);
                                Ext.io.Io.getIdStore().setSid('user', result.sid);
                                Ext.io.User.getCurrent(callback,scope);
                            } else {
                                callback.call(scope,undefined,result.error);
                            }
                        }, {authuser:options, groupId:this.getId(), provider: "senchaio"});
                    }else{
                        callback.call(scope,undefined,err);
                    }
                },
                this
            );
        },this);
    },

    /**
     * Authenticate an existing User.
     *
     * Checks if the user is a member of the group. The user provides an email address
     * and password. If the user is a member of the group, and the passwords match,
     * then an instance of {@link Ext.io.User} is returned. The current user object is
     * now available through {@link Ext.io.User.getCurrent}
     *
     *       group.authenticate(
     *           {
     *               email:'bob@isp.com',
     *               password:'secret',
     *           },
     *           function(user){
     *           }
     *      );
     *
     * We use a digest based authentication mechanism to ensure that no
     * sensitive information is passed over the network.
     *
     * @param {Object} options Authentication credentials
     * @param {Object} options.email
     * @param {Object} options.password
     *
     * @param {Function} callback The function to be called after authenticating the developer.
     * @param {Object} callback.developer The {Ext.io.Developer} object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    authenticate: function(options,callback,scope) {
      //  var type = this.getAuthMethod();       
      
        if(!Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
             { name: "provider", type: 'string' }
          ],arguments, "Ext.io.Group", "authenticate")) {
             return;
        }
        
        var auth = Ext.cf.messaging.AuthStrategies.strategies[options.provider];
        if(auth) {
            auth(this, options, function(user, usersid, err) {
                if(user) {
                    Ext.io.User.cacheObjectConfig(user._key,user);
                    Ext.io.Io.getIdStore().setId('user', user._key);
                    Ext.io.Io.getIdStore().setSid('user', usersid);
                    Ext.io.User.getCurrent(callback,scope);
                } else {
                    callback.call(scope,user,err);    
                }
            }, this); 
        } else {
            Ext.cf.util.Logger.error("Unsupported group registration type: " + options.provider + ".  Choose a different type from the managment console.");
        }  
    },
    
    /**
     * Send password recovery code to a user. 
     * @param {String} options.email
     *
     * @param {Function} callback The function to be called after recoverPassword has executed.
     * @param {Boolean} callback.success true if user was found and code was sent.
     * @param {Object} callback.err an error object if there was a problem sending the message
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    recoverPassword: function(options,callback,scope){
         if(!Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
                 { name: "email", type: 'string', optional: true }
              ],arguments, "Ext.io.Group", "recoverPassword")) {
                 return;
            } else {
                
                if(!options.email){
                    var err = Ext.cf.util.ErrorHelper.get('PARAM_MISSING', null, {
                        name: "email",
                        expected: "email must have a non-null value"
                    });
                    callback.call(scope, undefined, err);
                    return;
                } 
                
                
                 Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.getService(
                            {name: "GroupManager"},
                            function(groupManager,err) {
                                if(groupManager){
                                    groupManager.recoverPassword(function(results){
                                        if(results.error){
                                            callback.call(scope, undefined, results.error);   
                                        } else {
                                            callback.call(scope, results.status=="success", undefined);   
                                        }
                                    }, this.getId(), options.email);
                                }
                            }, this);
                    },this);
                
                
            }
        
       
    
    },
    
    
    /**
     * Reset a user's password using a code and a email address
     * @param {String} options.email    the email address the user sent the code to
     * @param {String} options.code     recovery code sent by recoverPassword
     * @param {String} options.newpass  new password 
     *
     * @param {Function} callback The function to be called after recoverPassword has executed.
     * @param {Boolean} callback.success true if user was found and code was sent.
     * @param {Object} callback.err an error object if there was a problem sending the message
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    resetPassword: function(options,callback,scope){
         if(!Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
                 { name: "email", type: 'string'},
                 { name: "code", type: 'string' },
                 { name: "newpass", type: 'string' }
              ],arguments, "Ext.io.Group", "resetPassword")) {
                 return;
            } else {
                
                 Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.getService(
                            {name: "GroupManager"},
                            function(groupManager,err) {
                                if(groupManager){
                                    groupManager.resetPassword(function(results){
                                        if(results.error){
                                            callback.call(scope, undefined, results.error);   
                                        } else {
                                            callback.call(scope, results.status=="success", undefined);   
                                        }
                                    }, this.getId(), options.email, options.code, options.newpass);
                                }
                            }, this);
                    },this);
                
                
            }
        
       
    
    },
    
    
    /**
     * @private
     * returns an array of the enabled auth type objects with the key authType set to the name of the auth method.
     *
     *@param asMap if set to true then a map of the types will be returned instead of an array.
     */
    getEnabledAuthMethods: function(asMap){
        var types = asMap ? {} : [];
        var data = this.getData();
        
        for (var type in data.auth) {
            var method = data.auth[type];
            if(method.enabled === true){
                if(asMap){
                   types[type] = method; 
                } else {
                    var config = Ext.Object.merge(method, {authType: type});
                    types.push(config);                    
                }
            }
        }
        return types;
    },

    /**
     * Find stores that match a query.
     * 
     * Returns all the group's store objects that match the given query. The query is a String
     * of the form name:value. For example, "city:austin", would search for all the
     * stores in Austin, assuming that the app is adding that attribute to all
     * its stores. 
     *
     *       group.findStores(
     *           {query:'city:austin'},
     *           function(stores){
     *           }
     *       );
     *
     * @param {Object} options
     * @param {String} options.query
     *
     * @param {Function} callback The function to be called after finding the stores.
     * @param {Object} callback.stores The {Ext.io.Store[]} matching stores found for the Group if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    findStores: function(options,callback,scope) {
        this.findRelatedObjects(Ext.io.Store, this.getId(), null, options.query, callback, scope);    
    },

    /**
     * Get all stores that belong to this group
     *
     *          group.getStores(
     *              function(stores){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the stores that belong to this group.
     * @param {Object} callback.stores Array of {Ext.io.Store} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getStores: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Group", "getStores")) {
            this.getRelatedObjects(Ext.io.Store, null, callback, scope);
        }
    }

});

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


/**
 * 
 * @aside guide concepts_device
 *
 * The Ext.io.Device class represents an instance of an application running on a physical device. 
 * It has a zero-or-one relationship with the Ext.io.User class 
 * A full description of the Ext.io.Device class can be found in the [How to use Device Services](#!/guide/concepts_device).
 *
 * ## Device Object
 *
 * There is always a device object available for the current device.
 *
 *          Ext.io.Device.getCurrent(
 *              function(device){
 *              
 *              } 
 *          );
 *
 * Device Objects are also used to represent other devices running the same app.
 * These can be instantiated using Ext.io.Device.get.
 *
 * ## Device Channel
 *
 * All devices have an associated channel for receiving messages. A message, which
 * is a plain old javascript object, can be sent to another device using the 
 * Ext.io.Device.send method.
 *
 *          device.send({
 *              from: 'John', text: 'Hey!'
 *          });
 *
 * A device can listen for messages from other devices with the `on` method.
 *
 *          Ext.io.Device.getCurrent(
 *             function(device){
 *
 *                device.on("message"
 *                    function(sender, message) {
 *                        console.log("device message", sender, message);
 *                    }
 *                );
 *
 *             } 
 *          );
 *
 * Device to device messages are always from a single device and to a single device. 
 *
 * To send a message to all devices running the same app the client would use
 * Ext.io.Channel 
 *
 * To send a message to all devices of a particular user the client would use
 * Ext.io.User.send.
 *
 */
Ext.define('Ext.io.Device', {
    extend: 'Ext.io.Object',
    
    mixins: {
        observable: "Ext.util.Observable" //using util instead of mixin for EXT 4 compatibility. 
    },

    /**
    * @event message
    * Fired when the device receives a message.
    * @param {Ext.io.Sender} sender The device that sent the message
    * @param {Object} message The message received.
    */

    statics: {
        /**
         * @static
         * @private
         * Find devices that match a query.
         * 
         * Returns all the device objects that match the given query. The query is a String
         * of the form name:value. For example, "city:austin", would search for all the
         * devices in Austin, assuming that the app is adding that attribute to all
         * its devices.
         * 
         *       user.find(
         *           {query:'city:austin'},
         *           function(devices){
         *           }
         *       );
         *
         * @param {Object} options An object which may contain the following properties:
         * @param {Object} options.query
         *
         * @param {Function} callback The function to be called after finding the matching devices.
         * @param {Array} callback.devices An array of type Ext.io.Device matching devices found for the App if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        find: function(options,callback,scope) {
          if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "query", type: 'string' }
            ],arguments, "Ext.io.Device", "find")) {
            Ext.io.App.getCurrent(function(app,err){
                if(app){
                    app.findDevices(options,callback,scope);
                }else{
                    callback.call(scope,app,err);
                }
            });
          }
        },

        /**
         * @static
         * Get the current Device object.
         *
         *          Ext.io.Device.getCurrent(
         *              function(device){
         *              } 
         *          );
         *
         * The current Device object is an instance of Ext.io.Device class. It represents
         * the device that this web app is running on. It is always available.
         *
         * The device object returned by this method will fire message events whenever a message is set from the the server.
         *
         * @param {Function} callback The function to be called after getting the current Device object.
         * @param {Object} callback.device The current Ext.io.Device object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        getCurrent: function(callback,scope) {
            if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Device", "getCurrent")) {
                var deviceId = Ext.io.Io.getIdStore().getId('device');
                if (!deviceId) {
                    var err = Ext.cf.util.ErrorHelper.get('NO_DEVICE_ID');
                    callback.call(scope,undefined,err);
                } else {
                    var cb = function(device,errors){
                        if(device && device.receive) {
                            device.receive();
                        }
                        callback.call(scope, device, errors);
                    };
                    this.getObject(deviceId, cb, this);
                }
            }
        },

        /**
         * @static
         * Get Device
         *
         * @param {Object} options
         * @param {Object} options.id
         *
         * @param {Function} callback The function to be called after getting the Device object.
         * @param {Object} callback.device The Ext.io.Device object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
          if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "id", type: 'string|number' }
            ],arguments, "Ext.io.Device", "get")) {
              this.getObject(options.id, callback, scope);
            }
        }
    },

    /**
     * @private
     * Get the App associated with this Device.
     *
     *          device.getApp(
     *              function(app){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the App object.
     * @param {Object} callback.app The Ext.io.App associated with this Device if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getApp: function(callback,scope) {
        this.getRelatedObject(Ext.io.Version, this.getData().version, null, function(version, err) {
            if(err) {
                callback.call(scope,undefined,err);
            } else {
                version.getRelatedObject(Ext.io.App, null, null, callback, scope);
            }
        }, this);
    },

    /**
     * Get the User associated with this Device, if any.
     *
     *          device.getUser(
     *              function(user){
     *              } 
     *          );
     *
     *
     * @param {Function} callback The function to be called after getting the User object.
     * @param {Object} callback.user The Ext.io.User associated with this Device if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getUser: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.Device", "getUser")) {
            this.getRelatedObject(Ext.io.User, null, null, callback, scope);
        }
    },

    /**
     * Send a message to this Device.
     *
     * The send method allow messages to be sent to another device. The message
     * is a simple Javascript object. The message is channeld on the server until
     * the destination device next comes online, then it is delivered.
     *
     *        device.send({
     *            message: {city: 'New York', state: 'NY'},
     *        }, function(error){
     *            console.log("send callback", error);
     *        });
     *
     * See message event for receiving device to device messages.
     *
     *
     * @param {Object} options
     * @param {Object} options.message A simple Javascript object.
     * @param {number} options.expires optional time in seconds the message should be buffered on this client when not connected to the server. If the message can not be delivered in the alloted time the message will be discarded. A value of zero will result in the message being discarded immediately if delivery fails.
     *
     * @param {Function} callback The function to be called after sending the message to the server for delivery.
     * @param {Object} callback.error an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    send: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([{ name: "message", type: 'string|object' },{name: "expires", type: 'number', optional: true }],arguments, "Ext.io.Device", "send")) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.transport.sendToClient(this.getId(), options.message, options.expires, callback, scope);
            },this);
        }
    },

    /**
     * @private
     * 
     * This method is called by Ext.io.Device.getCurrent before the device
     * object is returned.  It should not be called directly. 
     * 
     * Receive messages for this Device.
     *
     * To receive messages sent directly to a device the app must use this
     * method to register a handler function. Each message is passed to the
     * callback function as it is received. The message is a simple Javascript
     * object.
     *
     *      device.receive(
     *          function(sender, message) {
     *              console.log("received a message:", sender, message);
     *          }
     *      );
     *
     * See send for sending these device to device messages.
     *
     * @param {Function} callback Optional function to be called after receiving a message for this Device.
     * @param {String} callback.from The sending Device ID.
     * @param {Object} callback.message A simple Javascript object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    receive: function(callback,scope) {
        if(callback) {
            this.on("message", callback, scope);
        }
        if(!this.subscribedFn){
            this.subscribedFn = function(envelope) {
                var sender = Ext.create('Ext.io.Sender', {
                  deviceId: envelope.from,
                  userId: envelope.userId,
                  developerId: envelope.developerId
                });
                
                this.fireEvent("message", sender, envelope.msg);
            };
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.transport.setListener("CourierService", this.subscribedFn, this);
            },this);
        } 
    },

    /**
     * @private
     *
     * Get Version
     *
     * @param {Function} callback The function to be called after getting the version.
     * @param {Object} callback.version 
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    getVersion: function(callback,scope) {
        this.getRelatedObject(Ext.io.Version, this.getData().version, null, callback, scope);
    }

});

/**
 * @private
 *
 * An Object that can have a channel.
 * 
 */
Ext.define('Ext.io.WithChannel', {

    /**
     * Get Channel Key
     *
     * @param {Function} callback The function to be called after getting the Object's channel.
     * @param {Object} callback.channel The channel key of the object if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    getChannelKey: function(callback,scope) {
        var self = this;

        if (self._channelKey) {
            callback.call(scope, self._channelKey);
        } else {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "NamingRpcService"},
                    function(namingRpc,err) {
                        if(namingRpc){
                            namingRpc.getRelatedObjects(function(result) {
                                if(result.status == "success") {
                                    if(result.value && result.value.length) { // it's possible there is no linked object
                                        self._channelKey = result.value[0]._key;
                                        callback.call(scope, result.value[0]._key);
                                    }
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, this.$className, this.getId(), 'Ext.io.Channel', null);
                        }else{
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        }
    }

});

/**
 * @aside guide concepts_user
 *
 * The Ext.io.User class represents the person using the app on the device.
 * It has a one-to-many relationship with the Ext.io.Device class. 
 * A full description of the Ext.io.User class can be found in [How to use User Services](#!/guide/concepts_user).
 *
 * User authentication and registration is handled by Ext.io.Controller.  More details can be found in [How to use Application Controller](#!/guide/concepts_controller).
 *
 * Once the user has been registered or authenticated then the current user 
 * object will always be available using Ext.io.User.getCurrent.
 *
 *      Ext.io.User.getCurrent(
 *          function(user){
 *              
 *          } 
 *      );
  *
  * ## User Messaging
 *
 * Applications can send messages to other users by calling Ext.io.User.send.
 *
 *          user.send({
 *              from: 'John', text: 'Hey!'
 *          });
 *
 * A user can listen for messages from other users by listening for the message event.
 *
 *          Ext.io.User.getCurrent(
 *             function(user){
 *
 *                user.on("message"
 *                    function(sender, message) {
 *                        console.log("user message", sender, message);
 *                    }
 *                );
 *
 *             } 
 *          );
 *
 * If the user has multiple devices running the same app, then the same message will be received by all those
 * app instances. 
 *
 *
 * Sending a message to all of current user's devices
 * ----
 * If an application calls send on the current user a message will be delivered to all of users devices in that application
 * As with other channel messages the message will not echo back to the device that actually sent the message.
 *          Ext.io.User.getCurrent(
 *             function(user){
 *
 *                user.send(...)
 *
 *             } 
 *          );
 *  
 * 
 * To send a message to all devices running the same app the client would use Ext.io.Channel.
 *
 * To send a message to a specific device the client would use Ext.io.Device
 * 
 * ## User Logout
 *
 * The Ext.io.User.logout method will end the user's session.
 *
 * 
 */
Ext.define('Ext.io.User', {
    extend: 'Ext.io.Object',

    requires: [
            'Ext.io.Sender',
            'Ext.io.Store',
            'Ext.io.Device'
        ],

    mixins: {
        observable: "Ext.util.Observable", //using util instead of mixin for EXT 4 compatibility. 
        withchannel: "Ext.io.WithChannel"
    },
    
    /**
    * @event message
    * Fired when the user receives a message.
    * @param {Ext.io.Sender} sender The user/device that sent the message
    * @param {Object} the message sent.
    */



    /**
    * @event connected
    * Fired when this user's connection status changes.
    * Must call {Ext.io.Object.watch} to receive this event.
    * @param {boolean} isConnected true when the user is connected.
    */
    

    
    statics: {
        /**
         * @static  
         * Register a new User.
         * 
         * If the user does not already exist in the group then a new user is created,
         * and is returned as an instance of {@link Ext.io.User}.
         *
         *       Ext.io.User.register(
         *           {
         *               email:'bob@isp.com',
         *               password:'secret'
         *           }
         *           function(user){
         *           }
         *      );
         *
         * @param {Object} options User profile attributes.
         * @param {Object} options.email
         * @param {Object} options.password
         *
         * @param {Function} callback The function to be called after registering the user.
         * @param {Object} callback.user The {Ext.io.User} if registration succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        register: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([
               { name: "email", type: 'string' },
               { name: "password", type: 'string' }
               ],arguments, "Ext.io.User", "register")) {
              Ext.io.Group.getCurrent(function(group,err){
                  if(group){
                      group.register(options,callback,scope);
                  }else{
                      callback.call(scope,group,err);
                  }
              });
            }
        },

        /**
         * @static  
         * Authenticate an existing User.
         *
         * Checks if the user is a member of the group. The user provides an email address
         * and password. If the user is a member of the group, and the passwords match,
         * then an instance of {@link Ext.io.User} is returned. The current user object is
         * now available through {@link Ext.io.User.getCurrent}
         *
         *       Ext.io.User.authenticate(
         *           {
         *               uemail:'bob@isp.com',
         *               password:'secret'
         *           },
         *           function(user){
         *           }
         *      );
         *
         * We use a digest based authentication mechanism to ensure that no
         * sensitive information is passed over the network.
         *
         * @param {Object} options Authentication credentials
         * @param {Object} options.email
         * @param {Object} options.password
         *
         * @param {Function} callback The function to be called after authenticating the user.
         * @param {Object} callback.user The {Ext.io.User} if authentication succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        authenticate: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope(null,arguments, "Ext.io.User", "authenticate")) {
                Ext.io.Group.getCurrent(function(group,err){
                    if(group){
                        //Once we have user, before we return it to the caller
                        // enable recieve so that we will get user messages.
                        var cb = function(user,errors){
                            if(user) {
                                user.receive();
                            }
                            callback.call(scope, user, errors);
                        };
                        group.authenticate(options,cb,scope);
                    }else{
                        callback.call(scope,group,err);
                    }
                });
            }
        },

        /**
         * @static  
         * @private
         * Find Users that match a query.
         *
         * Returns all the user objects that match the given query. The query is a String
         * of the form name:value. For example, "hair:brown", would search for all the
         * users with brown hair, assuming that the app is adding that attribute to all
         * its users. 
         *
         *       Ext.io.User.find(
         *           {query:'username:bob'},
         *           function(users){
         *           }
         *       );
         *
         * @param {Object} options An object which may contain the following properties:
         * @param {Object} options.query
         *
         * @param {Function} callback The function to be called after finding the matching users.
         * @param {Array} callback.users Array of {Ext.io.User} objects that match the query. 
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        find: function(options,callback,scope) {
            if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([{ name: "query", type: 'string' }],arguments, "Ext.io.User", "find")) {
                Ext.io.Group.getCurrent(function(group,err){
                    if(group){
                        group.findUsers(options,callback,scope);
                    }else{
                        callback.call(scope,group,err);
                    }
                });
            }
        },

        /**
         * @static        
         * Get the current User, if any.
         *
         * The current User object is an instance of {@link Ext.io.User}. It represents
         * the user of the web app. If there is no group associated with the app,
         * then there will not be a current user object. If there is a group, and
         * it has been configured to authenticate users before download then the
         * current user object will be available as soon as the app starts running.
         * If the group has been configured to authenticate users within the app
         * itself then the current user object will not exist until after a
         * successful call to Ext.io.User.authenticate has been made.
         *
         *          Ext.io.User.getCurrent(
         *              function(user){
         *              } 
         *          );
         *
         * @param {Function} callback The function to be called after getting the current User object.
         * @param {Object} callback.user The current {Ext.io.User} object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         *
         */
        getCurrent: function(callback,scope) {
            if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.User", "getCurrent")) {
                var idstore = Ext.io.Io.getIdStore();
                var userId = idstore.getId('user');
                var userSid = idstore.getSid('user');
                var err = null;
                if (!userId) {
                    err = Ext.cf.util.ErrorHelper.get('NO_CURRENT_USER');
                    callback.call(scope,undefined,err);
                } else if (!userSid) {
                    Ext.io.User.removeCachedObject(userId);
                    idstore.remove('user', 'id');
                    err = Ext.cf.util.ErrorHelper.get('USER_NOT_AUTHENTICATED');
                    callback.call(scope,undefined,err);
                } else {
                    if(this.currentUser){
                        callback.call(scope, this.currentUser, null);
                    } else {
                        this.getCachedObject(userId,function(user,errors){
                            if(user) {
                                //
                                // Once we have the user, but before we return it to the caller
                                // we call recieve so that message events will start firing.
                                //
                                user.receive();

                                //
                                // Automatically watch the current user for changes so
                                // we will always have the latest.
                                user.watch();


                                this.currentUser = user;
                            }
                            callback.call(scope, user, errors);
                        },this);
                    }
                   
                }
            }
        },

        /**
         * @static
         * Get User
         *
         * @param {Object} options
         * @param {String} options.id
         *
         * @param {Function} callback The function to be called after getting the User object.
         * @param {Object} callback.user The Ext.io.User object if the call succeeded.
         * @param {Object} callback.err an error object.
         *
         * @param {Object} scope The scope in which to execute the callback. The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }

    },


    config: {

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


        this.userChannelName =  'Users/' + this.getId();

        this.on("updated",
            function(changed, remote) {
                if(remote && typeof changed.connected == "boolean"){
                    this.fireEvent("connected", changed.connected);
                }
        }, this);
        // name of the user channel (inbox)
    },
    
    
    
    /**
     * Reset a user's password
     * @param {String} options.oldpass  new password 
     * @param {String} options.newpass  new password
     *
     * @param {Function} callback The function to be called after changePassword has executed.
     * @param {Boolean} callback.success true if user was found and code was sent.
     * @param {Object} callback.err an error object if there was a problem sending the message
     *
     * @param {Object} scope The scope in which to execute the callback. The "this" object for
     * the callback function.
     */
    changePassword: function(options,callback,scope) {
        if(Ext.cf.util.ParamValidator.validateOptionsCallbackScope([{ name: "oldpass", type: 'string' }, { name: "newpass", type: 'string' }],arguments, "Ext.io.User", "changePassword")) {
             Ext.io.Io.getMessagingProxy(function(messaging){
                    messaging.getService(
                        {name: "GroupManager"},
                        function(groupManager,err) {
                            if(groupManager){
                                groupManager.changePassword(function(results){
                                    if(results.error){
                                        callback.call(scope, undefined, results.error);   
                                    } else {
                                        callback.call(scope, results.status=="success", undefined);   
                                    }
                                }, this.getId(), options.oldpass, options.newpass);
                            }
                        }, this);
                },this);
        }
    },
    

    /**
     * Get all devices that belong to this user
     *
     *          user.getDevices(
     *              function(devices){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the devices that belong to this user.
     * @param {Object} callback.devices Array of {Ext.io.Device} objects that belonging to this User.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getDevices: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.User", "getDevices")) {
            this.getRelatedObjects(Ext.io.Device, null, callback, scope);
        }
    },

    /**
     * @private
     * Get the user group that this user is a member of.
     *
     *          user.getGroup(
     *              function(group){
     *              } 
     *          });
     *
     * @param {Function} callback The function to be called after getting the Group object.
     * @param {Object} callback.group The {Ext.io.Group} object for this User if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getGroup: function(callback,scope) {
        Ext.io.Group.getCurrent(callback,scope);
        //this.getRelatedObject(Ext.io.Group, this.getData().group, null, callback, scope);
    },

    /**
     * Send a message to this User.
     *
     *
     *        user.send(
     *            {message:{fromDisplayName: 'John', text: 'Hello'}},
     *            function(error) {
     *              console.log("send callback", error);
     *            }
     *        );
     *
     *  *Note that the callback fires when the server accepts the message, not when the message
     *  is delivered to the user.*
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
            {name: "expires", type: 'number', optional: true }],arguments, "Ext.io.User", "send")) {
            self.getChannelKey(function(channel, err) {
                if (channel) {
                    Ext.io.Io.getMessagingProxy(function(messaging){
                        messaging.pubsub.publish(self.userChannelName, channel, options.message, options.expires, callback, scope);
                    },self);
                } else {
                    Ext.cf.util.Logger.error("Unable to get user Channel");
                }
            });
        }
    },

    /**
     * @private
     * Called by Ext.io.User.getCurrent to get messages delivered to this user see Ext.io.User.message
     * 
     * Receive messages for this User.
     *
     *      user.receive(
     *          function(sender, message) {
     *              console.log("received a message:", sender, message);
     *          }
     *      );
     *
     *
     * @param {Function} callback The function to be called after a message is received for this User.
     * @param {Ext.io.Sender} callback.sender  The user/device that sent the message
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
                        messaging.pubsub.subscribe(self.userChannelName, channel, self.subscribedFn, self, Ext.emptyFn);
                    },self);
                } else {
                    Ext.cf.util.Logger.error("Unable to get user Channel");
                }
            });
        } 
      
    },

    /**
     * Logout

     * Removes the user's session and id from local storage.  This will 
     * keep the user from having further access to the authenticated parts
     * of the application.  However this does not clear copies of sync stores.
     * To do that the application must call `store.getProxy().clear()` on every 
     * user or application store. The application is also responsible for removing 
     * any other user data it has stored elsewhere.
     * 
     * Also calls server to delete the user's session.
     *
     * @param {Function} callback Optional function to be called user is logged out
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     * 
     */
    logout: function(callback,scope) {
        var self = this;
        Ext.io.Io.getService({name: "GroupManager"}, function(groupManager, err) {
            if (!err && groupManager) {
                self.getGroup(function(group, err) {
                    if (!err && group) {
                        groupManager.logoutUser(function(result, err) {
                            if (err) {
                                Ext.cf.util.Logger.warn("Group Manager logoutUser failed" , err);
                            }
                            self._clearUser(callback,scope);
                        }, {groupId:group.getId()});
                    } else {
                        Ext.cf.util.Logger.warn("Unable to get group for user" , err);
                        self._clearUser(callback,scope);
                    }
                });
            } else {
                Ext.cf.util.Logger.warn("Unable to get GroupManager service" , err);
                self._clearUser(callback,scope);
            }
        }, this);
    },

    _clearUser: function(callback,scope) {
        Ext.io.User.currentUser = undefined;
        this.removeCached();
        Ext.io.Io.getIdStore().remove('user','sid');
        Ext.io.Io.getIdStore().remove('user','id');
        if (callback) callback.call(scope);
    },

    /**
     * Checks to see if the User has an active connection to the server.
     *
     *          user.isConnected(
     *              function(isConnected){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after determining whether user is connected.
     * @param {Object} callback.isConnected Boolean indicating whether user is connected.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     * A connected user is a user that has a web socket connection open to the server and is logged in.
     *
     */
    isConnected: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "PresenceService"},
                function(presenceService,err) {
                    if(presenceService){
                        presenceService.isConnectedUser(function(result) {
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
    },

    /**
     * @private
     * Get a Store
     *
     * All instances of a user have access to the same stores. 
     *
     *          user.getStore(
     *               {
     *                   name:music,
     *                   city:austin
     *               },
     *               function(store){
     *               }
     *           );     
     *
     * @param {Object} options Store options may contain custom metadata in addition to the name, which is manadatory
     * @param {String} options.name Name of the store
     *
     * @param {Function} callback The function to be called after getting the store.
     * @param {Object} callback.store The named {Ext.io.Channel} if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getStore: function(options,callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "NamingRpcService"},
                function(namingRpc,err) {
                    if(namingRpc){
                        namingRpc.getStore(function(result) {
                            if(result.status == "success") {
                                var store = Ext.create('Ext.io.Store', {id:result.value._key, data:result.value.data});
                                callback.call(scope,store);
                            } else {
                                callback.call(scope,undefined,result.error);
                            }
                        }, this.getId(), options);
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
     * Find stores that match a query.
     * 
     * Returns all the store objects that match the given query. The query is a String
     * of the form name:value. For example, "city:austin", would search for all the
     * stores in Austin, assuming that the app is adding that attribute to all
     * its stores. 
     *
     *       user.findStores(
     *           {query:'city:austin'},
     *           function(stores){
     *           }
     *       );
     *
     * @param {Object} options An object which may contain the following properties:
     * @param {Object} options.query
     *
     * @param {Function} callback The function to be called after finding the matching stores.
     * @param {Object} callback.stores The {Ext.io.Store[]} matching stores found for the App if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    findStores: function(options,callback,scope) {
        this.findRelatedObjects(Ext.io.Store, this.getId(), null, options.query, callback, scope);    
    },

    /**
     * Get all stores that belong to this user
     *
     *          user.getStores(
     *              function(stores){
     *              } 
     *          );
     *
     * @param {Function} callback The function to be called after getting the stores that belong to this user.
     * @param {Object} callback.stores Array of {Ext.io.Store} objects that belonging to this Group.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     *
     */
    getStores: function(callback,scope) {
        if(Ext.cf.util.ParamValidator.validateCallbackScope(arguments, "Ext.io.User", "getStores")) {
            this.getRelatedObjects(Ext.io.Store, null, callback, scope);
        }
    }

});

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


/** 
 * @private
 * The proxy is documented in the Ext.io.Store class, as is makes more sense
 * to have that in the docs structure.
 */
Ext.define('Ext.io.data.Proxy', {
    extend: 'Ext.data.proxy.Client',
    alias: 'proxy.syncstorage',
    requires: [
        'Ext.cf.Utilities',
        'Ext.cf.data.SyncProxy',
        'Ext.cf.data.SyncStore',
        'Ext.cf.data.Protocol'
    ],

    proxyInitialized: false,
    proxyLocked: true,
   
    config: {
        databaseName: undefined,
        deviceId: undefined,
        owner: null,
        access: null,
        userId: undefined,
        groupId: undefined,
        localSyncProxy: undefined,
        clock: undefined
    },
    
    /**
     * @private
     *
     * Constructor
     *
     * @param {Object} config
     *
     */
    constructor: function(config) {
        this.logger = Ext.cf.util.Logger;
        var validated = Ext.cf.util.ParamValidator.validateApi([
            { name: "config", type: "object",
                keys: [
                    { name: "id", type: 'string' }
                ]
            }
        ], arguments, 'Ext.io.data.Proxy', 'constructor');
        this.setDatabaseName(config.id);
        this.proxyLocked= true;
        this.proxyInitialized= false;
        this.initConfig(config);
        this.callParent([config]);
        //
        // Check the Database Directory
        //   The store might be known about, but was cleared.
        //
        var directory= Ext.io.Io.getStoreDirectory();
        var db= directory.get(this.getDatabaseName(), "syncstore");
        if(db){
            directory.add(this.getDatabaseName(), "syncstore");
        }
    },

    /**
     * @private
     * Create
     *
     */
    create: function(){
        var a= arguments;
        this.with_proxy(function(remoteProxy){
            remoteProxy.create.apply(remoteProxy,a);
        },this);
    },

    /**
     * @private
     * Read
     *
     */
    read: function(){
        var a= arguments;
        this.with_proxy(function(remoteProxy){
            remoteProxy.read.apply(remoteProxy,a);
        },this);
    },

    /**
     * @private
     * Update
     *
     */
    update: function(){
        var a= arguments;
        this.with_proxy(function(remoteProxy){
            remoteProxy.update.apply(remoteProxy,a);
        },this);
    },

    /**
     * @private
     * Destroy
     *
     */
    destroy: function(){
        var a= arguments;
        this.with_proxy(function(remoteProxy){
            remoteProxy.destroy.apply(remoteProxy,a);
        },this);
    },

    /**
     * @private
     * Set Model
     *
     */
    setModel: function(){
        var a= arguments;
        this.with_proxy(function(remoteProxy){
            remoteProxy.setModel.apply(remoteProxy,a);
        },this);
        this.callParent(arguments);
    },
    
    /**
     * @private
     * Sync
     *
     * @param {Object} store The store this proxy is bound to. The proxy fires events on it to update any bound views.
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    sync: function(store,callback,scope) {
      
        if(this.proxyLocked){
            // 
            // if there are local updates to be applied, then we should queue the call, and call it once the sync in progress has completed.
            //
            if(this.storeHasUpdates(store)){
                // JCM queue the request to sync
                // JCM do another sync when this one finishes
                // JCM we only have to queue one..?
                if(callback) {
                    callback.call(scope,{r:'error',message:'local updates do need to be synched, but a remote sync is currently in progress'});
                }
            }else{
                //
                // if there are no local updates, then we do nothing, since the sync in progress is already doing the requested sync. 
                //
                if(callback) {
                  callback.call(scope,{r:'ok',message:'no local updates to sync, and remote sync is already in progress'});
                }
            }
        } else {
            this.with_proxy(function(remoteProxy){
                this.proxyLocked= true;
                try {
                    //
                    // sync the local storage proxy
                    //
                    var changes= store.storeSync();
                    //if something changed locally fire refresh now.
                    if(changes && (changes.added.length + changes.updated.length + changes.removed.length) > 0){
                        store.fireEvent('refresh');  
                    }
                    
                    store.removed= []; // clear the list of records to be deleted
                    //
                    // sync the remote storage proxy
                    //
                    this.logger.info('Ext.io.data.Proxy.sync: Start sync of database:',this.getDatabaseName());
                    this.protocol.sync(function(r){
                        if(r.r=='ok'){
                            this.setDatabaseDefinitionRemote(true); // the server knows about the database now
                        }
                        this.updateStore(store,r.created,r.updated,r.removed);
                        this.proxyLocked= false;
                        this.logger.info('Ext.io.data.Proxy.sync: End sync of database:',this.getDatabaseName());
                        if(callback) {
                            callback.call(scope,r);
                        }
                    },this);
                } catch (e) {
                    this.proxyLocked= false;
                    this.logger.error('Ext.io.data.Proxy.sync: Exception thrown during synchronization');
                    this.logger.error(e);
                    this.logger.error(e.stack);
                    throw e;
                }
            },this);
        }
    },

    /**
     * @private
     *
     * Check if the store has any pending updates: add, update, delete
     *
     * @param {Object} store
     */
    storeHasUpdates: function(store) {
        var toCreate = store.getNewRecords();
        if(toCreate.length>0) {
            return true;
        }else{
            var toUpdate = store.getUpdatedRecords();
            if(toUpdate.length>0){
                return true;
            }else{
                var toDestroy = store.getRemovedRecords();
                return (toDestroy.length>0);
            }
        }
    },

    /**
     * @private
     *
     * Update the store with any created, updated, or deleted records.
     *
     * Fire events so that any bound views will update themselves.
     *
     * @param {Object} store
     * @param {Array} createdRecords
     * @param {Array} updatedRecords
     * @param {Array} removedRecords
     */
    updateStore: function(store,createdRecords,updatedRecords,removedRecords){
        var changed = false;
        var l, i;
        if(createdRecords && createdRecords.length>0) {
            store.data.addAll(createdRecords);
            store.fireEvent('addrecords', this, createdRecords, 0);
            changed = true;
        }
        if(updatedRecords && updatedRecords.length>0) {
            store.data.addAll(updatedRecords);
            l = updatedRecords.length;
            for(i = 0; i < l; i++ ){
              store.fireEvent('updaterecord', this, updatedRecords[i]);  
            }
            changed = true;
        }
        if(removedRecords && removedRecords.length>0) {
            l= removedRecords.length;
            for(i=0;i<l;i++){
                var id= removedRecords[i].getId();
                store.data.removeAt(store.data.findIndexBy(function(i){ // slower, but will match
                    return i.getId()===id;
                }));
            }
            store.fireEvent('removerecords', this, removedRecords);
            changed = true;
        }
        if(changed) {
            //
            // We only want to call refresh if something changed, otherwise sync will cause
            // UI strangeness as the components refresh for no reason.
            //
            store.fireEvent('refresh');
        }
    },
    
    /**
     * @private
     * Clear
     *
     * The proxy can be reused after it has been cleared.
     *
     */
    clear: function() {
        if(this.proxyInitialized) {
            this.proxyLocked= true;
            this.setDatabaseDefinitionLocal(false); // we no longer have a local copy of the data
            this.remoteProxy.clear(function(){ // JCM why are we clearing the remote... shouldn't it clear the local?
                delete this.localProxy;
                delete this.remoteProxy;
                delete this.protocol;
                this.proxyInitialized= false;
                this.proxyLocked= false;
            },this);
        }
    },
    
    // private

    /**
     * @private
     *
     * Set DB Definition = Local
     *
     * @param {Boolean/String} flag
     *
     */
    setDatabaseDefinitionLocal: function(flag){
        Ext.io.Io.getStoreDirectory().update(this.getDatabaseName(), "syncstore", {local: flag});
    },
    
    /**
     * @private
     *
     * Set DB Definition = Remote
     *
     * @param {Boolean/String} flag
     *
     */
    setDatabaseDefinitionRemote: function(flag){
        Ext.io.Io.getStoreDirectory().update(this.getDatabaseName(), "syncstore", {remote: flag});
    },

    /**
     * @private
     *
     * create the local proxy, remote proxy, and protocol
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    with_proxy: function(callback,scope) {
        if(this.proxyInitialized){
            callback.call(scope,this.remoteProxy);
        }else{
            this.createLocalProxy(function(localProxy){
                this.localProxy= localProxy;
                this.createRemoteProxy(function(remoteProxy){
                    this.remoteProxy= remoteProxy;
                    
                    
                    this.protocol= Ext.create('Ext.cf.data.Protocol',{proxy:this.remoteProxy, owner: this.getOwner(), access: this.getAccess()});
                    Ext.cf.Utilities.delegate(this,this.remoteProxy,['read','update','destroy']);
                    this.setDatabaseDefinitionLocal(true); // we have a local copy of the data now
                    this.proxyLocked= false; // we're open for business
                    this.proxyInitialized= true;
                    callback.call(scope,remoteProxy);
                },this);
            },this);
        }
    },

    /**
     * @private
     *
     * create local storage proxy
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    createLocalProxy: function(callback,scope) {
        //
        // Local Storage Proxy
        //
        var syncStoreName= this.getLocalSyncProxy()||'Ext.cf.data.SyncStore';
        var localProxy= Ext.create(syncStoreName);
        localProxy.asyncInitialize(this.getCurrentConfig(),function(r){
            if(r.r!=='ok'){
                this.logger.error('Ext.io.data.Proxy: Unable to create local proxy:',syncStoreName,r);
            }
            callback.call(scope,localProxy);
        },this);
    },

    /**
     * @private
     *
     * create remote storage proxy
     *
     * @param {Function} callback
     * @param {Object} scope
     *
     */
    createRemoteProxy: function(callback,scope) {
        var databaseDefinition= {
            databaseName: this.getDatabaseName(),
            generation: '0'
        };
        var config= {
            databaseDefinition: databaseDefinition,
            replicaDefinition: {
                replicaId: '0'
            },
            store: this.localProxy,
            clock: this.getClock()
        };
        var remoteProxy= Ext.create('Ext.cf.data.SyncProxy');
        remoteProxy.asyncInitialize(config,function(r){
            if(r.r!=='ok'){
                this.logger.error('Ext.io.data.Proxy: Unable to create remote proxy:',r);
            }
            callback.call(scope,remoteProxy);
        },this);
    }

});



Ext.define("Ext.io.data.DirectoryModel", {
    extend: "Ext.data.Model",
    config: {
		identifier: 'uuid', //required by touch but ignored by ext.
        fields: [
            { name:'name', type: 'string' },
            { name:'type', type: 'string' },
            { name:'meta', type: 'auto' }
        ]
    }
});

    /** 
     * @private
     *
     * A directory of stores in local storage.
     *
     */
    Ext.define('Ext.io.data.Directory', {
        requires: [
            'Ext.data.Store',
            'Ext.io.data.DirectoryModel',
            'Ext.data.Batch' /* EXTJS */
        ],
        store: undefined,
        
        /**
         * @private
         *
         * Constructor
         *
         * @param {Object} config
         *
         */
        constructor: function(config) {
            this.store = Ext.create('Ext.data.Store', {
                model: 'Ext.io.data.DirectoryModel',
                sorters: [
                    {
                        property : 'name',
                        direction: 'ASC'
                    }               
                ],
                proxy: {
                    id: 'ext-io-data-directory',
                    type: 'localstorage'
                },
                autoLoad: true,
                autoSync: true
            });
        },

        /**
         * Get Store
         *
         * @param {String} name
         *
         * @return {Object} Store
         *
         */
        get: function(name) {
            var index = this.store.find("name", name);
            if(index == -1) { // not found
                return null;
            } else {
                return this.store.getAt(index).data;
            }
        },

        /**
         * Get all stores
         *
         * @return {Array} Stores
         *
         */
        getAll: function() {
            var entries = this.store.getRange();
            var all = [];

            for(var i = 0; i < entries.length; i++) {
                all[i] = entries[i].data;   
            }

            return all;
        },

        /**
         * Get each store entry
         *
         * @param {Function} callback
         * @param {Object} scope
         *
         * @return {Object} Store entry
         *
         */
        each: function(callback, scope) {
          this.store.each(function(entry) {
              return callback.call(scope || entry.data, entry.data);
          }, this);  
        },

        /**
         * Add new store entry
         *
         * @param {String} name
         * @param {String} type
         * @param {String} meta
         *
         */
        add: function(name, type, meta) {
            var entry = Ext.create('Ext.io.data.DirectoryModel', {
                name: name,
                type: type,
                meta: meta
            });

            this.store.add(entry);
        },

        /**
         * Update store
         *
         * @param {String} name
         * @param {String} type
         * @param {String} meta
         *
         */
        update: function(name, type, meta) {
            var index = this.store.find("name", name);
            if(index == -1) { // not found
                this.add(name, type, meta);
            } else {
               var record = this.store.getAt(index);
               record.set("type", type);
               record.set("meta", meta);
              // record.save();
            }
        },

        /**
         * Remove store
         *
         * @param {String} name
         *
         */
        remove: function(name) {
            var index = this.store.find("name", name);
            if(index != -1) {
                this.store.removeAt(index);
            }

            return index;
        }
    });


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


/**
 * @private
 *
 * Base authentication class. All other authentication methods should
 * inherit from this class and implement the appropriate methods.
 */
Ext.define('Ext.io.auth.Base', {

    config: {
        loginView: "Ext.io.ux.AuthSencha",

        authButtonConfig: {
            authType: "sio",
            text: "Sencha"
        },

        initComplete: false
    },

    constructor: function (config) {
        this.initConfig(config);
    },


    /**
     * Called once per application load. Can be used to
     * initialize 3rd party auth libraries.
     *  Base implementation will execute callback immediately.
     * @param {Object} group associated with this application.
     * @param {Function} callback the function to call when init completes.
     * @param {Object} scope the scope to give to the callback function.
     */
    init: function (group, callback, scope) {
        this.setInitComplete(true);
        callback.call(scope);
    },


    /*
     * Check to see if the user is currently authenticated with
     * a 3rd party provider.
     * @param {Object} Authentication configuration details. This will include whatever config data
     *                 the application/group has about the 3td party auth scheme (api keys, callback urls etc)
     * @param {Function} callback the function to call when checkAuth completes.
     * @param {Boolean} callback.isAuth boolean to indicate if the user is authenticated or not
     * @param {Object} callback.authData auth method specific user data to be passed to sencha.io
     * @param {Object} scope the scope to give to the callback function.
     */
    checkAuth: function (group, callback, scope) {
        callback.call(scope, false, {});
    },


    /*
     * onAuth is called to fetch the 3rd party user credentials when the user is already authenticated
     * with the 3rd party but is not yet authenticated when sencha.io.
     * @param {Function} callback the function to call when checkAuth completes.
     * @param {Boolean} callback.isAuth boolean to indicate if the user is authenticated or not
     * @param {Object} callback.authData auth method specific user data to be passed to sencha.io
     * @param {Object} scope the scope to give to the callback function.
     */
    onAuth: function (auth, callback, scope) {
        callback.call(scope, {});
    },


    /*
     * Called when the user is logging out.  Should remove 3rd party authorization for this
     * application.
     */
    logout: function (callback, scope) {
        callback.call(scope);
    },


    /**
     * For auth methods that require an http redirect (oauth, facebook twitter etc) this method
     * saves the current url so it can be restored after auth is complete.
     */
    saveCurrentPath: function () {
        Ext.io.Io.getIdStore().setId('auth.preurl', document.location.href);
    },


    /**
     * Restore the saved url using html5 replaceState after auth has completed.
     */
    restorePreviousPath: function () {
        var previous = Ext.io.Io.getIdStore().getId('auth.preurl');
        if (previous) {
            history.replaceState({}, "", previous);
            Ext.io.Io.getIdStore().remove('auth.preurl');
        }
    }
});

/**
 * @private
 * Facebook authentication method.
 */
Ext.define('Ext.io.auth.Facebook', {
    extend: 'Ext.io.auth.Base',

    config: {
        loginView: "Ext.io.ux.AuthFacebook",

        authButtonConfig: {
            authType: "fb",
            text: "Facebook"
        },

        initComplete: false
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    checkAuth: function (group, callback, scope) {
        var opts = Ext.Object.fromQueryString(document.location.search);
        var code = opts["code"];
        if (code) {
            callback.call(scope, true, {
                provider: "facebook",
                callbackPath: this.getCallbackPath(),
                query: {
                    code: code
                }
            });
        } else {
            callback.call(scope, false, {});
        }
    },


    getCallbackPath: function () {
        return window.location.protocol + "//" + window.location.host + window.location.pathname;
    },


    onAuth: function (auth, callback, scope) {
        this.restorePreviousPath();
        callback.call(scope, auth);
    },

    logout: function (callback, scope) {

    }
});

/**
 * @private
 * twitter authentication method.
 */
Ext.define('Ext.io.auth.Twitter', {
    extend: 'Ext.io.auth.Base',

    config: {
        loginView: "Ext.io.ux.AuthTwitter",

        authButtonConfig: {
            authType: "twitter",
            text: "Twitter"
        },
        oauthUrl: "",

        initComplete: false
    },

    constructor: function (config) {
        this.initConfig(config);
    },


    /**
     * @private
     */
    init: function (group, callback, scope) {
        if (this.getInitComplete()) {
            callback.call(scope);
        }

        var args = {
            groupId: group.getId(),
            provider: "twitter",
            callbackPath: this.getCallbackPath()
        };

        var fn = Ext.bind(function (result) {
            this.setOauthUrl(result.returnuri);
            this.setInitComplete(true);
            callback.call(scope);
        }, this);

        Ext.io.Io.getMessagingProxy(function (messaging) {
            messaging.getService({
                name: "GroupManager"
            },

            function (groupManager, err) {
                if (groupManager) {
                    groupManager.loginUser(fn, args);
                } else {
                    callback.call(scope, err);
                }
            },
            this);
        }, this);

    },

    getCallbackPath: function () {
        return document.location.href;
    },


    checkAuth: function (group, callback, scope) {
        var opts = Ext.Object.fromQueryString(document.location.search);
        var authToken = opts["oauth_token"];
        var oauthVerifier = opts["oauth_verifier"];

        if (authToken) {
            callback.call(scope, true, {
                provider: "twitter",
                callbackPath: this.getCallbackPath(),
                oauth: {
                    token: authToken,
                    verifier: oauthVerifier
                }
            });
        } else {
            callback.call(scope, false, {});
        }
    },


    onAuth: function (auth, callback, scope) {
        this.restorePreviousPath();
        callback.call(scope, auth);
    },

    logout: function (callback, scope) {
        callback.call(scope, true, {});
    }
});

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

/**
 * @private
 *
 */
Ext.define('Ext.io.Replica', {
    extend: 'Ext.io.Object',
        
    statics: {

        /** 
         * @static
         * 
         * @param {Object} options
         *
         * @param {Function} callback The function to be called after getting replica.
         * @param {Object} error object
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }
    }

});


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

/**
 * @private
 * Version
 */
Ext.define('Ext.io.Version', {
    extend: 'Ext.io.Object',
        
    statics: {

        /**
         * @static
         * Get Version
         *
         * @param {Object} options
         * @param {String} options.id
         *
         * @param {Function} callback
         *
         * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
         * the callback function.
         */
        get: function(options,callback,scope) {
            this.getObject(options.id, callback, scope);
        }
    },

    /**
     * Deploy
     *
     *
     * @param {Function} callback
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    deploy: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "VersionService"},
                function(versionService,err) {
                    if(versionService){
                        versionService.deploy(function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.getId());
                    }else{
                        callback.call(scope,err);
                    }
                },
                this
            );
        },this);
    },

    /**
     * Undeploy
     *
     *
     * @param {Function} callback
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    undeploy: function(callback,scope) {
        Ext.io.Io.getMessagingProxy(function(messaging){
            messaging.getService(
                {name: "VersionService"},
                function(versionService,err) {
                    if(versionService){
                        versionService.undeploy(function(result) {
                            if(result.status == "success") {
                                callback.call(scope);
                            } else {
                                callback.call(scope,result.error);
                            }
                        }, this.getId());
                    }else{
                        callback.call(scope,err);
                    }
                },
                this
            );
        },this);
    },

    /**
     * Get App
     *
     * @param {Function} callback The function to be called after getting the App object.
     * @param {Object} callback.app The {Ext.io.App} associated with this Device if the call succeeded.
     * @param {Object} callback.err an error object.
     *
     * @param {Object} scope The scope in which to execute the callbacks: The "this" object for
     * the callback function.
     */
    getApp: function(callback,scope) {
        this.getRelatedObject(Ext.io.App, null, null, callback, scope);
    }

});

