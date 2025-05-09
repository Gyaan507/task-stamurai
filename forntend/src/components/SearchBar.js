"use client"

import { useState } from "react"
import "../styles/SearchBar.css"

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("ANY")
  const [priority, setPriority] = useState("ANY")
  const [dueDate, setDueDate] = useState("")
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const searchParams = {}

    if (query.trim()) {
      searchParams.query = query.trim()
    }

    if (isAdvancedSearch) {
      if (status !== "ANY") {
        searchParams.status = status
      }

      if (priority !== "ANY") {
        searchParams.priority = priority
      }

      if (dueDate) {
        searchParams.dueDate = dueDate
      }
    }

    onSearch(searchParams)
  }

  const toggleAdvancedSearch = () => {
    setIsAdvancedSearch(!isAdvancedSearch)
  }

  const clearForm = () => {
    setQuery("")
    setStatus("ANY")
    setPriority("ANY")
    setDueDate("")
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <button type="button" onClick={toggleAdvancedSearch} className="advanced-search-toggle">
          {isAdvancedSearch ? (
            <>
              <i className="fas fa-chevron-up"></i> Hide Filters
            </>
          ) : (
            <>
              <i className="fas fa-chevron-down"></i> Show Filters
            </>
          )}
        </button>

        {isAdvancedSearch && (
          <div className="advanced-search">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="ANY">Any Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="filter-select"
                >
                  <option value="ANY">Any Priority</option>
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
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button type="button" onClick={clearForm} className="clear-filters-btn">
                <i className="fas fa-eraser"></i> Clear Filters
              </button>
              <button type="submit" className="apply-filters-btn">
                <i className="fas fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar
