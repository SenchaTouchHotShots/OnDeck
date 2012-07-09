Ext.define('MyApp.view.Locations', {
    extend: 'Ext.Panel',
    
    requires: [
      "Ext.TitleBar",
      "Ext.Map",
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
                title: 'Locations',
                items: [
                  {
                      action: "publishLocation",
                      align: 'left',
                      iconMask: true,
                      ui: 'plain',
                      iconCls: 'locate'
                  },
                  {
                      xtype: "sioAuthButton",
                      align: "right"
                  }]
            },
            {
                xtype: 'map',
            }
        ]
    }
});