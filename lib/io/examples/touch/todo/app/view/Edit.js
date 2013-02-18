Ext.define('MyApp.view.Edit', {
    extend: 'Ext.Container',
    xtype: 'todoedit',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Text',
        'Ext.field.Toggle'
    ],

    config: {
        title: 'Edit',
        layout: 'fit',

        items: [
            {
                xtype: 'formpanel',
                items: [
                    {
                        xtype: 'fieldset',
                        items: [
                            {
                                xtype: 'togglefield',
                                name: 'complete',
                                label: 'Complete?'
                            },
                            {
                                xtype: 'textfield',
                                placeHolder: 'Todo',
                                name: 'task'
                            },
                            {
                                xtype: 'textareafield',
                                placeHolder: 'Details',
                                name: 'details'
                            }
                        ]
                    }
                ]
            }
        ],

        listeners: [
            {
                delegate: 'textfield',
                fn: 'onFormChange',
                event: 'keyup'
            },
            {
                delegate: 'togglefield',
                fn: 'onFormChange',
                event: 'change'
            }
        ],

        record: null
    },

    updateRecord: function(newRecord) {
        globalForm = this.down('formpanel');
        this.down('formpanel').setRecord(newRecord);
        this.down('togglefield').setValue(newRecord.get("completed")?1:0);
    },

    saveRecord: function() {
        var formPanel = this.down('formpanel'),
        record = formPanel.getRecord();

        formPanel.updateRecord(record);

        var completed = this.down('togglefield').getValue();

        record.set("completed", (completed == 1));
        record.set("timestamp", new Date().getTime());
       
        return record;
    },

    onFormChange: function() {
        this.fireEvent('change', this);
    }
});
