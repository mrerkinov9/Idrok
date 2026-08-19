# Idrok production auth setup

Project: `edbxrjwvrzqjikfbbkqm`

1. Authentication → URL Configuration:
   - Site URL: `https://idrok-one.vercel.app`
   - Redirect URL: `https://idrok-one.vercel.app/**`
2. Authentication → Email Templates → Magic Link:
   - Subject: `Idrok tasdiqlash kodi`
   - Body: paste `supabase/email-template.html`.
3. Authentication → Emails → SMTP Settings:
   - Configure a production SMTP provider. Supabase's built-in sender only supports project team addresses and is rate-limited.
4. SQL Editor:
   - Run `supabase/schema.sql` for profile/progress storage.
5. Optional Google login:
   - Enable the Google provider with its Client ID and secret.
   - Google callback URL: `https://edbxrjwvrzqjikfbbkqm.supabase.co/auth/v1/callback`
