import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'

const CATEGORIES = ['All categories', 'Mobile', 'Laptop', 'Tablet', 'Accessory', 'Gaming']
const CITIES = ['Any city', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar']
const PRICE_RANGES = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under Rs. 20,000', min: '', max: '20000' },
  { label: 'Rs. 20,000 – 50,000', min: '20000', max: '50000' },
  { label: 'Rs. 50,000 – 100,000', min: '50000', max: '100000' },
  { label: 'Rs. 100,000 – 200,000', min: '100000', max: '200000' },
  { label: 'Above Rs. 200,000', min: '200000', max: '' },
]
const POPULAR_TAGS = ['iPhone 13', 'Samsung S22', 'MacBook', 'AirPods', 'PlayStation 5', 'iPad']

export default function Hero() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('All categories')
  const [city, setCity] = useState('Any city')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (category !== 'All categories') params.set('category', category.toLowerCase())
    if (city !== 'Any city') params.set('city', city)
    if (priceRange.min) params.set('min_price', priceRange.min)
    if (priceRange.max) params.set('max_price', priceRange.max)
    navigate(`/browse?${params.toString()}`)
  }

  const handleTag = (tag) => {
    navigate(`/browse?search=${encodeURIComponent(tag)}`)
  }

  const toggle = (name) => setOpenDropdown(openDropdown === name ? null : name)

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-badge">🇵🇰 Pakistan's trusted electronics marketplace</div>
        <h1 className="hero-title">
          Buy & sell used phones<br />you can actually <span>trust</span>
        </h1>
        <p className="hero-sub">IMEI verified · Condition graded · Seller verified</p>

        <div className="search-bar">
          {/* Category */}
          <div className="search-field" onClick={() => toggle('category')}>
            <i className="ti ti-layout-grid search-icon" />
            <div className="search-field-inner">
              <span className="search-field-label">Category</span>
              <span className="search-field-value">{category}</span>
            </div>
            <i className="ti ti-chevron-down chevron" />
            {openDropdown === 'category' && (
              <div className="dropdown">
                {CATEGORIES.map(c => (
                  <div key={c} className={`dropdown-item ${category === c ? 'active' : ''}`}
                    onClick={() => { setCategory(c); setOpenDropdown(null) }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search-divider" />

          {/* City */}
          <div className="search-field" onClick={() => toggle('city')}>
            <i className="ti ti-map-pin search-icon" />
            <div className="search-field-inner">
              <span className="search-field-label">City</span>
              <span className="search-field-value">{city}</span>
            </div>
            <i className="ti ti-chevron-down chevron" />
            {openDropdown === 'city' && (
              <div className="dropdown">
                {CITIES.map(c => (
                  <div key={c} className={`dropdown-item ${city === c ? 'active' : ''}`}
                    onClick={() => { setCity(c); setOpenDropdown(null) }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search-divider" />

          {/* Price Range */}
          <div className="search-field" onClick={() => toggle('price')}>
            <i className="ti ti-cash search-icon" />
            <div className="search-field-inner">
              <span className="search-field-label">Price range</span>
              <span className="search-field-value">{priceRange.label}</span>
            </div>
            <i className="ti ti-chevron-down chevron" />
            {openDropdown === 'price' && (
              <div className="dropdown">
                {PRICE_RANGES.map(p => (
                  <div key={p.label} className={`dropdown-item ${priceRange.label === p.label ? 'active' : ''}`}
                    onClick={() => { setPriceRange(p); setOpenDropdown(null) }}>
                    {p.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="search-btn" onClick={handleSearch}>
            <i className="ti ti-search" />
            Search
          </button>
        </div>

        <div className="search-tags">
          {POPULAR_TAGS.map(tag => (
            <button key={tag} className="tag" onClick={() => handleTag(tag)}>{tag}</button>
          ))}
        </div>
      </div>
    </section>
  )
}