'use client';

import { useEffect, useState } from 'react';

interface TeamMember {
  name: string;
  jobTitle: string;
  description: string;
  imageUrl: string;
  email: string;
  website: string;
  github: string;
  discord: string;
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
  email: string;
  role: 'Admin' | 'Manager' | 'User' | 'Viewer';
  status: 'Active' | 'Suspended';
  createdAt: string;
}

const initialUsers: User[] = [
  { id: 'u1', name: 'Doc Cowles', email: 'doc@example.com', role: 'Admin', status: 'Active', createdAt: '2024-01-10' },
  { id: 'u2', name: 'Alice Johnson', email: 'alice@example.com', role: 'Manager', status: 'Active', createdAt: '2025-05-02' },
  { id: 'u3', name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Suspended', createdAt: '2025-09-12' }
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

    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formRole, setFormRole] = useState<User['role']>('User');

    const openCreateUser = () => {
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormRole('User');
      setShowUserForm(true);
    };

    const openEditUser = (u: User) => {
      setEditingUser(u);
      setFormName(u.name);
      setFormEmail(u.email);
      setFormRole(u.role);
      setShowUserForm(true);
    };

    const closeUserForm = () => {
      setShowUserForm(false);
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormRole('User');
    };

    const saveUser = () => {
      if (!formName.trim()) { alert('Name is required'); return; }
      if (!isValidEmail(formEmail)) { alert('Invalid email address'); return; }

      if (editingUser) {
        const updated = users.map(x => x.id === editingUser.id ? { ...x, name: formName, email: formEmail, role: formRole } : x);
        setUsers(updated);
        setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Updated User', details: `${formName} updated`, status: 'Success' }, ...prev]);
        alert('User updated.');
      } else {
        const newUser: User = { id: 'u' + Math.random().toString(36).slice(2,9), name: formName, email: formEmail, role: formRole, status: 'Active', createdAt: new Date().toISOString().slice(0,10) };
        setUsers([newUser, ...users]);
        setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Created User', details: `${formName} created`, status: 'Success' }, ...prev]);
        alert('User created.');
      }

      closeUserForm();
      try { window.dispatchEvent(new CustomEvent('teamMembersUpdated', { detail: { type: 'users' } })); } catch {}
    };

    const deleteUser = (id: string) => {
      if (!confirm('Delete this user?')) return;
      const toDelete = users.find(u => u.id === id);
      setUsers(users.filter(u => u.id !== id));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Deleted User', details: `${toDelete?.name} deleted`, status: 'Success' }, ...prev]);
    };

    const toggleUserStatus = (id: string) => {
      const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u);
      setUsers(updated);
      const u = users.find(x => x.id === id);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'Users', action: 'Toggled User Status', details: `${u?.name} status toggled`, status: 'Success' }, ...prev]);
    };


    // --- System Configuration state & handlers ---
    const defaultSystemConfig = {
      appName: 'In-Accord',
      maintenanceMode: false,
      loggingLevel: 'info',
      allowedOrigins: ['http://localhost:3000'],
      integrations: { github: true, sentry: false, analytics: true },
      backupSchedule: 'daily',
      apiKeys: [] as { id: string; name: string; key: string; createdAt: string }[],
    };

    type SystemConfig = typeof defaultSystemConfig;

    const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('system_config') : null;
        return raw ? JSON.parse(raw) : defaultSystemConfig;
      } catch { return defaultSystemConfig; }
    });

    useEffect(() => {
      try { if (typeof window !== 'undefined') localStorage.setItem('system_config', JSON.stringify(systemConfig)); } catch {}
    }, [systemConfig]);

    const saveSystemConfig = () => {
      setSystemConfig(prev => ({ ...prev }));
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Saved Configuration', details: `Config saved`, status: 'Success' }, ...prev]);
      alert('System configuration saved.');
    };

    const resetSystemDefaults = () => {
      if (!confirm('Reset system configuration to defaults?')) return;
      setSystemConfig(defaultSystemConfig as SystemConfig);
      setAuditLogEntries(prev => [{ timestamp: new Date().toISOString(), user: 'Admin', page: 'System Configuration', action: 'Reset Defaults', details: `Configuration reset to defaults`, status: 'Success' }, ...prev]);
      alert('System configuration reset to defaults.');
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
      if (!isValidURL(m.imageUrl)) newErrors.imageUrl = 'Image URL must be a valid URL.';
      if (!isValidEmail(m.email)) newErrors.email = 'Email must be valid (e.g., name@example.com).';
      if (!isValidURL(m.website)) newErrors.website = 'Website must be a valid URL.';
      if (!isValidURL(m.github)) newErrors.github = 'GitHub must be a valid URL.';
      if (!isValidURL(m.discord)) newErrors.discord = 'Discord must be a valid URL.';

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
                  <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@example.com" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <select value={formRole} onChange={e => setFormRole(e.target.value as User['role'])} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm">
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>User</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveUser} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Save</button>
                  <button onClick={closeUserForm} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Name</th>
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
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">{u.role}</span></td>
                      <td className="px-4 py-3">{u.status === 'Active' ? <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Active</span> : <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Suspended</span>}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.createdAt}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEditUser(u)} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mr-3">Edit</button>
                        <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-700 text-sm font-medium mr-3">Delete</button>
                        <button onClick={() => toggleUserStatus(u.id)} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">Toggle Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

                <div className="mt-6 flex gap-2">
                  <button onClick={saveSystemConfig} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Configuration</button>
                  <button onClick={resetSystemDefaults} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Reset Defaults</button>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">Integrations</h4>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">GitHub</div>
                      <div className="text-xs text-gray-500">Enable GitHub integration for issue syncing.</div>
                    </div>
                    <input type="checkbox" checked={systemConfig.integrations.github} onChange={e => setSystemConfig(prev => ({ ...prev, integrations: { ...prev.integrations, github: e.target.checked } }))} />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Sentry</div>
                      <div className="text-xs text-gray-500">Enable error monitoring (Sentry DSN required).</div>
                    </div>
                    <input type="checkbox" checked={systemConfig.integrations.sentry} onChange={e => setSystemConfig(prev => ({ ...prev, integrations: { ...prev.integrations, sentry: e.target.checked } }))} />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Analytics</div>
                      <div className="text-xs text-gray-500">Enable usage analytics collection.</div>
                    </div>
                    <input type="checkbox" checked={systemConfig.integrations.analytics} onChange={e => setSystemConfig(prev => ({ ...prev, integrations: { ...prev.integrations, analytics: e.target.checked } }))} />
                  </label>
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