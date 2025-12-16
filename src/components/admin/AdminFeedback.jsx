import React from 'react';

export default function AdminFeedback({ feedbacks, loading }) {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">User Feedback</h2>
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {feedbacks.map(fb => (
                            <tr key={fb.id} className="hover:bg-slate-700/50">
                                <td className="p-4 font-medium">{fb.name}</td>
                                <td className="p-4 text-slate-400">{fb.email}</td>
                                <td className="p-4 max-w-md truncate" title={fb.message}>{fb.message}</td>
                                <td className="p-4 text-slate-500 text-sm">{fb.created_at ? new Date(fb.created_at).toLocaleDateString() : '-'}</td>
                            </tr>
                        ))}
                        {feedbacks.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">No feedback found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
