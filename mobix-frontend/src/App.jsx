import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div style={{color:'white', padding:'40px'}}>Home page coming soon</div>} />
      </Routes>
    </>
  )
}