import React, { useState } from 'react'
import ModuleCard from './modules/ModuleCard'
import ModuleModal from './modules/ModuleModal'
import RevealOnScroll from './RevealOnScroll'

const modules = [
    {
        title: "Rule Addition",
        shortDesc: "Create and manage custom detection rules tailored to your security needs.",
        fullDesc: "Create and manage custom detection rules tailored to your security needs. Define specific criteria to flag or block traffic, ensuring your network is protected against known and emerging threats."
    },
    {
        title: "Rule Implementation",
        shortDesc: "Deploy, test, and validate rules in real-time against network activity.",
        fullDesc: "Deploy, test, and validate rules in real-time against network activity. Ensure that your security policies are effective without disrupting legitimate traffic flow."
    },
    {
        title: "PCAP File Analysis",
        shortDesc: "Dive deep into packet captures to identify anomalies, attacks, and suspicious traffic patterns.",
        fullDesc: "Dive deep into packet captures to identify anomalies, attacks, and suspicious traffic patterns. Upload PCAP files to visualize traffic, inspect payloads, and uncover hidden threats."
    },
    {
        title: "Network Topology Simulation",
        shortDesc: "Visualize network architecture and simulate attack paths and traffic flow.",
        fullDesc: "Visualize network architecture and simulate attack paths and traffic flow. Design virtual networks to understand vulnerabilities and test defense strategies in a safe environment."
    },
    {
        title: "Post-Attack Analysis",
        shortDesc: "Understand attacker behavior, uncover vulnerabilities, and improve your defenses.",
        fullDesc: "Understand attacker behavior, uncover vulnerabilities, and improve your defenses. Analyze incident data to generate reports and actionable insights for future prevention."
    }
]

export default function Modules() {
    const [selectedModule, setSelectedModule] = useState(null);

    return (
        <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
            <style>{`
        .module-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          cursor: pointer;
        }

        .module-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%);
        }

        .module-title {
          color: #f1f5f9;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 1.125rem;
        }

        .module-desc {
          color: #cbd5e1;
          font-size: 0.875rem;
        }
      `}</style>
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-2">Core Modules</h2>
                    <p className="text-slate-400">Comprehensive tools for network security management and analysis.</p>
                </div>
                <RevealOnScroll>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((mod, index) => (
                            <ModuleCard
                                key={index}
                                module={mod}
                                onClick={() => setSelectedModule(mod)}
                            />
                        ))}
                    </div>
                </RevealOnScroll>
            </div>

            {/* Modal */}
            <ModuleModal
                module={selectedModule}
                onClose={() => setSelectedModule(null)}
            />
        </section>
    )
}
