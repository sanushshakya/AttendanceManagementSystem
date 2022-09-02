"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.hasMany(User, {
        foreignKey: "role_id",
        as: "role",
      });
    }
  }
  Role.init(
    {
      role_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Role;
};
