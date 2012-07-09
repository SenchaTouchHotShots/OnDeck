/**
*  A store that groups 'tasks' by completed or not completed.
*  Sorts first by timestamp then by the task itself. 
*   This store uses a syncstorage proxy which means that it will
*   synchronize its data with the sencha.io servers.
*   The owner is set to user and access is set to private.
*   The data stores in a user/private store can only be see by 
*   that user on any of their devices.
*   The syncstorage proxy has an id of 'todos'
*/
Ext.define('MyApp.store.Todos', {
    extend: 'Ext.data.Store',
    requires: [
        'MyApp.model.Todo'
    ],

    config: {
        autoLoad: true,
        model: 'MyApp.model.Todo',
        storeId: 'todos',
        proxy: {
            type: 'syncstorage',
            id: 'todos',
            owner: 'user',
            access: 'private'
        },
        autoLoad: true,  //set auto load to true so that any local data will 
                         // populated in memory
        autoSync: false, // Wait until we have an authenciated user to
                         // and call sync manually. see MyApp.controller.Todos
        grouper: {
            groupFn: function(record) {
                return record.get('completed') ? "Complete" : "Tasks";
            },
            sortProperty: 'completed'
        },
        
        sorters: [
               {
                   property : 'timestamp',
                   direction: 'DESC'
               },
               {
                   property : 'task',
                   direction: 'ASC'
               }
        ],
        
    }
});