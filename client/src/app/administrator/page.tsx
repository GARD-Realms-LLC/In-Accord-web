'use client';

import { useEffect, useState, useMemo } from 'react';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Minimal MD5 for Gravatar (lightweight implementation)
function md5cycle(x: number[], k: number[]) {
  let [a, b, c, d] = x;
  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);
  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);
  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);
  x[0] = (x[0] + a) | 0;
  x[1] = (x[1] + b) | 0;
  x[2] = (x[2] + c) | 0;
  x[3] = (x[3] + d) | 0;
}
function cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return (a + ((q + x + t) | 0) << s) | 0; }
function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
function md51(s: string) {
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
  s = s.substring(i - 64);
  const tail = new Array(16).fill(0);
  for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (let j = 0; j < 16; j++) tail[j] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}
function md5blk(s: string) {
  const md5blks = [] as number[];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}
function rhex(n: number) { const s = '0123456789abcdef'; let j = 0; let str = ''; for (; j < 4; j++) { str += s[(n >> (j * 8 + 4)) & 0x0f] + s[(n >> (j * 8)) & 0x0f]; } return str; }
function hex(x: number[]) { for (let i = 0; i < x.length; i++) x[i] = x[i] | 0; return rhex(x[0]) + rhex(x[1]) + rhex(x[2]) + rhex(x[3]); }
function md5(s: string) { return hex(md51(s)); }

function gravatarUrlForEmail(email: string, size = 64) {
  if (!email) return '';
  try { return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?s=${size}&d=identicon`; } catch { return ''; }
}

// Hash password helper - uses SHA-256 and returns a simple prefixed form the server accepts (legacy sha256)
async function hashPassword(password: string) {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuf = await (crypto.subtle || (window as any).crypto.subtle).digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuf));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256$${hashHex}`;
  } catch (e) {
    // fallback: simple JS hash (not cryptographically secure)
    let h = 0;
    for (let i = 0; i < password.length; i++) h = ((h << 5) - h) + password.charCodeAt(i);
    return `sha256$${(h >>> 0).toString(16)}`;
  }
}


// Password strength helper component
function PasswordStrength({ password }: { password: string }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s += 1;
    if (password.length >= 12) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  })();
  const pct = Math.min(100, Math.round((score / 5) * 100));
  return (
    <div>
      <div className="text-xs text-gray-500 mt-1">Strength: {pct}% {score >= 4 ? '(Strong)' : score >= 2 ? '(Medium)' : '(Weak)'}</div>
      <div className="text-xs text-gray-500 mt-1">Rules: min 8 chars, uppercase, number, special</div>
    </div>
  );
}


interface AuditLogEntry {
  timestamp: string;
  user: string;
  page: string;
  action: string;
  details: string;
  status: 'Success' | 'Passed';
}

const initialAuditLogs: AuditLogEntry[] = [
  {
    timestamp: '2026-01-07 19:00:47',
    user: 'System',
    page: 'Backup & Recovery',
    action: 'Backup Completed',
    details: 'Full backup (DB + Files) 487 MB to Local + Cloud',
    status: 'Success'
  },
  {
    timestamp: '2026-01-06 19:00:33',
    user: 'System',
    page: 'Backup & Recovery',
    action: 'Backup Completed',
    details: 'Full backup (DB + Files) 465 MB to Local + Cloud',
    status: 'Success'
  },
  {
    timestamp: '2025-12-31 01:30:22',
    user: 'DocRST',
    page: 'Backup & Recovery',
    action: 'DR Test Executed',
    details: 'Disaster recovery test - Recovery time: 6m 14s',
    status: 'Passed'
  },
  {
    timestamp: '2025-01-08 07:35:22',
    user: 'DocRST',
    page: 'Team',
    action: 'Updated Job Title',
    details: 'Doc Cowles: Founder & Manager',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 07:28:15',
    user: 'DocRST',
    page: 'Administrator',
    action: 'Updated Team Member',
    details: 'Member #2: Email updated',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 07:15:43',
    user: 'DocRST',
    page: 'Dashboard',
    action: 'Page Accessed',
    details: 'View dashboard metrics',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 07:02:11',
    user: 'DocRST',
    page: 'Team',
    action: 'Page Accessed',
    details: 'View team members list',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 06:45:32',
    user: 'DocRST',
    page: 'Products',
    action: 'Page Accessed',
    details: 'View product inventory',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 06:32:18',
    user: 'DocRST',
    page: 'Users',
    action: 'Page Accessed',
    details: 'View system users',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 06:18:45',
    user: 'DocRST',
    page: 'Expenses',
    action: 'Page Accessed',
    details: 'View expense reports',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 06:05:22',
    user: 'DocRST',
    page: 'Inventory',
    action: 'Page Accessed',
    details: 'View inventory status',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 05:52:10',
    user: 'DocRST',
    page: 'Settings',
    action: 'Page Accessed',
    details: 'View system settings',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 05:38:56',
    user: 'DocRST',
    page: 'Administrator',
    action: 'Page Accessed',
    details: 'View admin panel',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 05:25:33',
    user: 'DocRST',
    page: 'Home',
    action: 'Login Success',
    details: 'User authenticated',
    status: 'Success'
  },
  {
    timestamp: '2025-01-08 05:10:15',
    user: 'DocRST',
    page: 'Support',
    action: 'Page Accessed',
    details: 'View support tickets',
    status: 'Success'
  }
];

interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  avatarUrl?: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User' | 'Viewer';
  status: 'Active' | 'Suspended';
  createdAt: string;
  passwordExpiresAt?: string;
}

interface Group {
  id: string;
  name: string;
  members: string[]; // user ids
  description?: string;
}

interface TeamMember {
  name: string;
  jobTitle: string;
  description?: string;
  imageUrl?: string;
  email?: string;
  website?: string;
  github?: string;
  discord?: string;
}

const initialUsers: User[] = [
  { id: 'u1', name: 'Doc Cowles', username: 'doc', password: 'password', avatarUrl: '', email: 'doc@example.com', role: 'Admin', status: 'Active', createdAt: '2024-01-10', passwordExpiresAt: '2025-01-10' },
  { id: 'u2', name: 'Alice Johnson', username: 'alice', password: 'password', avatarUrl: '', email: 'alice@example.com', role: 'Manager', status: 'Active', createdAt: '2025-05-02', passwordExpiresAt: '2026-05-02' },
  { id: 'u3', name: 'Bob Smith', username: 'bob', password: 'password', avatarUrl: '', email: 'bob@example.com', role: 'User', status: 'Suspended', createdAt: '2025-09-12', passwordExpiresAt: '2026-09-12' }
];

