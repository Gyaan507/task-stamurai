const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { sequelize } = require("./models")
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
const userRoutes = require("./routes/users")
const notificationRoutes = require("./routes/notifications")
const { authenticateToken } = require("./middleware/auth")
const dotenv = require("dotenv");


const app = express()

// Middleware

app.use(express.json())
app.use(morgan("dev"))

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : 'http://localhost:3000'
}));


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", authenticateToken, taskRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/notifications", authenticateToken, notificationRoutes)
app.use(cors);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Sequelize connection
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

// Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await connectDB()
  })
} else {
  // For Vercel or other serverless platforms
  connectDB()
}

module.exports = app
