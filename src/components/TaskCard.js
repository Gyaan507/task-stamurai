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
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-priority ${getPriorityClass(task.priority)}`}>{task.priority}</span>
      </div>
      <div className="task-body">
        <p className="task-description">{task.description || "No description"}</p>
        {task.dueDate && (
          <p className="task-due-date">
            Due: {formatDate(task.dueDate)}
            {isOverdue() && <span className="overdue-label">OVERDUE</span>}
          </p>
        )}
        <div className="task-meta">
          <span className={`task-status ${getStatusClass(task.status)}`}>{task.status.replace("_", " ")}</span>
          {task.assignee && <span className="task-assignee">Assigned to: {task.assignee.name}</span>}
        </div>
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
