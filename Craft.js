/**
 * Created by vivek on 19/8/16.
 */
var electronPackager = require('electron-packager');
var appMetaData = require('./package.json');
process.env.ENV = 'production';
var buildConfig = {
    'platform': ['darwin', 'linux', 'win32'],
    'arch': 'all',
    'dir': '.',
    'name': appMetaData.name,
    'app-version': appMetaData.version,
    'build-version': appMetaData.version,
    'out': './builds/' + appMetaData.version,
    'asar': true
};
console.log('-----------------> Crafting started <-----------------');
electronPackager(buildConfig, function (err, appPaths) {
    if (err) {
        console.log(err);
    } else {
        console.log(appPaths);
        console.log('-----------------> Crafting Completed :) <-----------------');
    }
});