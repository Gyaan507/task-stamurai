"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "../styles/TaskForm.css"

const TaskForm = ({ task, isEditing = false }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [status, setStatus] = useState("TODO")
  const [assignedTo, setAssignedTo] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()

    if (isEditing && task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
      setPriority(task.priority || "MEDIUM")
      setStatus(task.status || "TODO")
      setAssignedTo(task.assignedTo || "")
    }
  }, [isEditing, task])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const taskData = {
        title,
        description,
        dueDate: dueDate || null,
        priority,
        status,
        assignedTo: assignedTo === "unassigned" ? null : assignedTo || null,
      }

      if (isEditing) {
        await api.put(`/tasks/${task.id}`, taskData)
        setSuccess("Task updated successfully!")
      } else {
        await api.post("/tasks", taskData)
        setSuccess("Task created successfully!")
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (error) {
      console.error("Error saving task:", error)
      setError(error.response?.data?.message || "Failed to save task. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>
        <p className="task-form-subtitle">
          {isEditing ? "Update task details or reassign it" : "Fill in the details to create a new task"}
        </p>
      </div>

      {error && <div className="task-form-error">{error}</div>}
      {success && <div className="task-form-success">{success}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter task title"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <div className="date-input-container">
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="form-control"
              />
              <i className="fas fa-calendar-alt date-icon"></i>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <div className="select-container">
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-control"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <i className="fas fa-chevron-down select-icon"></i>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <div className="select-container">
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
              <i className="fas fa-chevron-down select-icon"></i>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <div className="select-container">
              <select
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="form-control"
              >
                <option value="unassigned">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down select-icon"></i>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/")} className="btn-cancel">
            <i className="fas fa-times"></i> Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <span className="spinner"></span> {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <i className={isEditing ? "fas fa-save" : "fas fa-plus-circle"}></i>
                {isEditing ? "Update Task" : "Create Task"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
