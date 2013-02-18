/**
* Set the path to Ext.io
*/
Ext.Loader.setPath({  
    'Ext': './touch/src',
    'Ext.io': './io/src/io'
});

Ext.application({

    models: ['Todo'],
    stores: ['Todos'],
    views:  ['Todos', 'Edit'],

    /**
    *  Add the application controller.
    */
    controllers: ['Ext.io.Controller', "Todos"],


    /**
    * Ext.io.Controller will read the application's config
    * to initialize sencha.io
    */
    io: {
        logLevel: "debug",
        appId:"4d8cbb76-d45a-49e4-be6b-596f9fe64574"
    },


    name: 'MyApp',

    launch: function() {
        Ext.create('MyApp.view.Todos', {
            fullscreen: true
        });
    }

});