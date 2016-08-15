/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    var core = require('./lib/core');
    var db = require('./lib/db');

    angular.module('musik')
        .controller('HomeController', ['$scope', '$mdToast', function ($scope, $mdToast) {

            $scope.musicPath = null;
            $scope.songs = [];
            $scope.songsFilePaths = [];
            $scope.currentSong = null;
            $scope.progress = 0;
            $scope.volume = 0.5;

            $scope.isPlaying = false;

            $scope.sortType = 'title';
            $scope.sortReverse = false;

            $scope.selectFile = function () {
                document.getElementById('musicPath').click();
            };

            var toast = $mdToast.simple().position('top right');

            function init() {
                db.getAllSongs()
                    .then(function (songs) {
                        $mdToast.show(toast.content('Songs loaded'));
                        $scope.$apply(function () { $scope.songs = songs; });
                    })
                    .catch(function (err) {
                        throw err;
                    });
            }

            init();

            $scope.onFileChange = function (element) {

                if (element.files === undefined) return;

                $scope.musicPath = element.files[0].path;
                $scope.songsFilePaths = core.getFiles($scope.musicPath);
                core.getMetaData($scope.songsFilePaths, function (err, songsMetaData) {
                    if (err) throw err;
                    db.clean()
                        .then(function () {
                            return db.addBulkSongs(songsMetaData);
                        }).then(function (result) {
                        $mdToast.show(toast.content('Songs saved successfully :)'));
                        $scope.$apply(function () { $scope.songs = songsMetaData; });
                    }).catch(function (err) {
                        if (err) {
                            console.log(err);
                            $mdToast.show(toast.content('Error on saving songs :('));
                            throw err;
                        }
                    });
                });
            };

            $scope.triggerAudio = function (song) {
                if (song === undefined) return;

                if (song === $scope.currentSong) {
                    if ($scope.isPlaying) {
                        Player.pause();
                        $scope.isPlaying = false;
                    } else {
                        Player.play();
                        $scope.isPlaying = true;
                    }
                } else {
                    $scope.currentSong = song;
                    Player.setAttribute('src', song.path);
                    Player.play();
                    $scope.isPlaying = true;
                }
            };

            $scope.play = function () {
                $scope.triggerAudio($scope.currentSong || $scope.songs[0]);
            };

            $scope.formatTime = function (inSeconds) {
                var minutes = Math.floor(inSeconds / 60);
                minutes = (minutes >= 10) ? minutes : "0" + minutes;
                var seconds = Math.floor(inSeconds % 60);
                seconds = (seconds >= 10) ? seconds : "0" + seconds;
                return minutes + ":" + seconds;
            };

            var Player = document.getElementById('player');

            Player.addEventListener('timeupdate', function () {
                $scope.$apply(function () {
                    $scope.progress = player.currentTime * 100 / player.duration;
                    $scope.time = $scope.formatTime(player.currentTime);
                });
            }, false);

            Player.addEventListener('ended', function () {
                $scope.playNext();
            }, false);
            
            var timeline = document.getElementById('timeline');

            timeline.addEventListener('click', function (e) {
                if (!$scope.currentSong) return;
                Player.currentTime = $scope.currentSong.duration * e.clientX / timeline.offsetWidth;
            }, false);

            $scope.playNext = function () {
                var index = $scope.songs.indexOf($scope.currentSong);
                if (index !== -1 && $scope.songs[++index]) {
                    $scope.triggerAudio($scope.songs[index]);
                }
            };

            $scope.playPrevious = function () {
                var index = $scope.songs.indexOf($scope.currentSong);
                if (index !== -1 && $scope.songs[--index]) {
                    $scope.triggerAudio($scope.songs[index]);
                }
            };

            $scope.$watch('volume', function (newVolume, oldVolume) {
                Player.volume = newVolume;
            });

        }]);

})();