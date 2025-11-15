
import React from 'react'

export default function Footer(){
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center">HS</div>
          <div className="font-semibold mt-3">H-SAFE</div>
          <p className="muted text-sm mt-2">Simulation-based firewall learning and analytics.</p>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="muted text-sm">Email: <a href="mailto:mohan.supe@adypu.edu.in" className="text-primary">mohan.supe@adypu.edu.in</a></p>
          <p className="muted text-sm">Phone: +91 98765 43210</p>
        </div>

        <div>
          <h4 className="font-semibold">Send us a message</h4>
          <form id="footer-contact-form" className="flex flex-col gap-3">
            <input name="name" placeholder="Name" className="px-3 py-2 border rounded-md" required/>
            <input name="email" placeholder="Email" className="px-3 py-2 border rounded-md" required/>
            <textarea name="message" placeholder="Message" rows="3" className="px-3 py-2 border rounded-md" required></textarea>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white">Send</button>
          </form>
        </div>
      </div>
      <div className="text-center muted text-sm pb-6">&copy; 2025 H-SAFE. All rights reserved.</div>
    </footer>
  )
}
