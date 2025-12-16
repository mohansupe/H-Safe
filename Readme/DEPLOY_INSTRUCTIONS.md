# Detailed Deployment Instructions (Vercel + Supabase + Clerk + Resend)

## 1. Prepare GitHub repo
- Create a GitHub repository and push your project code.

## 2. Create Supabase project
- Go to https://app.supabase.com and create a new project.
- Note the Project URL and Service Role key (Settings → API → Service Role).
- In SQL editor, run the schema SQL in README.md.

## 3. Create Clerk app
- Sign up on Clerk and create an application.
- Copy the Publishable Key (pk_test...) and add to Vercel as `VITE_CLERK_PUBLISHABLE_KEY`.
- For each admin account, set public metadata `role = "admin"` (Clerk dashboard → Users → Edit).

## 4. Create Resend account (for emails)
- Sign up at https://resend.com, create an API key and add as `RESEND_API_KEY` in Vercel.

## 5. Configure Vercel
- Create a new project in Vercel and link your GitHub repo.
- In Project Settings → Environment Variables, add values from `.env.example` (do NOT commit real values).
- In Build & Development settings set Install Command to: `npm install --include=dev` (or set `NPM_CONFIG_PRODUCTION=false`).
- Deploy the project.

## 6. Test endpoints
- Test `/api/feedback` and `/api/contact` via Postman or browser.
- Test admin endpoints with `x-admin-key` header.

## 7. Optional: switch to Clerk server-side admin verification
- Replace the `isAdmin` header check with Clerk JWT verification in `/api/*` functions.
- Use Clerk server SDK and verify tokens accordingly.
