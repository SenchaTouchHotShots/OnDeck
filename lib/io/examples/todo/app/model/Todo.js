/**
*  Model for the individual Task in the todo list.
*  the modle has fields for the task itself, 
*  a completed boolean and a timestamp for 
*  when the record was created.
*
*/
Ext.define('MyApp.model.Todo', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                defaultValue: '',
                name: 'task',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'completed',
                type: 'boolean'
            },
            {
                name: 'timestamp',
                type: 'int'
            }
        ]
    }
});