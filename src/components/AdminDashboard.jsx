
import React, { useEffect, useState } from 'react'

export default function AdminDashboard(){
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    async function fetchFeedback(){
      try {
        const res = await fetch('/api/admin-feedback')
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        setFeedback(data || [])
      } catch(e){ console.error(e); alert('Could not load feedback') }
      setLoading(false)
    }
    fetchFeedback()
  },[])

  async function handleDelete(id){
    if (!confirm('Delete this message?')) return
    const res = await fetch('/api/delete-feedback', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) })
    if (res.ok) setFeedback(f=>f.filter(x=>x.id!==id))
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin — Feedback</h1>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          {loading ? <div className="text-slate-400">Loading…</div> : (
            <div className="space-y-3">
              {feedback.length === 0 && <div className="text-slate-500">No feedback yet.</div>}
              {feedback.map(item=> (
                <div key={item.id} className="border border-slate-700 p-3 rounded-md flex justify-between items-start bg-slate-700/30">
                  <div>
                    <div className="font-semibold text-white">{item.name} <span className="text-slate-400 text-sm">&lt;{item.email}&gt;</span></div>
                    <div className="text-slate-500 text-sm">{new Date(item.created_at).toLocaleString()}</div>
                    <div className="mt-2 text-slate-300">{item.message.length>120 ? item.message.slice(0,120)+'...' : item.message}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={()=> setSelected(item)} className="px-3 py-1 border border-slate-600 rounded-md text-slate-300 hover:border-blue-400 hover:text-blue-400 transition-colors">View</button>
                    <button onClick={()=> handleDelete(item.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl w-full">
              <h3 className="text-lg font-bold mb-2 text-white">Message from {selected.name}</h3>
              <div className="text-slate-400 text-sm mb-4">{selected.email} — {new Date(selected.created_at).toLocaleString()}</div>
              <div className="mb-4 text-slate-300">{selected.message}</div>
              <div className="flex justify-end gap-3">
                <button onClick={()=> setSelected(null)} className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:border-blue-400 hover:text-blue-400 transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
