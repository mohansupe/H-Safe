
import React from 'react'
import { Link } from 'react-router-dom'
import { useClerk, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Header(){
  const clerk = useClerk?.() || null

  return (
    <header className="site-header">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white">HS</div>
          <Link to="/" className="font-semibold text-lg">H-SAFE</Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="muted">Home</Link>
          <Link to="/about" className="muted">About</Link>
          <Link to="/contact" className="muted">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <button onClick={()=> window.Clerk?.openSignIn?.()} className="px-4 py-2 border rounded-md">Sign In</button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
