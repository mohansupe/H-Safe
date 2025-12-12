import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-950 py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

        {/* Left: Logo */}
        <div className="flex items-center justify-center md:justify-start gap-3">
          <img src="/assets/Logo.png" alt="H-Safe Logo" className="w-8 h-8 object-contain" />
          <span className="text-slate-300 font-semibold tracking-wide">H-SAFE</span>
        </div>

        {/* Center: Copyright */}
        <div className="text-slate-500 text-sm text-center order-3 md:order-2">
          &copy; 2025 H-SAFE. All rights reserved.
        </div>

        {/* Right: Admin */}
        <div className="flex justify-center md:justify-end order-2 md:order-3">
          <a href="/admin" className="text-xs text-slate-700 hover:text-slate-500 transition-colors uppercase tracking-wider font-medium">
            Admin Login
          </a>
        </div>

      </div>
    </footer>
  )
}
