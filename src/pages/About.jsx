
import React from 'react'
import Team from '../components/Team'

export default function About(){
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-white">About the Team</h1>
        <p className="text-slate-400 mb-12 text-lg">Meet the core team behind H-SAFE.</p>
        <Team />
      </div>
    </div>
  )
}
