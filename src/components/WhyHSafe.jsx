import React from 'react'
import RevealOnScroll from './RevealOnScroll'

export default function WhyHSafe() {
    return (
        <section className="py-20 bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why H-Safe?</h2>
                    <RevealOnScroll>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Cyber threats are evolving faster than ever. Traditional tools lack visibility, integration, and real-time intelligence.
                        </p>
                        <p className="text-xl text-blue-400 font-medium mt-4 leading-relaxed">
                            H-Safe brings everything together — analysis, simulation, rule management, and forensics — in one intuitive platform.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    )
}
