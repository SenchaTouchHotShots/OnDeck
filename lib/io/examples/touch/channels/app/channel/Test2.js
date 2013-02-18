/**
*  Ext.io.Channel that can send and receive messages on the 'test' channel.
*  subscribeOnStart is set to false so messages on this channel will not
*  be automatically delivered.  The developer must call channel.subscribe()
*  to start receiving messages.
*/
Ext.define('MyApp.channel.Test2', {
    extend: 'Ext.io.Channel',
    config: {
        name:"test2",
        subscribeOnStart: false
    }
});