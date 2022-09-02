"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OTP.init(
    {
      code: { type: DataTypes.INTEGER },
      email: { type: DataTypes.STRING },
      valid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "OTP",
      tableName: "otps",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return OTP;
};
