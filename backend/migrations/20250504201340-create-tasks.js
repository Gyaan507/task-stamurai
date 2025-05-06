'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "MEDIUM",
      },
      status: {
        type: Sequelize.ENUM("TODO", "IN_PROGRESS", "DONE"),
        defaultValue: "TODO",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assignedTo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks')
  },
}
