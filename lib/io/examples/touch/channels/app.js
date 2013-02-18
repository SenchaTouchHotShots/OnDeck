/**
* A simple application that demonstrates how to use Ext.io.Channels 
*
*  For this application user login is optional.  If the user is authenticated in then the message
   are sent by the user. If they are not authenticated then the message is sent by the device. 
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
        'MyApp.channel.Test','MyApp.channel.Test2'
    ],
  
    models: ['Message'],
    stores: ['Messages'],
    views: ['ChannelView'],
   
    channels: ["Test", "Test2"], 
    
    /*
    * include Ext.io.Controller to manage the sencha.io connection
    */
    controllers: ['Ext.io.Controller', "Main"],
    
    /*
    *  Add sencha.io app configuration.
    */
    io: {
        logLevel: "debug",
        appId:"13d3e7eb-5b72-4dbf-a40e-d2a6a00bddcf"
    }, 
    
    
    name: 'MyApp',

    launch: function() {
      Ext.create('MyApp.view.ChannelView', {fullscreen: true});
    }

});