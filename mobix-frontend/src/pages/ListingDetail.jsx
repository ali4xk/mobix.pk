import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './ListingDetail.css'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [seller, setSeller] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)

  const conditionColor = {
    'Like New': '#22C55E',
    'Excellent': '#3B82F6',
    'Good': '#F59E0B',
    'Fair': '#F97316',
    'For Parts': '#F43F5E',
  }

  useEffect(() => {
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`https://mobixpk-production.up.railway.app/api/listings/${id}`)
      setListing(res.data)
      const sellerRes = await axios.get(`https://mobixpk-production.up.railway.app/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mobix_token')}` }
      })
      setSeller(sellerRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) =>
    'Rs. ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const handleContact = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate(`/messages/${listing.id}/${listing.seller_id}`)
  }

  if (loading) return (
    <div className="detail-loading">
      <i className="ti ti-loader-2 spin" /> Loading listing...
    </div>
  )

  if (!listing) return (
    <div className="detail-loading">Listing not found.</div>
  )

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <div className="detail-left">
          <div className="main-img-wrap">
            {listing.images && listing.images.length > 0 ? (
              <img src={listing.images[activeImg]} alt={listing.title} className="main-img" />
            ) : (
              <div className="main-img-placeholder">
                <i className="ti ti-device-mobile" />
              </div>
            )}
          </div>

          {listing.images && listing.images.length > 1 && (
            <div className="thumbnails">
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-right">
          <div className="detail-category">{listing.category}</div>
          <h1 className="detail-title">{listing.title}</h1>

          <div className="detail-price">{formatPrice(listing.price)}</div>

          <div className="detail-badges">
            <span className="badge-condition" style={{ color: conditionColor[listing.condition], borderColor: conditionColor[listing.condition] }}>
              {listing.condition}
            </span>
            <span className="badge-city">
              <i className="ti ti-map-pin" /> {listing.city}
            </span>
            <span className="badge-city">
              <i className="ti ti-tag" /> {listing.brand}
            </span>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">About this listing</div>
            <p className="detail-description">
              {listing.description || 'No description provided.'}
            </p>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Details</div>
            <div className="detail-specs">
              <div className="spec-row">
                <span className="spec-label">Brand</span>
                <span className="spec-value">{listing.brand}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Model</span>
                <span className="spec-value">{listing.model}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Condition</span>
                <span className="spec-value" style={{ color: conditionColor[listing.condition] }}>
                  {listing.condition}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-label">City</span>
                <span className="spec-value">{listing.city}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Listed</span>
                <span className="spec-value">
                  {new Date(listing.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {user && String(user.id) !== String(listing.seller_id) && (
            <button className="contact-btn" onClick={handleContact}>
              <i className="ti ti-message" />
              Contact seller
            </button>
          )}

          {!user && (
            <button className="contact-btn" onClick={handleContact}>
              <i className="ti ti-message" />
              Login to contact seller
            </button>
          )}

          {user && String(user.id) === String(listing.seller_id) && (
            <div className="own-listing-note">
              <i className="ti ti-info-circle" /> This is your listing
            </div>
          )}
        </div>
      </div>
    </div>
  )
}