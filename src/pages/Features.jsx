
import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RevealOnScroll from '../components/RevealOnScroll'
import { ChevronRight, Shield, Activity, Globe, FileText, BarChart2, Layout, X } from 'lucide-react'

const features = [
    {
        title: "Rule Addition Module",
        brief: "Create and customize detection rules to monitor traffic and identify suspicious behavior.",
        extended: {
            description: "The Rule Addition Module is the first line of defense in H-Safe. It allows administrators to define granular security policies that govern network traffic.",
            capabilities: [
                "**Stateful Inspection**: Define rules based on 5-tuple parameters (Source IP, Dest IP, Source Port, Dest Port, Protocol).",
                "**Priority Handling**: Assign severity levels (Low, Medium, High, Critical) to prioritize threat responses.",
                "**Action Definitions**: precise actions including ALLOW, DROP, ALERT, and LOG.",
                "**Validation Engine**: Real-time syntax checking to prevent conflicting or invalid rules."
            ],
            technical: "Implemented via `RuleImplementation` class which effectively serializes policies into a high-performance matching engine."
        },
        icon: <Shield className="w-8 h-8" />
    },
    {
        title: "Rule Implementation Engine",
        brief: "Deploy rules instantly within the system to evaluate real-time performance.",
        extended: {
            description: "Once rules are defined, the Implementation Engine enforces them across the simulated network nodes. It acts as the kernel of the firewall system.",
            capabilities: [
                "**Real-time Enforcement**: Rules are applied immediately without requiring system restarts.",
                "**Conflict Resolution**: Automatically identifies and resolves shadowing or redundant rules.",
                "**Performance Monitoring**: Tracks the CPU and memory impact of active rule sets.",
                "**Order Optimization**: Reorders rules dynamically to optimize packet processing speed."
            ],
            technical: "Uses optimized lookup tables to reduce complexity from O(N) to O(1) for common traffic patterns."
        },
        icon: <Layout className="w-8 h-8" />
    },
    {
        title: "PCAP File Analyzer",
        brief: "Upload PCAP files and inspect packets at granular levels with visual dashboards.",
        extended: {
            description: "The PCAP Analyzer turns raw packet data into actionable intelligence. It dissects uploaded capture files to reconstruct network conversations.",
            capabilities: [
                "**Protocol Dissection**: Native support for TCP, UDP, ICMP, HTTP, and DNS protocols.",
                "**Payload Inspection**: Deep dive into packet payloads to find hidden malware signatures or data exfiltration attempts.",
                "**Flow Reconstruction**: Visualizes the complete conversation between a client and server.",
                "**Anomaly Detection**: Heuristic analysis to flag non-compliant protocol headers."
            ],
            technical: "Powered by **Scapy**, capable of parsing gigabytes of traffic data efficiently."
        },
        icon: <FileText className="w-8 h-8" />
    },
    {
        title: "Network Topology Simulator",
        brief: "Simulate nodes, devices, routers, and attack paths to identify weak points.",
        extended: {
            description: "Design and test complex network architectures in a safe, virtualized environment. The Simulator allows you to model your actual infrastructure.",
            capabilities: [
                "**Drag-and-Drop Builder**: Intuitive UI to place Hosts, Servers, Routers, and Firewalls.",
                "**Attack Path Simulation**: Visualize how an attacker could move laterally through the network.",
                "**Bottleneck Identification**: Stress-test links to find bandwidth limitations.",
                "**Configuration Testing**: Validate subnet masks, routing tables, and gateway configurations."
            ],
            technical: "Built on **React Flow** for the frontend and a **Python NetworkX** backend for graph-based pathfinding."
        },
        icon: <Globe className="w-8 h-8" />
    },
    {
        title: "Post-Attack Analysis",
        brief: "Comprehensive insights after simulating or detecting an attack.",
        extended: {
            description: "After a simulation run, the Post-Attack Analysis dashboard provides a forensic breakdown of what happened.",
            capabilities: [
                "**Kill Chain Visualization**: See the exact steps the attacker took to breach the system.",
                "**Impact Assessment**: Quantifies data loss and system downtime.",
                "**Root Cause Analysis**: Pinpoints the specific misconfiguration or vulnerability exploited.",
                "**Remediation Suggestions**: AI-driven recommendations to patch the identified holes."
            ],
            technical: "Aggregates log data into structured JSON reports and generates PDF summaries."
        },
        icon: <Activity className="w-8 h-8" />
    },
    {
        title: "Metrics, Logs & Reporting",
        brief: "Track system behavior and rule triggers with detailed audit logs.",
        extended: {
            description: "Visibility is key to security. H-Safe creates an immutable audit trail of every decision made by the firewall.",
            capabilities: [
                "**Audit Trails**: Who changed what rule, and when?",
                "**Compliance Reporting**: Generate reports for compliance standards like ISO 27001 or SOC2.",
                "**Traffic Heatmaps**: Visualize high-volume interaction points.",
                "**Event Correlation**: Link seemingly unrelated events to identify coordinated attacks."
            ],
            technical: "High-throughput logging system capable of handling thousands of events per second."
        },
        icon: <BarChart2 className="w-8 h-8" />
    }
]

const FeatureModal = ({ feature, onClose }) => {
    if (!feature) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-10">
                    <div className="flex items-center gap-6 mb-8 border-b border-slate-800 pb-8">
                        <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-400">
                            {feature.icon}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{feature.title}</h2>
                            <p className="text-slate-400 text-lg">{feature.brief}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Overview
                            </h4>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                {feature.extended.description}
                            </p>

                            <div className="bg-slate-950/50 rounded-lg p-5 border border-slate-800/50">
                                <div className="text-sm font-mono text-blue-300/80 mb-3 block border-b border-slate-800/50 pb-2 w-full">// Technical Implementation</div>
                                <p className="text-sm text-slate-500 font-mono leading-relaxed">
                                    {feature.extended.technical}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                Key Capabilities
                            </h4>
                            <ul className="space-y-4">
                                {feature.extended.capabilities.map((cap, i) => (
                                    <li key={i} className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                                        <span className="text-slate-300 text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: cap.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-medium">$1</span>')
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function FeaturesPage() {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full transform -translate-y-1/2"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Features</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Explore the comprehensive toolkit that makes H-Safe the premier platform for network security emulation and policy validation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedFeature(feature)}
                                className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 hover:border-blue-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-900/10 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    <ChevronRight className="w-5 h-5 text-blue-500" />
                                </div>

                                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-colors duration-300">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    {feature.brief}
                                </p>
                                <div className="text-blue-500 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <FeatureModal
                feature={selectedFeature}
                onClose={() => setSelectedFeature(null)}
            />
        </div>
    )
}

