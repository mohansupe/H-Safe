
import React from 'react'

export default function Contact(){
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="muted mb-6">Reach out to us via email or the form in the footer.</p>
      <div className="card p-6">
        <p><strong>Email:</strong> <a href="mailto:mohan.supe@adypu.edu.in" className="text-primary">mohan.supe@adypu.edu.in</a></p>
        <p className="mt-2"><strong>Phone:</strong> +91 98765 43210</p>
      </div>
    </div>
  )
}
