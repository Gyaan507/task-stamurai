"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import "../styles/Layout.css"

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUnreadNotifications()

    // Poll for new notifications every minute
    const interval = setInterval(fetchUnreadNotifications, 60000)

    return () => clearInterval(interval)
  }, [])

  const fetchUnreadNotifications = async () => {
    try {
      const response = await api.get("/notifications/unread/count")
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error("Error fetching unread notifications:", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">
          <Link to="/">TaskFlow</Link>
        </div>
        <div className="user-menu">
          <div className="notification-icon">
            <Link to="/notifications">
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>
          </div>
          <div className="user-info">
            <span>{currentUser?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
