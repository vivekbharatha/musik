/**
 * Created by vivek on 12/08/16.
 */
(function () {
    'use strict';
    var Dexie = require('dexie');
    var db = new Dexie('musik');

    db.version(1).stores({
        songs: '++id, title, album',
        albums: '++id, album',
        folders: '++id, location'
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

    DB.addFolder = function (folder) {
        return db.folders.add(folder);
    };

    DB.getFolders = function () {
        return db.folders.toArray();
    };

    DB.updateFolder = function (folder) {
        return db.folders.put(folder);
    };

    DB.deleteFolder = function (id) {
        return db.folders.where('id').equals(id).delete();
    };

    DB.addBulkSongs = function (songs) {
        return db.songs.bulkAdd(songs);
    };

    DB.addSong = function (song) {
        return db.songs.add(song);
    };

    DB.getAllSongs = function (sortBy) {
        sortBy = sortBy || 'title';
        return db.songs.orderBy(sortBy).toArray();
    };

    DB.deleteAllSongs = function () {
      return db.songs.clear();
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
