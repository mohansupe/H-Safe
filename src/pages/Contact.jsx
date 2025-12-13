import React from 'react'
import FeedbackForm from '../components/FeedbackForm'
import RevealOnScroll from '../components/RevealOnScroll'

export default function Contact() {
    return (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 min-h-screen text-slate-200">
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
                        <p className="text-xl text-slate-400">
                            Have questions, suggestions, or collaboration ideas? <br />
                            We’d love to hear from you.
                        </p>
                    </div>

                    <RevealOnScroll>
                        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                            {/* Contact Info Card */}
                            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                                <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</h3>
                                            <a href="mailto:hsafe.official@gmail.com" className="text-lg text-white hover:text-blue-400 transition-colors">
                                                hsafe.official@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Website</h3>
                                            <a href="https://www.hsafe.in" target="_blank" rel="noopener noreferrer" className="text-lg text-white hover:text-blue-400 transition-colors">
                                                www.hsafe.in
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Organization</h3>
                                            <p className="text-lg text-white">
                                                Ajeenkya DY Patil University
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</h3>
                                            <p className="text-lg text-white">
                                                India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Form */}
                            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-800">
                                    <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
                                </div>
                                <FeedbackForm />
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>
        </div>
    )
}
