/**
 * @private
 * Facebook authentication method.
 */
Ext.define('Ext.io.auth.Facebook', {
    extend: 'Ext.io.auth.Base',

    config: {
        loginView: "Ext.io.ux.AuthFacebook",

        authButtonConfig: {
            authType: "fb",
            text: "Facebook"
        },

        initComplete: false
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    checkAuth: function (group, callback, scope) {
        var opts = Ext.Object.fromQueryString(document.location.search);
        var code = opts["code"];
        if (code) {
            callback.call(scope, true, {
                provider: "facebook",
                callbackPath: this.getCallbackPath(),
                query: {
                    code: code
                }
            });
        } else {
            callback.call(scope, false, {});
        }
    },


    getCallbackPath: function () {
        return window.location.protocol + "//" + window.location.host + window.location.pathname;
    },


    onAuth: function (auth, callback, scope) {
        this.restorePreviousPath();
        callback.call(scope, auth);
    },

    logout: function (callback, scope) {

    }
});
