/**
* We need to tell Ext where to find sencha.io
*/
Ext.Loader.setPath({
    'Ext.io': '../../src/io',
    'Ext.cf': '../../src/cf'
});

Ext.application({

    models: [
    'Todo'
    ],
    stores: [
    'Todos'
    ],
    views: [
    'Todos'
    ],

    /**
    *  Add the application controller.
    */
    controllers: ['Ext.io.Controller', "Todos"],


    /**
    * Ext.io.Controller will read the application's config
    * to initialize sencha.io
    */
    config: {
        io: {
            appId: "5ZarPd0Cu6XyZC15AVHTE1BXq6C",
            appSecret: "xlK93iMvE8nsYEfk"
        }
    },


    name: 'MyApp',

    launch: function() {
        Ext.create('MyApp.view.Todos', {
            fullscreen: true
        });


    },

});