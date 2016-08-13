/**
 * Created by vivek on 13/08/16.
 */
angular.module('musix')
    .directive('mSpin', function () {
       var mSpin = {};
        mSpin.restrict = 'E';
        mSpin.templateUrl = './ng/shared/m-spin.tmpl.html';
        return mSpin;
    });