"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import TaskList from "../components/TaskList"
import "../styles/Dashboard.css"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [dueDateFilter, setDueDateFilter] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [activeTab])

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

      const response = await api.get(endpoint)
      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    // Apply search and filters
    searchTasks()
  }

  const searchTasks = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()

      if (searchTerm) params.append("query", searchTerm)
      if (statusFilter) params.append("status", statusFilter)
      if (priorityFilter) params.append("priority", priorityFilter)
      if (dueDateFilter) params.append("dueDate", dueDateFilter)

      const queryString = params.toString()
      const endpoint = queryString ? `/tasks/search?${queryString}` : "/tasks"

      const response = await api.get(endpoint)
      setTasks(response.data)
    } catch (error) {
      console.error("Error searching tasks:", error)
      setError("Failed to search tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setPriorityFilter("")
    setDueDateFilter("")
    fetchTasks()
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
        <div>
          <h1>Task Dashboard</h1>
          <p className="dashboard-subtitle">Manage your tasks and assignments</p>
        </div>
        <Link to="/tasks/create" className="create-task-btn">
          <i className="fas fa-plus-circle"></i>
          <span>Create Task</span>
        </Link>
      </div>

      <div className="search-filter-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
            <button type="button" className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <i className={`fas ${showFilters ? "fa-times" : "fa-filter"}`}></i>
            </button>
          </div>

          {showFilters && (
            <div className="filters-container">
              <div className="filter-group">
                <label htmlFor="status">Status</label>
                <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Any Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="priority">Priority</label>
                <select id="priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="">Any Priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value)}
                />
              </div>

              <button type="button" onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
        </form>
      </div>

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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList tasks={tasks} emptyMessage={getEmptyMessage()} />
      )}
    </div>
  )
}

export default Dashboard
