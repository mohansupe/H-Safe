import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-6 py-10 flex flex-col items-center text-center">
        <img src="/assets/Logo.png" alt="H-Safe Logo" className="w-16 h-16 object-contain rounded-md" />
        <div className="font-semibold mt-4 text-white text-lg">H-SAFE</div>
        <p className="text-slate-400 text-sm mt-3 max-w-2xl">
          H-SAFE is a simulation-based firewall learning and analytics platform designed to help users understand, configure, and analyze firewall rules in a secure, interactive environment. Empowering cybersecurity education and practical skills for everyone.
        </p>
        <div className="mt-6">
          <a href="/admin" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Admin Login</a>
        </div>
      </div>
      <div className="text-center text-slate-500 text-sm pb-6">&copy; 2025 H-SAFE. All rights reserved.</div>
    </footer>
  )
}
