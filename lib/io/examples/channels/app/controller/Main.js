/**
*  Channels application controller.  
*  - Listens to events from Ext.io.Controller
   - Creates and subscribes to a Channel
   - Publishes messages to a channel
*
*/
Ext.define('MyApp.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        control: {

            
            textInput: {
                action: "sendMessage"
            },
            
            list: {
                itemswipe: "toggleTodo"
            },
            
        },

        refs: {
            list: "list",
            textInput: "textfield"
        }
    },
    
    init: function() {
      
      /*
      *  For this applicaiton we only need to worry about the initComplete
      *  event so that we can setup our channel after init is complete.
      */
      this.getApplication().sio.on({
          initComplete: this.setupChannels,
          scope: this
      });      
    },
    
    
    setupChannels: function() {
      console.log("setupChannels");
      
      /**
      * Create a chanel with the name "testChannel"
      */
      Ext.io.Channel.get({
       
       name:"testChannel2",
       foo: "bar"
        
      }, function(channel) {
        
        console.log("channel", arguments,this);
        
        /*
        * Keep a reference to the channel so we can publish later.
        */
        this.channel = channel;
        
        
        /*
        * Once we have the channel we can subscribe to it.
        * we will get a callback everytime there is a message 
        * delivered to this channel. 
        */
        channel.on("message", function(sender, message){
          console.log("channel message", sender, message);
          /*
          * Add the message to our store so that the user can see it.
          */
          messages = Ext.getStore("messages");
          
          messages.add({message: message.message })
          messages.sync();
        }, this);
        
      }, this);
      
    }, 

    /**
    * Adds a message to the messages store. 
    */
    addMessage: function(message) {
        var messages = Ext.getStore('messages');
        messages.add({message:message});
        messages.sync();
    },
    
    /**
    * event handler for the textfield.tap event. 
    */
    sendMessage: function(textfield, e, options) {
        console.log("sendMessage");
        var message = textfield.getValue();
        /**
        * Add the message to the local store first. 
        */
        this.addMessage(message);
        
        if(this.channel){
          //Publish the message to the channel.
          this.channel.publish({message: {message: message}}, function(){console.log("publish callback", arguments)});
        } else {
          console.error("something went wrong on setup, we don't have a channel.");
        }
        
        textfield.setValue("");        
    },

    
    
    
  });