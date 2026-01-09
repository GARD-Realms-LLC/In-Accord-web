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
          <p className="text-gray-600">
            Manage system users, permissions, and access control. View user activity, 
            reset passwords, and configure role-based access levels for different departments.
          </p>
        </section>

        {/* Section 2 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">System Configuration</h2>
          <p className="text-gray-600">
            Configure system settings, manage integrations, and monitor application health. 
            Update security policies, backup data, and view system logs and performance metrics.
          </p>
        </section>

        {/* Section 3 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Security & Permissions</h2>
          <p className="text-gray-600">
            Manage authentication settings, configure two-factor authentication, and set security policies. 
            Monitor suspicious activities, manage API keys, and enforce password requirements.
          </p>
        </section>

        {/* Section 5 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Database Management</h2>
          <p className="text-gray-600">
            Monitor database performance, manage schemas, and optimize queries. 
            View connection statistics, manage data integrity, and execute maintenance tasks.
          </p>
        </section>

        {/* Section 6 */}
        <section className="border-b pb-8">
          <h2 className="text-3xl font-bold mb-2">Backup & Recovery</h2>
          <p className="text-gray-600">
            Schedule automated backups, manage backup storage, and test disaster recovery procedures. 
            Restore from backups, track backup history, and ensure data redundancy across systems.
          </p>
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
              <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Export Logs
              </button>
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
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 14:35:22</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Team</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Updated Job Title</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Doc Cowles: Founder & Manager</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 14:28:15</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Administrator</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Updated Team Member</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Member #2: Email updated</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 14:15:43</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Dashboard</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View dashboard metrics</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 14:02:11</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Team</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View team members list</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 13:45:32</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Products</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View product inventory</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 13:32:18</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Users</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View system users</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 13:18:45</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Expenses</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View expense reports</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 13:05:22</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Inventory</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View inventory status</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 12:52:10</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Settings</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View system settings</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 12:38:56</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Administrator</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View admin panel</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 12:25:33</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Home</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Login Success</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">User authenticated</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">2025-01-08 12:10:15</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">DocRST</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Support</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Page Accessed</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">View support tickets</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">Success</span></td>
                  </tr>
                </tbody>
              </table>
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
              <a href="https://github.com/GARD-Realms-LLC/In-Accord-web" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors">
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