import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchMyListings()
  }, [user])

  const fetchMyListings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('mobix_token')
      const res = await axios.get('http://localhost:5000/api/listings/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setListings(res.data.listings)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      const token = localStorage.getItem('mobix_token')
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setListings(l => l.filter(listing => listing.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkSold = async (id) => {
    try {
      const token = localStorage.getItem('mobix_token')
      await axios.put(`http://localhost:5000/api/listings/${id}`,
        { status: 'sold' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setListings(l => l.map(listing =>
        listing.id === id ? { ...listing, status: 'sold' } : listing
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const formatPrice = (price) =>
    'Rs. ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const statusColor = { active: '#22C55E', sold: '#F59E0B', removed: '#F43F5E' }

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-sub">Welcome back, {user?.name}</p>
          </div>
          <Link to="/create-listing" className="create-btn">
            <i className="ti ti-plus" />
            Post a listing
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{listings.length}</div>
            <div className="stat-label">Total listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{listings.filter(l => l.status === 'active').length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{listings.filter(l => l.status === 'sold').length}</div>
            <div className="stat-label">Sold</div>
          </div>
        </div>

        <div className="listings-section">
          <h2 className="section-title">My listings</h2>

          {loading ? (
            <div className="dash-loading">
              <i className="ti ti-loader-2 spin" /> Loading...
            </div>
          ) : listings.length === 0 ? (
            <div className="dash-empty">
              <i className="ti ti-inbox" />
              <p>You haven't posted any listings yet.</p>
              <Link to="/create-listing" className="create-btn">Post your first listing</Link>
            </div>
          ) : (
            <div className="listings-table">
              {listings.map(listing => (
                <div key={listing.id} className="listing-row">
                  <div className="listing-row-img">
                    {listing.image ? (
                      <img src={listing.image} alt={listing.title} />
                    ) : (
                      <div className="listing-row-placeholder">
                        <i className="ti ti-device-mobile" />
                      </div>
                    )}
                  </div>

                  <div className="listing-row-info">
                    <div className="listing-row-title">{listing.title}</div>
                    <div className="listing-row-meta">{listing.brand} · {listing.city}</div>
                  </div>

                  <div className="listing-row-price">{formatPrice(listing.price)}</div>

                  <div className="listing-row-status" style={{ color: statusColor[listing.status] }}>
                    {listing.status}
                  </div>

                  <div className="listing-row-actions">
                    <Link to={`/listing/${listing.id}`} className="action-btn view">
                      <i className="ti ti-eye" />
                    </Link>
                    {listing.status === 'active' && (
                      <button className="action-btn sold" onClick={() => handleMarkSold(listing.id)}>
                        <i className="ti ti-check" />
                      </button>
                    )}
                    <button className="action-btn delete" onClick={() => handleDelete(listing.id)}>
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}