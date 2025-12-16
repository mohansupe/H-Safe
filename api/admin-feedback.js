import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_API_KEY = process.env.ADMIN_API_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function isAdmin(req) {
  const key = req.headers['x-admin-key'] || req.headers['x-admin-key'.toLowerCase()]
  return ADMIN_API_KEY && key === ADMIN_API_KEY
}

export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' })

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase select error', error)
      return res.status(500).json({ error: 'Database error' })
    }

    res.status(200).json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
