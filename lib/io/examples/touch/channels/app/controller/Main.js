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

            "button[action=pause]": {
                tap: "togglePause"
            },


            "button[action=preferences]": {
                tap: "showPreferences"
            },
    
            textInput: {
                action: "sendMessage"
            },
            
            list: {
                itemswipe: "toggleTodo"
            }
            
        },

        refs: {
            list: "list",
            textInput: "#messageField"
        }
    },
    
    getChannel: function(){
        return this.getApplication().sio.getChannel('test');
    },

    showPreferences: function(){
        if(Ext.io.User.currentUser){
            var currentUser = Ext.io.User.currentUser;
            var data = currentUser.getData();
            var value = currentUser && data.custom && data.custom.alias ? data.custom.alias : "";

            Ext.Msg.prompt('Preferences', 'Alias to show other users:', function(what, alias) {
                if(what == "ok" && alias.length>0){
                    Ext.io.User.currentUser.update({custom: {alias: alias }}, function(){console.log("alias updated");});
                }
            },
            this,
            false,
            value
            );


        }
        
        
    },
    
    /** 
    *Binds or unbinds a store to a channel. 
    */
    togglePause: function(button) {
        console.log("togglePause", arguments);  
        var channel = this.getChannel();
        this.paused = !this.paused;
        channel.disableStore("messages", this.paused);
        if(button){
            button.setText(this.paused ?  "resume" : "pause" );    
        }
        
    },

    /**
    * Adds a message to the messages store. 
    */
    addMessage: function(message) {
        var messages = Ext.getStore('messages');
        messages.add({message:message, user: "me", ts: new Date().getTime()});
        messages.sync();
    },
    
    /**
    * event handler for the textfield.tap event. 
    */
    sendMessage: function(textfield, e, options) {
        console.log("sendMessage");
        var ts = Ext.Date.format(new Date(), 'G:i:s');
        var message = textfield.getValue()  + " (" + ts + ")";
        /**
        * Add the message to the local store first. 
        */
        this.addMessage(message);
        
        var channel = this.getChannel();
        
    
        
        if(channel){
          //Publish the message to the channel.
          channel.publish({message: {message: message}}, function(){console.log("publish callback", arguments)});
        } else {
          console.error("something went wrong on setup, we don't have a channel.");
        }
        
        textfield.setValue("");        
    }

    
    
    
  });