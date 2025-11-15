
import React from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react'

export default function AdminProtected({ children }){
  // This component requires the Clerk user to have publicMetadata.role === 'admin'
  const { isSignedIn, user } = useUser ? useUser() : { isSignedIn: false, user: null }

  // Basic guard: if not signed in -> redirect to sign in
  if (!isSignedIn) return <RedirectToSignIn />

  // If user exists, check metadata (NOTE: for SSR you'd verify token on server)
  const role = user?.publicMetadata?.role
  if (role !== 'admin') return <div className="container mx-auto px-6 py-12"><div className="card p-6">Access denied — admin only.</div></div>

  return children
}
