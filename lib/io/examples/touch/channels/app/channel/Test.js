/**
*  Ext.io.Channel that will send and receive messages on the 'test' channel.
*  Each message the channel receives will be delivered to the messages store
*  If needed more than one store can be bound to the channel.
*/
Ext.define('MyApp.channel.Test', {
    extend: 'Ext.io.Channel',
    config: {
        name:"test", //channel name to create
        boundStores:{
            messages : {  // Ext.getStore('messages')
                enabled: true, // enable:true is default
                // declare a function to transform the sender and raw message into the record the store expects.
                // if this function returns anything other than an object then the record won't be added to the store.
                transform: function(cb, sender, message){
                    console.log("channel message transform", sender, message);
                    sender.getUser(function(user){
                        console.log("sender", user);
                        var alias = "unknown";
                        if(user){
                             var userData = user.getData();
                             if(userData){
                                if(userData.custom && userData.custom.alias){
                                    alias = userData.custom.alias;
                                } else {
                                    var email = userData.email;
                                    if(email){
                                        alias = email.split("@")[0];
                                    }
                                }
                             }
                        }
                        cb({message: message.message, user: alias, ts: new Date().getTime()});

                    });
                }
            }
        }
    }
});