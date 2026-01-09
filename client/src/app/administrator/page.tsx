'use client';

import { useState } from 'react';

interface TeamMember {
  name: string;
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
        description: "Founder and Manager of In-Accord",
        imageUrl: "https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/dic-irish-bear.jpeg",
        email: "member1@example.com",
        website: "https://example.com",
        github: "https://github.com",
        discord: "https://discord.com"
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        name: `Team Member ${i + 2}`,
        description: `Information about team member ${i + 2}`,
        imageUrl: `https://example.com/member${i + 2}`,
        email: `member${i + 2}@example.com`,
        website: "https://example.com",
        github: "https://github.com",
        discord: "https://discord.com"
      }))
    ]);

    const handleSubmit = (index: number, e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const updatedMember: TeamMember = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        imageUrl: formData.get('imageUrl') as string,
        email: formData.get('email') as string,
        website: formData.get('website') as string,
        github: formData.get('github') as string,
        discord: formData.get('discord') as string,
      };
      
      const newTeamMembers = [...teamMembers];
      newTeamMembers[index] = updatedMember;
      setTeamMembers(newTeamMembers);
      
      // Save to localStorage for persistence
      localStorage.setItem('teamMembers', JSON.stringify(newTeamMembers));
      
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
          <h2 className="text-3xl font-bold mb-2">Reports & Analytics</h2>
          <p className="text-gray-600">
            Generate comprehensive reports on system usage, user behavior, and business metrics. 
            Access advanced analytics, export data, and create custom dashboards for monitoring KPIs.
          </p>
        </section>

        {/* Section 4 */}
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
          <p className="text-gray-600">
            View comprehensive audit trails of all system activities and user actions. 
            Track changes, filter by user or action type, and export logs for compliance and investigation.
          </p>
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
          <h2 className="text-3xl font-bold mb-2">System Health & Monitoring</h2>
          <p className="text-gray-600">
            Monitor server performance, CPU usage, memory allocation, and disk space. 
            View uptime statistics, manage system alerts, and configure monitoring thresholds.
          </p>
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
                      defaultValue={member.name} 
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea 
                      name="description"
                      rows={2} 
                      defaultValue={member.description} 
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
                    <input 
                      type="url" 
                      name="imageUrl"
                      defaultValue={member.imageUrl} 
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        defaultValue={member.email} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                      <input 
                        type="url" 
                        name="website"
                        defaultValue={member.website} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                      <input 
                        type="url" 
                        name="github"
                        defaultValue={member.github} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discord</label>
                      <input 
                        type="url" 
                        name="discord"
                        defaultValue={member.discord} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                        required
                      />
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