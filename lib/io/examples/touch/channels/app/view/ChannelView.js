Ext.define('MyApp.view.ChannelView', {
    extend: 'Ext.Panel',
    
    requires: [
      "Ext.TitleBar",
      "Ext.dataview.List",
      "Ext.io.ux.AuthButton"
    ],
    
    config: {
        layout: {
            type: 'fit'
        },
        fullscreen: true,
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Channel',
                items: [ 

                    {
                        align: "right",
                        action: "preferences",
                        text: "Pref"
                    },

                    {
                      xtype: "sioAuthButton",
                      align: "right"
                    },


                   {
                        align: "left",
                        action: "pause",
                        text: "pause"
                    }
                  ]
            },
            {
                xtype: 'textfield',
                id: "messageField",
                docked: 'top',
                labelWidth: '0%',
                placeHolder: 'New message',
                disabled: false
            },
            {
                xtype: 'list',
                itemTpl: [
                    '{message} - {user}'
                ],
                disableSelection: true,
                store: 'messages'
            }
        ]
    }
});