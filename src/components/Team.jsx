import React, { useState } from 'react'

const members = [
  {
    name: 'Mohan Ashok Supe',
    role: 'Front-end Developer',
    bio: 'Developing the frontend of the project.',
    img: '/assets/mohan.jpg',
    details: {
      fullName: 'MOHAN ASHOK SUPE',
      course: 'Btech Computer Science Engineering',
      institute: 'Ajeenkya DY Patil University',
      Github: 'https://github.com/mohansupe',
      Linkedin: 'https://www.linkedin.com/in/mohansupe/',
      phone: '+91 7030085985',
      email: 'mohan.supe@adypu.edu.in'
    }
  },
  {
    name: 'Hrishikesh Badgujar',
    role: 'Front-end Developer',
    bio: 'Developing the frontend of the project.',
    img: '/assets/hrishi.jpg',
    details: {
      fullName: 'Hrishikesh Badgujar',
      course: 'Btech Computer Science Engineering',
      institute: 'Ajeenkya DY Patil University',
      Github: 'https://github.com/hrishikesh2810',
      Linkedin: 'https://www.linkedin.com/in/hrishikesh-badgujar/',
      phone: '+91 9404755864',
      email: 'Hrishikesh.badgujar@adypu.edu.in'
    }
  },
  {
    name: 'Varad Khopkar',
    role: 'Backend Developer',
    bio: 'Implementing & developing logic.',
    img: '/assets/varad.jpg',
    details: {
      fullName: 'Varad Khopkar',
      course: 'Btech Cyber Security Engineering',
      institute: 'Ajeenkya DY Patil University',
      Github: 'https://github.com/Varad-Khopkar',
      Linkedin: 'https://www.linkedin.com/in/varad-khopkar/',
      phone: '+91 7666023759',
      email: 'varad.khopkar@adypu.edu.in'
    }
  },
  {
    name: 'Khushi Gupta',
    role: 'Research',
    bio: 'Documenting & Research.',
    img: '/assets/khushi.jpg',
    details: {
      fullName: 'Khushi Gupta',
      course: 'Btech Computer Science Engineering',
      institute: 'Ajeenkya DY Patil University',
      Github: 'https://github.com/khushiiGupta016',
      Linkedin: 'https://www.linkedin.com/in/khushi-gupta-270022249/',
      phone: '+91 73852 26206',
      email: 'khushi.gupta@adypu.edu.in'
    }
  },
]

export default function Team() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((m, i) => (
          <div
            key={i}
            onClick={() => setSelectedMember(m)}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group"
          >
            <div className="relative inline-block">
              <img src={m.img} alt={m.name} className="w-28 h-28 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform duration-300" />
              {m.details && (
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                  Info
                </div>
              )}
            </div>
            <h3 className="font-semibold text-white">{m.name}</h3>
            <div className="text-slate-400 text-sm">{m.role}</div>
            <p className="text-slate-500 text-xs mt-2">{m.bio}</p>
          </div>
        ))}
      </div>

      {/* Project Guide Section */}
      <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-slate-500 text-sm uppercase tracking-widest font-semibold mb-6">Project Under Guidance of</h3>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 max-w-2xl mx-auto hover:border-blue-500/50 transition-all group">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src="/assets/santoshsir.png"
                alt="Dr. Santosh Borde"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 group-hover:border-blue-500 transition-colors relative z-10"
              />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold text-white mb-2">Dr. Santosh Borde Sir</h4>
              <p className="text-blue-400 font-medium mb-1">Director - Students Progression and Corporate Relations</p>
              <p className="text-slate-400 text-sm">@Ajeenkya DY Patil Group of Institutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMember(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full relative shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <img src={selectedMember.img} alt={selectedMember.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500/20" />
              <h2 className="text-2xl font-bold text-white">{selectedMember.details?.fullName || selectedMember.name}</h2>
              <p className="text-blue-400 font-medium">{selectedMember.role}</p>
            </div>

            {selectedMember.details ? (
              <div className="space-y-4 text-slate-300 text-sm">
                <div className="bg-slate-800/50 p-4 rounded-xl space-y-3">
                  <div>
                    <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold">Course</span>
                    {selectedMember.details.course}
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold">Institute</span>
                    {selectedMember.details.institute}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <a href={selectedMember.details.Github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group">
                    <i className="fab fa-github text-xl text-slate-400 group-hover:text-white"></i>
                    <span className="text-blue-400 group-hover:underline">GitHub Profile</span>
                  </a>
                  {selectedMember.details.Linkedin && (
                    <a href={selectedMember.details.Linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group">
                      <i className="fab fa-linkedin text-xl text-slate-400 group-hover:text-white"></i>
                      <span className="text-blue-400 group-hover:underline">LinkedIn Profile</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                    <i className="fas fa-phone text-xl text-slate-400"></i>
                    <span>{selectedMember.details.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                    <i className="fas fa-envelope text-xl text-slate-400"></i>
                    <a href={`mailto:${selectedMember.details.email}`} className="text-blue-400 hover:underline">{selectedMember.details.email}</a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-400">
                {selectedMember.bio}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
