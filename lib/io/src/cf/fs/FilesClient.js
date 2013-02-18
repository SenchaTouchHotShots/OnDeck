/**
 * @private
 *
 */
Ext.define('Ext.cf.fs.FilesClient', {

    requires: ['Ext.cf.util.ErrorHelper'],
    
    statics: {
        /*
        *@private
        */
        _readFile: function(file, callback, scope) {
            try {
                var reader = new FileReader();
                reader.onload = function (result) {
                    callback.call(scope, result.target.result);
                };

                reader.readAsDataURL(file);
            } catch (e) {
                var err = Ext.cf.util.ErrorHelper.get('UNABLE_READ_FILE');
                callback.call(scope, undefined, err);
            }
        },

        /*
        *@private
        */
        _createFileObject: function(file) {
            var result = {path:file.data.path, name:file.data.name, folder:(file.data.dir) ? file.data.dir : false};
            if (file.data.namespace) {result.namespace = file.data.namespace;}
            return result;
        },


        /**
        * Create a file
        * @param {Object} options.file
        * @param {Object} options.namespace
        * @param {Object} options.path
        * @param {Object} options.name
        * @param {Object} options.folder
        * @param {Object} options.content
        */

        create: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(//dude?
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            var createFile = function(content) {
                                fileService.create(function(result) {
                                    if (result.status == "success") {
                                        var file = self._createFileObject(result.value);
                                        callback.call(scope, file);
                                    } else {
                                        callback.call(scope, undefined, result.error);
                                    }
                                }, options.namespace, options.path, options.name, options.folder, content);
                            };
                            if(options.content){
                                createFile(options.content);
                            } else if (!options.folder && options.file) { //it is a file
                                self._readFile(options.file, function(content, err) {
                                    if (!err) {
                                        createFile(content);
                                    } else {
                                        callback.call(scope, undefined, err);
                                    }
                                }, scope);
                            } else {
                                createFile(null);
                            }
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        read: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.read(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope, result.value);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        write: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            self._readFile(options.file, function(content, err) {
                                if (!err) {
                                    fileService.write(function(result) {
                                        if (result.status == "success") {
                                            callback.call(scope);
                                        } else {
                                            callback.call(scope, undefined, result.error);
                                        }
                                    }, options.namespace, options.path, options.name, content);
                                } else {
                                    callback.call(scope, undefined, err);
                                }
                            }, scope);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        remove: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.remove(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        list: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.list(function(result) {
                                if (result.status == "success") {
                                    var files = [];
                                    for(var i = 0; i < result.value.length; i++) {
                                        files.push(self._createFileObject(result.value[i]));
                                    }
                                    callback.call(scope, files);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        share: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.share(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name, options.klass, options.id, options.actions);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        rename: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.rename(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name, options.new_name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        },

        getFileInfo: function(options,callback,scope) {
            Ext.io.Io.getMessagingProxy(function(messaging){
                messaging.getService(
                    {name: "FileService"},
                    function(fileService,err) {
                        if (fileService){
                            var self= this;
                            fileService.getFileInfo(function(result) {
                                if (result.status == "success") {
                                    callback.call(scope, result.value);
                                } else {
                                    callback.call(scope, undefined, result.error);
                                }
                            }, options.namespace, options.path, options.name);
                        } else {
                            callback.call(scope, undefined, err);
                        }
                    },
                    this
                );
            },this);
        }

    }

});