/**
* A application that demonstrates shared data stores. 
*
  - Users share their location with other users of the application.
  - Ext.Map and the Google Maps API display the users locations.
  - A shared data store keeps a list of all of the user shared locations
  - An Ext.io.Channel is used to notify users of store changes.
  - Authentication is required for this application.  
  - An auth dialog is presneted on startup if the user is not already authorized.
*
*/


/**
* Set the path to Ext.io and Ext.cf 
*/
Ext.Loader.setPath({
    'Ext.io': '../../src/io',
    'Ext.cf': '../../src/cf'
});

Ext.application({
  
    models: [
        'Location'
    ],
    stores: [
        'Locations'
    ],
    views: [
        'Locations'
    ],

    
    /*
    * include Ext.io.Controller to manage the sencha.io connection
    */
    controllers: ['Ext.io.Controller', "Main"],
    
    
    /*
    *  Add sencha.io app configuration.
    */
     config: {
        io: {
            appId: "K17X03vQvrNGZEGCpIs46ivIEoT",
            appSecret: "35c313wy9UMuofvH",
        }    
      },
    
    
    name: 'MyApp',

    launch: function() {
      Ext.create('MyApp.view.Locations', {fullscreen: true});
    },

});