/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    angular.module('musik')
        .controller('AboutController', ['$scope', '$mdToast', function ($scope, $mdToast) {
            $scope.exit = function () {
                remote.getCurrentWindow().close();
            };
        }]);

})();