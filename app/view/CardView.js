Ext.define('MyApp.view.CardView', {
    extend: 'Ext.carousel.Carousel',
    alias: 'widget.flashcards',
    config: {
	store: null,
	questionTpl: '<b>Question {number} of {total}</b>:<br />{question}',
	answerTpl: '<b>Question {number} of {total}</b>:<br />{question}<br /><b>Answer:</b><br />{answer}',
	indicator: false // set this to false because there are 2 cards per question, thus two indicator blips, which may be confusing.
    },
    constructor: function(config) {
	this.callParent(arguments);
	
        if (!this.getQuestionTpl().compile) {
	    this.setQuestionTpl(new Ext.XTemplate(this.getQuestionTpl()));
	}
	this.getQuestionTpl().compile();

	
	if (!this.getAnswerTpl().compile) {
	    this.setAnswerTpl(new Ext.XTemplate(this.getAnswerTpl()));
	}
	this.getAnswerTpl().compile();
	
	if (!this.getStore().storeId) {
	    this.setStore(Ext.getStore(this.getStore()));
	}

	
	this.getStore().on({
	    load: this.createCards,
	    refresh: this.createCards,
	    addrecords: this.createCards,
	    scope: this
	});

    },
    createCards: function() {
	var store = this.getStore();
	this.removeAll();
	if (store.getCount() > 0) {
	store.each(this.createFlashCard, this);
	} else {
	    this.add({xtype: 'panel', html: 'No Cards Available for this Deck.<br />Please click Add to add a card to this deck.'});
	}
	this.setActiveItem(0);
    },
    createFlashCard: function(record, index, total) {
	var data = Ext.apply({ total: total, number: (index + 1) }, record.data);
	this.add({ xtype: 'panel', html: this.getQuestionTpl().apply(data) });
	this.add({ xtype: 'panel', html: this.getAnswerTpl().apply(data) });
    }
});