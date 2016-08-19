/**
 * Created by vivek on 19/8/16.
 */
var fs = require('fs');
var electronPackager = require('electron-packager');
var archiver = require('archiver');
var async = require('async');
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
console.log('-----------------> Crafting Started <-----------------');
electronPackager(buildConfig, function (err, buildPaths) {
    if (err) {
        console.log(err);
    } else {
        console.log(buildPaths);
        console.log('-----------------> Compressing Builds <-----------------');
        async.each(buildPaths, function (buildPath, cb) {
            var zip = archiver('zip');
            var zipFile = fs.createWriteStream(buildPath + '.zip');

            zip.pipe(zipFile);

            zip.bulk([{
                expand: true,
                cwd: buildPath,
                src: ['**/*'],
                dot: true
            }]);

            zip.finalize();

            zipFile.on('close', function () {
                cb();
            });

            zip.on('error', cb);

        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('-----------------> Crafting Completed :) <-----------------');
            }
        });
    }
});