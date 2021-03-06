/*
 * File: app/controller/MyController.js
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

Ext.define('MyApp.controller.MyController', {
    extend: 'Ext.app.Controller',
    config: {
	selectedDeck: false,
        models: [
            'Deck',
            'Card'
        ],
        stores: [
            'DeckStore',
            'CardStore'
        ],
        views: [
            'Main',
            'addCardSheet',
            'addDeckSheet',
	    'CardView'
        ],
	refs: {
	    addCardSheet: '#addCardSheet',
	    addCardSaveButton: '#addCardSheet button[text="Save"]',
	    addDeckSheet: '#addDeckSheet',
	    addDeckSaveButton: '#addDeckSheet button[text="Save"]',
	    deckList: '#deckList',
	    mainView: '#mainView',
	    shuffle: 'button[text="Shuffle"]'
	},
	control: {
	    addCardSaveButton: {
		tap: "addCard"
	    },
	    addDeckSaveButton: {
		tap: "addDeck"
	    },
	    deckList: {
		select: "onDeckSelected"
	    },
	    addCardSheet: {
		show: "updateCardSheetDeckInfo"
	    },
	    shuffle: {
		tap: 'shuffleDeck'
	    }
	}
    },
    /**
    *  When the controller is created it needs to 
    *  listen for events generated by Ext.io.Controller.
    */
    init: function() {
        this.getApplication().sio.on({
            authorized: this.onAuth,
            logout: this.onLogout,
            usermessage: this.onUserMessage,
            scope: this
        });
    },
       /**
    *  When the application has an authentcated user.
    */
    onAuth: function(user) {
        console.log("onAuth", user);
        Ext.getStore('DeckStore').sync();
        Ext.getStore('CardStore').sync();
        return true;
    },
    /**
    *  When the user gets a message from the application
    *  needs to call sync on the todo's store.
    */
    onUserMessage: function(sender, message) {
        var userId = sender.getUserId();
        console.log("user got a message!", arguments, userId);
        Ext.getStore('DeckStore').sync(function() {
            console.log("DeckStore sync callback", arguments);
        });
        Ext.getStore('CardStore').sync(function() {
            console.log("CardStore sync callback", arguments);
        });
        return true;
    },

    /**
    * When the user logs out the application needs
    * to remove the local data from the store.
    */
    onLogout: function() {
        var deckStore = Ext.getStore('DeckStore');
        deckStore.getProxy().clear();
        deckStore.load();
        var cardStore = Ext.getStore('CardStore');
        cardStore.getProxy().clear();
        cardStore.load();
        return true;
    },
    shuffleDeck: function() {
	Ext.getStore('CardStore').sort({
	    sorterFn: function() {
		return (Math.round(Math.random())-0.5);
	    }
	});
    },

    onDeckSelected: function(list, model) {
	var cards = Ext.getStore('CardStore');
	this.setSelectedDeck(model);
	cards.clearFilter();
	cards.sort('id', 'ASC');
	cards.filter('deckID', model.get('id'));
	this.getMainView().down('#cardsPanel').enable();
	this.getMainView().setActiveItem(1);
    },

    updateCardSheetDeckInfo: function(sheet) {
	sheet.down('#deckName').setHtml(this.getSelectedDeck().get('name'));
    },

    addCard: function() {
        console.log("addCard");
        var cards = Ext.getStore('CardStore'),
	    sheet = this.getAddCardSheet();
        cards.add({
	    deckID: this.getSelectedDeck().get('id'),
            question: sheet.down('#cardQuestion').getValue(),
            answer: sheet.down('#cardAnswer').getValue()
        });
        cards.sync(Ext.bind(this.syncCallback, this));
	sheet.down('#cardQuestion').setValue("");
	sheet.down('#cardAnswer').setValue("");
	sheet.hide();
    },

    addDeck: function() {
        console.log("addDeck");
        var decks = Ext.getStore('DeckStore'),
	    sheet = this.getAddDeckSheet();
        decks.add({
            name: sheet.down('textfield').getValue()
        });
        decks.sync(Ext.bind(this.syncCallback, this));
        sheet.down('textfield').setValue("");
	sheet.hide();
    },

    /*
    * After the store sync is complete the application needs
    * to notify the user's other devices that the store has changed.
    */
    syncCallback: function() {
        console.log("broadcast update", arguments);
        this.getApplication().sio.getUser(function(user, error) {
            if (user) {
                console.log("user", user);
                user.send({
                    message: "updated"
                },
                function() {
                    console.log("send callback");
                }
                );

            }
        });
    }
});