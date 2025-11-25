
import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img src="/assets/Logo.png" alt="H-Safe Logo" className="w-12 h-12 object-contain rounded-md" />
          <div className="font-semibold mt-3 text-white">H-SAFE</div>
          <p className="text-slate-400 text-sm mt-2">H-SAFE is a simulation-based firewall learning and analytics platform designed to help users understand, configure, and analyze firewall rules in a secure, interactive environment. Empowering cybersecurity education and practical skills for everyone.</p>
          <div className="mt-4">
            <a href="/admin" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Admin Login</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <div className="text-slate-400 text-sm mb-2">
            <div className="mb-2">
              <span className="font-bold text-white">Mohan Supe</span><br />
              Email: <a href="mailto:mohan.supe@adypu.edu.in" className="text-blue-400 hover:text-blue-300">mohan.supe@adypu.edu.in</a><br />
              Phone: +91 7030085985
            </div>
            <div className="mb-2">
              <span className="font-bold text-white">Hrishi Badgujar</span><br />
              Email: <a href="mailto:hrishibadgujar2004@gmail.com" className="text-blue-400 hover:text-blue-300">hrishibadgujar2004@gmail.com</a><br />
              Phone: +91 9404755864
            </div>
            <div className="mb-2">
              <span className="font-bold text-white">Varad Khopkar</span><br />
              Email: <a href="mailto:varad.khopkar@adypu.edu.in" className="text-blue-400 hover:text-blue-300">varad.khopkar@adypu.edu.in</a><br />
              Phone: +91 7666023759
            </div>
            <div className="mb-2">
              <span className="font-bold text-white">Khushi Gupta</span><br />
              Email: <a href="mailto:khushi.gupta@adypu.edu.in" className="text-blue-400 hover:text-blue-300">khushi.gupta@adypu.edu.in</a><br />
              Phone: 8709710093
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Send us a message</h4>
          <form id="footer-contact-form" className="flex flex-col gap-3">
            <input name="name" placeholder="Name" className="px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" required />
            <input name="email" placeholder="Email" className="px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" required />
            <textarea name="message" placeholder="Message" rows="3" className="px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" required></textarea>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors">Send</button>
          </form>
        </div>
      </div>
      <div className="text-center text-slate-500 text-sm pb-6">&copy; 2025 H-SAFE. All rights reserved.</div>
    </footer>
  )
}
