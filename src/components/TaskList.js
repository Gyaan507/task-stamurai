import TaskCard from "./TaskCard"
import "../styles/TaskList.css"

const TaskList = ({ tasks, emptyMessage }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-task-list">
        <p>{emptyMessage || "No tasks found"}</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

export default TaskList
