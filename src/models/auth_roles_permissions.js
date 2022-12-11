const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return AuthRolesPermissions.init(sequelize, DataTypes);
}

class AuthRolesPermissions extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    roles_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'auth_roles',
        key: 'id'
      }
    },
    permissions_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'auth_permissions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'auth_roles_permissions',
    timestamps: true,
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roles_id" },
          { name: "permissions_id" },
        ]
      },
      {
        name: "roles_id",
        using: "BTREE",
        fields: [
          { name: "roles_id" },
        ]
      },
      {
        name: "permissions_id",
        using: "BTREE",
        fields: [
          { name: "permissions_id" },
        ]
      },
    ]
  });
  }
}
