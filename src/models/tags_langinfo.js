const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return TagsLanginfo.init(sequelize, DataTypes);
}

class TagsLanginfo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    tags_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'tags',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    removed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tags_langinfo',
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
        name: "tags_id",
        using: "BTREE",
        fields: [
          { name: "tags_id" },
        ]
      },
    ]
  });
  }
}
