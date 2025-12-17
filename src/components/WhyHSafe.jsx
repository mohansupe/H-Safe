import React from 'react'
import RevealOnScroll from './RevealOnScroll'
import { Shield, BookOpen, Activity } from 'lucide-react'

export default function WhyHSafe() {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6">Why H-Safe?</h2>
                    <RevealOnScroll>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Traditional cybersecurity training is often static or prohibitively expensive. H-Safe bridges the gap between theory and practice.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
                        <div className="bg-blue-500/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <BookOpen className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Educational First</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Designed for students and professionals to learn firewall logic, rule precedence, and network defense strategies in a risk-free environment.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                        <div className="bg-purple-500/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <Activity className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Interactive Simulation</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Visualize traffic flows, packet headers, and blocking actions in real-time. See exactly <em>why</em> a packet was dropped or allowed.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
                        <div className="bg-emerald-500/10 p-4 rounded-xl w-fit mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Real-World Forensics</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Integrate with standard PCAP files to analyze real network dumps, applying custom rules to detect threats in historical data.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
