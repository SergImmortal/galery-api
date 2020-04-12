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
    db.createTable('users', {
            columns: {
                id: {type: 'int', primaryKey: true, autoIncrement: true},
                username: {type: 'string', notNull: true, length: 200},
                email: {type: 'string', notNull: true, length: 200},
                password: {type: 'string', notNull: true, length: 400},
                token: {type: 'string', length: 800},
                status: {type: 'int', notNull: true, defaultValue: 1},
                role_id: {
                    type: 'int',
                    notNull: true,
                    foreignKey: {
                        name: 'roles_id_users_fk',
                        table: 'roles',
                        rules: {
                            onDelete: 'CASCADE',
                            onUpdate: 'CASCADE'
                        },
                        mapping: {
                            role_id: 'id'
                        }
                    }
                },
                created_at: {type: 'timestamp', notNull: true},
                last_login_at: {type: 'timestamp', notNull: true},

            },
            ifNotExists: true
        },
        function (err) {
            callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('users', function (err) {
        if (err) return callback(err);
        return callback();
    })
};

exports._meta = {
    "version": 1
};