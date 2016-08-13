/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    var core = require('./lib/core');
    var db = require('./lib/db');

    angular.module('musix')
        .controller('HomeController', ['$scope', function ($scope) {

            $scope.musicPath = null;
            $scope.songs = [];
            $scope.songsFilePaths = [];
            $scope.currentSong = null;
            $scope.progress = 0;

            $scope.isPlaying = false;

            $scope.sortType = 'title';
            $scope.sortReverse = false;

            $scope.selectFile = function () {
                document.getElementById('musicPath').click();
            };

            function init() {
                db.getAllSongs()
                    .then(function (songs) {
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
                        console.log('Saved in db successfully :)');
                        $scope.$apply(function () { $scope.songs = songsMetaData; });
                    }).catch(function (err) {
                        if (err) {
                            console.log(err);
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

            function formatTime(inSeconds) {
                var minutes = Math.floor(inSeconds / 60);
                minutes = (minutes >= 10) ? minutes : "" + minutes;
                var seconds = Math.floor(inSeconds % 60);
                seconds = (seconds >= 10) ? seconds : "0" + seconds;
                return minutes + ":" + seconds;
            }

            var Player = document.getElementById('player');

            Player.addEventListener('timeupdate', function () {
                $scope.$apply(function () {
                    $scope.progress = player.currentTime * 100 / player.duration;
                    $scope.time = formatTime(player.currentTime) + ' / ' + formatTime(player.duration);
                });
            }, false);

            Player.addEventListener('ended', function () {
                $scope.playNext();
            });

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

            $scope.setVolume = function () {
                Player.volume = document.getElementById('volume').value;
            };

        }]);
})();