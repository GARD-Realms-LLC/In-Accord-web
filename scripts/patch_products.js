const fs = require('fs');
const p = "e:\\In-Accord-web\\client\\src\\app\\products\\page.tsx";
let s = fs.readFileSync(p,'utf8');
fs.writeFileSync(p + '.bak', s);
if (s.includes('HomePageWrapper')) { console.log('already-wrapped'); process.exit(0); }
// ensure import
if (!/import\s+HomePageWrapper/.test(s)){
  if (s.startsWith("'use client'")){
    s = s.replace(/('use client';\s*)/m, "$1import HomePageWrapper from '../HomePageWrapper';\n\n");
  } else {
    s = "import HomePageWrapper from '../HomePageWrapper';\n\n" + s;
  }
}
const m = s.match(/export\s+default\s+([A-Za-z0-9_]+)\s*;?\s*$/m);
if (!m){ console.log('no-export'); fs.writeFileSync(p, s,'utf8'); process.exit(0); }
const name = m[1];
const out = s.replace(/export\s+default\s+([A-Za-z0-9_]+)\s*;?\s*$/m, `export default function Page(){return <HomePageWrapper><${name}/></HomePageWrapper>}`);
fs.writeFileSync(p, out, 'utf8');
console.log('patched');
