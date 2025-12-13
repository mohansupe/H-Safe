import React, { useState } from 'react'
import RevealOnScroll from '../components/RevealOnScroll'

export default function Documentation() {
    const [activeSection, setActiveSection] = useState('introduction');

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-slate-200">
            <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

                {/* Sidebar */}
                <aside className="lg:w-1/4">
                    <div className="sticky top-24 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-sm">Contents</h3>
                        <nav className="space-y-3">
                            {[
                                { id: 'introduction', label: 'Introduction' },
                                { id: 'user-workflow', label: 'User Workflow' },
                                { id: 'rule-addition', label: 'Rule Addition' },
                                { id: 'rule-implementation', label: 'Rule Implementation' },
                                { id: 'pcap-analysis', label: 'PCAP Analysis' },
                                { id: 'topology-simulation', label: 'Topology Simulation' },
                                { id: 'post-attack', label: 'Post-Attack Analysis' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === item.id
                                        ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:w-3/4 space-y-16">

                    {/* Introduction */}
                    <section id="introduction" className="scroll-mt-24">
                        <h1 className="text-4xl font-bold text-white mb-6">Introduction</h1>
                        <RevealOnScroll>
                            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
                                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                                    Welcome to the official <strong>H-Safe</strong> documentation.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    This guide explains how to use each module effectively and configure the platform for optimal performance. Whether you are a student, researcher, or administrator, this documentation will help you get the most out of the simulation capabilities.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </section>

                    {/* User Workflow */}
                    <section id="user-workflow" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold text-white mb-6">User Workflow</h2>
                        <RevealOnScroll>
                            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
                                <p className="text-slate-300 mb-6">
                                    The following diagram illustrates the typical user journey through the H-Safe platform, from initial access to advanced simulation and analysis.
                                </p>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 overflow-hidden">
                                    <img
                                        src="/assets/workflow.png"
                                        alt="H-Safe User Workflow Diagram"
                                        className="max-w-full h-auto mx-auto rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>
                    </section>

                    {/* Module: Rule Addition */}
                    <section id="rule-addition" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold text-white mb-6">Rule Addition</h2>
                        <RevealOnScroll>
                            <p className="text-slate-400 mb-6">Create and manage custom security rules for the firewall engine.</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Core Features</h3>
                                    <ul className="space-y-2 text-slate-300">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>How to write a rule</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Rule parameters</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Example rules</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Saving & editing rules</li>
                                    </ul>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </section>

                    {/* Module: Rule Implementation */}
                    <section id="rule-implementation" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold text-white mb-6">Rule Implementation</h2>
                        <RevealOnScroll>
                            <p className="text-slate-400 mb-6">Test and deploy your rules in a live simulation environment.</p>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <ul className="grid md:grid-cols-2 gap-4 text-slate-300">
                                    <li className="flex items-center gap-3"><span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">01</span> Deploying rules</li>
                                    <li className="flex items-center gap-3"><span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">02</span> Monitoring rule triggers</li>
                                    <li className="flex items-center gap-3"><span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">03</span> Understanding false positives</li>
                                    <li className="flex items-center gap-3"><span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">04</span> Performance tuning</li>
                                </ul>
                            </div>
                        </RevealOnScroll>
                    </section>

                    {/* Module: PCAP Analysis */}
                    <section id="pcap-analysis" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold text-white mb-6">PCAP Analysis</h2>
                        <RevealOnScroll>
                            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                                            <i className="fas fa-file-upload"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">Uploading PCAP files</h4>
                                            <p className="text-sm text-slate-400">Drag and drop standard .pcap files for instant parsing.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                                            <i className="fas fa-table"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">Packet table overview</h4>
                                            <p className="text-sm text-slate-400">View detailed headers, payloads, and timestamps per packet.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                                            <i className="fas fa-filter"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">Traffic filtering & Identification</h4>
                                            <p className="text-sm text-slate-400">Identify anomalies, filter by protocol, and export relevant logs.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </RevealOnScroll>
                    </section>

                    {/* Module: Topology Simulation */}
                    <section id="topology-simulation" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold text-white mb-6">Topology Simulation</h2>
                        <RevealOnScroll>
                            <p className="text-slate-400 mb-6">
                                Visual network builder to simulate complex attack vectors.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Adding nodes', 'Creating connections', 'Simulating attacks', 'Viewing network flow'].map((item, idx) => (
                                    <div key={idx} className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700 hover:border-blue-500 transition-colors">
                                        <span className="text-blue-400 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </RevealOnScroll>
                    </section>

                    {/* Module: Post-Attack Analysis */}
                    <section id="post-attack" className="scroll-mt-24 pb-20">
                        <h2 className="text-3xl font-bold text-white mb-6">Post-Attack Analysis</h2>
                        <RevealOnScroll>
                            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-8 rounded-2xl border border-red-900/30">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-4">Forensics & Reporting</h3>
                                        <p className="text-slate-400 mb-4">After a simulation, generate detailed reports on system resilience.</p>
                                        <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
                                            View Sample Report <span aria-hidden="true">→</span>
                                        </button>
                                    </div>
                                    <ul className="space-y-2 text-slate-300">
                                        <li className="flex items-center gap-2"><svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Attack graph explanation</li>
                                        <li className="flex items-center gap-2"><svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Vulnerability mapping</li>
                                        <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5.293 11.879a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Recommended fixes</li>
                                        <li className="flex items-center gap-2"><svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg> Report export</li>
                                    </ul>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </section>

                </main>
            </div>
        </div>
    )
}
