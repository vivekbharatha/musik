/**
 * Created by vivek on 16/8/16.
 */
(function () {
    'use strict';
    var remote = require('electron').remote;
    angular.module('musik')
        .directive('topBar', function () {
            var topBar = {};
            topBar.restrict = 'E';
            topBar.templateUrl = './ng/shared/topbar.tmpl.html';
            topBar.controller = function ($scope){
                $scope.exit = function () {
                    remote.getCurrentWindow().close();
                };

                $scope.minimize = function () {
                    remote.getCurrentWindow().minimize();
                };

                $scope.maximize = function () {
                    remote.getCurrentWindow().maximize();
                };
            };
            return topBar;
        });
})();