import React, { useEffect, useState } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Shield, Clock, Lock, ArrowRight, Activity, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Dashboard() {
    const { isSignedIn, user, isLoaded } = useUser()
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn && user) {
            checkStatus()
        }
    }, [isSignedIn, user])

    useEffect(() => {
        if (status === 'rejected') {
            const timeout = setTimeout(() => {
                navigate('/')
            }, 6000) // Give them a bit more time to read the message
            return () => clearTimeout(timeout)
        }
    }, [status, navigate])

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

    if (!isLoaded) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><div className="animate-pulse">Loading Dashboard...</div></div>

    if (!isSignedIn) {
        return <RedirectToSignIn />
    }

    return (
        <section className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center py-20 px-6">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto max-w-4xl relative z-10">
                {loading ? (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-slate-400 text-lg">Syncing with server...</p>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        {status === 'approved' && (
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-6 border border-green-500/20">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Access Granted</span>
                                        </div>
                                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
                                            Welcome Back
                                        </h1>
                                        <p className="text-slate-400 text-lg leading-relaxed">
                                            You typically have full access to the H-Safe Simulator. Dive into our comprehensive, simulation-based firewall system and start mastering network security today.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => navigate('/simulator')}
                                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                        >
                                            Launch Simulator
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => navigate('/about')}
                                            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 rounded-xl font-semibold text-slate-300 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
                                        >
                                            Documentation
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm text-slate-400">Full Simulator Access</span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm text-slate-400">Advanced PCAP Analysis</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex justify-center">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                                        <Shield className="w-64 h-64 text-slate-800 drop-shadow-2xl relative z-10" strokeWidth={1} fill="currentColor" style={{ fillOpacity: 0.1, stroke: 'url(#gradient)' }} />
                                        <svg width="0" height="0">
                                            <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                                                <stop stopColor="#60a5fa" offset="0%" />
                                                <stop stopColor="#818cf8" offset="100%" />
                                            </linearGradient>
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <span className="text-8xl font-bold text-white/10 select-none">H</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'pending' && (
                            <div className="max-w-xl mx-auto text-center">
                                <div className="inline-flex p-4 rounded-full bg-yellow-500/10 text-yellow-500 mb-6 ring-1 ring-yellow-500/20">
                                    <Clock className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-4">Application under Review</h1>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                                    <p className="text-slate-300 leading-relaxed">
                                        Thanks for requesting access! Our team is currently reviewing your application.
                                        You'll be notified via email once your access to the simulator is approved.
                                    </p>
                                </div>
                                <div className="flex justify-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
                                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}

                        {status === 'rejected' && (
                            <div className="max-w-xl mx-auto text-center">
                                <div className="inline-flex p-4 rounded-full bg-blue-500/10 text-blue-500 mb-6 ring-1 ring-blue-500/20">
                                    <AlertCircle className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-4">You're on the list!</h1>
                                <p className="text-slate-400 text-lg mb-8">
                                    Thanks for interest in H-Safe. We've added you to our waitlist and will notify you as soon as spots open up.
                                </p>
                                <p className="text-slate-500 text-sm animate-pulse">Redirecting to home...</p>
                            </div>
                        )}

                        {status === null && (
                            <div className="max-w-2xl mx-auto text-center">
                                <div className="inline-flex p-4 rounded-full bg-slate-800 mb-8 border border-slate-700 shadow-xl">
                                    <Lock className="w-8 h-8 text-slate-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Restricted Access</h1>
                                <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
                                    The H-Safe Simulator is currently in private beta. Request access to join our network of security researchers and students.
                                </p>
                                <button
                                    onClick={requestAccess}
                                    className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-colors shadow-xl shadow-white/5 hover:shadow-white/10 flex items-center gap-2 mx-auto"
                                >
                                    Request Early Access
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
