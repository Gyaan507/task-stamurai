import { Link } from "react-router-dom"
import { formatDate } from "../utils/dateUtils"
import "../styles/TaskCard.css"

const TaskCard = ({ task }) => {
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
    if (!task.dueDate || task.status === "DONE") return false
    return new Date(task.dueDate) < new Date()
  }

  return (
    <div className={`task-card ${isOverdue() ? "overdue" : ""}`}>
      <div className="task-header">
        <span className={`task-status ${getStatusClass(task.status)}`}>
          {task.status === "TODO" ? "To Do" : task.status === "IN_PROGRESS" ? "In Progress" : "Done"}
        </span>
        <span className={`task-priority ${getPriorityClass(task.priority)}`}>{task.priority}</span>
      </div>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description || "No description provided"}</p>
      </div>

      <div className="task-meta">
        {task.dueDate && (
          <div className="meta-item">
            <i className={`fas fa-calendar ${isOverdue() ? "overdue" : ""}`}></i>
            <span className={isOverdue() ? "overdue" : ""}>{formatDate(task.dueDate)}</span>
          </div>
        )}

        {task.assignee && (
          <div className="meta-item assignee">
            <div className="assignee-avatar">{task.assignee.name.charAt(0).toUpperCase()}</div>
            <span>{task.assignee.name}</span>
          </div>
        )}
      </div>

      <div className="task-footer">
        <Link to={`/tasks/${task.id}`} className="view-btn">
          View Details
        </Link>
        <Link to={`/tasks/${task.id}/edit`} className="edit-btn">
          Edit
        </Link>
      </div>
    </div>
  )
}

export default TaskCard