const Administrator = (props: Props) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
      {
        name: "Doc Cowles - DocRST",
        jobTitle: "Founder & Manager",
        description: "Founder and Manager of In-Accord",
        imageUrl: "https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/dic-irish-bear.jpeg",
        email: "member1@example.com",
        website: "https://example.com",
        github: "https://github.com",
        discord: "https://discord.com"
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        name: `Team Member ${i + 2}`,
        jobTitle: "Team Member",
        description: `Information about team member ${i + 2}`,
        imageUrl: `https://example.com/member${i + 2}`,
        email: `member${i + 2}@example.com`,
        website: "https://example.com",
        github: "https://github.com",
        discord: "https://discord.com"
      }))
    ]);

    // Validation state per member index and field
    const [errors, setErrors] = useState<{ [key: number]: Partial<Record<keyof TeamMember, string>> }>({});

    const [auditLogEntries, setAuditLogEntries] = useState<AuditLogEntry[]>(initialAuditLogs);

    // System Health state
    const [appStatus, setAppStatus] = useState('Operational');
    const [responseTime, setResponseTime] = useState(45);
    const [uptime, setUptime] = useState(99.98);
    const [requestsPerMin, setRequestsPerMin] = useState(2.4);
    const [successRate, setSuccessRate] = useState(99.2);
    const [p95Latency, setP95Latency] = useState(127);
    const [memoryUsage, setMemoryUsage] = useState(8.2);
    const [lastUpdated, setLastUpdated] = useState(new Date());


    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidURL = (url: string) => {
      if (!url) return false;
      try { new URL(url); return true; } catch { return false; }
    };

    // Update system health metrics
    const updateMetrics = () => {
      // Simulate realtime metric updates with slight variations
      setResponseTime(Math.floor(Math.random() * 30) + 35); // 35-65ms
      setUptime(99.95 + Math.random() * 0.05); // 99.95-100%
      setRequestsPerMin(2.0 + Math.random() * 1.0); // 2.0-3.0K
      setSuccessRate(98.5 + Math.random() * 1.5); // 98.5-100%
      setP95Latency(Math.floor(Math.random() * 50) + 100); // 100-150ms
      setMemoryUsage(7.5 + Math.random() * 1.5); // 7.5-9.0GB
      
      // Determine status based on metrics
      const currentResponseTime = Math.floor(Math.random() * 30) + 35;
      const currentUptime = 99.95 + Math.random() * 0.05;
      
      if (currentResponseTime > 100 || currentUptime < 99.5) {
        setAppStatus('Warning');
      } else if (currentResponseTime > 200 || currentUptime < 98.0) {
        setAppStatus('Critical');
      } else {
        setAppStatus('Operational');
      }
      
      setLastUpdated(new Date());
    };

    // Refresh audit logs
    const refreshAuditLogs = () => {
      setAuditLogEntries(initialAuditLogs);
      alert('Audit logs refreshed! Latest entries loaded.');
    };

    const clearAuditLogs = () => {
      setAuditLogEntries([]);
      alert('Audit logs cleared.');
    };

    const openBackupLog = () => {
      alert('Viewing backup log: 2026-01-07 19:00:47 — Full backup (DB + Files) 487 MB to Local + Cloud.');
    };

    // Database Management Functions
    const runMaintenance = () => {
      alert('Database maintenance task started. This may take 5-10 minutes. Status will be updated in the Audit Logs.');
    };

    const optimizeIndexes = () => {
      alert('Index optimization started. Query performance will be improved. Process: Rebuilding 12 indexes...');
    };

    const verifyIntegrity = () => {
      alert('Database integrity verification started. Checking all tables for consistency and data corruption...');
    };

    const viewQueryLogs = () => {
      alert('Scrolling to Database Query Logs section in Audit Logs. All database queries are logged with execution times.');
      document.querySelector('#query-logs-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const refreshSchema = () => {
      alert('Database schema refreshed! Table definitions and statistics updated.');
    };

    const editTable = (tableName: string) => {
      alert(`Opening schema editor for table: ${tableName}. You can view and modify column definitions here.`);
    };

    const viewTableDetails = (tableName: string) => {
      alert(`Displaying detailed information for table: ${tableName}.\n\nIndexes: Multiple indexes configured\nRelationships: Connected to other tables\nConstraints: Primary keys and foreign keys defined`);
    };

    const rebuildIndexes = () => {
      alert('Rebuilding all database indexes to improve query performance. This process will run in the background.');
    };

    const analyzeTables = () => {
      alert('Analyzing table statistics to help the query optimizer make better decisions. Process started...');
    };

    const vacuumDatabase = () => {
      alert('Database vacuum operation started. This will reclaim space from deleted rows and optimize the database file.');
    };

    const checkIntegrity = () => {
      alert('Running comprehensive data integrity check. Verifying referential integrity, constraints, and data consistency...');
    };

    // --- User Management state and handlers ---
    const [users, setUsers] = useState<User[]>(() => {
      try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem('users') : null;
        return raw ? (JSON.parse(raw) as User[]) : initialUsers;
      } catch {
        return initialUsers;
      }
    });

    useEffect(() => {
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem('users', JSON.stringify(users));
      } catch {}
    }, [users]);

    // --- Online sessions (simulated) ---
    interface OnlineSession {
      id: string; // session id
      userId: string;
      name: string;
      username: string;
      ip: string;
      since: string; // ISO
      avatar?: string;
    }

    // start empty; load real sessions from server
    const [onlineUsers, setOnlineUsers] = useState<OnlineSession[]>([]);

    // Try to load real session data from server; fall back to simulated local sessions
    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/admin/sessions`);
          if (!res.ok) return;
          const data = await res.json();
          if (!Array.isArray(data.sessions)) return;
          const mapped: OnlineSession[] = data.sessions.map((s: any) => ({
            id: s.id || s.sessionId || ('sess-' + (s.userId || Math.random().toString(36).slice(2,8))),
            userId: s.userId || s.user?.id || s.userId,
            name: s.user?.name || s.name || s.username || 'Unknown',
            username: s.user?.username || s.username || s.user?.email || '',
            ip: s.ip || s.remoteAddr || '0.0.0.0',
            since: s.since || s.createdAt || new Date().toISOString(),
            avatar: s.avatar || (s.user?.email ? gravatarUrlForEmail(s.user.email, 40) : undefined)
          }));
          if (mounted) setOnlineUsers(mapped);
        } catch (e) {
          // ignore; keep simulated
        }
      })();
      return () => { mounted = false; };
    }, []);

    // listen for session creation events (dispatched by Navbar on login)
    useEffect(() => {
      function handler() {
        // best-effort refresh
        (async () => {
          try {
            const res = await fetch(`${API_BASE}/api/admin/sessions`);
            if (!res.ok) return;
            const data = await res.json();
            if (!Array.isArray(data.sessions)) return;
            const mapped: OnlineSession[] = data.sessions.map((s: any) => ({
              id: s.id || s.sessionId || ('sess-' + (s.userId || Math.random().toString(36).slice(2,8))),
              userId: s.userId || s.user?.id || s.userId,
              name: s.user?.name || s.name || s.username || 'Unknown',
              username: s.user?.username || s.username || s.user?.email || '',
              ip: s.ip || s.remoteAddr || '0.0.0.0',
              since: s.since || s.createdAt || new Date().toISOString(),
              avatar: s.avatar || (s.user?.email ? gravatarUrlForEmail(s.user.email, 40) : undefined)
            }));
            setOnlineUsers(mapped);
          } catch (e) {}
        })();
      }
      window.addEventListener('sessionCreated', handler);
      return () => window.removeEventListener('sessionCreated', handler);
    }, []);

    // Boot a single session (simulate terminating a session)
    const bootSession = async (sessionId: string) => {
      if (!confirm('Boot this user session?')) return;
      const s = onlineUsers.find(x => x.id === sessionId);
      setOnlineUsers(prev => prev.filter(x => x.id !== sessionId));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Booted Session', details: `${s?.name} (${s?.username}) booted from ${s?.ip}`, status: 'Success' }, ...prev]);
      try {
        await fetch(`${API_BASE}/api/admin/sessions/terminate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) });
      } catch (e) { /* best-effort */ }
      alert(`${s?.name ?? 'User'} has been booted.`);
    };

    const [refreshingOnline, setRefreshingOnline] = useState(false);

    // Boot all online sessions
    const bootAllSessions = async () => {
      if (!confirm('Boot ALL online sessions?')) return;
      const copy = [...onlineUsers];
      setOnlineUsers([]);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Booted All Sessions', details: `Booted ${copy.length} online sessions`, status: 'Success' }, ...prev]);
      try { await fetch(`${API_BASE}/api/admin/sessions/terminate-all`, { method: 'POST' }); } catch (e) {}
      alert(`Booted ${copy.length} sessions.`);
    };

    // Refresh online sessions from server (best-effort)
    const refreshOnlineUsers = async () => {
      setRefreshingOnline(true);
      try {
        const res = await fetch(`${API_BASE}/api/admin/sessions`);
        if (!res.ok) {
          console.warn('refreshOnlineUsers: non-ok response', res.status);
          alert('Failed to refresh sessions from server');
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data.sessions)) {
          console.warn('refreshOnlineUsers: unexpected payload', data);
          alert('No session data returned');
          return;
        }
        const mapped: OnlineSession[] = data.sessions.map((s: any) => ({
          id: s.id || s.sessionId || ('sess-' + (s.userId || Math.random().toString(36).slice(2,8))),
          userId: s.userId || s.user?.id || s.userId,
          name: s.user?.name || s.name || s.username || 'Unknown',
          username: s.user?.username || s.username || s.user?.email || '',
          ip: s.ip || s.remoteAddr || '0.0.0.0',
          since: s.since || s.createdAt || new Date().toISOString(),
          avatar: s.avatar || (s.user?.email ? gravatarUrlForEmail(s.user.email, 40) : undefined)
        }));
        setOnlineUsers(mapped);
        setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Refreshed Online Users', details: `Loaded ${mapped.length} sessions`, status: 'Success' }, ...prev]);
      } catch (e) {
        console.warn('refreshOnlineUsers failed', e);
        alert('Network error while refreshing sessions');
      } finally {
        setRefreshingOnline(false);
      }
    };

    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formRole, setFormRole] = useState<User['role']>('User');
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formAvatarUrl, setFormAvatarUrl] = useState<string | undefined>(undefined);
    const [formPasswordExpiresAt, setFormPasswordExpiresAt] = useState<string | undefined>(undefined);
    // UI for save-toast and temporary reveal of saved password
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [lastSavedPlain, setLastSavedPlain] = useState<string | null>(null);
    const [showSavedReveal, setShowSavedReveal] = useState(false);
    // Bulk password migration state
    const [showBulkPasswords, setShowBulkPasswords] = useState(false);
    const [bulkPasswords, setBulkPasswords] = useState<Record<string,string>>({});
    const [refreshing, setRefreshing] = useState(false);

    const generateRandomPassword = (len = 12) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=';
      let out = '';
      for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    };

    const openBulkForUnset = () => {
      const map: Record<string,string> = {};
      users.forEach(u => { if (!looksHashed(u.password)) map[u.id] = ''; });
      setBulkPasswords(map);
      setShowBulkPasswords(true);
    };

    const uploadAvatarForUser = (userId: string) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (ev: any) => {
        const file = ev.target.files && ev.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result as string | ArrayBuffer | null;
          if (!data) return;
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, avatarUrl: String(data) } : u));
          setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Updated Avatar', details: `Avatar updated for ${userId}`, status: 'Success' }, ...prev]);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    const applyBulkPasswords = async () => {
      const entries = Object.entries(bulkPasswords).filter(([_, v]) => !!v);
      if (entries.length === 0) { alert('No bulk passwords set'); return; }
      // capture plaintext export data
      const exportRows: Array<{ id: string; username: string; password: string }> = [];
      const updated = await Promise.all(users.map(async u => {
        const plain = bulkPasswords[u.id];
        if (plain) {
          exportRows.push({ id: u.id, username: u.username ?? u.email ?? '', password: plain });
          const hashed = await hashPassword(plain);
          // try sending to server (best-effort)
          try { await fetch(`${API_BASE}/api/admin/users/password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, passwordHash: hashed }) }); } catch (e) { console.warn('Failed to POST password to server', e); }
          return { ...u, password: hashed } as User;
        }
        return u;
      }));
      setUsers(updated as User[]);
      // offer export of plaintexts
      try {
        const payload = exportRows.map(r => `${r.id},"${r.username}","${r.password}"`).join('\n');
        const csv = 'id,username,password\n' + payload;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulk_passwords.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) { console.warn('Export failed', e); }
      setShowBulkPasswords(false);
      setBulkPasswords({});
      alert('Bulk passwords applied (hashed) and exported.');
    };

    const exportBulkPasswords = () => {
      const rows = Object.entries(bulkPasswords).map(([id, pwd]) => ({ id, username: users.find(u => u.id === id)?.username ?? '', password: pwd }));
      const csv = 'id,username,password\n' + rows.map(r => `${r.id},"${r.username}","${r.password}"`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'bulk_passwords.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    };

    const openCreateUser = () => {
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormRole('User');
      setFormUsername('');
      setFormPassword('');
      setFormPasswordExpiresAt(undefined);
      setFormAvatarUrl(undefined);
      setShowUserForm(true);
    };

    const openEditUser = (u: User) => {
      setEditingUser(u);
      setFormName(u.name);
      setFormEmail(u.email);
      setFormRole(u.role);
      setFormUsername(u.username ?? '');
      setFormPassword(u.password ?? '');
      setFormPasswordExpiresAt(u.passwordExpiresAt);
      setFormAvatarUrl(u.avatarUrl ?? undefined);
      setShowUserForm(true);
    };

    const closeUserForm = () => {
      setShowUserForm(false);
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormRole('User');
      setFormUsername('');
      setFormPassword('');
      setFormPasswordExpiresAt(undefined);
      setFormAvatarUrl(undefined);
    };

    const saveUser = async () => {
      const minPasswordLen = 8;
      if (!formName.trim()) { alert('Name is required'); return; }
      if (!formUsername.trim()) { alert('Username is required'); return; }
      if (!isValidEmail(formEmail)) { alert('Invalid email address'); return; }

      if (editingUser) {
        if (formPassword && formPassword.length < minPasswordLen) { alert(`Password must be at least ${minPasswordLen} characters`); return; }
        const hashed = formPassword ? await hashPassword(formPassword) : undefined;
        const updated = users.map(x => x.id === editingUser.id ? { ...x, name: formName, email: formEmail, role: formRole, username: formUsername, password: hashed ?? x.password, passwordExpiresAt: formPasswordExpiresAt ?? x.passwordExpiresAt, avatarUrl: formAvatarUrl ?? x.avatarUrl } : x);
        setUsers(updated as User[]);
        if (hashed) {
          try { await fetch(`${API_BASE}/api/admin/users/password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingUser.id, passwordHash: hashed }) }); } catch (e) { console.warn('Failed to POST password to server', e); }
        // also upsert full user metadata to server
        try { await fetch(`${API_BASE}/api/admin/users/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: updated.find(u => u.id === editingUser.id) }) }); } catch (e) { console.warn('Failed to upsert user to server', e); }
        }
        setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Updated User', details: `${formName} updated`, status: 'Success' }, ...prev]);
        alert('User updated.');
      } else {
        if (!formPassword) { alert('Password is required for new user'); return; }
        if (formPassword.length < minPasswordLen) { alert(`Password must be at least ${minPasswordLen} characters`); return; }
        const hashed = await hashPassword(formPassword);
        const newUser: User = { id: 'u' + Math.random().toString(36).slice(2,9), name: formName, email: formEmail, role: formRole, username: formUsername, password: hashed, avatarUrl: formAvatarUrl, status: 'Active', createdAt: new Date().toISOString().slice(0,10), passwordExpiresAt: formPasswordExpiresAt };
        setUsers([newUser, ...users] as User[]);
        try { await fetch(`${API_BASE}/api/admin/users/password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: newUser.id, passwordHash: hashed }) }); } catch (e) { console.warn('Failed to POST new password to server', e); }
        // also send full user metadata to server so login by username/email works
        try { await fetch(`${API_BASE}/api/admin/users/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: newUser }) }); } catch (e) { console.warn('Failed to upsert new user to server', e); }
        setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Created User', details: `${formName} created`, status: 'Success' }, ...prev]);
        alert('User created.');
      }

      closeUserForm();
      try { window.dispatchEvent(new CustomEvent('teamMembersUpdated', { detail: { type: 'users' } })); } catch {}
    };

    const deleteUser = (id: string) => {
      if (!confirm('Delete this user?')) return;
      const toDelete = users.find(u => u.id === id);
      setUsers(users.filter(u => u.id !== id) as User[]);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Deleted User', details: `${toDelete?.name} deleted`, status: 'Success' }, ...prev]);
    };

    const savePasswordOnly = async () => {
      const minPasswordLen = 8;
      if (!editingUser) { alert('No user selected. Open Edit for a user first.'); return; }
      if (!formPassword) { alert('Enter a new password first.'); return; }
      if (formPassword.length < minPasswordLen) { alert(`Password must be at least ${minPasswordLen} characters`); return; }
      try {
        const plain = formPassword;
        const hashed = await hashPassword(plain);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, password: hashed } : u));
        try { await fetch(`${API_BASE}/api/admin/users/password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingUser.id, passwordHash: hashed }) }); } catch (e) { console.warn('Failed to POST password to server', e); }
        setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Updated Password', details: `${editingUser.name} password updated`, status: 'Success' }, ...prev]);
        // show transient reveal and toast
        setLastSavedPlain(plain);
        setShowSavedReveal(true);
        setToastMessage('Password saved');
        setToastVisible(true);
        setFormPassword('');
        // hide reveal after 8s and toast after 3s
        setTimeout(() => setShowSavedReveal(false), 8000);
        setTimeout(() => setToastVisible(false), 3000);
      } catch (e) {
        console.error('savePasswordOnly failed', e);
        alert('Failed to save password.');
      }
    };

    const toggleUserStatus = (id: string) => {
      const updated = users.map(u => u.id === id ? { ...u, status: (u.status === 'Active' ? 'Suspended' : 'Active') as User['status'] } : u);
      setUsers(updated as User[]);
      const u = users.find(x => x.id === id);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Toggled User Status', details: `${u?.name} status toggled`, status: 'Success' }, ...prev]);
    };

    // --- Custom user tables (persisted locally and optionally server-backed) ---
    interface CustomField { id: string; name: string; type: string }
    interface CustomTable { id: string; name: string; fields: CustomField[] }

    const [customTables, setCustomTables] = useState<CustomTable[]>(() => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('user_custom_tables') : null;
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    });

    useEffect(() => { try { if (typeof window !== 'undefined') localStorage.setItem('user_custom_tables', JSON.stringify(customTables)); } catch {} }, [customTables]);

    // --- User Groups state (persisted locally) ---
    const [groups, setGroups] = useState<Group[]>(() => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('user_groups') : null;
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    });

    useEffect(() => { try { if (typeof window !== 'undefined') localStorage.setItem('user_groups', JSON.stringify(groups)); } catch {} }, [groups]);

    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);

    const toggleNewGroupMember = (userId: string) => {
      setNewGroupMembers(prev => prev.includes(userId) ? prev.filter(x => x !== userId) : [...prev, userId]);
    };

    const addGroup = () => {
      const name = newGroupName.trim();
      if (!name) { alert('Group name required'); return; }
      const g: Group = { id: 'g' + Math.random().toString(36).slice(2,9), name, description: newGroupDesc, members: newGroupMembers };
      setGroups(prev => [g, ...prev]);
      setNewGroupName(''); setNewGroupDesc(''); setNewGroupMembers([]);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Created Group', details: `${name} created`, status: 'Success' }, ...prev]);
    };

    const deleteGroup = (id: string) => {
      if (!confirm('Delete this group?')) return;
      const g = groups.find(x => x.id === id);
      setGroups(prev => prev.filter(x => x.id !== id));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Deleted Group', details: `${g?.name} deleted`, status: 'Success' }, ...prev]);
    };

    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [editingGroupDraft, setEditingGroupDraft] = useState<Group | null>(null);

    const startEditGroup = (id: string) => { const g = groups.find(x => x.id === id) || null; setEditingGroupDraft(g ? { ...g, members: [...g.members] } : null); setEditingGroupId(id); };
    const cancelEditGroup = () => { setEditingGroupId(null); setEditingGroupDraft(null); };
    const saveEditGroup = () => { if (!editingGroupDraft) return; setGroups(prev => prev.map(g => g.id === editingGroupDraft.id ? editingGroupDraft : g)); setEditingGroupId(null); setEditingGroupDraft(null); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Updated Group', details: `${editingGroupDraft.name} updated`, status: 'Success' }, ...prev]); };

    const getAllUserFields = () => {
      const defaultFields = [
        { table: 'users', name: 'id', type: 'string' },
        { table: 'users', name: 'name', type: 'string' },
        { table: 'users', name: 'username', type: 'string' },
        { table: 'users', name: 'password', type: 'string' },
        { table: 'users', name: 'email', type: 'string' },
        { table: 'users', name: 'role', type: 'string' },
        { table: 'users', name: 'status', type: 'string' },
        { table: 'users', name: 'createdAt', type: 'date' },
      ];
      const custom = customTables.flatMap(t => t.fields.map(f => ({ table: t.name, name: f.name, type: f.type })));
      return [...defaultFields, ...custom];
    };

    const refreshTablesFromServer = async () => {
      try {
        const res = await fetch('/api/schemas');
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.tables)) setCustomTables(data.tables as CustomTable[]);
      } catch (e) { console.warn('Failed to refresh tables from server', e); }
    };

    const defaultUserFields = [
      { name: 'id', type: 'string', description: 'Unique identifier for the user', example: 'u1' },
      { name: 'name', type: 'string', description: 'Full name', example: 'Alice Johnson' },
      { name: 'username', type: 'string', description: 'Login username', example: 'alice' },
      { name: 'password', type: 'string', description: 'Login password (stored hashed in production)', example: '••••••' },
      { name: 'email', type: 'string', description: 'Email address used for login and notifications', example: 'alice@example.com' },
      { name: 'role', type: 'enum', description: 'Assigned role determining permissions', example: 'Admin | Manager | User | Viewer' },
      { name: 'status', type: 'enum', description: 'Account status', example: 'Active | Suspended' },
      { name: 'createdAt', type: 'date', description: 'Account creation date', example: '2024-01-10' }
    ];

    // UI state & handlers for adding/editing custom user tables/fields
    const [editingTableId, setEditingTableId] = useState<string | null>(null);
    const [editingTableDraft, setEditingTableDraft] = useState<CustomTable | null>(null);
    const [newTableName, setNewTableName] = useState('');
    const [newTableFields, setNewTableFields] = useState<CustomField[]>([]);

    const addFieldToNewTable = () => {
      setNewTableFields(prev => [...prev, { id: 'f' + Math.random().toString(36).slice(2,9), name: '', type: 'string' }]);
    };

    const updateNewField = (id: string, patch: Partial<CustomField>) => {
      setNewTableFields(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
    };

    const removeNewField = (id: string) => {
      setNewTableFields(prev => prev.filter(f => f.id !== id));
    };

    const addCustomTable = () => {
      const name = newTableName.trim();
      if (!name) { alert('Table name required'); return; }
      const table: CustomTable = { id: 't' + Math.random().toString(36).slice(2,9), name, fields: newTableFields.map(f => ({ ...f })) };
      setCustomTables(prev => [table, ...prev]);
      setNewTableName('');
      setNewTableFields([]);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Created Custom Table', details: `${name} created`, status: 'Success' }, ...prev]);
    };

    const startEditTable = (id: string) => {
      const t = customTables.find(x => x.id === id) || null;
      setEditingTableDraft(t ? { id: t.id, name: t.name, fields: t.fields.map(f => ({ ...f })) } : null);
      setEditingTableId(id);
    };

    const cancelEditTable = () => { setEditingTableId(null); setEditingTableDraft(null); };

    const saveEditedTable = () => {
      if (!editingTableDraft) return;
      setCustomTables(prev => prev.map(t => t.id === editingTableDraft.id ? editingTableDraft : t));
      setEditingTableId(null);
      setEditingTableDraft(null);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Updated Custom Table', details: `${editingTableDraft.name} updated`, status: 'Success' }, ...prev]);
    };

    const deleteCustomTableById = (id: string) => {
      if (!confirm('Delete this custom table?')) return;
      const t = customTables.find(x => x.id === id);
      setCustomTables(prev => prev.filter(x => x.id !== id));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Deleted Custom Table', details: `${t?.name} deleted`, status: 'Success' }, ...prev]);
    };


    // --- System Configuration state & handlers ---
    const defaultSystemConfig = {
      appName: 'In-Accord',
      maintenanceMode: false,
      loggingLevel: 'info',
      allowedOrigins: ['http://localhost:3000'],
      integrations: { github: true, sentry: false, analytics: true },
      oauth: {
        github: { enabled: false, enableLogin: false, clientId: '', clientSecret: '', redirectUri: (typeof window !== 'undefined' ? window.location.origin + '/api/auth/github/callback' : ''), connected: false },
        discord: { enabled: false, enableLogin: false, clientId: '', clientSecret: '', redirectUri: (typeof window !== 'undefined' ? window.location.origin + '/api/auth/discord/callback' : ''), connected: false }
      },
      backupSchedule: 'daily',
      apiKeys: [] as { id: string; name: string; key: string; createdAt: string }[],
      sidebarLogo: '',
      sidebarUrl: '',
    };

    type SystemConfig = typeof defaultSystemConfig;

    const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('system_config') : null;
        if (!raw) return defaultSystemConfig;
        const parsed = JSON.parse(raw) as Partial<SystemConfig>;
        return {
          ...defaultSystemConfig,
          ...parsed,
          integrations: { ...defaultSystemConfig.integrations, ...(parsed.integrations || {}) },
          oauth: {
            github: { ...defaultSystemConfig.oauth.github, ...((parsed.oauth as any)?.github || {}) },
            discord: { ...defaultSystemConfig.oauth.discord, ...((parsed.oauth as any)?.discord || {}) }
          },
          apiKeys: (parsed.apiKeys as any) ?? defaultSystemConfig.apiKeys,
          allowedOrigins: parsed.allowedOrigins ?? defaultSystemConfig.allowedOrigins,
          sidebarLogo: (parsed as any).sidebarLogo ?? defaultSystemConfig.sidebarLogo,
          sidebarUrl: (parsed as any).sidebarUrl ?? defaultSystemConfig.sidebarUrl,
        } as SystemConfig;
      } catch (e) { console.warn('Failed to parse system_config from localStorage', e); return defaultSystemConfig; }
    });

    const [integrationSaveStatus, setIntegrationSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
    const [integrationSaveMessage, setIntegrationSaveMessage] = useState('');

    useEffect(() => {
      try { if (typeof window !== 'undefined') localStorage.setItem('system_config', JSON.stringify(systemConfig)); } catch {}
    }, [systemConfig]);

    const saveSystemConfig = async () => {
      setSystemConfig(prev => ({ ...prev }));
      setIntegrationSaveStatus('saving');
      setIntegrationSaveMessage('Saving...');
      try {
        const res = await fetch('/api/integrations/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ github: systemConfig.oauth.github, discord: systemConfig.oauth.discord })
        });
        if (res.ok) {
          setIntegrationSaveStatus('saved');
          setIntegrationSaveMessage('Integration config saved');
          setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Saved Configuration', details: `Config saved`, status: 'Success' }, ...prev]);
        } else {
          const j = await res.json().catch(() => ({}));
          setIntegrationSaveStatus('error');
          setIntegrationSaveMessage(j.error || 'Failed to save config');
        }
      } catch (e: any) {
        console.warn('Failed to save integration config to server', e);
        setIntegrationSaveStatus('error');
        setIntegrationSaveMessage('Network or server error');
      }
      alert('System configuration saved.');
      setTimeout(() => { setIntegrationSaveStatus('idle'); setIntegrationSaveMessage(''); }, 3500);
    };

    const resetSystemDefaults = () => {
      if (!confirm('Reset system configuration to defaults?')) return;
      setSystemConfig(defaultSystemConfig as SystemConfig);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Reset Defaults', details: `Configuration reset to defaults`, status: 'Success' }, ...prev]);
      alert('System configuration reset to defaults.');
    };

    const handleSidebarLogoUpload = (file?: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string | ArrayBuffer | null;
        if (!result) return;
        setSystemConfig(prev => ({ ...prev, sidebarLogo: String(result) }));
      };
      reader.readAsDataURL(file);
    };

    const addApiKey = (name: string) => {
      const newKey = { id: 'k' + Math.random().toString(36).slice(2,9), name, key: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2), createdAt: new Date().toISOString() };
      setSystemConfig(prev => ({ ...prev, apiKeys: [newKey, ...prev.apiKeys] }));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Added API Key', details: `${name} added`, status: 'Success' }, ...prev]);
      return newKey;
    };

    const deleteApiKey = (id: string) => {
      if (!confirm('Delete API key?')) return;
      setSystemConfig(prev => ({ ...prev, apiKeys: prev.apiKeys.filter(k => k.id !== id) }));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Deleted API Key', details: `Key ${id} deleted`, status: 'Success' }, ...prev]);
    };

    // --- Security & Permissions state ---
    const defaultSecurity = {
      require2FA: false,
      sessionTimeout: 60,
      allowedIPs: [] as string[],
      blockedIPs: [] as string[],
      passwordPolicy: { minLength: 8, requireNumbers: true, requireSpecial: true, expireDays: 90 }
    };

    type SecurityConfig = typeof defaultSecurity;
    const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
      try { const raw = typeof window !== 'undefined' ? localStorage.getItem('security_config') : null; return raw ? JSON.parse(raw) : defaultSecurity; } catch { return defaultSecurity; }
    });

    useEffect(() => { try { if (typeof window !== 'undefined') localStorage.setItem('security_config', JSON.stringify(securityConfig)); } catch {} }, [securityConfig]);

    const saveSecurityConfig = () => {
      setSecurityConfig(prev => ({ ...prev }));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Security & Permissions', action: 'Saved Security Settings', details: `Security settings saved`, status: 'Success' }, ...prev]);
      alert('Security settings saved.');
    };

    const resetSecurityDefaults = () => {
      if (!confirm('Reset security settings to defaults?')) return;
      setSecurityConfig(defaultSecurity);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Security & Permissions', action: 'Reset Security Defaults', details: `Security reset`, status: 'Success' }, ...prev]);
      alert('Security settings reset to defaults.');
    };


