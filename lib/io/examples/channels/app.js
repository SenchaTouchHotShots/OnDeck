/**
* A simple application that demonstrates how to use Ext.io.Channels 
*
*  For this application user login is optional.  If the user is authentcated in then the message
   are sent by the user. If they are not authentcated then the message is sent by the device. 
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
        'Message'
    ],
    stores: [
        'Messages'
    ],
    views: [
        'ChannelView'
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
            appId: "O6Xu1QorWSj2LgFYrg3nWKwFthr",
            appSecret: "sOrjbQer3SY7obv5",
            
            //We don't want to require a user login
            manualLogin: true
        }    
      },
    
    
    name: 'MyApp',

    launch: function() {
      Ext.create('MyApp.view.ChannelView', {fullscreen: true});
    },

});