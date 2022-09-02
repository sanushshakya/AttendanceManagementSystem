"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes.lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeaveRequest.init(
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
      from: {
        type: DataTypes.DATE,
      },
      till: {
        type: DataTypes.DATE,
      },
      approval_status: {
        type: DataTypes.BOOLEAN,
      },
      approval_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "LeaveRequest",
      tableName: "leave_requests",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return LeaveRequest;
};
