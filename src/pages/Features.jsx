import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RevealOnScroll from '../components/RevealOnScroll'

const features = [
    {
        title: "Rule Addition Module",
        description: "Create and customize detection rules to monitor traffic and identify suspicious behavior.",
        details: [
            "Supports modular rule construction and validation to ensure accuracy."
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        )
    },
    {
        title: "Rule Implementation Engine",
        description: "Deploy rules instantly within the system to evaluate real-time performance.",
        details: [
            "Monitor false positives, rule effectiveness, and coverage."
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    },
    {
        title: "PCAP File Analyzer",
        description: "Upload PCAP files and inspect packets at granular levels with visual dashboards.",
        details: [
            "Identify Malware traffic & Anomalies",
            "Detect Intrusion attempts & Protocol exploits",
            "Visual and detailed dashboards help simplify analysis"
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    },
    {
        title: "Network Topology Simulator",
        description: "Simulate nodes, devices, routers, and attack paths to identify weak points.",
        details: [
            "Test how attackers might move through a network",
            "Visualize network architecture"
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )
    },
    {
        title: "Post-Attack Analysis Dashboard",
        description: "Comprehensive insights after simulating or detecting an attack.",
        details: [
            "View Attack flow & Vulnerabilities exploited",
            "Impact mapping & Mitigation recommendations"
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )
    },
    {
        title: "Metrics, Logs & Reporting",
        description: "Track system behavior and rule triggers with detailed audit logs.",
        details: [
            "Track event timelines and rule triggers",
            "Export-ready reports for academic or professional use"
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        title: "Modern, Intuitive Interface",
        description: "Designed with a clean UI for students and cybersecurity teams alike.",
        details: [
            "No steep learning curve",
            "Clear and easy to navigate structure"
        ],
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        )
    }
]

export default function FeaturesPage() {
    return (
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 min-h-screen text-slate-200">

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Platform Features</h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Discover the powerful tools that make H-Safe the ultimate cybersecurity simulation platform.
                        </p>
                    </div>

                    <RevealOnScroll>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 group ${index === features.length - 1 ? 'lg:col-start-2' : ''}`}
                                >
                                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <ul className="space-y-3">
                                        {feature.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

        </div>
    )
}
