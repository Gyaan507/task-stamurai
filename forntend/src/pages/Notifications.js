"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { formatDate } from "../utils/dateUtils"
import "../styles/Notifications.css"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNotifications()
    markAllAsRead()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await api.get("/notifications")
      setNotifications(response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all")
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="notifications-error">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>
          <i className="fas fa-bell"></i> Notifications
        </h2>
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <div className="empty-icon">
            <i className="fas fa-bell-slash"></i>
          </div>
          <p>You have no notifications</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.read ? "read" : "unread"}`}>
              <div className="notification-content">
                <p className="notification-message">
                  <i className="fas fa-info-circle notification-icon"></i>
                  {notification.message}
                </p>
                <span className="notification-time">
                  <i className="fas fa-clock"></i> {formatDate(notification.createdAt)}
                </span>
              </div>
              {notification.taskId && (
                <Link to={`/tasks/${notification.taskId}`} className="view-task-btn">
                  <i className="fas fa-eye"></i> View Task
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
