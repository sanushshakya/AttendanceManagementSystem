"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AttendanceRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AttendanceRequest.init(
    {
      staff_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      reason_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason_desc: {
        type: DataTypes.TEXT,
      },
      approval_status: {
        type: DataTypes.BOOLEAN,
      },
      approval_date: {
        type: DataTypes.DATE,
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
    },
    {
      sequelize,
      modelName: "AttendanceRequest",
      tableName: "attendance_requests",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return AttendanceRequest;
};
