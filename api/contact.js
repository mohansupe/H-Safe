import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function sendEmailNotification(subject, html) {
  if (!RESEND_API_KEY) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'H-SAFE <no-reply@h-safe.example>',
        to: [ADMIN_EMAIL],
        subject,
        html
      })
    })
  } catch (e) {
    console.error('Resend email error', e)
  }
}

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = req.body || (await new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => r(JSON.parse(d))) }))
    const { name, email, message } = body
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }])

    if (error) {
      console.error('Supabase insert error', error)
      return res.status(500).json({ error: 'Database error' })
    }

    const html = `<p>New contact message:</p><p><strong>${name}</strong> &lt;${email}&gt;</p><p>${message}</p>`
    sendEmailNotification('New H-SAFE Contact Message', html).catch(() => { })

    res.status(200).json({ ok: true, inserted: data })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
