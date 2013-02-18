
Ext.define("Ext.io.data.DirectoryModel", {
    extend: "Ext.data.Model",
    config: {
		identifier: 'uuid', //required by touch but ignored by ext.
        fields: [
            { name:'name', type: 'string' },
            { name:'type', type: 'string' },
            { name:'meta', type: 'auto' }
        ]
    }
});
