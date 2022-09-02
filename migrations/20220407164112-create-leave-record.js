"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leave_records", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      till: {
        type: Sequelize.DATE,
      },
      from: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("leave_records");
  },
};