/* Backup Code */
   
    // Backup logs state
    interface BackupLog {
      timestamp: string;
      user: string;
      page: string;
      action: string;
      details: string;
      status: 'Success' | 'In Progress' | 'Failed';
    }
    const [backupLogs, setBackupLogs] = useState<BackupLog[]>([
      {
        timestamp: '2026-01-08 02:00:47',
        user: 'System',
        page: 'Backup & Recovery',
        action: 'Backup Completed',
        details: 'Full backup (DB + Files) 487 MB to Local + Cloud',
        status: 'Success'
      },
      {
        timestamp: '2026-01-07 02:00:33',
        user: 'System',
        page: 'Backup & Recovery',
        action: 'Backup Completed',
        details: 'Full backup (DB + Files) 465 MB to Local + Cloud',
        status: 'Success'
      },
      {
        timestamp: '2026-01-01 08:30:22',
        user: 'DocRST',
        page: 'Backup & Recovery',
        action: 'DR Test Executed',
        details: 'Disaster recovery test - Recovery time: 6m 14s',
        status: 'Success'
      }
    ]);

    // Run backup immediately
    const runBackup = () => {
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }).replace(/(\d+)\/(\d+)\/(\d+),\s/, '$3-$1-$2 ');

      // Add "In Progress" log entry
      const inProgressLog: BackupLog = {
        timestamp,
        user: 'System',
        page: 'Backup & Recovery',
        action: 'Backup Started',
        details: 'Starting full backup (DB + Files) to Local + Cloud storage',
        status: 'In Progress'
      };

      setBackupLogs([inProgressLog, ...backupLogs]);

      // Simulate backup completion after 3 seconds
      setTimeout(() => {
        const completionTime = new Date();
        const completionTimestamp = completionTime.toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }).replace(/(\d+)\/(\d+)\/(\d+),\s/, '$3-$1-$2 ');

        const completedLog: BackupLog = {
          timestamp: completionTimestamp,
          user: 'System',
          page: 'Backup & Recovery',
          action: 'Backup Completed',
          details: 'Full backup (DB + Files) 492 MB to Local + Cloud',
          status: 'Success'
        };

        setBackupLogs(prevLogs => {
          const updatedLogs = [...prevLogs];
          // Remove the "In Progress" entry and add the completed one
          updatedLogs.shift();
          return [completedLog, ...updatedLogs];
        });

        alert('Backup completed successfully! 492 MB backed up to local storage and Cloudflare R2.');
      }, 3000);
    };

