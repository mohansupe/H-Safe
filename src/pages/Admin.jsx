import React, { useEffect, useState } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [requests, setRequests] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress === 'mohansupe2004@gmail.com') {
      fetchData()
    }
  }, [isSignedIn, user])

  async function fetchData() {
    try {
      const [requestsRes, feedbackRes] = await Promise.all([
        supabase.from('early_access_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false })
      ])

      if (requestsRes.data) setRequests(requestsRes.data)
      if (feedbackRes.data) setFeedbacks(feedbackRes.data)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const { error } = await supabase
        .from('early_access_requests')
        .update({ status: newStatus })
        .eq('id', id)

      if (!error) {
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  if (user?.primaryEmailAddress?.emailAddress !== 'mohansupe2004@gmail.com') {
    return <Navigate to="/unauthorized" />
  }

  return (
    <section className="min-h-screen bg-slate-900 text-white pt-32 px-6 pb-12">
      <div className="container mx-auto space-y-12">

        {/* Early Access Requests */}
        <div>
          <h1 className="text-3xl font-bold mb-8">Early Access Requests</h1>
          <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-700/50">
                    <td className="p-4">{req.email}</td>
                    <td className="p-4">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(req.id, 'approved')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, 'rejected')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {req.status !== 'pending' && (
                        <button
                          onClick={() => updateStatus(req.id, 'pending')}
                          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                        >
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8">User Feedback</h2>
          <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {feedbacks.map(fb => (
                  <tr key={fb.id} className="hover:bg-slate-700/50">
                    <td className="p-4 font-medium">{fb.name}</td>
                    <td className="p-4 text-slate-400">{fb.email}</td>
                    <td className="p-4 max-w-md truncate" title={fb.message}>{fb.message}</td>
                    <td className="p-4 text-slate-500 text-sm">{fb.created_at ? new Date(fb.created_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                {feedbacks.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No feedback found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}
