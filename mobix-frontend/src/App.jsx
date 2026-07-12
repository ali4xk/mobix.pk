import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import ListingDetail from './pages/ListingDetail'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
      </Routes>
    </>
  )
}