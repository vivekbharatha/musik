/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    var remote = require('electron').remote;

    var core = require('./lib/core');
    var db = require('./lib/db');

    angular.module('musik')
        .controller('HomeController', ['$scope', '$mdToast', function ($scope, $mdToast) {
            $scope.musicPath = null;
            $scope.songs = [];
            $scope.showSongs = true;
            $scope.queue = [];
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
                        // if (songs.length > 0) $mdToast.show(toast.content('Songs loaded'));
                        var queue = songs.map( $scope.getQueueData );
                        $scope.$apply(function () {
                            $scope.songs = songs;
                            $scope.queue = queue;
                        });
                    })
                    .catch(function (err) {
                        throw err;
                    });
            }

            init();

            $scope.triggerAudio = function (song) {
                if (!song) return;

                if ($scope.currentSong && song.id === $scope.currentSong.id) {
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
                $scope.triggerAudio($scope.currentSong || $scope.queue[0]);
            };

            $scope.getQueueData = function (song) {
                var queueObj = {
                    id: song.id,
                    title: song.title,
                    album: song.album,
                    path: song.path
                };

                queueObj.duration = song.duration;

                return queueObj;
            };

            $scope.getSongFromQueue = function (song) {
                var returnValue = null;
                for(var i = 0; i < $scope.queue.length; i++) {
                    if (song.id === $scope.queue[i].id) {
                        returnValue = $scope.queue[i];
                        break;
                    }
                }

                return returnValue;
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
                var index = $scope.queue.indexOf($scope.currentSong);
                if (index !== -1 && $scope.queue[++index]) {
                    $scope.triggerAudio($scope.queue[index]);
                }
            };

            $scope.playPrevious = function () {
                var index = $scope.queue.indexOf($scope.currentSong);
                if (index !== -1 && $scope.queue[--index]) {
                    $scope.triggerAudio($scope.queue[index]);
                }
            };

            $scope.$watch('volume', function (newVolume, oldVolume) {
                Player.volume = newVolume;
            });

            $scope.exit = function () {
                remote.getCurrentWindow().close();
            };

            $scope.albums = [];
            $scope.checkAlbumDuplicates = [];  // album name

            $scope.albumView = function () {
                $scope.songs.forEach(function (song) {
                    if ($scope.checkAlbumDuplicates.indexOf(song.album) === -1) {
                        var album = {
                            album: song.album || 'Unknown',
                            albumImage: ''
                        };
                        if (song.albumArt && song.albumArt.data && song.albumArt.format) {
                            album.albumImage = window.URL.createObjectURL(new Blob([song.albumArt.data], {type: 'image/' + song.albumArt.format}));
                        }
                        $scope.albums.push(album);
                        $scope.checkAlbumDuplicates.push(song.album);
                        album = null;
                    }
                });
                $scope.showSongs = false;
            };

            $scope.removeFromQueue = function (song, e) {
                var queueIndex = $scope.queue.indexOf(song);
                if (queueIndex !== -1) {
                    $scope.queue.splice(queueIndex, 1);
                }
            };

        }]);

})();