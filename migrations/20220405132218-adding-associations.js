"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "attendances", // name of Source model
      "staff_id", // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: "users", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onDelete: "SET NULL",
      }
    );

    await queryInterface.addColumn(
      "users", // name of Source model
      "role_id", // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: "roles", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onDelete: "SET NULL",
      }
    );
    await queryInterface.addColumn(
      "users", // name of Source model
      "supervisor_id", // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: "users", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onDelete: "SET NULL",
      }
    );

    await queryInterface.addColumn("leave_requests", "staff_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("attendances", "staff_id");
    await queryInterface.removeColumn("users", "role_id");
    await queryInterface.removeColumn("users", "supervisor_id");
    await queryInterface.removeColumn("leave_requests", "staff_id");
  },
};
