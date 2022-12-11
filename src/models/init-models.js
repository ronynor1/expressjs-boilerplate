const DataTypes = require("sequelize").DataTypes;
const _Artists = require("./artists");
const _ArtistsLanginfo = require("./artists_langinfo");
const _AuthPermissions = require("./auth_permissions");
const _AuthRoles = require("./auth_roles");
const _AuthRolesPermissions = require("./auth_roles_permissions");
const _Categories = require("./categories");
const _Media = require("./media");
const _Tags = require("./tags");
const _TagsCategories = require("./tags_categories");
const _TagsLanginfo = require("./tags_langinfo");
const _Users = require("./users");
const _UsersTokens = require("./users_tokens");

function initModels(sequelize) {
  const Artists = _Artists(sequelize, DataTypes);
  const ArtistsLanginfo = _ArtistsLanginfo(sequelize, DataTypes);
  const AuthPermissions = _AuthPermissions(sequelize, DataTypes);
  const AuthRoles = _AuthRoles(sequelize, DataTypes);
  const AuthRolesPermissions = _AuthRolesPermissions(sequelize, DataTypes);
  const Categories = _Categories(sequelize, DataTypes);
  const Media = _Media(sequelize, DataTypes);
  const Tags = _Tags(sequelize, DataTypes);
  const TagsCategories = _TagsCategories(sequelize, DataTypes);
  const TagsLanginfo = _TagsLanginfo(sequelize, DataTypes);
  const Users = _Users(sequelize, DataTypes);
  const UsersTokens = _UsersTokens(sequelize, DataTypes);

  AuthPermissions.belongsToMany(AuthRoles, { as: 'roles_id_auth_roles', through: AuthRolesPermissions, foreignKey: "permissions_id", otherKey: "roles_id" });
  AuthRoles.belongsToMany(AuthPermissions, { as: 'permissions_id_auth_permissions', through: AuthRolesPermissions, foreignKey: "roles_id", otherKey: "permissions_id" });
  Categories.belongsToMany(Tags, { as: 'tags_id_tags', through: TagsCategories, foreignKey: "categories_id", otherKey: "tags_id" });
  Tags.belongsToMany(Categories, { as: 'categories_id_categories', through: TagsCategories, foreignKey: "tags_id", otherKey: "categories_id" });
  ArtistsLanginfo.belongsTo(Artists, { as: "artist", foreignKey: "artists_id"});
  Artists.hasMany(ArtistsLanginfo, { as: "artists_langinfos", foreignKey: "artists_id"});
  Media.belongsTo(Artists, { as: "artist", foreignKey: "artists_id"});
  Artists.hasMany(Media, { as: "media", foreignKey: "artists_id"});
  AuthRolesPermissions.belongsTo(AuthPermissions, { as: "permission", foreignKey: "permissions_id"});
  AuthPermissions.hasMany(AuthRolesPermissions, { as: "auth_roles_permissions", foreignKey: "permissions_id"});
  AuthRolesPermissions.belongsTo(AuthRoles, { as: "role", foreignKey: "roles_id"});
  AuthRoles.hasMany(AuthRolesPermissions, { as: "auth_roles_permissions", foreignKey: "roles_id"});
  Users.belongsTo(AuthRoles, { as: "role", foreignKey: "roles_id"});
  AuthRoles.hasMany(Users, { as: "users", foreignKey: "roles_id"});
  Media.belongsTo(Categories, { as: "category", foreignKey: "categories_id"});
  Categories.hasMany(Media, { as: "media", foreignKey: "categories_id"});
  TagsCategories.belongsTo(Categories, { as: "category", foreignKey: "categories_id"});
  Categories.hasMany(TagsCategories, { as: "tags_categories", foreignKey: "categories_id"});
  TagsCategories.belongsTo(Tags, { as: "tag", foreignKey: "tags_id"});
  Tags.hasMany(TagsCategories, { as: "tags_categories", foreignKey: "tags_id"});
  TagsLanginfo.belongsTo(Tags, { as: "tag", foreignKey: "tags_id"});
  Tags.hasMany(TagsLanginfo, { as: "tags_langinfos", foreignKey: "tags_id"});
  UsersTokens.belongsTo(Users, { as: "user", foreignKey: "users_id"});
  Users.hasMany(UsersTokens, { as: "users_tokens", foreignKey: "users_id"});

  return {
    Artists,
    ArtistsLanginfo,
    AuthPermissions,
    AuthRoles,
    AuthRolesPermissions,
    Categories,
    Media,
    Tags,
    TagsCategories,
    TagsLanginfo,
    Users,
    UsersTokens,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
