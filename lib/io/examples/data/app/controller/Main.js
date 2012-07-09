/**
*  Locations application controller.  
*  - Listens to events from Ext.io.Controller
   - Creates and subscribes to a Channel
   - Publishes messages to a channel
   - Adds location records to locations store
   - updates the map with markers. 
*
*/
Ext.define('MyApp.controller.Main', {
    extend: 'Ext.app.Controller',
    
    requires:[
    'Ext.util.Geolocation'
    ],

    config: {
        control: {

           locationBtn: {
             tap: "publishLocation"
           }
            
        },

        refs: {
            locationBtn: "button[action=publishLocation]",
            locationMap: ".map"
        }
    },
    
    init: function() {
      
      /*
      *  For this applicaiton we only need to worry about the initComplete
      *  event so that we can setup our channel after init is complete.
      */
      this.getApplication().sio.on({
          initComplete: this.setupChannels,
          authorized: this.onAuth,
          scope: this
      });     
      
      var self = this;
      this.geo = Ext.create('Ext.util.Geolocation', {
          autoUpdate: false,
          listeners: {
              locationupdate: function(geo) {
                  console.log("locationupdate listener", geo);
                  self.updateLocation(geo);
              },
              locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                  console.log("could not get location", arguments);
              }
          }
      });
      
      /// keep track of the google maps markers. 
      this.markers = [];
      
      
       
    },
    
    
    onAuth: function(){
      console.log("onauth");
      this.getLocationStore().load();
      this.syncLocation(false);
      
    },
    
    setupChannels: function() {
      console.log("setupChannels");
      
      /**
      * Create a chanel with the name "testChannel"
      */
      Ext.io.Channel.get({
       
       name:"locationupdates" 
        
        
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
          console.log("I have channel message", arguments);
          this.syncLocation(false);  
        }, this);
        
      }, this);
      
    }, 
    
    /**
    * event handler for the textfield.tap event. 
    */
    publishLocation: function() {
         this.geo.updateLocation();      
    },
    
    
     updateLocation: function(geo) {
          console.log("updateLocation", geo);
          var locations = this.getLocationStore();
          var self = this;
          this.getApplication().sio.getUser(function(user) {
                  locations.sync(function() {
                      console.log("location sync before update");
                      if (user) {
                          self._updateLocation(user, geo);
                      }
                  });
          });
      },

      _updateLocation: function(user, geo) {
          var locations = this.getLocationStore();

          var record = locations.findRecord('userId', user.key);
          console.log("_updateLocation", locations, record, geo, user);

          var map = this.getLocationMap();
          var loc = new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());

          map.setMapCenter(loc);


          var marker = new google.maps.Marker({
                position: loc,
                map: map.getMap(),
                title:"ME!"
          });


          if (record) {

              record.set('lat', geo.getLatitude());
              record.set('long', geo.getLongitude());
              record.set('updated', new Date().getTime());

              console.log("updating");
          } else {
              console.log("creating");
              locations.add({
                  username: user.getData().username,
                  userId: user.getId(),
                  lat: geo.getLatitude(),
                  "long": geo.getLongitude(),
                  updated: new Date().getTime()
              });
          }


          this.syncLocation(true);

      },

      updateMarkers: function() {

        var locations = this.getLocationStore();
        var all = locations.getData().all;

        var map = this.getLocationMap().getMap();

        for(var i =0, l = all.length; i<l;i++) {
          var record = all[i];
          
          var username = record.get('username');
          
          var lat = record.get('lat');
          var lng = record.get('long');
          
          if(username && lat && lng) {
             var marker = this.markers[username];
             var loc = new google.maps.LatLng(lat,lng);
             if(marker){
               marker.setMap(null);
               delete this.markers[username];
             } 

             marker = new google.maps.Marker({
                   position: loc,
                   map: map,
                   title:username
             });
             console.log("new marker", marker);
             this.markers[username] = marker;

          }

        }

      },

      getLocationStore: function() {
          return Ext.getStore('locations');
      },

      syncLocation: function(publishAfterSync) {
          var location = this.getLocationStore();
          var btn = this.getLocationBtn();
          var sio = this.getApplication().sio;
          btn.setDisabled(true);
          var self = this;
          location.sync(function() {
              btn.setDisabled(false);
              console.log("location sync callback", arguments);
              if (publishAfterSync === true) {
                  self.channel.publish({message:{channel: "updated"}}, function(){ console.log("publish complete", arguments);  });
              }
              self.updateMarkers();
          });
          globalMap = this.getLocationMap();
          console.log("map", this.getLocationMap());
      }

    
    
    
  });