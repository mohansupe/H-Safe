import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomeSection() {
    return (
        <div className="space-y-8 order-2 lg:order-2 animate-slide-in-right">
            <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight tracking-tight text-slate-500 animate-fade-in-down uppercase" style={{
                fontFamily: 'Sora, sans-serif',
                letterSpacing: '0.02em',
                fontWeight: 700,
            }}>
                <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                    Welcome Back
                </span>
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                You have early access to the H-Safe Simulator. Dive into our comprehensive, simulation-based firewall system and start mastering network security today.
            </p>

            <div className="flex gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link
                    to="/simulator"
                    className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 transition-all text-white shadow-lg font-semibold tracking-wide hover:shadow-2xl hover:scale-105 transform duration-300 flex items-center gap-2"
                >
                    <span>Launch Simulator</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>

                <Link
                    to="/about"
                    className="px-8 py-4 rounded-xl border-2 border-blue-500 bg-blue-600/20 hover:bg-blue-600/40 text-white hover:text-white transition-all font-semibold hover:scale-105 transform duration-300 hover:border-blue-400"
                >
                    About
                </Link>
            </div>

            <div className="mt-8 text-sm font-semibold text-slate-500 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 hover:text-blue-400 transition-all hover:translate-x-2 duration-300">
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    <span>Full Simulator Access</span>
                </div>
                <div className="flex items-center gap-3 hover:text-blue-400 transition-all hover:translate-x-2 duration-300">
                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    <span>Advanced PCAP Analysis</span>
                </div>
            </div>
        </div>
    );
}
