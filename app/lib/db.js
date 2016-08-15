/**
 * Created by vivek on 12/08/16.
 */
(function () {
    'use strict';
    var Dexie = require('dexie');
    var db = new Dexie('musik');

    db.version(1).stores({
        songs: "++id, title, album",
        albums: "++id, album"
    });

    var DB = {};

    DB.open = function () {
        return db.open()
            .then(function (res) {
            })
            .catch(function (err) {
                console.log(err);
                throw err;
            });
    };

    DB.addBulkSongs = function (songs) {
        return db.songs.bulkAdd(songs);
    };

    DB.addSong = function (song) {
        return db.songs.add(song);
    };

    DB.getAllSongs = function () {
        return db.songs.toArray();
    };

    DB.clean = function () {
        return db.delete()
            .then(function () {
                return DB.open();
            })
            .catch(function (err) {
                throw err;
            });
    };

    module.exports = DB;
})();
