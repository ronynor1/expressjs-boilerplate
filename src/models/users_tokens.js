const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UsersTokens.init(sequelize, DataTypes);
}

class UsersTokens extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    users_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users_tokens',
    timestamps: true,
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FK_users_tokens_users",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
    ]
  });
  }
}
