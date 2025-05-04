const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { sequelize } = require("./models")
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
const userRoutes = require("./routes/users")
const notificationRoutes = require("./routes/notifications")
const { authenticateToken } = require("./middleware/auth")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", authenticateToken, taskRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/notifications", authenticateToken, notificationRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
})
