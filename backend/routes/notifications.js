const express = require("express")
const { Notification } = require("../models")
const router = express.Router()

// Get all notifications for the current user
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    res.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ message: "Error fetching notifications" })
  }
})

// Get unread notifications count
router.get("/unread/count", async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        userId: req.user.id,
        read: false,
      },
    })

    res.json({ count })
  } catch (error) {
    console.error("Error fetching unread notifications count:", error)
    res.status(500).json({ message: "Error fetching unread notifications count" })
  }
})

// Mark all notifications as read
router.patch("/read-all", async (req, res) => {
  try {
    await Notification.update({ read: true }, { where: { userId: req.user.id, read: false } })

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    res.status(500).json({ message: "Error marking notifications as read" })
  }
})

// Mark a specific notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    await notification.update({ read: true })

    res.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ message: "Error marking notification as read" })
  }
})

module.exports = router
