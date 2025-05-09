"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { formatDate } from "../utils/dateUtils"
import "../styles/TaskDetails.css"

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await api.get(`/tasks/${id}`)
      setTask(response.data)
    } catch (error) {
      console.error("Error fetching task:", error)
      setError("Failed to load task details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${id}`)
      navigate("/")
    } catch (error) {
      console.error("Error deleting task:", error)
      setError("Failed to delete task. Please try again.")
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH":
        return "priority-high"
      case "MEDIUM":
        return "priority-medium"
      case "LOW":
        return "priority-low"
      default:
        return ""
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "TODO":
        return "status-todo"
      case "IN_PROGRESS":
        return "status-in-progress"
      case "DONE":
        return "status-done"
      default:
        return ""
    }
  }

  const isOverdue = () => {
    if (!task?.dueDate || task?.status === "DONE") return false
    return new Date(task.dueDate) < new Date()
  }

  if (loading) {
    return <div className="loading-spinner">Loading task details...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/" className="back-btn">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="not-found-container">
        <h2>Task Not Found</h2>
        <p>The task you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/" className="back-btn">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="task-details-container">
      <div className="task-details-header">
        <h2>{task.title}</h2>
        <div className="task-details-actions">
          <Link to={`/tasks/${id}/edit`} className="edit-btn">
            Edit Task
          </Link>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} className="delete-btn">
              Delete Task
            </button>
          ) : (
            <div className="delete-confirm">
              <span>Are you sure?</span>
              <button onClick={handleDelete} className="confirm-yes">
                Yes
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="confirm-no">
                No
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="task-details-content">
        <div className="task-details-meta">
          <div className="meta-item">
            <span className="meta-label">Status:</span>
            <span className={`meta-value ${getStatusClass(task.status)}`}>{task.status.replace("_", " ")}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Priority:</span>
            <span className={`meta-value ${getPriorityClass(task.priority)}`}>{task.priority}</span>
          </div>

          {task.dueDate && (
            <div className="meta-item">
              <span className="meta-label">Due Date:</span>
              <span className={`meta-value ${isOverdue() ? "overdue" : ""}`}>
                {formatDate(task.dueDate)}
                {isOverdue() && <span className="overdue-label">OVERDUE</span>}
              </span>
            </div>
          )}

          <div className="meta-item">
            <span className="meta-label">Created By:</span>
            <span className="meta-value">{task.creator.name}</span>
          </div>

          {task.assignee && (
            <div className="meta-item">
              <span className="meta-label">Assigned To:</span>
              <span className="meta-value">{task.assignee.name}</span>
            </div>
          )}

          <div className="meta-item">
            <span className="meta-label">Created On:</span>
            <span className="meta-value">{formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="task-details-description">
          <h3>Description</h3>
          <p>{task.description || "No description provided"}</p>
        </div>
      </div>

      <div className="task-details-footer">
        <Link to="/" className="back-btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default TaskDetails
