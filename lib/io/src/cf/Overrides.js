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
