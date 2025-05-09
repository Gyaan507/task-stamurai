"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../services/api"
import TaskForm from "../components/TaskForm"

const EditTask = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      setError("Failed to load task. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-spinner">Loading task...</div>
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
        <p>The task you're looking for doesn't exist or you don't have permission to edit it.</p>
        <Link to="/" className="back-btn">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="edit-task-container">
      <TaskForm task={task} isEditing={true} />
    </div>
  )
}

export default EditTask
