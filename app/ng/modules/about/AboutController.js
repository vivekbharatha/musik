/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    var remote = require('electron').remote;
    var shell = require('electron').shell;
    angular.module('musik')
        .controller('AboutController', ['$scope', '$mdToast', function ($scope, $mdToast) {

            $scope.openLink = function (url) {
                shell.openExternal(url);
            };

        }]);

})();