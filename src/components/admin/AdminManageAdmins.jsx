import React from 'react';

export default function AdminManageAdmins({
    admins,
    addAdmin,
    removeAdmin,
    newAdminEmail,
    setNewAdminEmail
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-purple-400">Manage Admins</h1>
            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 mb-8">
                <form onSubmit={addAdmin} className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="email"
                        placeholder="Enter new admin email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded font-medium transition-colors w-full sm:w-auto"
                    >
                        Add Admin
                    </button>
                </form>

                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-3 sm:p-4">Email</th>
                                <th className="p-3 sm:p-4">Added Date</th>
                                <th className="p-3 sm:p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {admins.map(admin => (
                                <tr key={admin.id} className="hover:bg-slate-700/50">
                                    <td className="p-3 sm:p-4">{admin.email}</td>
                                    <td className="p-3 sm:p-4 text-slate-400">{new Date(admin.created_at).toLocaleDateString()}</td>
                                    <td className="p-3 sm:p-4 text-right">
                                        <button
                                            onClick={() => removeAdmin(admin.id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-slate-500">No additional admins found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
