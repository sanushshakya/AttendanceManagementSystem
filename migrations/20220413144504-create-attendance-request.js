"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance_requests", {
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
      approval_status: {
        type: Sequelize.BOOLEAN,
      },
      approval_date: {
        type: Sequelize.DATE,
      },
      date: {
        type: Sequelize.DATE,
      },
      check_in: {
        type: Sequelize.DATE,
      },
      check_out: {
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
    await queryInterface.dropTable("attendance_requests");
  },
};
