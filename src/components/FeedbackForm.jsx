
import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.target)
    const payload = { name: form.get('name'), email: form.get('email'), message: form.get('message') }

    let attempts = 0;
    while (attempts < 3) {
      try {
        const { error } = await supabase
          .from('feedback')
          .insert([payload])

        if (!error) {
          setDone(true)
          e.target.reset()
          setLoading(false)
          return; // Success, exit function
        }

        console.warn(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts < 3) await new Promise(r => setTimeout(r, 1000)); // Wait 1s before retry

      } catch (err) {
        console.error(`Attempt ${attempts + 1} exception:`, err);
        attempts++;
        if (attempts < 3) await new Promise(r => setTimeout(r, 1000));
      }
    }

    // If we get here, all retries failed
    console.error('All feedback submission attempts failed.');
    alert('Error sending feedback after multiple attempts. Please try again later.');
    setLoading(false)
  }

  if (done) return (
    <section className="py-12 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-white">
          Thanks — we received your feedback.
        </div>
      </div>
    </section>
  )

  return (
    <section className="py-12 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-xl mx-auto">
          <h3 className="text-xl font-bold mb-3 text-white">Let us know what you think!</h3>
          <p className="text-slate-400 mb-4">Tell us what features matter most to you.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input name="name" placeholder="Name" className="px-3 py-2 border border-slate-700 rounded-md bg-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" required />
            <input name="email" placeholder="Email" className="px-3 py-2 border border-slate-700 rounded-md bg-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" type="email" required />
            <textarea name="message" placeholder="Message" rows="4" className="px-3 py-2 border border-slate-700 rounded-md bg-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" required />
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold">{loading ? 'Sending...' : 'Send Feedback'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
