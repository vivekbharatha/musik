/**
 * Created by vivek on 13/08/16.
 */
(function () {
    'use strict';
    angular.module('musik')
        .directive('mSpin', function () {
            var mSpin = {};
            mSpin.restrict = 'E';
            mSpin.templateUrl = './ng/shared/m-spin.tmpl.html';
            return mSpin;
        });
})();