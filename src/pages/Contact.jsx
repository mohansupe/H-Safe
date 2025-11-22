
import React from 'react'

export default function Contact(){
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-white">Contact</h1>
        <p className="text-slate-400 mb-6 text-lg">Reach out to us via email or the form in the footer.</p>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-white"><strong>Email:</strong> <a href="mailto:mohan.supe@adypu.edu.in" className="text-blue-400 hover:text-blue-300">mohan.supe@adypu.edu.in</a></p>
          <p className="mt-2 text-white"><strong>Phone:</strong> +91 7030085985</p>
          <hr className="my-4 border-slate-700" />
          <p className="text-white"><strong>Email:</strong> <a href="mailto:hrishibadgujar2004@gmail.com" className="text-blue-400 hover:text-blue-300">hrishibadgujar2004@gmail.com</a></p>
          <p className="mt-2 text-white"><strong>Phone:</strong> +91 9404755864</p>
          <hr className="my-4 border-slate-700" />
          <p className="text-white"><strong>Email:</strong> <a href="mailto:varad.khopkar@adypu.edu.in" className="text-blue-400 hover:text-blue-300">varad.khopkar@adypu.edu.in</a></p>
          <p className="mt-2 text-white"><strong>Phone:</strong> +91 7666023759</p>
          <hr className="my-4 border-slate-700" />
          <p className="text-white"><strong>Email:</strong> <a href="mailto:khushi.gupta@adypu.edu.in" className="text-blue-400 hover:text-blue-300">khushi.gupta@adypu.edu.in</a></p>
          <p className="mt-2 text-white"><strong>Phone:</strong>+91 8709710093</p>
        </div>
      </div>
    </div>
  )
}
