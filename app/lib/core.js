/**
 * Created by vivek on 12/8/16.
 */
var fs = require('fs');
var async = require('async');
var id3 = require('id3js');

var core = {};

core.getFiles = function (path, extensions) {
    extensions = extensions || ['mp3'];
    return digFiles(path, extensions);
};

core.getMetaData = function (songs, cb) {
    var songsMetaData = [];
    async.each(songs, function (song, callback) {
        id3({file: song, type: id3.OPEN_LOCAL}, function (err, tags) {
            songsMetaData.push({
                path: song,
                name: song.split('/').pop().split('.').shift(),
                meta: tags
            });
            callback(err, tags);
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