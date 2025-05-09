"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import "../styles/Layout.css"

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <i className={`fas ${sidebarOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
        <div className="logo">
          <Link to="/">TaskFlow</Link>
        </div>
        <Link to="/notifications" className="notification-icon">
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </Link>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Link to="/">TaskFlow</Link>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">{currentUser?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <h3>{currentUser?.name}</h3>
            <p>{currentUser?.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""} onClick={closeSidebarOnMobile}>
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks/create"
                className={isActive("/tasks/create") ? "active" : ""}
                onClick={closeSidebarOnMobile}
              >
                <i className="fas fa-plus-square"></i>
                <span>Create Task</span>
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className={isActive("/notifications") ? "active" : ""}
                onClick={closeSidebarOnMobile}
              >
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
                {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <div className="content-wrapper">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  )
}

export default Layout
