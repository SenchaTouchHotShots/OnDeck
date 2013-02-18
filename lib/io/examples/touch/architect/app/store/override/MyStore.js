Ext.define('MyApp.store.override.MyStore', {
    override: 'MyApp.store.MyStore',
    
    constructor: function() {
        this.callParent(arguments);
        this.setProxy({
            type: 'syncstorage',
            id: 'things',
            owner: 'user',
            access: 'private'
    });
    }
});