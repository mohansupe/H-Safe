import React, { useEffect, useState } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
    const { isSignedIn, user, isLoaded } = useUser()
    const [status, setStatus] = useState(null) // 'pending', 'approved', 'rejected', or null (not applied)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isSignedIn && user) {
            checkStatus()
        }
    }, [isSignedIn, user])

    async function checkStatus() {
        try {
            const { data, error } = await supabase
                .from('early_access_requests')
                .select('status')
                .eq('user_id', user.id)
                .single()

            if (data) {
                setStatus(data.status)
            } else {
                setStatus(null)
            }
        } catch (error) {
            console.error('Error checking status:', error)
        } finally {
            setLoading(false)
        }
    }

    async function requestAccess() {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('early_access_requests')
                .insert([{ user_id: user.id, email: user.primaryEmailAddress.emailAddress }])

            if (!error) {
                setStatus('pending')
            } else {
                alert('Error requesting access. Please try again.')
            }
        } catch (error) {
            console.error('Error requesting access:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>

    if (!isSignedIn) {
        return <RedirectToSignIn />
    }

    return (
        <section className="min-h-screen bg-slate-900 text-white pt-32 px-6">
            <div className="container mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

                {loading ? (
                    <p className="text-slate-400">Checking status...</p>
                ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-lg">
                        {status === 'approved' && (
                            <div>
                                <div className="text-green-400 text-5xl mb-4"><i className="fas fa-check-circle"></i></div>
                                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                                <p className="text-slate-300">You have been approved for Early Access.</p>
                                {/* Add actual dashboard content here later */}
                            </div>
                        )}

                        {status === 'pending' && (
                            <div>
                                <div className="text-yellow-400 text-5xl mb-4"><i className="fas fa-clock"></i></div>
                                <h2 className="text-2xl font-bold mb-2">Application Received</h2>
                                <p className="text-slate-300">We are reviewing your request. You will be notified once approved.</p>
                            </div>
                        )}

                        {status === 'rejected' && (
                            <div>
                                <div className="text-blue-400 text-5xl mb-4"><i className="fas fa-heart"></i></div>
                                <h2 className="text-2xl font-bold mb-2">Thanks for applying</h2>
                                <p className="text-slate-300">You are on our waitlist. We'll let you know when spots open up!</p>
                            </div>
                        )}

                        {status === null && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Get Early Access</h2>
                                <p className="text-slate-300 mb-6">Join the waitlist to get exclusive access to our firewall simulation tools.</p>
                                <button
                                    onClick={requestAccess}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                                >
                                    Request Access
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
