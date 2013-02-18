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
* Set the path to Ext.io
*/
Ext.Loader.setPath({  
    'Ext': './touch/src',
    'Ext.io': './io/src/io'
});

Ext.application({

    requires:[
        'MyApp.channel.Map' //required for the build tool.
    ],
  
    models: [
        'Location'
    ],
    stores: [
        'Locations'
    ],
    views: [
        'Locations'
    ],

    channels: ["Map"],

    
    /*
    * include Ext.io.Controller to manage the sencha.io connection
    */
    controllers: ['Ext.io.Controller', "Main"],
    
    
    /*
    *  Add sencha.io app configuration.
    */
    io: {
        logLevel: "debug",
        appId:"1289f7c3-608d-4fa5-be81-d1a253a891d9"
    },
  
    
    name: 'MyApp',

    launch: function() {
      Ext.create('MyApp.view.Locations', {fullscreen: true});
    }
});

//Populate some fake data on the map. Call from web inspector. 
 /* var locations = Ext.getStore("locations");
  locations.add({username: "steve", userId: "1", lat: "47.602501",long: "-122.340027", updated: new Date().getTime()}); 
  locations.add({username: "ryan", userId: "2", lat: "45.527938",long: "-122.659843", updated: new Date().getTime()});
  locations.add({username: "lax", userId: "4", lat: "33.9471",long: "-118.4082", updated: new Date().getTime()});
  locations.add({username: "nyc", userId: "3", lat: "40.7142",long: "-74.0064", updated: new Date().getTime()}); 
  locations.sync(function() { console.log("done", arguments)});*/

