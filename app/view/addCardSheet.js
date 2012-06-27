/*
 * File: app/view/addCardSheet.js
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

Ext.define('MyApp.view.addCardSheet', {
    extend: 'Ext.Sheet',

    config: {
        id: 'addCardSheet',
        items: [
            {
                xtype: 'container',
                html: 'Deck Name Here',
                style: 'color: #FFFFFF; text-align:center;'
            },
            {
                xtype: 'textareafield',
                id: 'cardQuestion',
                margin: '0 0 10 0',
                label: 'Question'
            },
            {
                xtype: 'textareafield',
                id: 'cardAnswer',
                margin: '0 0 10 0',
                label: 'Answer'
            },
            {
                xtype: 'button',
                ui: 'confirm',
                text: 'Save'
            },
            {
                xtype: 'button',
                itemId: 'mybutton5',
                ui: 'decline',
                text: 'Cancel'
            },
            {
                xtype: 'hiddenfield',
                id: 'deckID'
            }
        ],
        listeners: [
            {
                fn: 'hideCardSheet',
                event: 'tap',
                delegate: '#mybutton5'
            }
        ]
    },

    hideCardSheet: function(button, e, options) {
        button.up('sheet').hide();
    }

});