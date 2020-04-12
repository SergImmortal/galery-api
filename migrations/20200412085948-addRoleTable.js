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
    db.createTable('roles', {
            columns: {
                id: {type: 'int', primaryKey: true, autoIncrement: true},
                name: {type: 'string', notNull: true, length: 100}
            },
            ifNotExists: true
        },
        function (err) {
            if (err) return callback(err);
            db.runSql(
                "INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'user'), (3, 'public')",
                [],
                function (err) {
                if (err) return callback(err);
                callback();
            });
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('roles', function (err) {
        if (err) return callback(err);
        return callback();
    })
};

exports._meta = {
    "version": 1
};
