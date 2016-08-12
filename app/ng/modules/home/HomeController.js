/**
 * Created by vivek on 12/8/16.
 */

var core = require('./lib/core');
var db = require('./lib/db');

angular.module('musix')
    .controller('HomeController', ['$scope', function ($scope) {

        $scope.musicPath = null;
        $scope.songs = [];
        $scope.songsFilePaths = [];
        $scope.currentSong = null;
        $scope.progress = 0;

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
                        return db.addBulkSongs(songsMetaData)
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
        var Player = document.getElementById('player');
        Player.addEventListener('timeupdate', function () {
            $scope.$apply(function () {
                $scope.progress = player.currentTime * 100 / player.duration;
                $scope.time = formatTime(player.currentTime) + ' / ' + formatTime(player.duration);
            });
        }, false);
        $scope.triggerAudio = function (song) {
            $scope.currentSong = song;
            Player.setAttribute('src', song.path);
            if (song.isPlaying) {
                Player.pause();
                song.isPlaying = false;
            } else {
                Player.play();
                song.isPlaying = true;
            }
        };

        function formatTime(inSeconds) {
            var minutes = Math.floor(inSeconds / 60);
            minutes = (minutes >= 10) ? minutes : "" + minutes;
            var seconds = Math.floor(inSeconds % 60);
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        }

    }]);