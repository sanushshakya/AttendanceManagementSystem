"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AbsentRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbsentRecord.init(
    {
      date: {
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
      modelName: "AbsentRecord",
      tableName: "absent_records",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return AbsentRecord;
};
