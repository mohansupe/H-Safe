import React from 'react'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react'

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useUser()

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />
    }

    return children
}

export default ProtectedRoute
