import { supabase } from './supabaseClient'

export const SUPER_ADMIN_EMAILS = ['mohansupe2004@gmail.com', 'varadkhopkar@gmail.com']

/**
 * Checks if a user is an admin.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - True if the user is an admin, false otherwise.
 */
export async function isAdmin(email) {
    if (!email) return false

    // Check if super admin
    if (SUPER_ADMIN_EMAILS.includes(email)) return true

    try {
        // Check if in admin_users table
        const { data, error } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .single()

        if (error || !data) {
            return false
        }

        return true
    } catch (err) {
        console.error('Error checking admin status:', err)
        return false
    }
}
