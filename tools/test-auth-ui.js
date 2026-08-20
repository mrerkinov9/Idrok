const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const app = read('app.js');
const styles = read('styles.css');
const auth = read('supabase-auth.js');
const authConfig = read('auth-config.js');
const schema = read('supabase/schema.sql');
const pages = ['index.html', 'garden.html', 'lab.html', 'labs.html', 'physics.html', 'physics7.html', 'physics8.html', 'physics10.html', 'physics11.html'];
let assertionCount = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
  assertionCount += 1;
}

assert(!/IDROKNI-OCHISH|cmd faylini oching|noto‘g‘ri manzildan/.test(index + app), 'Production UI ichida CMD xabari qolgan');
assert(!/name="(?:password|email|firstName|lastName)"/.test(index), 'Google-only oynada eski forma maydoni qolgan');
assert(!/id="(?:otpForm|loginForm|registerForm)"/.test(index), 'OTP yoki email formasi hali ham mavjud');
assert((index.match(/data-google-auth/g) || []).length === 1, 'Yagona Google kirish tugmasi topilmadi');
assert(/id="googleAuthPanel"/.test(index) && /Google orqali davom etish/.test(index), 'Google-only professional panel topilmadi');
assert(/signInWithOAuth/.test(auth) && !/signInWithOtp|verifyOtp/.test(auth), 'Auth adapter Google-only emas');
assert(/persistSession:\s*true/.test(auth) && /autoRefreshToken:\s*true/.test(auth), 'Uzoq sessiya sozlamasi yo‘q');
assert(/\.auth-google-primary\{/.test(styles) && /\.auth-account-flow\{/.test(styles), 'Professional Google auth uslublari topilmadi');
assert(/https:\/\/[a-z0-9-]+\.supabase\.co/.test(authConfig) && /sb_publishable_/.test(authConfig), 'Production Supabase konfiguratsiyasi ulanmagan');
assert(/isMissingProfileStore/.test(auth) && /profileStoreAvailable/.test(auth), 'Profil jadvali kechiksa auth fallback yo‘q');
assert(/auth\/v1\/settings/.test(auth) && /availability\.google===false/.test(app), 'O‘chiq Google provider tugmasi himoyalanmagan');
assert(/location\.search/.test(auth) && /prompt:\s*'select_account'/.test(auth) && /continueAfterAuth/.test(app), 'Google OAuth qaytish yoki hisob tanlash oqimi yo‘q');
assert(/auth-quantum-stage/.test(index) && /quantum-cube/.test(index) && /auth-tilt-x/.test(app), 'Interaktiv 3D auth sahnasi to‘liq ulanmagan');
assert(!/idrokGuest|rememberGuestSession/.test(app), 'Mehmon sessiyasi auth oqimida qolgan');
assert(/handle_new_user/.test(schema) && /after insert on auth\.users/.test(schema), 'Birinchi Google kirishda profil avtomatik yaratilmaydi');

for (const page of pages) {
  const html = read(page);
  const supabaseIndex = html.indexOf('@supabase/supabase-js');
  const adapterIndex = html.indexOf('supabase-auth.js');
  const sessionIndex = html.indexOf('account-session.js');
  assert(supabaseIndex >= 0, `${page}: Supabase SDK ulanmagan`);
  assert(adapterIndex > supabaseIndex, `${page}: auth adapter SDKdan oldin yuklangan`);
  assert(sessionIndex > adapterIndex, `${page}: account-session auth adapterdan oldin yuklangan`);
}

console.log(`AUTH UI TEST: ${assertionCount}/${assertionCount} muvaffaqiyatli`);
