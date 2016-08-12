/**
 * Created by vivek on 12/8/16.
 */

var core = require('./lib/core');

angular.module('musix')
    .controller('HomeController', ['$scope', function ($scope) {

        $scope.musicPath = null;
        $scope.songs = [];
        $scope.songsFilePaths = [];
        $scope.currentSong = null;

        $scope.selectFile = function () {
            document.getElementById('musicPath').click();
        };
        $scope.onFileChange = function (element) {
            $scope.musicPath = element.files[0].path;
            $scope.songsFilePaths = core.getFiles($scope.musicPath);
            core.getMetaData($scope.songsFilePaths, function (err, songsMetaData) {
                $scope.$apply(function () {
                    $scope.songs = songsMetaData;
                })
            });
        };

        $scope.triggerAudio = function (song) {
           $scope.currentSong = song;
            var Player = document.getElementById('player');
            Player.setAttribute('src', song.path);
            if (song.isPlaying) {
                Player.pause();
                song.isPlaying = false;
            } else {
                Player.play();
                song.isPlaying = true;
            }
        };

    }]);