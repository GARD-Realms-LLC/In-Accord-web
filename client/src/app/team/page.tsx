"use client";

import HomePageWrapper from '../HomePageWrapper';

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

const Team = () => {
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

    useEffect(() => {
      // Load team members from localStorage on mount
      const savedMembers = localStorage.getItem('teamMembers');
      if (savedMembers) {
        try {
          const parsed = JSON.parse(savedMembers) as any[];
          const normalized: TeamMember[] = parsed.map((m) => ({
            name: m.name,
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

    useEffect(() => {
      const handler = () => {
        const savedMembers = localStorage.getItem('teamMembers');
        if (savedMembers) {
          try {
            const parsed = JSON.parse(savedMembers) as any[];
            const normalized: TeamMember[] = parsed.map((m) => ({
              name: m.name,
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
      };
      window.addEventListener('teamMembersUpdated', handler);
      return () => window.removeEventListener('teamMembersUpdated', handler);
    }, []);

    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex justify-center gap-6 p-6 flex-1">
        <div className="flex flex-col gap-6">
          {teamMembers.slice(0, 3).map((member, index) => (
            <div key={index} className="w-[300px] h-[300px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-center">{member.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-2">{member.jobTitle}</p>
                {member.imageUrl === `https://example.com/member${index + 1}` ? (
                  <div className="flex items-center justify-center w-full h-48 rounded mb-2 bg-gray-200 dark:bg-gray-700">
                    <svg className="w-64 h-64 text-blue-900 dark:text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                ) : (
                  <a href={member.imageUrl} className="block">
                    <img src={member.imageUrl} alt={member.name} className="w-full h-48 object-contain rounded mb-2 hover:opacity-80 transition-opacity" />
                  </a>
                )}
                <p className="text-gray-600 dark:text-gray-400 text-center">{member.description}</p>
              </div>
              <div className="flex gap-3">
                <a href={`mailto:${member.email}`} title="Email">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
                <a href={member.website} title="Website" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
                <a href={member.github} title="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href={member.discord} title="Discord" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.397-.875-.609-1.25a.077.077 0 00-.079-.036a19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C1.582 8.572 0 12.632 0 16.630v.049a.083.083 0 00.036.057 19.9 19.9 0 005.993 3.03.08.08 0 00.087-.027c.461-.613.871-1.265 1.216-1.955a.077.077 0 00-.042-.107 13.107 13.107 0 01-1.872-.892.083.083 0 01-.008-.138c.125-.093.25-.19.371-.287a.077.077 0 01.08-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 01.083.011c.12.098.246.195.371.288a.083.083 0 01-.006.137c-.598.349-1.222.645-1.873.893a.077.077 0 00-.041.107c.345.69.755 1.342 1.215 1.955a.077.077 0 00.087.028 19.86 19.86 0 005.993-3.03.083.083 0 00.037-.058v-.049c0-3.998-1.582-8.058-3.67-11.206a.061.061 0 00-.032-.028zM8.02 13.231c-1.048 0-1.911-.962-1.911-2.14 0-1.179.851-2.14 1.911-2.14 1.059 0 1.927.961 1.911 2.14 0 1.178-.851 2.14-1.911 2.14zm7.975 0c-1.049 0-1.911-.962-1.911-2.14 0-1.179.851-2.14 1.911-2.14 1.059 0 1.928.961 1.911 2.14 0 1.178-.852 2.14-1.911 2.14z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-6">
          {teamMembers.slice(3, 6).map((member, index) => (
            <div key={index + 3} className="w-[300px] h-[300px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-center">{member.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-2">{member.jobTitle}</p>
                {member.imageUrl === `https://example.com/member${index + 4}` ? (
                  <div className="flex items-center justify-center w-full h-48 rounded mb-2 bg-gray-200 dark:bg-gray-700">
                    <svg className="w-64 h-64 text-blue-900 dark:text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                ) : (
                  <a href={member.imageUrl} className="block">
                    <img src={member.imageUrl} alt={member.name} className="w-full h-48 object-contain rounded mb-2 hover:opacity-80 transition-opacity" />
                  </a>
                )}
                <p className="text-gray-600 dark:text-gray-400 text-center">{member.description}</p>
              </div>
              <div className="flex gap-3">
                <a href={`mailto:${member.email}`} title="Email">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
                <a href={member.website} title="Website" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
                <a href={member.github} title="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href={member.discord} title="Discord" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.397-.875-.609-1.25a.077.077 0 00-.079-.036a19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C1.582 8.572 0 12.632 0 16.630v.049a.083.083 0 00.036.057 19.9 19.9 0 005.993 3.03.08.08 0 00.087-.027c.461-.613.871-1.265 1.216-1.955a.077.077 0 00-.042-.107 13.107 13.107 0 01-1.872-.892.083.083 0 01-.008-.138c.125-.093.25-.19.371-.287a.077.077 0 01.08-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 01.083.011c.12.098.246.195.371.288a.083.083 0 01-.006.137c-.598.349-1.222.645-1.873.893a.077.077 0 00-.041.107c.345.69.755 1.342 1.215 1.955a.077.077 0 00.087.028 19.86 19.86 0 005.993-3.03.083.083 0 00.037-.058v-.049c0-3.998-1.582-8.058-3.67-11.206a.061.061 0 00-.032-.028zM8.02 13.231c-1.048 0-1.911-.962-1.911-2.14 0-1.179.851-2.14 1.911-2.14 1.059 0 1.927.961 1.911 2.14 0 1.178-.851 2.14-1.911 2.14zm7.975 0c-1.049 0-1.911-.962-1.911-2.14 0-1.179.851-2.14 1.911-2.14 1.059 0 1.928.961 1.911 2.14 0 1.178-.852 2.14-1.911 2.14z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {teamMembers.slice(6, 9).map((member, index) => (
            <div key={index + 6} className="w-[300px] h-[300px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-center">{member.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-2">{member.jobTitle}</p>
                {member.imageUrl === `https://example.com/member${index + 7}` ? (
                  <div className="flex items-center justify-center w-full h-48 rounded mb-2 bg-gray-200 dark:bg-gray-700">
                    <svg className="w-64 h-64 text-blue-900 dark:text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                ) : (
                  <a href={member.imageUrl} className="block">
                    <img src={member.imageUrl} alt={member.name} className="w-full h-48 object-contain rounded mb-2 hover:opacity-80 transition-opacity" />
                  </a>
                )}
                <p className="text-gray-600 dark:text-gray-400 text-center">{member.description}</p>
              </div>
              <div className="flex gap-3">
                <a href={`mailto:${member.email}`} title="Email">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
                <a href={member.website} title="Website" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
                <a href={member.github} title="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href={member.discord} title="Discord" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.397-.875-.609-1.25a.077.077 0 00-.079-.036a19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C1.582 8.572 0 12.632 0 16.630v.049a.083.083 0 00.036.057 19.9 19.9 0 005.993 3.03.08.08 0 00.087-.027c.461-.613.871-1.265 1.216-1.955a.077.077 0 00-.042-.107 13.107 13.107 0 01-1.872-.892.083.083 0 01-.008-.138c.125-.093.25-.19.371-.287a.077.077 0 01.08-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 01.083.011c.12.098.246.195.371.288a.083.083 0 01-.006.137c-.598.349-1.222.645-1.873.893a.077.077 0 00-.041.107c.345.69.755 1.342 1.215 1.955a.077.077 0 00.087.028 19.86 19.86 0 005.993-3.03.083.083 0 00.037-.058v-.049c0-3.998-1.582-8.058-3.67-11.206a.061.061 0 00-.032-.028zM8.02 13.231c-1.048 0-1.911-.962-1.911-2.14 0-1.179.851-2.14 1.911-2.14 1.059 0 1.927.961 1.911 2.14 0 1.178-.851 2.14-1.911 2.14zm7.975 0c-1.049 0-1.911-.962-1.911-2.14 0-1.179.851-2.14 1.911-2.14 1.059 0 1.928.961 1.911 2.14 0 1.178-.852 2.14-1.911 2.14z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        </main>
      </div>
    )
}

export default function Page(){return <HomePageWrapper><Team /></HomePageWrapper>;}

