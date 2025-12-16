import React from 'react'
import RevealOnScroll from './RevealOnScroll'

const targets = [
    "Cybersecurity Students",
    "Ethical Hackers",
    "SOC Analysts",
    "IT & Network Teams",
    "Colleges & Cybersecurity Clubs",
    "Organizations"
]

export default function TargetAudience() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-950 to-slate-900">
            <style>{`
            .target-card {
                background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
                border: 1px solid rgba(100, 116, 139, 0.1);
                transition: all 0.3s ease;
            }
            .target-card:hover {
                transform: translateY(-5px);
                border-color: rgba(96, 165, 250, 0.3);
                background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
            }
        `}</style>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Who Is H-Safe For?</h2>
                    <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
                </div>

                <RevealOnScroll>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {targets.map((target, idx) => (
                            <div key={idx} className="target-card p-8 rounded-2xl flex items-center justify-center text-center group">
                                <span className="text-lg font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">
                                    {target}
                                </span>
                            </div>
                        ))}
                    </div>
                </RevealOnScroll>
            </div>
        </section>
    )
}
