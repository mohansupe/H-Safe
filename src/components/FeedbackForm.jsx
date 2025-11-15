
import React, { useState } from 'react'

export default function FeedbackForm(){
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.target)
    const payload = { name: form.get('name'), email: form.get('email'), message: form.get('message') }
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setDone(true)
        e.target.reset()
      } else {
        alert('Error sending feedback')
      }
    } catch(err){ console.error(err); alert('Network error') }
    setLoading(false)
  }

  if (done) return <div className="container mx-auto px-6 py-12 text-center"><div className="card p-6">Thanks — we received your feedback.</div></div>

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="card p-8 max-w-xl mx-auto">
          <h3 className="text-xl font-bold mb-3">Let us know what you think!</h3>
          <p className="muted mb-4">Tell us what features matter most to you.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input name="name" placeholder="Name" className="px-3 py-2 border rounded-md" required/>
            <input name="email" placeholder="Email" className="px-3 py-2 border rounded-md" type="email" required/>
            <textarea name="message" placeholder="Message" rows="4" className="px-3 py-2 border rounded-md" required/>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white">{loading ? 'Sending...' : 'Send Feedback'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
