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