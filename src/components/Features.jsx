
import React from 'react'

export default function Features(){
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Key Features</h2>
          <p className="muted">Tools to teach, simulate, and analyze network security.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Interactive Simulations</h3>
            <p className="muted text-sm">Hands-on scenarios to learn firewall rules and attack mitigation.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">PCAP Analysis</h3>
            <p className="muted text-sm">Upload and analyze packet capture files with visual insights.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Reports & Metrics</h3>
            <p className="muted text-sm">Generate detailed post-attack reports and performance metrics.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
