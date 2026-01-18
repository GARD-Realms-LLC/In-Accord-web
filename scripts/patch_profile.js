const fs = require('fs');
const p = "e:\\In-Accord-web\\client\\src\\app\\profile\\page.tsx";
let s = fs.readFileSync(p,'utf8');
fs.writeFileSync(p + '.bak', s);
if (!s.includes('export default Profile;')){ console.log('no-export'); process.exit(0); }
const out = s.replace(/export default Profile;\s*$/m, 'export default function Page(){return <HomePageWrapper><Profile/></HomePageWrapper>}');
fs.writeFileSync(p, out, 'utf8');
console.log('patched');
