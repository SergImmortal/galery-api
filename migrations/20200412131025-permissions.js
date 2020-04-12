'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.createTable('permissions', {
            columns: {
                id: {type: 'int', primaryKey: true, autoIncrement: true},
                resource: {type: 'string', notNull: true, length: 100},
                permission: {type: 'string', notNull: true, length: 100},
                group: {type: 'string', length: 100}
            },
            ifNotExists: true
        },
        function (err) {
            if (err) return callback(err);
            callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('permissions', function (err) {
        if (err) return callback(err);
        return callback();
    })
};

exports._meta = {
    "version": 1
};