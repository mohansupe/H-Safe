
import React from 'react'

export default function Hero(){
  return (
    <section className="hero-landing py-20">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <h1 className="text-5xl font-extrabold mb-4">Coming Soon</h1>
          <p className="muted mb-6">We're building a comprehensive, simulation-based firewall system that helps students & admins learn network security through hands-on simulations.</p>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-md bg-primary text-white">Get Early Access</button>
            <a href="/about" className="px-6 py-3 rounded-md border">About</a>
          </div>
          <div className="mt-6 muted text-sm flex gap-6">
            <div><i className="fas fa-check-circle text-green-500"></i> Interactive simulator</div>
            <div><i className="fas fa-check-circle text-green-500"></i> PCAP analysis</div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="card p-4">
            <div className="h-44 rounded-lg bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-primary font-bold">H‑SAFE Preview</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-md text-sm muted">Rule Editor</div>
              <div className="p-3 border rounded-md text-sm muted">Topology</div>
              <div className="p-3 border rounded-md text-sm muted">Analytics</div>
              <div className="p-3 border rounded-md text-sm muted">Reports</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
