/**
 * Created by vivek on 12/8/16.
 */

(function () {
    'use strict';

    var fs = require('fs');
    var async = require('async');
    var mm = require('musicmetadata');

    var core = {};

    core.getFiles = function (path, extensions) {
        extensions = extensions || ['mp3'];
        return digFiles(path, extensions);
    };

    core.getMetaData = function (songsPath, cb) {
        var songsMetaData = [];
        async.each(songsPath, function (songPath, callback) {

            mm(fs.createReadStream(songPath), {duration: true}, function (err, data) {
                if (err) return callback(err);
                var temp = songPath.split('/').pop().split('.');
                temp.pop();
                data.name = temp.join('');
                data.path = songPath;
                songsMetaData.push(data);
                callback();
            });
        }, function (err) {
            if (err) return cb(err);

            songsMetaData = songsMetaData.map(function (songMetaData) {
                var mainData = {
                    title: songMetaData.title || songMetaData.name,
                    album: songMetaData.album || '',
                    artist: songMetaData.artist[0] || '',
                    albumArtist: songMetaData.albumartist[0] || '',
                    albumArt: songMetaData.picture[0] || '',
                    year: songMetaData.year || '',
                    duration: songMetaData.duration || ''
                };

                mainData.path = songMetaData.path;
                return mainData;
            });

            return cb(null, songsMetaData);
        });
    };

    var digFiles = function (path, extensions, files) {
        files = files || [];
        fs.readdirSync(path).forEach(function (file) {
            var subPath = path + '/' + file;
            if (fs.statSync(subPath).isDirectory()) {
                digFiles(subPath, extensions, files);
            } else if (extensions.indexOf(file.split('.').pop()) !== -1) {
                files.push(subPath);
            }
        });

        return files;
    };

    module.exports = core;
})();