'use client';

import { useEffect, useMemo, useState } from 'react';

interface DiscordServerAd {
        id: string;
        headline: string;
        shortDescription: string;
        pricing: string;
        deliverables: string[];
        badge?: string;
        targetCommunity?: string;
        turnaround?: string;
        ctaLabel: string;
        ctaUrl: string;
        contactDiscord?: string;
        isFeatured?: boolean;
        createdAt: string;
        updatedAt: string;
        craftedBy?: string;
      }

    interface DiscordServerAdForm {
        headline: string;
        shortDescription: string;
        pricing: string;
        deliverablesText: string;
        badge: string;
        targetCommunity: string;
        turnaround: string;
        ctaLabel: string;
        ctaUrl: string;
        contactDiscord: string;
      }

    const STORAGE_KEY = 'discord_server_creator_ads';

    const extractRoleTokens = (user: any): string[] => {
        const tokens = new Set<string>();
        const addToken = (value: unknown) => {
          if (typeof value === 'string') {
            const matches = value.match(/[A-Za-z0-9]+/g);
            if (matches) {
              matches.forEach((match) => tokens.add(match.toLowerCase()));
            }
          }
        };

        if (Array.isArray(user?.roles)) {
          user.roles.forEach(addToken);
        }

        addToken(user?.role);

        return Array.from(tokens);
      };

    const formatRoleLabel = (user: any, tokens: string[]): string => {
        if (Array.isArray(user?.roles) && user.roles.length) {
          return user.roles
            .filter((role: string) => typeof role === 'string' && role.trim().length)
            .join(', ');
        }
        if (typeof user?.role === 'string' && user.role.trim().length) {
          return user.role;
        }
        if (tokens.length) {
          return tokens
            .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
            .join(', ');
        }
        return '';
      };

    const DEFAULT_ADS: DiscordServerAd[] = [
        {
          id: 'discord-builder-pro',
          headline: 'Creator Guild Launch Kit',
          shortDescription: 'Custom Discord servers engineered for creators hosting courses, VIP drops, and Patreon-style perks.',
          pricing: '$499 setup + $99/mo stewardship',
          deliverables: [
            'Modular channel architecture mapped to your revenue funnel',
            'Automations with MEE6, Tatsu, and custom Slash commands',
            'Onboarding flows synced with Gumroad, Patreon, and Shopify',
            'Bi-weekly audit with retention and engagement reporting',
          ],
          badge: 'Creator favorite',
          targetCommunity: 'Content creators & knowledge entrepreneurs',
          turnaround: '14-day average launch',
          ctaLabel: 'Review launch checklist',
          ctaUrl: 'https://example.com/discord/creator-guild',
          contactDiscord: '@guildsmith',
          isFeatured: true,
          createdAt: '2026-01-02T10:00:00.000Z',
          updatedAt: '2026-01-02T10:00:00.000Z',
          craftedBy: 'System',
        },
        {
          id: 'discord-saas-pro',
          headline: 'SaaS Support Nexus',
          shortDescription: 'Ship a Discord hub that doubles as customer success, beta testing lounge, and feature feedback engine.',
          pricing: 'Starting at $899',
          deliverables: [
            'Role-gated spaces for success, VIP, and beta cohorts',
            'Zendesk + Linear ticket sync with two-way webhooks',
            'Insight dashboards surfaced inside Discord via Slash commands',
            'Triage macros and escalation playbooks for your support team',
          ],
          badge: 'Most requested',
          targetCommunity: 'SaaS founders & customer teams',
          turnaround: '3-week build sprint',
          ctaLabel: 'Book an architecture session',
          ctaUrl: 'https://example.com/discord/saas-nexus',
          contactDiscord: '@supportgarden',
          isFeatured: true,
          createdAt: '2026-01-02T10:00:00.000Z',
          updatedAt: '2026-01-04T15:30:00.000Z',
          craftedBy: 'System',
        },
        {
          id: 'discord-esports',
          headline: 'Esports Command Center',
          shortDescription: 'Tournament-ready Discord stack with sponsor activations, scrim scheduling, and broadcast integrations.',
          pricing: 'Custom quote',
          deliverables: [
            'Bracket automation with Battlefy, Challonge, or Smash.gg',
            'Caster & producer war rooms with OBS scene syncing',
            'Partner lounge with branded sponsor mini-sites',
            'Crisis comms runbooks for moderators and staff',
          ],
          badge: 'White-glove build',
          targetCommunity: 'Esports orgs & tournament hosts',
          turnaround: '6-week engagement',
          ctaLabel: 'Plan your season rollout',
          ctaUrl: 'https://example.com/discord/esports-command',
          contactDiscord: '@arenaops',
          isFeatured: false,
          createdAt: '2026-01-03T12:45:00.000Z',
          updatedAt: '2026-01-03T12:45:00.000Z',
          craftedBy: 'System',
        },
      ];

    const emptyForm: DiscordServerAdForm = {
        headline: '',
        shortDescription: '',
        pricing: '',
        deliverablesText: '',
        badge: '',
        targetCommunity: '',
        turnaround: '',
        ctaLabel: '',
        ctaUrl: '',
        contactDiscord: '',
      };

    const generateId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }
        return `discord-ad-${Math.random().toString(36).slice(2, 10)}`;
      };

    const formatTimestamp = (iso: string) => {
        try {
          return new Date(iso).toLocaleString();
        } catch {
          return iso;
        }
      };

    const ServersPage = () => {
        const [ads, setAds] = useState<DiscordServerAd[]>(() => {
          if (typeof window === 'undefined') return DEFAULT_ADS;
          try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (!stored) return DEFAULT_ADS;
            const parsed = JSON.parse(stored) as DiscordServerAd[];
            if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ADS;
            return parsed;
          } catch {
            return DEFAULT_ADS;
          }
        });
        const [form, setForm] = useState<DiscordServerAdForm>(emptyForm);
        const [editingId, setEditingId] = useState<string | null>(null);
        const [statusMessage, setStatusMessage] = useState<string | null>(null);
        const [role, setRole] = useState<string>('');
        const [canManage, setCanManage] = useState(false);

  useEffect(() => {
          if (typeof window === 'undefined') return;
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
          } catch {
            // ignore persistence errors
          }
        }, [ads]);

  useEffect(() => {
          if (typeof window === 'undefined') return;
          try {
            const raw = window.localStorage.getItem('currentUser');
            if (!raw) {
              setRole('');
              setCanManage(false);
              return;
            }
            const parsed = JSON.parse(raw);
            const roleTokens = extractRoleTokens(parsed);
            const hasAdmin = roleTokens.includes('admin');
            const hasDiscord = roleTokens.includes('discord');
            const hasCreator = roleTokens.includes('creator');
            setRole(formatRoleLabel(parsed, roleTokens));
            setCanManage(hasDiscord || hasCreator || hasAdmin);
          } catch {
            setRole('');
            setCanManage(false);
          }
        }, []);

  useEffect(() => {
          if (!statusMessage) return;
          const timeout = setTimeout(() => setStatusMessage(null), 3500);
          return () => clearTimeout(timeout);
        }, [statusMessage]);

  const sortedAds = useMemo(() => {
          return [...ads].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }, [ads]);

  const resetForm = () => {
          setForm(emptyForm);
          setEditingId(null);
        };

  const handleChange = (field: keyof DiscordServerAdForm, value: string) => {
          setForm((prev) => ({ ...prev, [field]: value }));
        };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
          event.preventDefault();
          if (!canManage) return;

          const deliverables = form.deliverablesText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

          if (!form.headline.trim()) {
            setStatusMessage('Headline is required.');
            return;
          }

          if (!form.ctaLabel.trim() || !form.ctaUrl.trim()) {
            setStatusMessage('CTA label and URL are required.');
            return;
          }

          const timestamp = new Date().toISOString();

          if (editingId) {
            setAds((prev) =>
              prev.map((ad) => {
                if (ad.id !== editingId) return ad;
                return {
                  ...ad,
                  headline: form.headline.trim(),
                  shortDescription: form.shortDescription.trim(),
                  pricing: form.pricing.trim() || 'Custom quote',
                  deliverables,
                  badge: form.badge.trim() || undefined,
                  targetCommunity: form.targetCommunity.trim() || undefined,
                  turnaround: form.turnaround.trim() || undefined,
                  ctaLabel: form.ctaLabel.trim(),
                  ctaUrl: form.ctaUrl.trim(),
                  contactDiscord: form.contactDiscord.trim() || undefined,
                  updatedAt: timestamp,
                  craftedBy: role || 'Discord Builder',
                };
              })
            );
            setStatusMessage('Discord server advertisement updated.');
          } else {
            const newAd: DiscordServerAd = {
              id: generateId(),
              headline: form.headline.trim(),
              shortDescription: form.shortDescription.trim(),
              pricing: form.pricing.trim() || 'Custom quote',
              deliverables,
              badge: form.badge.trim() || undefined,
              targetCommunity: form.targetCommunity.trim() || undefined,
              turnaround: form.turnaround.trim() || undefined,
              ctaLabel: form.ctaLabel.trim(),
              ctaUrl: form.ctaUrl.trim(),
              contactDiscord: form.contactDiscord.trim() || undefined,
              isFeatured: false,
              createdAt: timestamp,
              updatedAt: timestamp,
              craftedBy: role || 'Discord Builder',
            };
            setAds((prev) => [newAd, ...prev]);
            setStatusMessage('New Discord server advertisement published.');
          }

          resetForm();
        };

  const handleEdit = (ad: DiscordServerAd) => {
          if (!canManage) return;
          setEditingId(ad.id);
          setForm({
            headline: ad.headline,
            shortDescription: ad.shortDescription,
            pricing: ad.pricing,
            deliverablesText: ad.deliverables.join('\n'),
            badge: ad.badge ?? '',
            targetCommunity: ad.targetCommunity ?? '',
            turnaround: ad.turnaround ?? '',
            ctaLabel: ad.ctaLabel,
            ctaUrl: ad.ctaUrl,
            contactDiscord: ad.contactDiscord ?? '',
          });
        };

  const handleDelete = (id: string) => {
          if (!canManage) return;
          if (!confirm('Remove this Discord server advertisement?')) return;
          setAds((prev) => prev.filter((ad) => ad.id !== id));
          if (editingId === id) {
            resetForm();
          }
        };

  const toggleFeatured = (id: string) => {
          if (!canManage) return;
          setAds((prev) =>
            prev.map((ad) => {
              if (ad.id !== id) return ad;
              return { ...ad, isFeatured: !ad.isFeatured };
            })
          );
        };

  const stats = useMemo(() => {
          const total = ads.length;
          const featured = ads.filter((ad) => ad.isFeatured).length;
          return { total, featured };
        }, [ads]);

  return (
    <div className="space-y-10 p-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-600 to-sky-500 text-white">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]"
                aria-hidden
              ></div>
              <div className="relative flex flex-col gap-8 p-10 lg:p-16">
                <div className="max-w-3xl space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
                    Discord Servers Development Studio
                  </span>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Launch communities engineered to convert, retain, and delight.
                  </h1>
                  <p className="text-lg text-indigo-100">
                    Draft high-impact Discord server packages, iterate on campaigns, and showcase offers built for creators,
                    SaaS teams, and esports organizations.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-indigo-100">Live advertisements</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <div className="text-3xl font-bold">{stats.featured}</div>
                    <div className="text-sm text-indigo-100">Featured placements</div>
                  </div>
                </div>
              </div>
            </div>
          

            <section className="space-y-6">
              <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Live Discord creator campaigns</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Featured offers surface first. Each card mirrors how prospects experience your Discord development services.
                  </p>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Last update {ads[0] ? formatTimestamp(ads[0].updatedAt) : '—'}
                </div>
              </header>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedAds.map((ad) => (
                <article
                    key={ad.id}
                    className={`relative flex h-full flex-col justify-between rounded-2xl border p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 ${
                      ad.isFeatured
                        ? 'border-indigo-400 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/40 dark:to-gray-900'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                    }`}
                  >
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{ad.headline}</h3>
                        {ad.badge && (
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                            {ad.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ad.shortDescription || 'Add a description to help communities understand the transformation offered.'}
                      </p>
                      <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{ad.pricing}</p>
                        {ad.targetCommunity && (
                          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">For {ad.targetCommunity}</p>
                        )}
                        {ad.turnaround && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">Turnaround: {ad.turnaround}</p>
                        )}
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        {ad.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden></span>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  <footer className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={ad.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        {ad.ctaLabel}
                      </a>
                      <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-3">
                        <span>Updated {formatTimestamp(ad.updatedAt)}</span>
                        {ad.craftedBy && <span>· Crafted by {ad.craftedBy}</span>}
                        {ad.contactDiscord && <span>· Contact {ad.contactDiscord}</span>}
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
    </div>
  );
};

export default ServersPage;