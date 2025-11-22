// api/feedback.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

    const { data, error } = await supabase
      .from('feedback')
      .insert([{ name, email, message }]);

    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: 'Database error', detail: error });
    }

    res.status(200).json({ ok: true, inserted: data });
  } catch (e) {
    console.error('Handler error', e);
    return res.status(500).json({ error: 'Server error', detail: String(e) });
  }
