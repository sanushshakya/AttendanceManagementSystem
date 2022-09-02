"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leave_requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reason_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reason_desc: {
        type: Sequelize.TEXT,
      },
      from: {
        type: Sequelize.DATE,
      },
      till: {
        type: Sequelize.DATE,
      },
      approval_status: {
        type: Sequelize.BOOLEAN,
      },
      approval_date: {
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
    await queryInterface.dropTable("leave_requests");
  },
};
