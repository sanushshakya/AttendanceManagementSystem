"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init(
    {
      staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATE,
      },
      check_in: {
        type: DataTypes.DATE,
      },
      check_out: {
        type: DataTypes.DATE,
      },
      total_time: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "attendances",
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  return Attendance;
};
