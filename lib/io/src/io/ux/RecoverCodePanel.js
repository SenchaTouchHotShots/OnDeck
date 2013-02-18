/**
*  
*/
if (!Ext.getVersion('extjs')) {
    Ext.define('Ext.io.ux.RecoverCodePanel', {
        extend: 'Ext.Panel',
        
        requires: [
        "Ext.Button"
        ],
        
         

        config: {
            
            control: {

                "button[action=sioResetPassword]": {
                  tap: "resetPassword"
                }
            },
            
            recoveryId: "", // the username or email address that user is attempting to reset. 
            title: "Recovery Code",
     
            left: 0,
            top: 0,

            modal: true,
            hideOnMaskTap: true,

            hidden: true,

            width: Ext.os.deviceType == 'Phone' ? 260 : 400,
            height: 300,
            
            layout: "fit",

            items:[
                { xtype: "formpanel",
                    items: [
                        {html: "Check your email for a recovery code:"},
                        {
                            xtype: 'fieldset',
                            items: [
                            {
                                xtype: 'textfield',
                                placeHolder: "Code",
                                name: 'code'
                            },
                            {
                                xtype: 'passwordfield',
                                placeHolder: "New Password",
                                name: 'password'
                            },
                            {
                              xtype: "button",
                              text: "Reset Password",
                              width: "80%",
                              action: "sioResetPassword",
                              ui: 'action',
                              margin: "10",
                              align: "center"
                            }
                            ]
                        }
                    ]
                }    
            ]
        },
    
        resetPassword: function(){
            var form = this.query('.formpanel')[0];
            
             Ext.Viewport.setMasked({
                  xtype: 'loadmask',
                  message: 'Verifying...',
                  indicator: true
            });
            
            var values = form.getValues();
            var code = values["code"];
            var newpass = values["password"];
            
            Ext.io.Group.getCurrent(function(group){
                if(group){
                    group.resetPassword({email: this.getRecoveryId(), code: code, newpass: newpass}, function(success, error){
                        Ext.Viewport.setMasked(false);
                        if(success){
                            Ext.Msg.alert('Password', 'Password Reset', Ext.bind(function(){this.fireEvent("passwordrest");}, this));
                            this.hide();
                        } else {
                            Ext.Msg.alert('Error', error.message, Ext.emptyFn);
                        }
                    }, this);
                }    
            }, this);
        }
        
        
        
        
    });
}