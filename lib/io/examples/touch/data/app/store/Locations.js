/**
*  Ext.data.Store that will keep our list of messages we get from the channel
*  The proxy type is localstorage so that the messages will be presisted on 
*  the device.
*/
Ext.define('MyApp.store.Locations', {
    extend: 'Ext.data.Store',
    requires: [
        'MyApp.model.Location'
    ],

    config: {
        autoLoad: true,
        model: 'MyApp.model.Location',
        storeId: 'locations',
        proxy: {
            type: 'syncstorage',
            owner: 'user',
            access: 'public',
            id: 'userlocations'
        },
        autoLoad: false,
        autoSync: false 
    }
});