const fs = require('fs');
const path = require('path');
const BAK_DIR = path.join(process.cwd(), 'assistant_baks');
if (!fs.existsSync(BAK_DIR)) fs.mkdirSync(BAK_DIR, { recursive: true });
const p = "e:\\In-Accord-web\\client\\src\\app\\themes\\page.tsx";
let s = fs.readFileSync(p,'utf8');
fs.writeFileSync(path.join(BAK_DIR, path.basename(p) + '.bak'), s);
if (s.includes('HomePageWrapper') && /export\s+default\s+function\s+Page\(\)/.test(s)) { console.log('already-wrapped'); process.exit(0); }
if (!/import\s+HomePageWrapper/.test(s)){
  if (/^'use client'|^"use client"/.test(s)){
    s = s.replace(/(^('use client'|"use client");\s*)/m, `$1import HomePageWrapper from '../HomePageWrapper';\n\n`);
  } else {
    s = "import HomePageWrapper from '../HomePageWrapper';\n\n" + s;
  }
}
const out = s.replace(/export\s+default\s+([A-Za-z0-9_]+)\s*;?\s*$/m, 'export default function Page(){return <HomePageWrapper><$1/></HomePageWrapper>}');
if (out === s) { console.log('no-change'); process.exit(0); }
fs.writeFileSync(p, out, 'utf8');
console.log('patched');
