const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return TagsCategories.init(sequelize, DataTypes);
}

class TagsCategories extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    tags_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id'
      }
    },
    categories_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'tags_categories',
    timestamps: true,
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tags_id" },
          { name: "categories_id" },
        ]
      },
      {
        name: "FK_tags_categories_categories",
        using: "BTREE",
        fields: [
          { name: "categories_id" },
        ]
      },
    ]
  });
  }
}
