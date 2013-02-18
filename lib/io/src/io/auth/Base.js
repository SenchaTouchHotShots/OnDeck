/**
 * @private
 *
 * Base authentication class. All other authentication methods should
 * inherit from this class and implement the appropriate methods.
 */
Ext.define('Ext.io.auth.Base', {

    config: {
        loginView: "Ext.io.ux.AuthSencha",

        authButtonConfig: {
            authType: "sio",
            text: "Sencha"
        },

        initComplete: false
    },

    constructor: function (config) {
        this.initConfig(config);
    },


    /**
     * Called once per application load. Can be used to
     * initialize 3rd party auth libraries.
     *  Base implementation will execute callback immediately.
     * @param {Object} group associated with this application.
     * @param {Function} callback the function to call when init completes.
     * @param {Object} scope the scope to give to the callback function.
     */
    init: function (group, callback, scope) {
        this.setInitComplete(true);
        callback.call(scope);
    },


    /*
     * Check to see if the user is currently authenticated with
     * a 3rd party provider.
     * @param {Object} Authentication configuration details. This will include whatever config data
     *                 the application/group has about the 3td party auth scheme (api keys, callback urls etc)
     * @param {Function} callback the function to call when checkAuth completes.
     * @param {Boolean} callback.isAuth boolean to indicate if the user is authenticated or not
     * @param {Object} callback.authData auth method specific user data to be passed to sencha.io
     * @param {Object} scope the scope to give to the callback function.
     */
    checkAuth: function (group, callback, scope) {
        callback.call(scope, false, {});
    },


    /*
     * onAuth is called to fetch the 3rd party user credentials when the user is already authenticated
     * with the 3rd party but is not yet authenticated when sencha.io.
     * @param {Function} callback the function to call when checkAuth completes.
     * @param {Boolean} callback.isAuth boolean to indicate if the user is authenticated or not
     * @param {Object} callback.authData auth method specific user data to be passed to sencha.io
     * @param {Object} scope the scope to give to the callback function.
     */
    onAuth: function (auth, callback, scope) {
        callback.call(scope, {});
    },


    /*
     * Called when the user is logging out.  Should remove 3rd party authorization for this
     * application.
     */
    logout: function (callback, scope) {
        callback.call(scope);
    },


    /**
     * For auth methods that require an http redirect (oauth, facebook twitter etc) this method
     * saves the current url so it can be restored after auth is complete.
     */
    saveCurrentPath: function () {
        Ext.io.Io.getIdStore().setId('auth.preurl', document.location.href);
    },


    /**
     * Restore the saved url using html5 replaceState after auth has completed.
     */
    restorePreviousPath: function () {
        var previous = Ext.io.Io.getIdStore().getId('auth.preurl');
        if (previous) {
            history.replaceState({}, "", previous);
            Ext.io.Io.getIdStore().remove('auth.preurl');
        }
    }
});
