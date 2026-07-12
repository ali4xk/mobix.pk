import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          mobix<span>.pk</span>
        </Link>

        <div className="navbar-links">
          <Link to="/browse" className="navbar-link">Browse</Link>
          <Link to="/browse?category=mobile" className="navbar-link">Mobiles</Link>
          <Link to="/browse?category=laptop" className="navbar-link">Laptops</Link>
          <Link to="/how-it-works" className="navbar-link">How it works</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/messages" className="navbar-link">
                <i className="ti ti-message" /> Messages
              </Link>
              <Link to="/create-listing" className="btn-post">
                <i className="ti ti-plus" />
                Post a listing
              </Link>
              <button className="navbar-logout" onClick={logout}>
                <i className="ti ti-logout" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/create-listing" className="btn-post">
                <i className="ti ti-plus" />
                Post a listing
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}