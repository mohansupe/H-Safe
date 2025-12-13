import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RevealOnScroll from '../components/RevealOnScroll'

export default function About() {
    return (
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen text-slate-200">

            {/* Hero / Intro */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 -z-10 pointer-events-none"></div>
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">What is H-Safe?</h1>
                    <RevealOnScroll>
                        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                            H-Safe is an end-to-end cybersecurity analysis and simulation framework designed to empower users with real-world defensive and analytical experience.
                        </p>
                        <div className="mt-8 h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
                        <p className="mt-8 text-lg text-slate-400">
                            It bridges the gap between theory and practice by offering tools that professionals and learners can use to understand, detect, and analyze cyber threats.
                        </p>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16 bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <RevealOnScroll>
                        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {/* Vision */}
                            <div className="bg-slate-800/50 p-10 rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    To create a next-generation cybersecurity platform that empowers users to proactively defend digital infrastructure using intelligent, data-driven, and interactive technologies.
                                </p>
                            </div>

                            {/* Mission */}
                            <div className="bg-slate-800/50 p-10 rounded-2xl border border-slate-700 hover:border-purple-500/30 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    To deliver an accessible, high-precision cybersecurity ecosystem that enhances threat detection, simplifies complex analysis, and supports informed security decision-making.
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Why We Built It */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why We Built H-Safe</h2>
                        <RevealOnScroll>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                                Modern cybersecurity tools are powerful but often complicated, expensive, or fragmented.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <RevealOnScroll delay={200}>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl">
                            <h3 className="text-2xl font-semibold text-blue-400 mb-8 text-center">
                                H-Safe provides an integrated, affordable, and educational solution that brings together:
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                {["Packet Analysis", "Rule-based Detection", "Attack Simulation", "Network Visualization", "Post-attack Forensics"].map((item, idx) => (
                                    <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 text-slate-200 hover:bg-slate-800 transition-colors">
                                        {item}
                                    </div>
                                ))}
                                <div className="bg-blue-600/20 p-4 rounded-xl border border-blue-500/30 text-blue-300 font-semibold">
                                    All in One Platform
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

        </div>
    )
}
