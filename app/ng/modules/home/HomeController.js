/**
 * Created by vivek on 12/8/16.
 */
angular.module('musix')
    .controller('HomeController', ['$scope', function ($scope) {

        $scope.musicPath = null;

        $scope.selectFile = function () {
            document.getElementById('musicPath').click();
        };

        $scope.onFileChange = function (element) {
            $scope.musicPath = element.files[0].path;

        };

    }]);