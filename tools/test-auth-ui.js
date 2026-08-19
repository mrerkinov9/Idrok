const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const app = read('app.js');
const styles = read('styles.css');
const auth = read('supabase-auth.js');
const authConfig = read('auth-config.js');
const pages = ['index.html', 'garden.html', 'lab.html', 'labs.html', 'physics.html', 'physics7.html', 'physics8.html', 'physics10.html', 'physics11.html'];
let assertionCount = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
  assertionCount += 1;
}

assert(!/IDROKNI-OCHISH|cmd faylini oching|noto‘g‘ri manzildan/.test(index + app), 'Production UI ichida CMD xabari qolgan');
assert(!/name="password"/.test(index), 'Eski parol maydoni qolgan');
assert(/id="otpForm"/.test(index) && /autocomplete="one-time-code"/.test(index), 'OTP tasdiqlash formasi topilmadi');
assert((index.match(/data-google-auth/g) || []).length === 2, 'Login va register uchun Google tugmalari to‘liq emas');
assert(/name="firstName"/.test(index) && /name="lastName"/.test(index), 'Ism va familiya alohida olinmayapti');
assert(/signInWithOtp/.test(auth) && /verifyOtp/.test(auth) && /signInWithOAuth/.test(auth), 'Supabase OTP yoki Google oqimi yo‘q');
assert(/persistSession:\s*true/.test(auth) && /autoRefreshToken:\s*true/.test(auth), 'Uzoq sessiya sozlamasi yo‘q');
assert(/\.auth-google\{/.test(styles) && /\.otp-input/.test(styles), 'Professional auth uslublari topilmadi');
assert(/https:\/\/[a-z0-9-]+\.supabase\.co/.test(authConfig) && /sb_publishable_/.test(authConfig), 'Production Supabase konfiguratsiyasi ulanmagan');
assert(/isMissingProfileStore/.test(auth) && /profileStoreAvailable/.test(auth), 'Profil jadvali kechiksa auth fallback yo‘q');
assert(/auth\/v1\/settings/.test(auth) && /availability\.google===false/.test(app), 'O‘chiq Google provider tugmasi xato chiqarishdan himoyalanmagan');

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
