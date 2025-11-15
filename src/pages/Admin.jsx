
import React from 'react'
import AdminProtected from '../components/AdminProtected'
import AdminDashboard from '../components/AdminDashboard'

export default function Admin(){
  return (
    <AdminProtected>
      <AdminDashboard />
    </AdminProtected>
  )
}
