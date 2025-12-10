import React from 'react'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
    return (
        <section className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 text-center shadow-2xl">
                <div className="text-red-500 text-6xl mb-6">
                    <i className="fas fa-lock"></i>
                </div>
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-slate-400 mb-8">
                    Sorry, you don't have admin rights to view this page.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                >
                    Go to Dashboard
                </Link>
            </div>
        </section>
    )
}
