
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
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Admin — Feedback</h1>
      <div className="card p-4">
        {loading ? <div>Loading…</div> : (
          <div className="space-y-3">
            {feedback.length === 0 && <div className="muted">No feedback yet.</div>}
            {feedback.map(item=> (
              <div key={item.id} className="border p-3 rounded-md flex justify-between items-start">
                <div>
                  <div className="font-semibold">{item.name} <span className="muted text-sm">&lt;{item.email}&gt;</span></div>
                  <div className="muted text-sm">{new Date(item.created_at).toLocaleString()}</div>
                  <div className="mt-2">{item.message.length>120 ? item.message.slice(0,120)+'...' : item.message}</div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button onClick={()=> setSelected(item)} className="px-3 py-1 border rounded-md">View</button>
                  <button onClick={()=> handleDelete(item.id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="card p-6 max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-2">Message from {selected.name}</h3>
            <div className="muted text-sm mb-4">{selected.email} — {new Date(selected.created_at).toLocaleString()}</div>
            <div className="mb-4">{selected.message}</div>
            <div className="flex justify-end gap-3">
              <button onClick={()=> setSelected(null)} className="px-4 py-2 border rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
