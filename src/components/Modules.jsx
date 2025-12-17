import React, { useState } from 'react'
import ModuleCard from './modules/ModuleCard'
import ModuleModal from './modules/ModuleModal'
import RevealOnScroll from './RevealOnScroll'

const modules = [
    {
        title: "Rule Engine & Policy Management",
        shortDesc: "stateful firewall logic using 5-tuple matching and priority handling.",
        fullDesc: "Powered by 'rule_implementation.py' and 'rule_addition.py', this module provides stateful packet inspection, priority-based rule evaluation, and support for complex filtering conditions (IP, Port, Protocol, Severity)."
    },
    {
        title: "Graph-Based Topology Simulation",
        shortDesc: "Simulate attack paths across complex network graphs with hop-by-hop traversal.",
        fullDesc: "Utilizing 'topology_simulation.py', this core module models network devices as nodes in a directed graph. It calculates shortest paths, mimics forwarding logic, and applies firewall rules at specific hops to block or allow traffic dynamically."
    },
    {
        title: "PCAP Forensics & Analysis",
        shortDesc: "Deep packet inspection and threat signature matching using Scapy.",
        fullDesc: "The 'pcap_analysis.py' module dissects packet captures to identify protocol anomalies, flag suspicious payloads, and visualize traffic patterns. It supports varied protocols (TCP, UDP, ICMP) and generates detailed forensic reports."
    },
    {
        title: "Post-Attack Analytics",
        shortDesc: "Generate comprehensive incident reports and effective security insights.",
        fullDesc: "Driven by 'post_attack_analysis.py' and 'report_generator.py', this module aggregates simulation data to produce actionable intelligence. It generates PDF/JSON reports summarizing blocked threats, rule effectiveness, and network vulnerabilities."
    },
    {
        title: "Visual Topology Builder",
        shortDesc: "Interactive React Flow interface for designing validation environments.",
        fullDesc: "A responsive frontend interface enabling users to drag-and-drop hosts, servers, and firewalls. It seamlessly synchronizes the visual graph with the backend simulation engine for real-time validation of security policies."
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
