/**
*  TODO application view:  
*  Panel that fills the viewport
*   - Title bar with a login/logout button
*   - Text field for task entry
*   - List to display tasks from the 'todos' store.
*/
Ext.define('MyApp.view.Todos', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    
    requires: [
      "Ext.dataview.List",
      "Ext.io.ux.AuthButton"
    ],
    
    config: {
         autoDestroy: false,
         navigationBar: {

            defaults:{
                xtype: 'button',
                hideAnimation: Ext.os.is.Android ? false : {
                    type: 'fadeOut',
                    duration: 200
                },
                showAnimation: Ext.os.is.Android ? false : {
                    type: 'fadeIn',
                    duration: 200
                }
            },
            items: [
                {
                    action: "saveTodo",
                    text: 'Save',
                    align: 'right',
                    hidden: true
                },

                {
                    action: "showAdd", 
                    text: "Add",
                    align:"left",
                    disabled: true
                },
                {
                  xtype: "sioAuthButton",
                  align: "right"
                } 


            ]
        },
        items:[
            {
                title: "Todos",
                xtype: 'list',
                itemTpl: [
                    '<div class="completed{completed}">{task}</div>'
                ],
                store: 'todos'
                //, grouped: true
            }
        ]
     
    }
});