"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SupervisorStaff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SupervisorStaff.belongsTo(models.User, {
        as: "staff",
        foreignKey: "staff_id",
      });
      SupervisorStaff.belongsTo(models.User, {
        as: "supervisor",
        foreignKey: "supervisor_id",
      });
    }
  }
  SupervisorStaff.init(
    {
      staff_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
      supervisor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SupervisorStaff",
      tableName: "supervisor_staff",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return SupervisorStaff;
};
