/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    var remote = require('electron').remote;
    var async = require('async');

    var core = require('./lib/core');
    var db = require('./lib/db');

    angular.module('musik')
        .controller('LibraryController', ['$scope', '$mdToast', function ($scope, $mdToast) {

            $scope.libraryLocation = null;
            $scope.folders = [];
            $scope.editFolder = null;

            $scope.refreshList = function () {
                db.getFolders().then(function (folders) {
                    $scope.$apply(function () {
                        $scope.folders = folders;
                    });
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            };

            $scope.refreshList();

            $scope.selectFile = function () {
                document.getElementById('musicPath').click();
            };

            var toast = $mdToast.simple().position('top right');

            $scope.onFileChange = function (element) {
                if (element.files === undefined || element.files[0] === undefined || element.files[0].path === undefined) return;

                $scope.libraryLocation = element.files[0].path;

                if ($scope.editFolder) {
                    var updateFolder = { id: $scope.editFolder.id, location: $scope.libraryLocation };
                    db.updateFolder(updateFolder)
                        .then(function (result) {
                            $scope.refreshList();
                            $scope.editFolder = null;
                            $scope.$digest();
                            document.getElementById('folderPath').value = '';
                        })
                        .catch(function (error) {
                           console.log(error);
                            $scope.editFolder = null;
                            $scope.$digest();
                            document.getElementById('folderPath').value = '';
                        });
                } else {
                    for (var i = 0; i < $scope.folders.length; i++) {
                        if ($scope.libraryLocation.includes($scope.folders[i].location)) {
                            document.getElementById('folderPath').value = '';
                            alert('Already a parent folder exists for your location =>' + $scope.libraryLocation);
                            return;
                        }
                    }

                    var folder = { location: $scope.libraryLocation };

                    db.addFolder(folder)
                        .then(function (id) {
                            folder.id = id;
                            $scope.folders.push(folder);
                            $scope.$digest();
                            document.getElementById('folderPath').value = '';
                        })
                        .catch(function (error) {
                            console.log(error);
                            document.getElementById('folderPath').value = '';
                        });
                }
            };

            $scope.edit = function (folder) {
                $scope.editFolder = folder;
                document.getElementById('musicPath').click();
            };

            $scope.delete = function (folder) {
                if (!confirm('Are you sure to delete this folder ?')) return false;

                db.deleteFolder(folder.id)
                    .then(function (result) {
                        if (result) {
                            $scope.refreshList();
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            };

            $scope.updateLibrary = function () {
                if ($scope.folders.length === 0) {
                    db.deleteAllSongs()
                        .then(function () {
                            $mdToast.show(toast.content('Songs saved successfully :)'));
                        })
                        .catch(function (error) {
                            console.log(error);
                            $mdToast.show(toast.content('Error on saving songs :('));
                        });
                    return;
                }
                async.each($scope.folders, function (folder, callback) {
                    var songsFilePaths = core.getFiles(folder.location);
                    core.getMetaData(songsFilePaths, function (err, songsMetaData) {
                        if (err) throw err;
                        db.deleteAllSongs()
                        .then(function () {
                            return db.addBulkSongs(songsMetaData);
                        }).then(function (result) {
                            callback();
                        }).catch(function (err) {
                            callback(err);
                        });
                    });
                }, function (err, result) {
                   console.log(err, result);
                    if (err) {
                        console.log(err);
                        $mdToast.show(toast.content('Error on saving songs :('));
                        throw err;
                    } else {
                        $mdToast.show(toast.content('Songs saved successfully :)'));
                    }
                });
            };

            $scope.exit = function () {
                remote.getCurrentWindow().close();
            };

        }]);

})();