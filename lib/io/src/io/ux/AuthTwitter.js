/**
* Default Facebook login panel.  Ext.io.Controller will automatically display this panel if the application is configured to use Facebook as its login type. 
*
*/
if (!Ext.getVersion('extjs')) {
    Ext.define("Ext.io.ux.AuthTwitter", {
        extend: 'Ext.Container',
        requires: ["Ext.TitleBar","Ext.form.Panel", "Ext.form.FieldSet", "Ext.field.Password", "Ext.field.Email"],




   /**
     * @event loginUser
     * Fired when the user has entered their auth credentials.
     * {Ext.io.Controller} listens for this event and will attempt to login 
     * the user with the passed credentials. 
     * @param {Object} auth Key/values given by the user to authenticate with.
     */

    /**
      * @event cancel
      * Fired when the user doesn't want to login.
      * {Ext.io.Controller} listens for this event and will 
      * close the login pannel.
      */


        /**
        * @private
        * config
        */
        config: {
            fullscreen: true,
           
            control: {
                "button[action=cancellogin]": {
                    tap: "hideLogin"
                },
                
                "button[action=twlogin]": {
                    tap: "loginButtonTapped"
                }
            },
            items: [
                {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Login',
                    items: [
                    {
                        text: "cancel",
                        action: "cancellogin"
                    }
                    ]
                },
                {
                  xtype: "panel",
                  html: "To use this application please sign in with your Twitter account.",
                  padding: "10",
                  align: "center"
                },
                {
                  xtype: "button",
                  text: "Login with Twitter",
                  action: "twlogin",
                  width: "80%",
                  ui: 'action',
                  margin: "10",
                  align: "center"

                }
            ]
        },
        
        /**
        * Login button tapped
        */
        loginButtonTapped: function(button) {
          button.setDisabled(true);    
          
          this.redirectUrl = this.config.controller.getOauthUrl();
          
          this.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Twitter',
                    indicator: true
          });
          
          this.config.controller.saveCurrentPath();
          document.location.href=this.redirectUrl;
        },


        /**
        * Initialize
        */
        initialize: function(scope) {
          
            
        },


        /**
        * Reset the form to its default state.
        */
        resetForm: function() {
        //NA
        },


        /**
        * {Ext.io.Controller} will call this method when login fails.
        */
        showLoginErrors: function() {
            //NA //Ext.Msg.alert('Login Error', 'Invalid username or passsword', Ext.emptyFn);
        },


        /**
        * @private
        */
        hideLogin: function() {
            this.fireEvent("cancel");
        }


    });
}