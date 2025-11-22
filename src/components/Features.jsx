
import React from 'react'

export default function Features(){
  return (
    <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
      <style>{`
        .feature-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%);
        }

        .feature-title {
          color: #f1f5f9;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 1.125rem;
        }

        .feature-desc {
          color: #cbd5e1;
          font-size: 0.875rem;
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Key Features</h2>
          <p className="text-slate-400">Tools to teach, simulate, and analyze network security.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="feature-card">
            <h3 className="feature-title">Interactive Simulations</h3>
            <p className="feature-desc">Hands-on scenarios to learn firewall rules and attack mitigation.</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">PCAP Analysis</h3>
            <p className="feature-desc">Upload and analyze packet capture files with visual insights.</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Reports & Metrics</h3>
            <p className="feature-desc">Generate detailed post-attack reports and performance metrics.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
