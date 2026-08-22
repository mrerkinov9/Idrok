const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const auth = read('supabase-auth.js');
const account = read('account-session.js');
const physics = read('physics.js');
const garden = read('garden.js');
const focus = read('focus-widget.js');
const app = read('app.js');
const admin = read('admin.js');
const schema = read('supabase/schema.sql');
const vercel = JSON.parse(read('vercel.json'));
const protectedPages = ['garden.html', 'lab.html', 'labs.html', 'physics.html', 'physics7.html', 'physics8.html', 'physics10.html', 'physics11.html'];
let count = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
  count += 1;
}

assert(/syncQueue\s*=\s*Promise\.resolve/.test(auth), 'Profil yozuvlari navbat bilan bajarilmayapti');
assert(/gardenQueue\s*=\s*Promise\.resolve/.test(auth), 'Bog‘ amallari navbat bilan bajarilmayapti');
assert(/path\.startsWith\('\/api\/garden'\)/.test(auth), 'Supabase garden adapteri yo‘q');
assert(/\/api\/garden\/purchase/.test(auth) && /\/api\/garden\/focus\/heartbeat/.test(auth), 'Garden critical amallari adapterga to‘liq kirmagan');
assert(/mergeCourseState/.test(auth), 'Ikki qurilma progressini birlashtirish funksiyasi yo‘q');
assert(/window\.IDROK_ACCOUNT\?\.request/.test(garden), 'Garden account adapteridan foydalanmayapti');
assert(/window\.IDROK_ACCOUNT\?\.request/.test(focus), 'Focus widget account adapteridan foydalanmayapti');
assert(/window\.IDROK_ACCOUNT\.request\('\/api\/progress'/.test(physics), 'Kurs autosave account adapteriga ulanmagan');
assert(!/fetch\('\/api\/progress'/.test(physics), 'Kursda raw /api/progress fetch qolgan');
assert(!/demo-zilola|demo-temur|demo-madina|demo-aziz/.test(garden), 'Soxta public bog‘lar hali ham mavjud');
assert(/escapeHTML/.test(app) && /safeName/.test(app), 'Leaderboard user matni escape qilinmagan');
assert(/escapeHTML/.test(garden) && /safeName/.test(garden), 'Public garden user matni escape qilinmagan');
assert(/escapeHTML/.test(admin), 'Admin user matni escape qilinmagan');
assert(/leaderboard_opt_in boolean not null default false/.test(schema), 'Leaderboard privacy opt-in yo‘q');
assert(/revoke all on public\.leaderboard from anon/.test(schema), 'Anon leaderboard yopilmagan');
assert(/guard_profile_update/.test(schema) && /new\.lifetime_impulse/.test(schema), 'Profil iqtisod himoyasi yo‘q');
assert(/profiles_garden_size/.test(schema) && /profiles_completed_array/.test(schema), 'Profil JSON limitlari yo‘q');
assert(/cloudAuth\)result=await window\.IDROK_AUTH\.request/.test(account), 'Account request Supabase adapteriga delegatsiya qilmayapti');

const securityHeaders = Object.fromEntries(vercel.headers[0].headers.map(item => [item.key.toLowerCase(), item.value]));
assert(securityHeaders['content-security-policy']?.includes("object-src 'none'"), 'CSP object himoyasi yo‘q');
assert(securityHeaders['content-security-policy']?.includes("frame-ancestors 'none'"), 'CSP frame himoyasi yo‘q');
assert(securityHeaders['x-content-type-options'] === 'nosniff', 'nosniff header yo‘q');
assert(securityHeaders['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer policy noto‘g‘ri');

for (const page of protectedPages) {
  const html = read(page);
  assert(/supabase-auth\.js\?v=6/.test(html), `${page}: yangi Supabase adapter versiyasi ulanmagan`);
  assert(/focus-widget\.js\?v=2/.test(html), `${page}: yangi focus widget versiyasi ulanmagan`);
}

console.log(`PRODUCTION FOUNDATION TEST: ${count}/${count} muvaffaqiyatli`);
