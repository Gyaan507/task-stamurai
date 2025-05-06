const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { sequelize } = require("./models")
const authRoutes = require("./routes/auth")
const tasksRoutes = require("./routes/tasks")
const usersRoutes = require("./routes/users")
const notificationsRoutes = require("./routes/notifications")
const authenticateToken = require("./middleware/authenticateToken")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", authenticateToken, tasksRoutes)
app.use("/api/users", authenticateToken, usersRoutes)
app.use("/api/notifications", authenticateToken, notificationsRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

const PORT = process.env.PORT || 5000

// Sync database and start server
sequelize
  .sync({ alter: true }) // This will create the tables if they don't exist
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err)
  })

module.exports = app
