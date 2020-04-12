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
    db.createTable('roles_permissions', {
            columns: {
                id: {
                    type: 'int',
                    primaryKey: true,
                    autoIncrement: true
                },
                role_id: {
                    type: 'int',
                    notNull: true,
                    foreignKey: {
                        name: 'roles_id_roles_permissions_fk',
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
                permission_id: {
                    type: 'int',
                    notNull: true,
                    foreignKey: {
                        name: 'permission_id_roles_permissions_fk',
                        table: 'permissions',
                        rules: {
                            onDelete: 'CASCADE',
                            onUpdate: 'CASCADE'
                        },
                        mapping: {
                            permission_id: 'id'
                        }
                    }
                }
            },
            ifNotExists: true
        },
        function (err) {
            callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('roles_permissions', function (err) {
        if (err) return callback(err);
        return callback();
    })
};

exports._meta = {
    "version": 1
};