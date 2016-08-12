/**
 * Created by vivek on 12/8/16.
 */
var fs = require('fs');
var async = require('async');
var id3 = require('music-tag');

var core = {};

core.getFiles = function (path, extensions) {
    extensions = extensions || ['mp3'];
    return digFiles(path, extensions);
};

core.getMetaData = function (songsPath, cb) {
    var songsMetaData = [];
    async.each(songsPath, function (songPath, callback) {
        id3.read(songPath).then(function (tag) {
            var temp = songPath.split('/').pop().split('.');
            temp.pop();
            songsMetaData.push({
                path: songPath,
                name: temp.join(''),
                meta: tag
            });
            callback();
        }).catch(function (err) {
            callback(err);
        });
    },function (err) {
        if(err) return cb(err);
        return cb(null, songsMetaData);
    });
};

var digFiles = function (path, extensions, files) {
    files = files || [];
    fs.readdirSync(path).forEach(function (file) {
            var subPath = path + '/' + file;
            if(fs.statSync(subPath).isDirectory()) {
                digFiles(subPath, extensions, files);
            } else if (extensions.indexOf(file.split('.').pop()) !== -1) {
                    files.push(subPath);
            }
    });

    return files;
};

module.exports = core;