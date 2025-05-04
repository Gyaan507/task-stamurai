"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import TaskList from "../components/TaskList"
import SearchFilter from "../components/SearchFilter"
import "../styles/Dashboard.css"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchFilters, setSearchFilters] = useState({})

  useEffect(() => {
    fetchTasks()
  }, [activeTab, searchFilters])

  const fetchTasks = async () => {
    setLoading(true)
    setError("")

    try {
      let endpoint = "/tasks"

      // Determine endpoint based on active tab
      if (activeTab === "assigned") {
        endpoint = "/tasks/assigned"
      } else if (activeTab === "created") {
        endpoint = "/tasks/created"
      } else if (activeTab === "overdue") {
        endpoint = "/tasks/overdue"
      }

      // Add search filters if any
      if (Object.keys(searchFilters).length > 0) {
        endpoint = "/tasks/search"
        const params = new URLSearchParams()

        if (searchFilters.query) params.append("query", searchFilters.query)
        if (searchFilters.status) params.append("status", searchFilters.status)
        if (searchFilters.priority) params.append("priority", searchFilters.priority)
        if (searchFilters.dueDate) params.append("dueDate", searchFilters.dueDate)

        endpoint += `?${params.toString()}`
      }

      const response = await api.get(endpoint)
      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "assigned":
        return "No tasks assigned to you"
      case "created":
        return "You haven't created any tasks yet"
      case "overdue":
        return "No overdue tasks"
      default:
        return "No tasks found"
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <Link to="/tasks/create" className="create-task-btn">
          Create New Task
        </Link>
      </div>

      <SearchFilter onSearch={handleSearch} />

      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          All Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === "assigned" ? "active" : ""}`}
          onClick={() => setActiveTab("assigned")}
        >
          Assigned to Me
        </button>
        <button
          className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
          onClick={() => setActiveTab("created")}
        >
          Created by Me
        </button>
        <button
          className={`tab-btn ${activeTab === "overdue" ? "active" : ""}`}
          onClick={() => setActiveTab("overdue")}
        >
          Overdue
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : (
        <TaskList tasks={tasks} emptyMessage={getEmptyMessage()} />
      )}
    </div>
  )
}

export default Dashboard
