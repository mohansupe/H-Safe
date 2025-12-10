import React, { useEffect, useState } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { isAdmin, SUPER_ADMIN_EMAIL } from '../lib/checkAdmin'
import AdminManageAdmins from '../components/admin/AdminManageAdmins'
import AdminAccessRequests from '../components/admin/AdminAccessRequests'
import AdminFeedback from '../components/admin/AdminFeedback'

export default function Admin() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [requests, setRequests] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function checkPermissions() {
      if (!isLoaded || !isSignedIn || !user) return

      const email = user.primaryEmailAddress?.emailAddress
      const authorized = await isAdmin(email)

      if (authorized) {
        setIsAuthorized(true)
        setIsSuperAdmin(email === SUPER_ADMIN_EMAIL)
        fetchData()
        if (email === SUPER_ADMIN_EMAIL) {
          fetchAdmins()
        }
      } else {
        setIsAuthorized(false)
      }
      setLoading(false)
    }

    checkPermissions()
  }, [isLoaded, isSignedIn, user])

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
    }
  }

  async function fetchAdmins() {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setAdmins(data)
    } catch (error) {
      console.error('Error fetching admins:', error)
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

  async function addAdmin(e) {
    e.preventDefault()
    if (!newAdminEmail) return

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{ email: newAdminEmail }])
        .select()

      if (error) throw error

      if (data) {
        setAdmins([data[0], ...admins])
        setNewAdminEmail('')
      }
    } catch (error) {
      console.error('Error adding admin:', error)
      alert('Failed to add admin. Make sure the email is unique.')
    }
  }

  async function removeAdmin(id) {
    if (!window.confirm('Are you sure you want to remove this admin?')) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id)

      if (!error) {
        setAdmins(admins.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Error removing admin:', error)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  if (!loading && !isAuthorized) {
    return <Navigate to="/unauthorized" />
  }

  return (
    <section className="min-h-screen bg-slate-900 text-white pt-32 px-6 pb-12">
      <div className="container mx-auto space-y-12">

        {/* Super Admin Section: Manage Admins */}
        {/* Super Admin Section: Manage Admins */}
        {isSuperAdmin && (
          <AdminManageAdmins
            admins={admins}
            addAdmin={addAdmin}
            removeAdmin={removeAdmin}
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
          />
        )}

        {/* Early Access Requests */}
        <AdminAccessRequests
          requests={requests}
          updateStatus={updateStatus}
          loading={loading}
        />

        {/* Feedback Section */}
        <AdminFeedback
          feedbacks={feedbacks}
          loading={loading}
        />

      </div>
    </section>
  )
}
