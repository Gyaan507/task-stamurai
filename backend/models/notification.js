const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Define associations
      Notification.belongsTo(models.User, { foreignKey: "userId" })
      Notification.belongsTo(models.Task, { foreignKey: "taskId" })
    }
  }

  Notification.init(
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Tasks",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications", // Note: lowercase table name
    },
  )

  return Notification
}
