/**
*  Ext.io.Channel that will send and receive messages on the 'map' channel.
*  Used by Main controller 
*/
Ext.define('MyApp.channel.Map', {
    extend: 'Ext.io.Channel',
    config: {
        name:"map"
    }
});