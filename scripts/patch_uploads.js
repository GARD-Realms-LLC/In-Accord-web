const fs = require('fs');
const p = "e:\\In-Accord-web\\client\\src\\app\\uploads\\page.tsx";
let s = fs.readFileSync(p,'utf8');
fs.writeFileSync(p + '.bak', s);
if (s.includes('HomePageWrapper') && /export\s+default\s+function\s+Page\(\)/.test(s)) { console.log('already-wrapped'); process.exit(0); }
const out = s.replace(/export\s+default\s+([A-Za-z0-9_]+)\s*;?\s*$/m, 'export default function Page(){return <HomePageWrapper><$1/></HomePageWrapper>}');
if (out === s) { console.log('no-change'); process.exit(0); }
fs.writeFileSync(p, out, 'utf8');
console.log('patched');
