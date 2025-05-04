// In models/task.js
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      defaultValue: "MEDIUM",
    },
    status: {
      type: DataTypes.ENUM("TODO", "IN_PROGRESS", "DONE"),
      defaultValue: "TODO",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  })

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    })
    Task.belongsTo(models.User, {
      foreignKey: "assignedTo",
      as: "assignee",
    })
  }

  return Task
}