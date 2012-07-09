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
                items: [ {
                      xtype: "sioAuthButton",
                      align: "right"
                  }]
            },
            {
                xtype: 'textfield',
                docked: 'top',
                labelWidth: '0%',
                placeHolder: 'New message',
                disabled: false
            },
            {
                xtype: 'list',
                itemTpl: [
                    '{message}'
                ],
                disableSelection: true,
                store: 'messages'
            }
        ]
    }
});