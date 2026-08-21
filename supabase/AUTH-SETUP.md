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
   - Open a new query and run the complete `supabase/schema.sql` file.
   - The file is idempotent: it can be rerun after an Idrok database update.
   - Day 1 hardening adds profile limits, protected lifetime Impulse updates, safe display names, and an opt-in leaderboard.
   - After it succeeds, confirm that the result says `Success. No rows returned`.

## Day 1 verification

- A signed-out visitor cannot read `public.leaderboard`.
- A new account receives a `public.profiles` row automatically.
- Progress survives refresh and a second browser session.
- Garden purchase, move, sell, expand, focus, and mission actions persist.
- Leaderboard stays empty until a student explicitly opts in. The opt-in UI will be added before the leaderboard is publicly promoted.

The frontend uses Google OAuth only. Email OTP, SMTP, passwords, and guest authentication are intentionally not part of the production flow. Never commit the Google Client Secret to this repository.
