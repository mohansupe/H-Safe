
import React from 'react'
const members = [
  { name: 'Mohan Supe', role: 'Front-end Dev', bio: 'All the frontend needed for the project.', img: '/assets/mohan.jpg' },
  { name: 'Hrishikesh Badgujar', role: 'Front-end Dev', bio: 'Login and UI/UX.', img: '/assets/hrishi.jpg' },
  { name: 'Varad Khopkar', role: 'Backend', bio: 'Implementing & developing logic.', img: '/assets/varad.jpg' },
  { name: 'Khushi Gupta', role: 'Research', bio: 'Documenting & Research.', img: '/assets/khushi.jpg' },
]

export default function Team(){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {members.map((m,i)=> (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <img src={m.img} alt={m.name} className="w-28 h-28 rounded-full mx-auto mb-4 object-cover" />
          <h3 className="font-semibold text-white">{m.name}</h3>
          <div className="text-slate-400 text-sm">{m.role}</div>
          <p className="text-slate-500 text-xs mt-2">{m.bio}</p>
        </div>
      ))}
    </div>
  )
}
