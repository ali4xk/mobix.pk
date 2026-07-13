import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import ListingCard from '../components/ListingCard'
import axios from 'axios'
import './Home.css'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Mobiles', value: 'mobile' },
  { label: 'Laptops', value: 'laptop' },
  { label: 'Tablets', value: 'tablet' },
  { label: 'Accessories', value: 'accessory' },
  { label: 'Gaming', value: 'gaming' },
]

export default function Home() {
  const [listings, setListings] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [activeCategory])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = activeCategory ? `?category=${activeCategory}` : ''
      const res = await axios.get(`https://mobixpk-production.up.railway.app/api/listings${params}`)
      setListings(res.data.listings)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Hero />
      <TrustBar />
      <main className="home-main">
        <div className="home-inner">
          <div className="section-header">
            <h2 className="section-title">Latest listings</h2>
            <div className="category-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  className={`cat-tab ${activeCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <i className="ti ti-loader-2 spin" />
              Loading listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="empty">
              <i className="ti ti-inbox" />
              <p>No listings yet. Be the first to post!</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}