import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import axios from 'axios'
import './Browse.css'

const CATEGORIES = ['mobile', 'laptop', 'tablet', 'accessory', 'gaming']
const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar']
const CONDITIONS = ['Like New', 'Excellent', 'Good', 'Fair', 'For Parts']

export default function Browse() {
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    condition: '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    search: searchParams.get('search') || '',
  })

  useEffect(() => { fetchListings() }, [filters])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const res = await axios.get(`http://localhost:5000/api/listings?${params}`)
      setListings(res.data.listings)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const setFilter = (key, value) =>
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }))

  const clearFilters = () => setFilters({ category: '', city: '', condition: '', min_price: '', max_price: '', search: '' })

  return (
    <div className="browse-page">
      <div className="browse-inner">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">Filters</span>
            <button className="clear-btn" onClick={clearFilters}>Clear all</button>
          </div>

          <div className="filter-group">
            <div className="filter-label">Category</div>
            {CATEGORIES.map(c => (
              <label key={c} className="filter-option">
                <input type="radio" name="category" checked={filters.category === c}
                  onChange={() => setFilter('category', c)} />
                <span>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-label">Condition</div>
            {CONDITIONS.map(c => (
              <label key={c} className="filter-option">
                <input type="radio" name="condition" checked={filters.condition === c}
                  onChange={() => setFilter('condition', c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-label">City</div>
            {CITIES.map(c => (
              <label key={c} className="filter-option">
                <input type="radio" name="city" checked={filters.city === c}
                  onChange={() => setFilter('city', c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-label">Price range</div>
            <div className="price-inputs">
              <input type="number" placeholder="Min" className="price-input"
                value={filters.min_price}
                onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))} />
              <span className="price-sep">—</span>
              <input type="number" placeholder="Max" className="price-input"
                value={filters.max_price}
                onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))} />
            </div>
          </div>
        </aside>

        <main className="browse-main">
          <div className="browse-header">
            <h1 className="browse-title">
              {filters.search ? `Results for "${filters.search}"` : 'Browse listings'}
            </h1>
            <span className="browse-count">{listings.length} listings</span>
          </div>

          {loading ? (
            <div className="loading"><i className="ti ti-loader-2 spin" /> Loading...</div>
          ) : listings.length === 0 ? (
            <div className="empty">
              <i className="ti ti-inbox" />
              <p>No listings found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}