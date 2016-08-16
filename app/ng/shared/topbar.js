/**
 * Created by vivek on 16/8/16.
 */
(function () {
    'use strict';
    angular.module('musik')
        .directive('topBar', function () {
            var topBar = {};
            topBar.restrict = 'E';
            topBar.templateUrl = './ng/shared/topbar.tmpl.html';
            return topBar;
        });
})();