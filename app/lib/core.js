/**
 * Created by vivek on 12/8/16.
 */

(function () {
    'use strict';

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
        }, function (err) {
            if (err) return cb(err);

            songsMetaData = songsMetaData.map(function (songMetaData) {
                var mainData = {
                    title: songMetaData.meta.data.title || songMetaData.name,
                    album: songMetaData.meta.data.album || '',
                    artist: songMetaData.meta.data.artist || '',
                    albumArt: songMetaData.meta.data.attached_picture || '',
                    trackNumber: songMetaData.meta.data.track_number || '',
                    year: songMetaData.meta.data.year || ''
                };

                mainData.title = mainData.title.replace(/[^\w\s]/gi, '');
                mainData.album = mainData.album.replace(/[^\w\s]/gi, '');
                mainData.artist = mainData.artist.replace(/[^\w\s]/gi, '');

                mainData.path = songMetaData.meta.path || songMetaData.path;
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