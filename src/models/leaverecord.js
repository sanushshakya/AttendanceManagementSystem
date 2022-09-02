"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LeaveRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeaveRecord.init(
    {
      from: {
        type: DataTypes.DATE,
      },
      till: {
        type: DataTypes.DATE,
      },
      staff_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "LeaveRecord",
      tableName: "leave_records",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return LeaveRecord;
};
