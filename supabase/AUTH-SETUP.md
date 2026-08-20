# Idrok Google-only production auth setup

Project: `edbxrjwvrzqjikfbbkqm`

1. Google Cloud Console → APIs & Services → Credentials:
   - Create an OAuth 2.0 Client ID with application type `Web application`.
   - Authorized JavaScript origin: `https://idrok-one.vercel.app`
   - Authorized redirect URI: `https://edbxrjwvrzqjikfbbkqm.supabase.co/auth/v1/callback`
2. Supabase → Authentication → Providers → Google:
   - Enable Google.
   - Paste the Google Client ID and Client Secret, then save.
3. Supabase → Authentication → URL Configuration:
   - Site URL: `https://idrok-one.vercel.app`
   - Redirect URL: `https://idrok-one.vercel.app/**`
4. Supabase SQL Editor:
   - Run `supabase/schema.sql` once for automatic profile creation and progress storage.

The frontend uses Google OAuth only. Email OTP, SMTP, passwords, and guest authentication are intentionally not part of the production flow. Never commit the Google Client Secret to this repository.
