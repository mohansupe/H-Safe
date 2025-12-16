import React, { useState, useEffect } from 'react'
import { useUser, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { supabase } from '../lib/supabaseClient'
import WelcomeSection from './WelcomeSection'

export default function Hero() {

  // MAIN LOGO (easy to replace later)
  const mainLogo = "/assets/H-Safe-Logo.png";

  const { user, isSignedIn } = useUser()
  const [hasEarlyAccess, setHasEarlyAccess] = useState(false)

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

  // Add modern sleek fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <section className="hero-landing py-32 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 min-h-screen flex items-center relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none"></div>

      <div className="container mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center font-inter h-full">

          {/* LEFT SIDE — MAIN LOGO */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-1">
            <div className="relative w-full max-w-lg animate-slide-in-left">
              <img
                src={mainLogo}
                alt="H-Safe Logo"
                className="w-full h-auto drop-shadow-2xl object-contain hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* RIGHT TEXT CONTENT */}
          {hasEarlyAccess ? (
            <WelcomeSection />
          ) : (
            <div className="space-y-8 order-2 lg:order-2 animate-slide-in-right">

              <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight tracking-tight text-white animate-fade-in-down mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                H-SAFE
              </h1>

              <p className="text-2xl md:text-3xl font-bold text-blue-400 animate-fade-in-up">
                Strengthen. Simulate. Secure.
              </p>

              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                A unified cybersecurity intelligence platform built to analyze threats, inspect network traffic, simulate attacks, and deliver powerful post-incident insights.
              </p>

              <div className="flex gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <SignedIn>
                  <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all text-white shadow-lg font-semibold tracking-wide hover:shadow-2xl hover:scale-105 transform duration-300"
                  >
                    Launch Dashboard
                  </button>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all text-white shadow-lg font-semibold tracking-wide hover:shadow-2xl hover:scale-105 transform duration-300">
                      Get Started
                    </button>
                  </SignInButton>
                </SignedOut>

                <a
                  href="/documentation"
                  className="px-8 py-4 rounded-xl border-2 border-blue-500 bg-blue-600/20 hover:bg-blue-600/40 text-white hover:text-white transition-all font-semibold hover:scale-105 transform duration-300 hover:border-blue-400"
                >
                  Documentation
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  )
}
