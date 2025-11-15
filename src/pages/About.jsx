
import React from 'react'
import Team from '../components/Team'

export default function About(){
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">About the Team</h1>
      <p className="muted mb-6">Meet the core team behind H-SAFE.</p>
      <Team />
    </div>
  )
}
