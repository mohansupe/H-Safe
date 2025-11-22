
import React from 'react'
import { Link } from 'react-router-dom'
import { useClerk, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Header(){
  const clerk = useClerk?.() || null

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
      `}</style>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="logo-link">
          <img src="/assets/Logo.png" alt="H-Safe Logo" className="logo-img w-10 h-10 object-contain" />
          <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-400 text-transparent bg-clip-text">H-SAFE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <button onClick={()=> window.Clerk?.openSignIn?.()} className="sign-in-btn">Sign In</button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
