// In models/user.js
const bcrypt = require("bcrypt")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
          }
        },
      },
    }
  )

  // Add instance method for password validation
  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: "createdBy",
      as: "createdTasks",
    })
    User.hasMany(models.Task, {
      foreignKey: "assignedTo",
      as: "assignedTasks",
    })
    User.hasMany(models.Notification, {
      foreignKey: "userId",
      as: "notifications",
    })
  }

  return User
}