/**
* A simple model for our messages. 
*/
Ext.define('MyApp.model.Location', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
           { name: 'username', type: 'string' },
           { name: 'userId', type: 'string' },
           { name: 'lat', type: 'string' },
           { name: 'long', type: 'string' },
           { name: 'updated', type: 'int' }
        ]
    }
});