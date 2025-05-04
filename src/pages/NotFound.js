import { Link } from "react-router-dom"
import "../styles/NotFound.css"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-btn">
        Go to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
