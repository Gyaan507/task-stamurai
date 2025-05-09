"use client"

import { useState } from "react"
import "../styles/SearchFilter.css"

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch({
      query: searchTerm,
      status,
      priority,
      dueDate,
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatus("")
    setPriority("")
    setDueDate("")
    onSearch({})
  }

  return (
    <div className="search-filter-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
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
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Any Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="">Any Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="dueDate">Due Date</label>
              <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <button type="button" onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchFilter
