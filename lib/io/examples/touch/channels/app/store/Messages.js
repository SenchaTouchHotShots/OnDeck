/**
*  Ext.data.Store that will keep our list of messages we get from the channel
*  The proxy type is localstorage so that the messages will be presisted on 
*  the device.
*/
Ext.define('MyApp.store.Messages', {
    extend: 'Ext.data.Store',
    requires: [
        'MyApp.model.Message'
    ],

    config: {
        model: 'MyApp.model.Message',
        storeId: 'messages',
        autoLoad: true,
        autoSync: true,
        sorters: [
           {
               property : 'ts', 
               direction: 'DESC'
           }
        ]
    }
});