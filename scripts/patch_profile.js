const fs = require('fs');
const path = require('path');
const BAK_DIR = path.join(process.cwd(), 'assistant_baks');
if (!fs.existsSync(BAK_DIR)) fs.mkdirSync(BAK_DIR, { recursive: true });
const p = "e:\\In-Accord-web\\client\\src\\app\\profile\\page.tsx";
let s = fs.readFileSync(p,'utf8');
fs.writeFileSync(path.join(BAK_DIR, path.basename(p) + '.bak'), s);
if (!s.includes('export default Profile;')){ console.log('no-export'); process.exit(0); }
const out = s.replace(/export default Profile;\s*$/m, 'export default function Page(){return <HomePageWrapper><Profile/></HomePageWrapper>}');
fs.writeFileSync(p, out, 'utf8');
console.log('patched');
