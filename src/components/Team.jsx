
import React from 'react'
const members = [
  { name: 'Mohan Supe', role: 'Product', bio: 'Product lead and project coordination.', img: '/assets/avatar1.svg' },
  { name: 'Hrishikesh Badgujar', role: 'Backend', bio: 'APIs, databases & deployment.', img: '/assets/avatar2.svg' },
  { name: 'Varad Khopkar', role: 'Frontend', bio: 'UI, accessibility & animations.', img: '/assets/avatar3.svg' },
  { name: 'Khushi Gupta', role: 'Research', bio: 'Simulation and testing.', img: '/assets/avatar4.svg' },
]

export default function Team(){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {members.map((m,i)=> (
        <div key={i} className="card p-6 text-center">
          <img src={m.img} alt={m.name} className="w-28 h-28 rounded-full mx-auto mb-4" />
          <h3 className="font-semibold">{m.name}</h3>
          <div className="muted text-sm">{m.role}</div>
          <p className="muted text-xs mt-2">{m.bio}</p>
        </div>
      ))}
    </div>
  )
}
