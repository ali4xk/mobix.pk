import { Link } from 'react-router-dom'
import './ListingCard.css'

export default function ListingCard({ listing }) {
  const formatPrice = (price) =>
    'Rs. ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const conditionColor = {
    'Like New': '#22C55E',
    'Excellent': '#3B82F6',
    'Good': '#F59E0B',
    'Fair': '#F97316',
    'For Parts': '#F43F5E',
  }

  return (
    <Link to={`/listing/${listing.id}`} className="listing-card">
      <div className="card-img-wrap">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="card-img" />
        ) : (
          <div className="card-img-placeholder">
            <i className="ti ti-device-mobile" />
          </div>
        )}
        <div className="card-category">{listing.category}</div>
      </div>

      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-meta">{listing.brand} · {listing.model}</div>

        <div className="card-footer">
          <div className="card-price">{formatPrice(listing.price)}</div>
          <div className="card-condition" style={{ color: conditionColor[listing.condition] }}>
            {listing.condition}
          </div>
        </div>

        <div className="card-city">
          <i className="ti ti-map-pin" />
          {listing.city}
        </div>
      </div>
    </Link>
  )
}