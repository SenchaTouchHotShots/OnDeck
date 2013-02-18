/*@private
* Test class to emit fake browser offline events.
* for internal testing only. 
*/
Ext.define('Ext.cf.util.FakeOffline', {
    
    statics: {

		offline: function() {
			var evt = document.createEvent("Events");
			evt.initEvent("offline");
			window.dispatchEvent(evt);
		},

		online: function() {
			var evt = document.createEvent("Events");
			evt.initEvent("online");
			window.dispatchEvent(evt);	
		}
    }
});