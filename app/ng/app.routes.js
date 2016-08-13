/**
 * Created by vivek on 12/8/16.
 */
(function () {
    'use strict';
    angular.module('musix')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: './ng/modules/home/home.html',
                    controller: 'HomeController'
                });
        }]);
})();