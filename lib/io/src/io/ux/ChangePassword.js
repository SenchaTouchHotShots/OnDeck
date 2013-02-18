if (!Ext.getVersion('extjs')) {
    Ext.define("Ext.io.ux.ChangePassword", {
        extend: 'Ext.Panel',
        requires: ["Ext.TitleBar", "Ext.form.Panel", "Ext.form.FieldSet", "Ext.field.Password", "Ext.field.Email", "Ext.io.ux.RecoverCodePanel"],

        config: {
            
            control: {
                "button[action=sioChangePassword]" : {
                    tap: "onChangePassword"
                }
            },
            title: "Change Password",
            
            left: 0,
            top: 0,

            modal: true,
            hideOnMaskTap: true,

            hidden: true,

            width: Ext.os.deviceType == 'Phone' ? 260 : 400,
            height: 300,
            
            
            layout: "card",
            items: [{
                xtype: "formpanel",
                items: [
                {
                    html: Ext.io.ux.Strings.LABEL_CHANGE_PASSWORD
                },
                {
                    xtype: 'fieldset',
                    items: [
                    {
                        xtype: 'passwordfield',
                        placeHolder: Ext.io.ux.Strings.LABEL_OLD_PASSWORD,
                        name: 'oldpassword'
                    },
                    {
                        xtype: 'passwordfield',
                        placeHolder: Ext.io.ux.Strings.LABEL_NEW_PASSWORD,
                        name: 'newpassword'
                    },
                    {
                      xtype: "button",
                      text: Ext.io.ux.Strings.CHANGE_PASSWORD_BUTTON,
                      width: "80%",
                      action: "sioChangePassword",
                      ui: 'action',
                      margin: "10",
                      align: "center"
                    }
                    ]
                }]
            }]
        },
        
        /**
        * @private
        */
        getForm: function(){
            return this.query('.formpanel')[0];
        },
        
        onChangePassword: function(){
            
             this.setMasked({
                  xtype: 'loadmask',
                  message: Ext.io.ux.Strings.CHANGE_PASSWORD_MASK,
                  indicator: true
            });
            
            var form = this.getForm();
            var val = form.getValues();
            Ext.io.User.getCurrent(function(user){
                if(user){
                    user.changePassword({oldpass: val.oldpassword, newpass: val.newpassword}, function(success, error){
                        this.setMasked(false);
                        if(success){
                            Ext.Msg.alert(Ext.io.ux.Strings.MSGBOX_PASSWORD_TITLE, Ext.io.ux.Strings.CHANGE_PASSWORD_SUCCESS, Ext.emptyFn);
                            this.hide();
                        } else {
                            Ext.Msg.alert(Ext.io.ux.Strings.MSGBOX_ERROR_TITLE, error.message, Ext.emptyFn);
                        }
                    }, this);
                }    
            }, this);
        }
        
    });
}
