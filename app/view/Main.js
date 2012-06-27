/*
 * File: app/view/Main.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.view.Main', {
    extend: 'Ext.tab.Panel',

    config: {
        id: 'mainView',
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'fit'
                },
                title: 'Decks',
                iconCls: 'info',
                items: [
                    {
                        xtype: 'list',
                        itemTpl: [
                            '<div>{name}</div>'
                        ],
                        store: 'DeckStore'
                    },
                    {
                        xtype: 'titlebar',
                        docked: 'top',
                        title: 'Decks',
                        items: [
                            {
                                xtype: 'button',
                                itemId: 'mybutton',
                                text: 'Add',
                                align: 'right'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                title: 'Cards',
                iconCls: 'info',
                items: [
                    {
                        xtype: 'titlebar',
                        docked: 'top',
                        items: [
                            {
                                xtype: 'button',
                                itemId: 'mybutton1',
                                text: 'Add',
                                align: 'right'
                            },
                            {
                                xtype: 'button',
                                text: 'Shuffle'
                            }
                        ]
                    },
                    {
                        xtype: 'carousel'
                    }
                ]
            }
        ],
        tabBar: {
            docked: 'bottom'
        },
        listeners: [
            {
                fn: 'showDeckSheet',
                event: 'tap',
                delegate: '#mybutton'
            },
            {
                fn: 'showCardSheet',
                event: 'tap',
                delegate: '#mybutton1'
            }
        ]
    },

    showDeckSheet: function(button, e, options) {
        var sheet = Ext.create('MyApp.view.addDeckSheet');
        var main = Ext.getCmp('mainView');
        main.add(sheet);
        sheet.show();
    },

    showCardSheet: function(button, e, options) {
        var sheet = Ext.create('MyApp.view.addCardSheet');
        var main = Ext.getCmp('mainView');
        main.add(sheet);
        sheet.show();
    }

});