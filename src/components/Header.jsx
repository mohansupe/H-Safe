
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useClerk, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabaseClient'

// Simple icons for the menu
const MenuIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const XIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export default function Header() {
  const clerk = useClerk?.() || null
  const { user, isSignedIn } = useUser()
  const [hasEarlyAccess, setHasEarlyAccess] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      if (!isSignedIn || !user) {
        setHasEarlyAccess(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('early_access_requests')
          .select('status')
          .eq('user_id', user.id)
          .single()

        if (data && data.status === 'approved') {
          setHasEarlyAccess(true)
        } else {
          setHasEarlyAccess(false)
        }
      } catch (error) {
        console.error('Error checking early access:', error)
        setHasEarlyAccess(false)
      }
    }

    checkAccess()
  }, [isSignedIn, user])

  return (
    <header className="site-header sticky top-0 z-50">
      <style>{`
        .site-header {
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          border-bottom: 1px solid rgba(100, 116, 139, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
        }
        
        .nav-link:hover {
          color: #60a5fa;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .logo-link:hover {
          transform: translateY(-2px);
        }
        
        .logo-img {
          transition: transform 0.3s ease;
        }
        
        .logo-link:hover .logo-img {
          transform: scale(1.1);
        }
        
        .sign-in-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .sign-in-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .simulator-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .simulator-btn:hover {
          background: rgba(96, 165, 250, 0.1);
          border-color: #60a5fa;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(96, 165, 250, 0.2);
        }

        .mobile-menu-enter {
             animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="logo-link z-50"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMobileMenuOpen(false);
          }}
        >
          <img src="/assets/Logo.png" alt="H-Safe Logo" className="logo-img w-10 h-10 object-contain" />
          <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-400 text-transparent bg-clip-text">H-SAFE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {hasEarlyAccess && (
            <Link to="/simulator" className="simulator-btn">H-SAFE SIMULATOR</Link>
          )}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <button onClick={() => window.Clerk?.openSignIn?.()} className="sign-in-btn">Sign In</button>
          </SignedOut>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4 z-50">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-2xl mobile-menu-enter">
          <nav className="flex flex-col p-6 space-y-4">
            <Link to="/" className="nav-link text-lg block py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="nav-link text-lg block py-2" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="nav-link text-lg block py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-4">
              {hasEarlyAccess && (
                <Link to="/simulator" className="simulator-btn text-center block" onClick={() => setIsMobileMenuOpen(false)}>H-SAFE SIMULATOR</Link>
              )}
              <SignedOut>
                <button onClick={() => { window.Clerk?.openSignIn?.(); setIsMobileMenuOpen(false); }} className="sign-in-btn w-full">Sign In</button>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
