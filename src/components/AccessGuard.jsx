import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AccessGuard = ({ children }) => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            checkStatus();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false); // Let ProtectedRoute handle auth redirect if needed, or handle here
        }
    }, [isLoaded, isSignedIn, user]);

    async function checkStatus() {
        try {
            const { data, error } = await supabase
                .from('early_access_requests')
                .select('status')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setStatus(data.status);
            }
        } catch (error) {
            console.error('Error checking access status:', error);
        } finally {
            setLoading(false);
        }
    }

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Verifying Access Rights...</p>
                </div>
            </div>
        );
    }

    if (status !== 'approved') {
        // Redirect to dashboard where they can request access
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AccessGuard;
