
import React from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react'
import { isAdmin } from '../lib/checkAdmin'

export default function AdminProtected({ children }) {
  const { isSignedIn, user, isLoaded } = useUser()
  const [isAuthorized, setIsAuthorized] = React.useState(null) // null = loading, true = yes, false = no

  React.useEffect(() => {
    async function check() {
      if (!isLoaded) return
      if (!isSignedIn || !user) {
        setIsAuthorized(false)
        return
      }

      const email = user.primaryEmailAddress?.emailAddress
      const authorized = await isAdmin(email)
      setIsAuthorized(authorized)
    }

    check()
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded || isAuthorized === null) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Checking permissions...</div>
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-slate-300 mb-6">You do not have permission to view this page.</p>
          <a href="/" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return children
}
