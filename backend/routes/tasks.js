const express = require("express")
const { Task, User, Notification, sequelize } = require("../models")
const { Op } = require("sequelize")
const router = express.Router()

// Get all tasks for the current user (created or assigned)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({ message: "Error fetching tasks" })
  }
})

// Get tasks assigned to the current user
router.get("/assigned", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedTo: req.user.id },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching assigned tasks:", error)
    res.status(500).json({ message: "Error fetching assigned tasks" })
  }
})

// Get tasks created by the current user
router.get("/created", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { createdBy: req.user.id },
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching created tasks:", error)
    res.status(500).json({ message: "Error fetching created tasks" })
  }
})

// Get overdue tasks
router.get("/overdue", async (req, res) => {
  try {
    const currentDate = new Date()

    const tasks = await Task.findAll({
      where: {
        [Op.or]: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
        dueDate: {
          [Op.lt]: currentDate,
        },
        status: {
          [Op.ne]: "DONE",
        },
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["dueDate", "ASC"]],
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching overdue tasks:", error)
    res.status(500).json({ message: "Error fetching overdue tasks" })
  }
})

// Search tasks - FIXED to only show user's own tasks
router.get("/search", async (req, res) => {
  try {
    const { query, status, priority, dueDate } = req.query

    // Base where clause - only show tasks created by or assigned to the current user
    const whereClause = {
      [Op.or]: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    }

    // Add search query if provided
    if (query) {
      whereClause[Op.and] = [
        {
          [Op.or]: [{ title: { [Op.iLike]: `%${query}%` } }, { description: { [Op.iLike]: `%${query}%` } }],
        },
      ]
    }

    // Add status filter if provided
    if (status && status !== "ANY") {
      whereClause.status = status
    }

    // Add priority filter if provided
    if (priority && priority !== "ANY") {
      whereClause.priority = priority
    }

    // Add due date filter if provided
    if (dueDate) {
      const date = new Date(dueDate)
      const nextDay = new Date(date)
      nextDay.setDate(date.getDate() + 1)

      whereClause.dueDate = {
        [Op.gte]: date,
        [Op.lt]: nextDay,
      }
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error searching tasks:", error)
    res.status(500).json({ message: "Error searching tasks" })
  }
})

// Get a specific task - FIXED to only allow access to own tasks
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found or you don't have permission to view it" })
    }

    res.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    res.status(500).json({ message: "Error fetching task" })
  }
})

// Create a new task
router.post("/", async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body

    // Create task
    const task = await Task.create(
      {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "MEDIUM",
        status: status || "TODO",
        createdBy: req.user.id,
        assignedTo: assignedTo || null,
      },
      { transaction },
    )

    // Create notification if task is assigned to someone
    if (assignedTo && assignedTo !== req.user.id) {
      await Notification.create(
        {
          message: `You have been assigned a new task: ${title}`,
          userId: assignedTo,
          taskId: task.id,
        },
        { transaction },
      )
    }

    await transaction.commit()

    // Fetch the task with associations
    const taskWithAssociations = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
    })

    res.status(201).json(taskWithAssociations)
  } catch (error) {
    await transaction.rollback()
    console.error("Error creating task:", error)
    res.status(500).json({ message: "Error creating task" })
  }
})

// Update a task - FIXED to handle assignment properly
router.put("/:id", async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body

    // Find the task
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id, // Only the creator can update the task
      },
    })

    if (!task) {
      await transaction.rollback()
      return res.status(404).json({ message: "Task not found or you are not authorized to update it" })
    }

    // Check if assignee has changed
    const previousAssignee = task.assignedTo
    const assigneeChanged = previousAssignee !== assignedTo

    // Update task
    await task.update(
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        priority: priority || task.priority,
        status: status || task.status,
        assignedTo: assignedTo || task.assignedTo,
      },
      { transaction },
    )

    // Create notification if assignee has changed
    if (assigneeChanged && assignedTo && assignedTo !== req.user.id) {
      await Notification.create(
        {
          message: `You have been assigned a task: ${task.title}`,
          userId: assignedTo,
          taskId: task.id,
        },
        { transaction },
      )
    }

    await transaction.commit()

    // Fetch the updated task with associations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email"],
        },
      ],
    })

    res.json(updatedTask)
  } catch (error) {
    await transaction.rollback()
    console.error("Error updating task:", error)
    res.status(500).json({ message: "Error updating task" })
  }
})

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    // Find the task
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id, // Only the creator can delete the task
      },
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found or you are not authorized to delete it" })
    }

    // Delete the task
    await task.destroy()

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ message: "Error deleting task" })
  }
})

module.exports = router
