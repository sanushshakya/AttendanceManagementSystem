"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, SupervisorStaff }) {
      // define association here
      this.belongsTo(Role, {
        foreignKey: "role_id",
        as: "role",
      });
      User.belongsToMany(User, {
        through: SupervisorStaff,
        as: "supervisors",
        foreignKey: "staff_id",
      });
      User.belongsToMany(User, {
        through: SupervisorStaff,
        as: "staffs",
        foreignKey: "supervisor_id",
      });
    }
  }
  User.init(
    {
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
      },
      role_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
      },
      designation: {
        type: DataTypes.STRING,
      },
      is_supervisor: {
        type: DataTypes.BOOLEAN,
      },
      last_login: {
        type: DataTypes.DATE,
      },
      current_login: {
        type: DataTypes.DATE,
      },
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
