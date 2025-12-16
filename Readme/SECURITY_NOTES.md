# Security Notes & Best Practices

1. **Never commit secret keys** (service_role, resend API keys, clerk secret) to git.
2. **Only put service_role** in server environment variables (Vercel project settings).
3. Use `ADMIN_API_KEY` as a short-term protect for admin endpoints; migrate to Clerk-based server verification in production.
4. Enable Row Level Security (RLS) if you ever expose Supabase directly to clients.
5. Rotate keys if they are accidentally leaked.
