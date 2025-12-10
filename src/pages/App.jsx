
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Admin from './Admin'
import Dashboard from './Dashboard'
import Simulator from './Simulator'
import Unauthorized from './Unauthorized'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
