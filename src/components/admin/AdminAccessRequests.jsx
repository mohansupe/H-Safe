import React from 'react';

export default function AdminAccessRequests({ requests, updateStatus, loading }) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Early Access Requests</h1>
            <div className="bg-slate-800 rounded-xl overflow-x-auto border border-slate-700">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-slate-900/50 text-slate-400">
                        <tr>
                            <th className="p-3 sm:p-4">Email</th>
                            <th className="p-3 sm:p-4">Date</th>
                            <th className="p-3 sm:p-4">Status</th>
                            <th className="p-3 sm:p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {requests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-700/50">
                                <td className="p-3 sm:p-4">{req.email}</td>
                                <td className="p-3 sm:p-4">{new Date(req.created_at).toLocaleDateString()}</td>
                                <td className="p-3 sm:p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                        req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-3 sm:p-4 flex gap-2">
                                    {req.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(req.id, 'approved')}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(req.id, 'rejected')}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {req.status !== 'pending' && (
                                        <button
                                            onClick={() => updateStatus(req.id, 'pending')}
                                            className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">No requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