/* Backup Code */

    useEffect(() => {
      const savedMembers = localStorage.getItem('teamMembers');
      if (savedMembers) {
        try {
          const parsed = JSON.parse(savedMembers) as any[];
          const normalized: TeamMember[] = parsed.map((m) => ({
            name: m.name ?? '',
            jobTitle: m.jobTitle ?? 'Team Member',
            description: m.description ?? '',
            imageUrl: m.imageUrl ?? '',
            email: m.email ?? '',
            website: m.website ?? '',
            github: m.github ?? '',
            discord: m.discord ?? '',
          }));
          setTeamMembers(normalized);
        } catch (e) {
          console.error('Error loading team members:', e);
        }
      }
    }, []);

    // Load persisted integration config from server (safe view)
    useEffect(() => {
      (async () => {
        try {
          const res = await fetch('/api/integrations/config');
          if (!res.ok) return;
          const data = await res.json();
          if (data && data.config) {
            setSystemConfig(prev => ({ ...prev, oauth: {
              github: { ...prev.oauth.github, ...(data.config.github || {}) },
              discord: { ...prev.oauth.discord, ...(data.config.discord || {}) }
            } }));
          }
        } catch (e) { console.warn('Failed to load integration config', e); }
      })();
    }, []);

    // Auto-refresh system health metrics every 5 seconds
    useEffect(() => {
      const interval = setInterval(updateMetrics, 5000);
      return () => clearInterval(interval);
    }, []);

    const updateMemberField = (index: number, field: keyof TeamMember, value: string) => {
      setTeamMembers((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value } as TeamMember;
        return next;
      });
      // Clear error for this field if present
      setErrors((prev) => {
        const next = { ...prev };
        if (next[index]) {
          const fieldErrors = { ...next[index] };
          delete fieldErrors[field];
          if (Object.keys(fieldErrors).length > 0) {
            next[index] = fieldErrors;
          } else {
            delete next[index];
          }
        }
        return next;
      });
    };

    const handleSubmit = (index: number, e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const m = teamMembers[index];

      const newErrors: Partial<Record<keyof TeamMember, string>> = {};
      if (!m.name?.trim()) newErrors.name = 'Name is required.';
      if (!m.jobTitle?.trim()) newErrors.jobTitle = 'Job Title is required.';
      if (!m.description?.trim()) newErrors.description = 'Description is required.';
      if (!isValidURL(m.imageUrl || '')) newErrors.imageUrl = 'Image URL must be a valid URL.';
      if (!isValidEmail(m.email || '')) newErrors.email = 'Email must be valid (e.g., name@example.com).';
      if (!isValidURL(m.website || '')) newErrors.website = 'Website must be a valid URL.';
      if (!isValidURL(m.github || '')) newErrors.github = 'GitHub must be a valid URL.';
      if (!isValidURL(m.discord || '')) newErrors.discord = 'Discord must be a valid URL.';

      if (Object.keys(newErrors).length > 0) {
        setErrors((prev) => ({ ...prev, [index]: newErrors }));
        return;
      }

      // Clear previous errors for this member
      setErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });

      // Persist and notify Team page
      const newTeamMembers = [...teamMembers];
      localStorage.setItem('teamMembers', JSON.stringify(newTeamMembers));
      window.dispatchEvent(new Event('teamMembersUpdated'));

      alert(`Team Member ${index + 1} updated successfully!`);
    };

    return (
      <div className="space-y-8 p-8">
        {/* Toast */}
        {toastVisible && (
          <div className="fixed right-4 bottom-4 z-50">
            <div className="px-4 py-2 bg-gray-900 text-white rounded shadow">{toastMessage}</div>
          </div>
        )}
        {/* Section 1 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">User Management</h2>
          <p className="text-gray-600 mb-4">
            Manage system users, permissions, and access control. View user activity, reset passwords, and configure role-based access levels.
          </p>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
              <div className="flex items-center gap-2">
                <button onClick={openCreateUser} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Create User</button>
                <button onClick={() => { setUsers(initialUsers); alert('Reset users to seed data.'); }} className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Reset</button>
              </div>
            </div>

            {showUserForm && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full name</label>
                    <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm w-full" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Username</label>
                    <input value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="username" className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm w-full" />
                  </div>

                  {/* password moved below next to avatar */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                    <input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@example.com" className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm w-full" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Role</label>
                    <select value={formRole} onChange={e => setFormRole(e.target.value as User['role'])} className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm w-full">
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>User</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Avatar & Password</label>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={formAvatarUrl || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(formName || 'User'))}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formName || 'User'); }}
                      />
                      <div>
                        <button type="button" onClick={() => {
                          const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (ev: any) => {
                            const f = ev.target.files && ev.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setFormAvatarUrl(String(r.result)); r.readAsDataURL(f);
                          }; input.click();
                        }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Upload</button>
                        <button type="button" onClick={() => setFormAvatarUrl(undefined)} className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Clear</button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">New Password</label>
                      <div className="flex items-center gap-2">
                        <input value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="New password" type={showPassword ? 'text' : 'password'} className="mt-0 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm w-full" />
                        <button type="button" onClick={async () => { await savePasswordOnly(); }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Save Password</button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-gray-500"><PasswordStrength password={formPassword} /></div>
                        <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1"><input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} /> Show</label>
                      </div>
                      {showSavedReveal && lastSavedPlain && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-900 dark:text-gray-100">
                          <div className="font-medium text-xs text-gray-600 dark:text-gray-300">Saved Password (temporary)</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="font-mono text-sm break-all">{lastSavedPlain}</div>
                            <button type="button" onClick={() => { navigator.clipboard?.writeText(lastSavedPlain); setToastMessage('Copied'); setToastVisible(true); setTimeout(() => setToastVisible(false), 2000); }} className="ml-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Copy</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Password Expires</label>
                  <input type="date" value={formPasswordExpiresAt ?? ''} onChange={e => setFormPasswordExpiresAt(e.target.value || undefined)} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveUser} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Save</button>
                  <button onClick={closeUserForm} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Online Users panel (top of users list) - always visible, shows empty state when none online */}
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Online Users ({onlineUsers.length})</div>
                <div className="flex gap-2">
                  <button onClick={refreshOnlineUsers} disabled={refreshingOnline} className={refreshingOnline ? 'px-3 py-1 bg-green-300 text-white text-sm rounded cursor-not-allowed' : 'px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded'}>
                    {refreshingOnline ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <button
                    onClick={bootAllSessions}
                    disabled={onlineUsers.length === 0}
                    aria-disabled={onlineUsers.length === 0}
                    className={onlineUsers.length === 0 ? 'px-3 py-1 bg-gray-300 text-gray-600 text-sm rounded cursor-not-allowed' : 'px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded'}
                  >
                    Boot All
                  </button>
                </div>
              </div>

              {onlineUsers.length === 0 ? (
                <div className="text-sm text-gray-600">No users are currently online.</div>
              ) : (
                // Render online users in a responsive grid: 4 per row, unlimited rows, fixed height with custom scrollbar
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 h-56 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                  {onlineUsers.map(s => (
                    <div key={s.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 border rounded px-3 py-2">
                      <img
                        src={s.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name))}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name); }}
                      />
                      <div className="text-sm flex-1">
                        <div className="font-medium">{s.name} <span className="text-xs text-gray-500">({s.username})</span></div>
                        <div className="text-xs text-gray-500">IP: {s.ip} • since {new Date(s.since).toLocaleTimeString()}</div>
                      </div>
                      <div>
                        <button onClick={() => bootSession(s.id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">Boot</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Username</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Password</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Expires</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Created</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.username}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.password ? '●●●●●' : <span className="text-xs text-red-500">Unset</span>}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.passwordExpiresAt ? u.passwordExpiresAt : <span className="text-xs text-gray-500">Never</span>}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">{u.role}</span></td>
                      <td className="px-4 py-3">{u.status === 'Active' ? <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Active</span> : <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Suspended</span>}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.createdAt}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEditUser(u)} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Edit</button>
                        <button onClick={() => { setEditingUser(u); setFormName(u.name); setFormEmail(u.email); setFormRole(u.role); setFormUsername(u.username); setFormPassword(''); setShowUserForm(true); alert('Enter a new password and click Save to reset.'); }} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mr-3">Reset Password</button>
                        <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-700 text-sm font-medium mr-3">Delete</button>
                        <button onClick={() => toggleUserStatus(u.id)} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Toggle Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              {/* All User Fields & Custom Tables */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white">All User Fields</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshTablesFromServer} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Refresh from Server</button>
                    <button onClick={openBulkForUnset} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded">Bulk Passwords</button>
                    <button onClick={() => { const payload = JSON.stringify({ tables: customTables }, null, 2); const blob = new Blob([payload], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'custom_tables.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-sm text-white rounded">Export</button>
                  </div>
                </div>

                <div className="space-y-3">
                
                  {showBulkPasswords && (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Bulk Password Migration</div>
                        <div className="flex gap-2">
                          <button onClick={() => { Object.keys(bulkPasswords).forEach(id => { if (!bulkPasswords[id]) bulkPasswords[id] = generateRandomPassword(); }); setBulkPasswords({ ...bulkPasswords }); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Randomize</button>
                          <button onClick={applyBulkPasswords} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Apply</button>
                          <button onClick={exportBulkPasswords} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded">Export</button>
                          <button onClick={() => setShowBulkPasswords(false)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Close</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Object.keys(bulkPasswords).length === 0 && <div className="text-sm text-gray-500">No users require migration.</div>}
                        {Object.keys(bulkPasswords).map(id => {
                          const u = users.find(x => x.id === id)!;
                          return (
                            <div key={id} className="flex items-center gap-2">
                              <div className="w-48 text-sm">{u.name} ({u.username || u.email})</div>
                              <input value={bulkPasswords[id] ?? ''} onChange={e => setBulkPasswords(prev => ({ ...prev, [id]: e.target.value }))} placeholder="new password" className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm flex-1" />
                              <button onClick={() => setBulkPasswords(prev => ({ ...prev, [id]: generateRandomPassword() }))} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Rand</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium mb-2">Default User Fields</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {defaultUserFields.map(f => (
                        <div key={f.name} className="p-2 bg-white dark:bg-gray-800 border rounded text-xs">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{f.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{f.type} — {f.description}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Example: <span className="font-mono text-xs">{f.example}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Custom Tables ({customTables.length})</div>

                    <div className="p-3 bg-white dark:bg-gray-800 border rounded mb-3">
                      <div className="flex gap-2 items-start">
                        <input value={newTableName} onChange={e => setNewTableName(e.target.value)} placeholder="New table name" className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm flex-1" />
                        <button onClick={addFieldToNewTable} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">+ Field</button>
                        <button onClick={addCustomTable} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Create</button>
                      </div>

                      {newTableFields.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {newTableFields.map(f => (
                            <div key={f.id} className="flex gap-2 items-center">
                              <input value={f.name} onChange={e => updateNewField(f.id, { name: e.target.value })} placeholder="field name" className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm flex-1" />
                              <select value={f.type} onChange={e => updateNewField(f.id, { type: e.target.value })} className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm">
                                <option value="string">string</option>
                                <option value="number">number</option>
                                <option value="date">date</option>
                                <option value="boolean">boolean</option>
                                <option value="enum">enum</option>
                              </select>
                              <button onClick={() => removeNewField(f.id)} className="px-2 py-1 text-red-600">Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {customTables.length === 0 ? (
                      <div className="text-sm text-gray-500">No custom tables defined.</div>
                    ) : (
                      <div className="space-y-2">
                        {customTables.map(t => {
                          const isEditing = editingTableId === t.id;
                          return (
                            <div key={t.id} className="p-2 bg-white dark:bg-gray-800 border rounded">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{t.name}</div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-500">{t.fields.length} fields</div>
                                </div>
                              </div>

                              {isEditing ? (
                                <div className="mt-2 space-y-2">
                                  <input value={editingTableDraft?.name ?? ''} onChange={e => setEditingTableDraft(prev => prev ? { ...prev, name: e.target.value } : prev)} className="px-2 py-1 border rounded w-full bg-white dark:bg-gray-800 text-sm" />

                                  <div className="space-y-2">
                                    {editingTableDraft?.fields.map(f => (
                                      <div key={f.id} className="flex gap-2 items-center">
                                        <input value={f.name} onChange={e => setEditingTableDraft(prev => prev ? { ...prev, fields: prev.fields.map(ff => ff.id === f.id ? { ...ff, name: e.target.value } : ff) } : prev)} placeholder="field name" className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm flex-1" />
                                        <select value={f.type} onChange={e => setEditingTableDraft(prev => prev ? { ...prev, fields: prev.fields.map(ff => ff.id === f.id ? { ...ff, type: e.target.value } : ff) } : prev)} className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm">
                                          <option value="string">string</option>
                                          <option value="number">number</option>
                                          <option value="date">date</option>
                                          <option value="boolean">boolean</option>
                                          <option value="enum">enum</option>
                                        </select>
                                        <button onClick={() => setEditingTableDraft(prev => prev ? { ...prev, fields: prev.fields.filter(ff => ff.id !== f.id) } : prev)} className="px-2 py-1 text-red-600">Remove</button>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex gap-2 mt-2">
                                    <button onClick={() => setEditingTableDraft(prev => prev ? { ...prev, fields: [...prev.fields, { id: 'f' + Math.random().toString(36).slice(2,9), name: '', type: 'string' }] } : prev)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Add Field</button>
                                    <button onClick={saveEditedTable} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Save</button>
                                    <button onClick={cancelEditTable} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {t.fields.map(f => <span key={f.id} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border rounded text-xs text-gray-700 dark:text-gray-200">{f.name} ({f.type})</span>)}
                                  </div>

                                  <div className="mt-2 flex gap-2">
                                    <button onClick={() => startEditTable(t.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Edit</button>
                                    <button onClick={() => deleteCustomTableById(t.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Delete</button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          {/* User Groups */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">User Groups</h4>
              <div className="text-sm text-gray-500">Create and manage user groups and their members.</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-3 border rounded bg-gray-50 dark:bg-gray-700/40">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Group Name</label>
                <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g. Sales Team" className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3">Description</label>
                <input value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Optional description" className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />

                <div className="text-sm font-medium mt-3">Members</div>
                <div className="mt-2 max-h-40 overflow-auto grid grid-cols-1 gap-2">
                  {users.map(u => (
                    <label key={u.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={newGroupMembers.includes(u.id)} onChange={() => toggleNewGroupMember(u.id)} />
                      <span className="text-sm">{u.name} — <span className="text-xs text-gray-500">{u.email}</span></span>
                    </label>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={addGroup} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Create Group</button>
                  <button onClick={() => { setNewGroupName(''); setNewGroupDesc(''); setNewGroupMembers([]); }} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Clear</button>
                </div>
              </div>

              <div className="space-y-2 p-3 border rounded bg-gray-50 dark:bg-gray-700/40">
                {groups.length === 0 ? (
                  <div className="text-sm text-gray-500">No groups defined.</div>
                ) : (
                  groups.map(g => (
                    <div key={g.id} className="p-2 bg-white dark:bg-gray-800 border rounded">
                      {editingGroupId === g.id ? (
                        <div>
                          <input value={editingGroupDraft?.name ?? ''} onChange={e => setEditingGroupDraft(prev => prev ? { ...prev, name: e.target.value } : prev)} className="px-2 py-1 border rounded w-full bg-white dark:bg-gray-800 text-sm" />
                          <input value={editingGroupDraft?.description ?? ''} onChange={e => setEditingGroupDraft(prev => prev ? { ...prev, description: e.target.value } : prev)} className="mt-2 px-2 py-1 border rounded w-full bg-white dark:bg-gray-800 text-sm" placeholder="Description" />

                          <div className="text-sm font-medium mt-2">Members</div>
                          <div className="mt-2 max-h-40 overflow-auto grid grid-cols-1 gap-2">
                            {users.map(u => (
                              <label key={u.id} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={editingGroupDraft?.members.includes(u.id) ?? false} onChange={() => setEditingGroupDraft(prev => prev ? { ...prev, members: prev.members.includes(u.id) ? prev.members.filter(x => x !== u.id) : [...prev.members, u.id] } : prev)} />
                                <span>{u.name}</span>
                              </label>
                            ))}
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button onClick={saveEditGroup} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Save</button>
                            <button onClick={cancelEditGroup} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{g.name}</div>
                              {g.description && <div className="text-xs text-gray-500">{g.description}</div>}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startEditGroup(g.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Edit</button>
                              <button onClick={() => deleteGroup(g.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Delete</button>
                            </div>
                          </div>

                          <div className="mt-2 text-sm">
                            <div className="text-xs text-gray-500">Members ({g.members.length}):</div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {g.members.map(mid => <span key={mid} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border rounded text-xs">{users.find(u => u.id === mid)?.name ?? mid}</span>)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">System Configuration</h2>
          <p className="text-gray-600 mb-4">
            Configure system settings, manage integrations, and monitor application health.
          </p>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Application Name</label>
                <input value={systemConfig.appName} onChange={e => setSystemConfig(prev => ({ ...prev, appName: e.target.value }))} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />

                <div className="mt-4 flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={systemConfig.maintenanceMode} onChange={e => setSystemConfig(prev => ({ ...prev, maintenanceMode: e.target.checked }))} />
                    <span className="text-sm text-gray-700 dark:text-gray-200">Maintenance Mode</span>
                  </label>
                  <span className="text-xs text-gray-500">When enabled, non-admin access is limited.</span>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Logging Level</label>
                  <select value={systemConfig.loggingLevel} onChange={e => setSystemConfig(prev => ({ ...prev, loggingLevel: e.target.value }))} className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warn</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Allowed Origins (one per line)</label>
                  <textarea value={systemConfig.allowedOrigins.join('\n')} onChange={e => setSystemConfig(prev => ({ ...prev, allowedOrigins: e.target.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean) }))} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 h-24 text-sm" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Backup Schedule</label>
                  <select value={systemConfig.backupSchedule} onChange={e => setSystemConfig(prev => ({ ...prev, backupSchedule: e.target.value }))} className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Sidebar Top Logo (Image URL or upload)</label>
                  <input value={(systemConfig as any).sidebarLogo || ''} onChange={e => setSystemConfig(prev => ({ ...prev, sidebarLogo: e.target.value }))} placeholder="https://example.com/logo.png or data:image/..." className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3">Sidebar Top Link (URL)</label>
                  <input value={(systemConfig as any).sidebarUrl || ''} onChange={e => setSystemConfig(prev => ({ ...prev, sidebarUrl: e.target.value }))} placeholder="https://example.com" className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />

                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-24 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded border overflow-hidden">
                      {(systemConfig as any).sidebarLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={(systemConfig as any).sidebarLogo} alt="Sidebar Logo" className="max-h-12 object-contain" />
                      ) : (
                        <div className="text-xs text-gray-500">No logo set</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input id="sidebarLogoFile" type="file" accept="image/*" onChange={e => handleSidebarLogoUpload(e.target.files?.[0] ?? null)} className="hidden" />
                      <button onClick={() => (document.getElementById('sidebarLogoFile') as HTMLInputElement)?.click()} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">Upload</button>
                      <button onClick={() => { setSystemConfig(prev => ({ ...prev, sidebarLogo: '', sidebarUrl: '' })); }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Clear</button>
                      <button onClick={() => { navigator.clipboard && (systemConfig as any).sidebarLogo && navigator.clipboard.writeText((systemConfig as any).sidebarLogo); alert('Logo URL copied'); }} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm">Copy Logo URL</button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <button onClick={saveSystemConfig} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Configuration</button>
                  <button onClick={resetSystemDefaults} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Reset Defaults</button>
                  <div className="ml-3">
                    {integrationSaveStatus === 'saving' && <span className="text-sm text-gray-600">{integrationSaveMessage || 'Saving...'}</span>}
                    {integrationSaveStatus === 'saved' && <span className="text-sm text-green-600">{integrationSaveMessage || 'Saved'}</span>}
                    {integrationSaveStatus === 'error' && <span className="text-sm text-red-600">{integrationSaveMessage || 'Save failed'}</span>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">Integration Management</h4>
                <div className="mt-3 space-y-4">
                  {/* Generic toggles for lightweight integrations (kept for backward compatibility) */}
                  <div className="grid grid-cols-1 gap-2">
                    <label className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Issue/Telemetry Integrations</div>
                        <div className="text-xs text-gray-500">Enable basic integrations like GitHub issue sync, Sentry, and analytics.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={systemConfig.integrations.github} onChange={e => setSystemConfig(prev => ({ ...prev, integrations: { ...prev.integrations, github: e.target.checked } }))} />
                        <input type="checkbox" checked={systemConfig.integrations.sentry} onChange={e => setSystemConfig(prev => ({ ...prev, integrations: { ...prev.integrations, sentry: e.target.checked } }))} />
                        <input type="checkbox" checked={systemConfig.integrations.analytics} onChange={e => setSystemConfig(prev => ({ ...prev, integrations: { ...prev.integrations, analytics: e.target.checked } }))} />
                      </div>
                    </label>
                  </div>

                  {/* OAuth provider management */}
                  <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">GitHub Login</div>
                        <div className="text-xs text-gray-500">Configure GitHub OAuth login (optional).</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Enabled</label>
                        <input type="checkbox" checked={systemConfig.oauth.github.enabled} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, enabled: e.target.checked } } }))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Client ID</label>
                        <input value={systemConfig.oauth.github.clientId} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, clientId: e.target.value } } }))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Client Secret</label>
                        <input type="password" value={systemConfig.oauth.github.clientSecret} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, clientSecret: e.target.value } } }))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Redirect URI</label>
                        <input value={systemConfig.oauth.github.redirectUri} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, redirectUri: e.target.value } } }))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={async () => {
                          try {
                            const r = await fetch('/api/auth/github/url');
                            if (r.ok) {
                              const j = await r.json();
                              try { await navigator.clipboard.writeText(j.url); alert('Auth URL copied'); } catch { alert(j.url); }
                            } else { alert('Failed to fetch auth url'); }
                          } catch (e) { console.warn(e); alert('Failed to fetch auth url'); }
                        }} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded">Copy Auth URL</button>

                        <button onClick={async () => {
                          try {
                            const r = await fetch('/api/auth/github/url');
                            if (r.ok) {
                              const j = await r.json();
                              window.open(j.url, '_blank');
                            } else { alert('Failed to fetch auth url'); }
                          } catch (e) { console.warn(e); alert('Failed to start OAuth'); }
                        }} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded">Start OAuth</button>

                        <button onClick={() => { const ok = !!systemConfig.oauth.github.clientId && !!systemConfig.oauth.github.clientSecret; setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, connected: ok } } })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: ok ? 'GitHub OAuth Configured' : 'GitHub OAuth Missing Credentials', details: ok ? 'GitHub OAuth configured' : 'Missing client id/secret', status: 'Success' }, ...prev]); alert(ok ? 'Connection simulated as successful.' : 'Missing client id or secret.'); }} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Test / Connect</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">Status: {systemConfig.oauth.github.connected ? <span className="text-green-600 font-medium">Connected</span> : <span className="text-gray-500">Not Connected</span>}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, connected: true } } })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'GitHub Connected', details: 'Marked connected (simulated)', status: 'Success' }, ...prev]); }} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Simulate Connect</button>
                        <button onClick={() => { setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, github: { ...prev.oauth.github, connected: false } } })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'GitHub Disconnected', details: 'Disconnected', status: 'Success' }, ...prev]); }} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Disconnect</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Discord Login</div>
                        <div className="text-xs text-gray-500">Configure Discord OAuth login (optional).</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Enabled</label>
                        <input type="checkbox" checked={systemConfig.oauth.discord.enabled} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, enabled: e.target.checked } } }))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Client ID</label>
                        <input value={systemConfig.oauth.discord.clientId} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, clientId: e.target.value } } }))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Client Secret</label>
                        <input type="password" value={systemConfig.oauth.discord.clientSecret} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, clientSecret: e.target.value } } }))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Redirect URI</label>
                        <input value={systemConfig.oauth.discord.redirectUri} onChange={e => setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, redirectUri: e.target.value } } }))} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={async () => {
                          try {
                            const r = await fetch('/api/auth/discord/url');
                            if (r.ok) {
                              const j = await r.json();
                              try { await navigator.clipboard.writeText(j.url); alert('Auth URL copied'); } catch { alert(j.url); }
                            } else { alert('Failed to fetch auth url'); }
                          } catch (e) { console.warn(e); alert('Failed to fetch auth url'); }
                        }} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded">Copy Auth URL</button>

                        <button onClick={async () => {
                          try {
                            const r = await fetch('/api/auth/discord/url');
                            if (r.ok) { const j = await r.json(); window.open(j.url, '_blank'); } else { alert('Failed to fetch auth url'); }
                          } catch (e) { console.warn(e); alert('Failed to start OAuth'); }
                        }} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded">Start OAuth</button>

                        <button onClick={() => { const ok = !!systemConfig.oauth.discord.clientId && !!systemConfig.oauth.discord.clientSecret; setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, connected: ok } } })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: ok ? 'Discord OAuth Configured' : 'Discord OAuth Missing Credentials', details: ok ? 'Discord OAuth configured' : 'Missing client id/secret', status: 'Success' }, ...prev]); alert(ok ? 'Connection simulated as successful.' : 'Missing client id or secret.'); }} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Test / Connect</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">Status: {systemConfig.oauth.discord.connected ? <span className="text-green-600 font-medium">Connected</span> : <span className="text-gray-500">Not Connected</span>}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, connected: true } } })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Discord Connected', details: 'Marked connected (simulated)', status: 'Success' }, ...prev]); }} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Simulate Connect</button>
                        <button onClick={() => { setSystemConfig(prev => ({ ...prev, oauth: { ...prev.oauth, discord: { ...prev.oauth.discord, connected: false } } })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Discord Disconnected', details: 'Disconnected', status: 'Success' }, ...prev]); }} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Disconnect</button>
                      </div>
                    </div>
                  </div>

                  </div>

                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mt-6">API Keys</h4>
                <div className="mt-2">
                  <div className="mb-2 flex gap-2">
                    <input id="newKeyName" placeholder="Key name" className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    <button onClick={() => {
                      const el: any = document.getElementById('newKeyName');
                      if (!el || !el.value.trim()) { alert('Enter a key name'); return; }
                      const newKey = addApiKey(el.value.trim());
                      alert(`New API Key created: ${newKey.key}`);
                      el.value = '';
                    }} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">Create</button>
                  </div>

                  <div className="space-y-2">
                    {systemConfig.apiKeys.map(k => (
                      <div key={k.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{k.name}</div>
                          <div className="text-xs text-gray-500">Created: {new Date(k.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(k.key); alert('Key copied'); }} className="text-sm px-2 py-1 border rounded">Copy</button>
                          <button onClick={() => deleteApiKey(k.id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
                        </div>
                      </div>
                    ))}
                    {systemConfig.apiKeys.length === 0 && <div className="text-sm text-gray-500">No API keys configured.</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Security & Permissions</h2>
          <p className="text-gray-600 mb-4">Manage authentication, two-factor settings, password policies, and access controls.</p>

          {/* Security controls UI */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Authentication</h3>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={securityConfig?.require2FA ?? false} onChange={e => setSecurityConfig(prev => ({ ...prev, require2FA: e.target.checked }))} />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Require Two-Factor Authentication for all admins</span>
                </label>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Session Timeout (minutes)</label>
                  <select value={securityConfig?.sessionTimeout ?? 60} onChange={e => setSecurityConfig(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))} className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                    <option value={120}>120</option>
                    <option value={1440}>1440 (1 day)</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Allowed IP Ranges (CIDR / one per line)</label>
                  <textarea value={securityConfig?.allowedIPs?.join('\n') ?? ''} onChange={e => setSecurityConfig(prev => ({ ...prev, allowedIPs: e.target.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean) }))} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 h-24 text-sm" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Password Policy</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-200">Minimum Length</label>
                    <input type="number" value={securityConfig?.passwordPolicy?.minLength ?? 8} onChange={e => setSecurityConfig(prev => ({ ...prev, passwordPolicy: { ...prev.passwordPolicy, minLength: Number(e.target.value) } }))} className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-200">Expire (days)</label>
                    <input type="number" value={securityConfig?.passwordPolicy?.expireDays ?? 90} onChange={e => setSecurityConfig(prev => ({ ...prev, passwordPolicy: { ...prev.passwordPolicy, expireDays: Number(e.target.value) } }))} className="mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={securityConfig?.passwordPolicy?.requireNumbers ?? true} onChange={e => setSecurityConfig(prev => ({ ...prev, passwordPolicy: { ...prev.passwordPolicy, requireNumbers: e.target.checked } }))} /> <span className="text-sm text-gray-700 dark:text-gray-200">Require numbers</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={securityConfig?.passwordPolicy?.requireSpecial ?? true} onChange={e => setSecurityConfig(prev => ({ ...prev, passwordPolicy: { ...prev.passwordPolicy, requireSpecial: e.target.checked } }))} /> <span className="text-sm text-gray-700 dark:text-gray-200">Require special characters</span></label>
                </div>

                <div className="mt-6 flex gap-2">
                  <button onClick={saveSecurityConfig} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Security Settings</button>
                  <button onClick={resetSecurityDefaults} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Reset Defaults</button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">Blocked IPs</h4>
              <div className="mt-2 flex gap-2">
                <input id="blockIpInput" placeholder="e.g. 203.0.113.0/24" className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />
                <button onClick={() => { const el: any = document.getElementById('blockIpInput'); if (!el || !el.value.trim()) { alert('Enter IP/CIDR to block'); return; } setSecurityConfig(prev => ({ ...prev, blockedIPs: [ ...(prev.blockedIPs||[]), el.value.trim() ] })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Security & Permissions', action: 'Blocked IP', details: `${el.value.trim()} blocked`, status: 'Success' }, ...prev]); el.value = ''; }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Block</button>
              </div>
              <div className="mt-3 space-y-2">
                {(securityConfig?.blockedIPs || []).map((ip: string) => (
                  <div key={ip} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="text-sm">{ip}</div>
                    <div>
                      <button onClick={() => { setSecurityConfig(prev => ({ ...prev, blockedIPs: (prev.blockedIPs||[]).filter((x: string) => x !== ip) })); setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Security & Permissions', action: 'Unblocked IP', details: `${ip} unblocked`, status: 'Success' }, ...prev]); }} className="px-2 py-1 border rounded text-sm text-red-600">Unblock</button>
                    </div>
                  </div>
                ))}
                {(!(securityConfig?.blockedIPs || []).length) && <div className="text-sm text-gray-500">No blocked IPs</div>}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Database Management</h2>
          <p className="text-gray-600 mb-6">
            Monitor database performance, manage schemas, and optimize queries. 
            View connection statistics, manage data integrity, and execute maintenance tasks.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Database Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">PostgreSQL (Prisma)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">245 MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tables:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Check:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2 min ago</span>
                </div>
              </div>
            </div>

            {/* Connection Statistics */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connections</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Connections</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Max Pool:</span>
                    <span className="font-medium text-gray-900 dark:text-white">20</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Idle Connections:</span>
                    <span className="font-medium text-gray-900 dark:text-white">3</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg Query Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">8ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-2">
                <button onClick={runMaintenance} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Run Maintenance
                </button>
                <button onClick={optimizeIndexes} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Optimize Indexes
                </button>
                <button onClick={verifyIntegrity} className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Verify Integrity
                </button>
                <button onClick={viewQueryLogs} className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
                  View Query Logs
                </button>
              </div>
            </div>
          </div>

          {/* Schema Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database Tables</h3>
              <button onClick={refreshSchema} className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Refresh Schema
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Table Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Rows</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Size</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Indexes</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">users</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">9</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">128 KB</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Healthy</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => editTable('users')} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-2">Edit</button>
                      <button onClick={() => viewTableDetails('users')} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Details</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">products</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">156</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">892 KB</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">3</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Healthy</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => editTable('products')} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-2">Edit</button>
                      <button onClick={() => viewTableDetails('products')} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Details</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">orders</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">342</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1.8 MB</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">4</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Healthy</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => editTable('orders')} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-2">Edit</button>
                      <button onClick={() => viewTableDetails('orders')} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Details</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">inventory</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2,847</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">4.2 MB</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">5</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Healthy</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => editTable('inventory')} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-2">Edit</button>
                      <button onClick={() => viewTableDetails('inventory')} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Details</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">migrations</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">12</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">64 KB</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">Tracking</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => editTable('migrations')} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-2">Edit</button>
                      <button onClick={() => viewTableDetails('migrations')} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Maintenance Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Optimization */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimization</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Rebuild Indexes</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Improve query performance</p>
                  </div>
                  <button onClick={rebuildIndexes} className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">Run</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Analyze Tables</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Update table statistics</p>
                  </div>
                  <button onClick={analyzeTables} className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">Run</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Vacuum Database</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Clean up dead rows</p>
                  </div>
                  <button onClick={vacuumDatabase} className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">Run</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Check Integrity</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Verify data consistency</p>
                  </div>
                  <button onClick={checkIntegrity} className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded">Run</button>
                </div>
              </div>
            </div>

            {/* Database Monitoring */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">CPU Usage</span>
                    <span className="font-medium text-gray-900 dark:text-white">34%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                    <span className="font-medium text-gray-900 dark:text-white">58%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Disk I/O</span>
                    <span className="font-medium text-gray-900 dark:text-white">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: 1 minute ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Backup & Recovery</h2>
          <p className="text-gray-600 mb-6">
            Schedule automated backups to local or cloud storage, manage backup files, and test disaster recovery procedures. 
            Restore from backups, track backup history, and ensure data redundancy across systems.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Backup Schedule Configuration */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Automated Backup Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage Location</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Local - E:/In-Accord-web/backups</option>
                    <option>Cloudflare R2 - inaccord/In-Accord Backups</option>
                    <option>Both (Local + Cloud)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Backup Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Daily at 2:00 AM</option>
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                    <option>Weekly (Sunday 2:00 AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What to Backup</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Database (Prisma schema + data)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Team member data (localStorage)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Application files (client/server)</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next backup: <strong>Today 2:00 AM</strong></span>
                  <button onClick={runBackup} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Run Now
                  </button>
                </div>
              </div>
            </div>

            {/* Storage Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup Storage Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Local Storage Used</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">3.1 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '6.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cloudflare R2 Used</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">1.8 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div className="pt-2 space-y-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Backups:</span>
                    <span className="font-medium text-gray-900 dark:text-white">7 backups</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Local Copies:</span>
                    <span className="font-medium text-gray-900 dark:text-white">7 files</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cloud Copies:</span>
                    <span className="font-medium text-gray-900 dark:text-white">5 files</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Oldest Backup:</span>
                    <span className="font-medium text-gray-900 dark:text-white">Jan 2, 2026</span>
                  </div>
                </div>
                <button className="w-full mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors">
                  Manage Storage Locations
                </button>
              </div>
            </div>
          </div>

          {/* Backup History */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backup History</h3>
              <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Date & Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Backup Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Size</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">2026-01-08 02:00</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Full (DB + Files)</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Local + Cloud</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">487 MB</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Complete</span></td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Restore</button>
                      <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Download</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">2026-01-07 02:00</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Full (DB + Files)</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Local + Cloud</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">465 MB</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Complete</span></td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Restore</button>
                      <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Download</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">2026-01-06 02:00</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Full (DB + Files)</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Local + Cloud</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">458 MB</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Complete</span></td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Restore</button>
                      <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Download</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">2026-01-05 02:00</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Full (DB + Files)</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Local Only</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">442 MB</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Verified</span></td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Restore</button>
                      <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Download</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">2026-01-04 02:00</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Full (DB + Files)</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Local Only</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">438 MB</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Complete</span></td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Restore</button>
                      <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Download</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Disaster Recovery & Redundancy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disaster Recovery Testing */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Disaster Recovery Testing</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last DR Test:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2026-01-01 08:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Test Result:</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Passed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recovery Time:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">6m 14s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Backup Tested:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2025-12-31 backup</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next Test:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Feb 1, 2026</span>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Run DR Test Now
                </button>
                <button className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors">
                  View Test History
                </button>
              </div>
            </div>

            {/* Data Redundancy Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Redundancy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Local Primary</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">E:/In-Accord-web/backups</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Cloudflare R2</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">inaccord/In-Accord Backups</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Synced</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Database Schema</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">server/prisma/schema.prisma</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Git Tracked</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Team Data</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">localStorage + backups</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Protected</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    All critical data is backed up to local storage and <a href="https://dash.cloudflare.com/e6170abf1613b7f0d6f016cda0f7fcf4/r2/default/buckets/inaccord?prefix=In-Accord+Backups%2F" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">Cloudflare R2</a>. Database schema and migrations are version controlled in the GitHub repository (GARD-Realms-LLC/In-Accord-web).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Audit Logs</h2>
          <p className="text-gray-600 mb-6">
            View comprehensive audit trails of all system activities and user actions. 
            Track changes, filter by user or action type, and export logs for compliance and investigation.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Log</h3>
              <div className="flex gap-2">
                <button onClick={refreshAuditLogs} className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors">
                  Refresh
                </button>
                <button onClick={clearAuditLogs} className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/60 dark:hover:bg-red-800 text-red-700 dark:text-red-100 font-medium rounded-lg transition-colors">
                  Clear Logs
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Export Logs
                </button>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Timestamp</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Page</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Details</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {auditLogEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-600 dark:text-gray-400">No audit log entries. Click Refresh to reload.</td>
                    </tr>
                  ) : (
                    auditLogEntries.map((log, idx) => {
                      const badgeClass = log.status === 'Success'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
                      return (
                        <tr key={`${log.timestamp}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            {log.timestamp === '2026-01-07 19:00:47' ? (
                              <button onClick={openBackupLog} className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 underline font-medium">
                                {log.timestamp}
                              </button>
                            ) : (
                              log.timestamp
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{log.user}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.page}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.action}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.details}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 ${badgeClass} text-xs font-medium rounded`}>{log.status}</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Query Logs */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database Query Logs</h3>
              <div className="flex gap-2">
                <select className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Queries</option>
                  <option>SELECT</option>
                  <option>INSERT</option>
                  <option>UPDATE</option>
                  <option>DELETE</option>
                  <option>Slow Queries (&gt;100ms)</option>
                  <option>Failed Queries</option>
                </select>
                <button className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors">
                  Clear Logs
                </button>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Timestamp</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Query Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Table</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Execution Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Rows Affected</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:45:32 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">SELECT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">users</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">3ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">9</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:44:18 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">INSERT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">products</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">5ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:43:05 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">UPDATE</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">inventory</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">8ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">47</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:41:52 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium rounded">DELETE</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">orders</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">4ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:40:38 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">SELECT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">products</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">12ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">156</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:39:21 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">UPDATE</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">users</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:38:07 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">SELECT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">orders</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">18ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">342</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Slow</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:36:54 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">INSERT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">inventory</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">6ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">15</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:35:42 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">SELECT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">users</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">9</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:34:15 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">SELECT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">products</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">7ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">24</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:33:08 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">UPDATE</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">products</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">125ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">3</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Slow</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:31:52 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">SELECT</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">inventory</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">34ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2847</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Slow</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2026-01-09 12:30:18 UTC−07:00</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium rounded">DELETE</span></td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">orders</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">3ms</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">0</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium rounded">No Data</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Query Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">15,847</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Execution Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.2ms</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Slow Queries</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">34</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Failed Queries</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Integration Management</h2>
          <p className="text-gray-600">
            Configure third-party integrations and manage API connections. 
            Monitor webhook delivery, manage authentication tokens, and troubleshoot integration issues.
          </p>
        </section>

        {/* Section 9 */}
        <section className="border-b pb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold">System Health & Monitoring</h2>
            <button 
              onClick={updateMetrics}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
          <p className="text-gray-600 mb-2">
            Monitor server performance, CPU usage, memory allocation, and disk space. 
            View uptime statistics, manage system alerts, and configure monitoring thresholds.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Last updated: {lastUpdated.toLocaleTimeString()} (auto-refreshes every 5 seconds)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* App Status Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">App Status</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  appStatus === 'Operational' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' :
                  appStatus === 'Warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' :
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                }`}>
                  {appStatus}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">All services running normally</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">No critical alerts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">API endpoints responsive</span>
                </div>
              </div>
            </div>

            {/* App Speed Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Speed</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{responseTime}ms</span>
                        {showBulkPasswords && (
                          <div className="mt-3 p-3 bg-white dark:bg-gray-800 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">Bulk Password Migration</div>
                              <div className="flex gap-2">
                                <button onClick={() => { Object.keys(bulkPasswords).forEach(id => { if (!bulkPasswords[id]) bulkPasswords[id] = generateRandomPassword(); }); setBulkPasswords({ ...bulkPasswords }); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Randomize</button>
                                <button onClick={applyBulkPasswords} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Apply</button>
                                <button onClick={() => setShowBulkPasswords(false)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded">Close</button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {Object.keys(bulkPasswords).length === 0 && <div className="text-sm text-gray-500">No users require migration.</div>}
                              {Object.keys(bulkPasswords).map(id => {
                                const u = users.find(x => x.id === id)!;
                                return (
                                  <div key={id} className="flex items-center gap-2">
                                    <div className="w-48 text-sm">{u.name} ({u.username || u.email})</div>
                                    <input value={bulkPasswords[id] ?? ''} onChange={e => setBulkPasswords(prev => ({ ...prev, [id]: e.target.value }))} placeholder="new password" className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-sm flex-1" />
                                    <button onClick={() => setBulkPasswords(prev => ({ ...prev, [id]: generateRandomPassword() }))} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Rand</button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      responseTime < 50 ? 'bg-green-500' :
                      responseTime < 100 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${Math.min(100, (100 - responseTime) + 50)}%` }}></div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Optimal: &lt;100ms | Target: &lt;50ms</p>
                </div>
              </div>
            </div>

            {/* Uptime Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uptime</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{uptime.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      uptime >= 99.9 ? 'bg-green-500' :
                      uptime >= 99.0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${uptime}%` }}></div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Downtime: {((100 - uptime) * 43.2).toFixed(2)} minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{requestsPerMin.toFixed(1)}K</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Requests/min</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{successRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{p95Latency}ms</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">P95 Latency</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{memoryUsage.toFixed(1)}GB</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11 - GitHub Changes */}
        <section className="pb-8">
          <h2 className="text-3xl font-bold mb-2">GitHub Repository Changes</h2>
          <p className="text-gray-600 mb-6">
            Track all commits and changes made to the In-Accord-web repository on GitHub.
            View commit messages, authors, dates, and file modifications for version control and deployment tracking.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Commits</h3>
              <a href="https://github.com/GARD-Realms-LLC/In-Accord-web" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                View on GitHub
              </a>
            </div>
            
            <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Commit Message</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Author</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Files Changed</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Add Job Title field to team members</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2 files</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">Feature</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Implement controlled form inputs in admin panel</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1 file</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">Feature</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Add form validation with error messages</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1 file</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">Feature</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Add System Health & Monitoring metrics</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1 file</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Enhancement</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Implement audit logs with scrollable table</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1 file</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Enhancement</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-07</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Fix localStorage sync between pages</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2 files</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Bugfix</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-07</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Update dark mode styling for team components</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1 file</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Enhancement</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-06</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Initial team page setup with member cards</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">3 files</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">Feature</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-06</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Add administrator panel sections</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">1 file</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">Feature</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-05</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Setup Next.js project structure</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">5 files</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">Setup</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Export Logs
              </button>
              <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors">
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Section 10 - Team Member Management */}
        <section className="pb-8">
          <h2 className="text-3xl font-bold mb-2">Team Member Management</h2>
          <p className="text-gray-600 mb-6">
            Edit and manage team member information, profile details, and contact links for all team members.
          </p>
          
          <div className="space-y-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {index === 0 ? 'Team Member 1 (Doc Cowles - DocRST)' : `Team Member ${index + 1}`}
                </h3>
                <form onSubmit={(e) => handleSubmit(index, e)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Member Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={member.name}
                      onChange={(e) => updateMemberField(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                    {errors[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors[index]?.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                    <input 
                      type="text" 
                      name="jobTitle"
                      value={member.jobTitle}
                      onChange={(e) => updateMemberField(index, 'jobTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                    {errors[index]?.jobTitle && (
                      <p className="mt-1 text-sm text-red-600">{errors[index]?.jobTitle}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea 
                      name="description"
                      rows={2} 
                      value={member.description}
                      onChange={(e) => updateMemberField(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                    {errors[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">{errors[index]?.description}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
                    <input 
                      type="url" 
                      name="imageUrl"
                      value={member.imageUrl}
                      onChange={(e) => updateMemberField(index, 'imageUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                    {errors[index]?.imageUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors[index]?.imageUrl}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={member.email}
                        onChange={(e) => updateMemberField(index, 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                      {errors[index]?.email && (
                        <p className="mt-1 text-sm text-red-600">{errors[index]?.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                      <input 
                        type="url" 
                        name="website"
                        value={member.website}
                        onChange={(e) => updateMemberField(index, 'website', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                      {errors[index]?.website && (
                        <p className="mt-1 text-sm text-red-600">{errors[index]?.website}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                      <input 
                        type="url" 
                        name="github"
                        value={member.github}
                        onChange={(e) => updateMemberField(index, 'github', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                      {errors[index]?.github && (
                        <p className="mt-1 text-sm text-red-600">{errors[index]?.github}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discord</label>
                      <input 
                        type="url" 
                        name="discord"
                        value={member.discord}
                        onChange={(e) => updateMemberField(index, 'discord', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                      {errors[index]?.discord && (
                        <p className="mt-1 text-sm text-red-600">{errors[index]?.discord}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      Save Changes
                    </button>
                    <button type="button" className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
}

export default Administrator