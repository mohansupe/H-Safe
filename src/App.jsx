import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Features from './pages/Features'
import Documentation from './pages/Documentation'
import Contact from './pages/Contact'

import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import Simulator from './pages/Simulator'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import AccessGuard from './components/AccessGuard'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/features" element={<Features />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/simulator"
            element={
              <ProtectedRoute>
                <AccessGuard>
                  <Simulator />
                </AccessGuard>
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
