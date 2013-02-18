/**
 * @private
 *
 * Wraps an envelope and its contained message in a Model so
 * that it can be stored in a Store.
 *
 */
Ext.define('Ext.cf.messaging.EnvelopeWrapper', {
    //<if touch>
    //Added compiler check to workaround issue with Cmd. 
    // Should be able to remove after next release of Cmd after 3.0.2.288
    requires: ['Ext.data.identifier.Uuid'],
    //</if>
    extend: 'Ext.data.Model',
    config: {
        identifier: 'uuid',
        fields: [
            {name: 'e', type: 'auto'}, // envelope
            {name: 'ts', type: 'integer'} // timestamp
        ]
    }
});
