import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './CreateListing.css'

const CATEGORIES = ['mobile', 'laptop', 'tablet', 'accessory', 'gaming']
const CONDITIONS = ['Like New', 'Excellent', 'Good', 'Fair', 'For Parts']
const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar']

const CONDITION_DESC = {
  'Like New': 'No scratches, original accessories, under 3 months old',
  'Excellent': 'Minor signs of use, fully functional, all accessories',
  'Good': 'Visible wear but fully functional, may lack some accessories',
  'Fair': 'Noticeable damage or missing parts, functional with caveats',
  'For Parts': 'Not fully functional, sold as-is for repair or parts',
}

export default function CreateListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', brand: '', model: '', price: '',
    condition: '', category: '', city: '', description: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (index) => {
    setImages(imgs => imgs.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (images.length < 2) {
      setError('Please upload at least 2 images')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('mobix_token')
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      images.forEach(img => formData.append('images', img))

      const res = await axios.post('https://mobixpk-production.up.railway.app/api/listings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/listing/${res.data.listing_id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-page">
      <div className="create-inner">
        <div className="create-header">
          <h1 className="create-title">Post a listing</h1>
          <p className="create-sub">Fill in the details about your device</p>
        </div>

        {error && (
          <div className="create-error">
            <i className="ti ti-alert-circle" /> {error}
          </div>
        )}

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title">Basic information</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-input" name="city" value={form.city} onChange={handleChange} required>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group full">
                <label className="form-label">Listing title</label>
                <input className="form-input" type="text" name="title"
                  placeholder="e.g. iPhone 13 Pro 256GB Sierra Blue"
                  value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" type="text" name="brand"
                  placeholder="e.g. Apple" value={form.brand} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Model</label>
                <input className="form-input" type="text" name="model"
                  placeholder="e.g. iPhone 13 Pro" value={form.model} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Price (PKR)</label>
                <input className="form-input" type="number" name="price"
                  placeholder="e.g. 120000" value={form.price} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Condition</label>
                <select className="form-input" name="condition" value={form.condition} onChange={handleChange} required>
                  <option value="">Select condition</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {form.condition && (
                <div className="condition-hint full">
                  <i className="ti ti-info-circle" />
                  {CONDITION_DESC[form.condition]}
                </div>
              )}

              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" name="description"
                  placeholder="Describe the condition, accessories included, reason for selling..."
                  value={form.description} onChange={handleChange} rows={4} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Photos</div>
            <p className="form-section-sub">Upload at least 2 clear photos. First photo will be the cover image.</p>

            <div className="image-upload-area" onClick={() => document.getElementById('img-input').click()}>
              <i className="ti ti-camera-plus" />
              <span>Click to upload photos</span>
              <span className="upload-hint">JPG, PNG — minimum 2 photos required</span>
              <input id="img-input" type="file" multiple accept="image/*"
                onChange={handleImages} style={{ display: 'none' }} />
            </div>

            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((src, i) => (
                  <div key={i} className="preview-wrap">
                    <img src={src} alt="" className="preview-img" />
                    {i === 0 && <div className="preview-cover">Cover</div>}
                    <button type="button" className="preview-remove"
                      onClick={() => removeImage(i)}>
                      <i className="ti ti-x" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <><i className="ti ti-loader-2 spin" /> Uploading images & posting...</>
            ) : (
              <><i className="ti ti-check" /> Post listing</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}