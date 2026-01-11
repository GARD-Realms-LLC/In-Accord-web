'use client';

import { useEffect, useMemo, useState } from 'react';

interface HostingAd {
        id: string;
        planName: string;
        shortDescription: string;
        pricePerMonth: string;
        features: string[];
        badge?: string;
        targetAudience?: string;
        ctaLabel: string;
        ctaUrl: string;
        contactEmail?: string;
        isFeatured?: boolean;
        createdAt: string;
        updatedAt: string;
        managedBy?: string;
      }

    interface HostingAdForm {
        planName: string;
        shortDescription: string;
        pricePerMonth: string;
        featuresText: string;
        badge: string;
        targetAudience: string;
        ctaLabel: string;
        ctaUrl: string;
        contactEmail: string;
      }

    const STORAGE_KEY = 'hosting_ads';

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
            .filter((role) => typeof role === 'string' && role.trim().length)
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

    const DEFAULT_ADS: HostingAd[] = [
        {
          id: 'ad-starter',
          planName: 'Creator Cloud',
          shortDescription: 'Perfect for personal sites, portfolios, or early-stage projects that crave speed on a budget.',
          pricePerMonth: '$19/mo',
          features: [
            '40 GB NVMe storage with daily snapshots',
            'Global CDN acceleration and DDoS shielding',
            'One-click app launcher (WordPress, Ghost, Next.js)',
            '24/7 live chat with a real engineer in under 2 minutes',
          ],
          badge: 'Starter favorite',
          targetAudience: 'Solo founders, bloggers, makers',
          ctaLabel: 'Launch in under 5 minutes',
          ctaUrl: 'https://example.com/creator-cloud',
          contactEmail: 'hello@example.com',
          isFeatured: true,
          createdAt: '2026-01-01T12:00:00.000Z',
          updatedAt: '2026-01-01T12:00:00.000Z',
          managedBy: 'System',
        },
        {
          id: 'ad-scale',
          planName: 'HyperScale Pro',
          shortDescription: 'Built for scaling SaaS products that need autoscaling, observability, and bulletproof SLAs.',
          pricePerMonth: '$79/mo',
          features: [
            'Auto-scale clusters across 3 regions',
            'Managed Postgres + Redis bundles included',
            'Advanced observability dashboards & alerting',
            '99.99% uptime SLA with runbook handoff',
          ],
          badge: 'Most popular',
          targetAudience: 'Growing SaaS teams, agencies, enterprises',
          ctaLabel: 'Book a migration consult',
          ctaUrl: 'https://example.com/hyperscale-pro',
          contactEmail: 'scale@example.com',
          isFeatured: true,
          createdAt: '2026-01-01T12:00:00.000Z',
          updatedAt: '2026-01-01T12:00:00.000Z',
          managedBy: 'System',
        },
        {
          id: 'ad-enterprise',
          planName: 'Enterprise Atlas',
          shortDescription: 'Dedicated clusters, compliance-ready, and run by an embedded SRE squad tailored to your org.',
          pricePerMonth: 'Let’s talk',
          features: [
            'Dedicated pod with private networking and WAF',
            'SOC2 / HIPAA / GDPR compliance tooling included',
            'Quarterly resilience drills and performance tuning',
            'Executive dashboards with budget forecasting',
          ],
          badge: 'White-glove delivery',
          targetAudience: 'Enterprises, FinTech, Healthcare, Gov',
          ctaLabel: 'Schedule a strategy session',
          ctaUrl: 'https://example.com/enterprise-atlas',
          contactEmail: 'enterprise@example.com',
          isFeatured: false,
          createdAt: '2026-01-01T12:00:00.000Z',
          updatedAt: '2026-01-01T12:00:00.000Z',
          managedBy: 'System',
        },
      ];

    const emptyForm: HostingAdForm = {
        planName: '',
        shortDescription: '',
        pricePerMonth: '',
        featuresText: '',
        badge: '',
        targetAudience: '',
        ctaLabel: '',
        ctaUrl: '',
        contactEmail: '',
      };

    const generateId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }
        return `ad-${Math.random().toString(36).slice(2, 10)}`;
      };

    const formatTimestamp = (iso: string) => {
        try {
          return new Date(iso).toLocaleString();
        } catch {
          return iso;
        }
      };

    const HostingPage = () => {
        const [ads, setAds] = useState<HostingAd[]>(() => {
          if (typeof window === 'undefined') return DEFAULT_ADS;
          try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (!stored) return DEFAULT_ADS;
            const parsed = JSON.parse(stored) as HostingAd[];
            if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ADS;
            return parsed;
          } catch {
            return DEFAULT_ADS;
          }
        });
        const [form, setForm] = useState<HostingAdForm>(emptyForm);
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
            const hasHosting = roleTokens.includes('hosting');
            setRole(formatRoleLabel(parsed, roleTokens));
            setCanManage(hasHosting || hasAdmin);
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

  const handleChange = (field: keyof HostingAdForm, value: string) => {
          setForm((prev) => ({ ...prev, [field]: value }));
        };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
          event.preventDefault();
          if (!canManage) return;

          const features = form.featuresText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

          if (!form.planName.trim()) {
            setStatusMessage('Plan name is required.');
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
                  planName: form.planName.trim(),
                  shortDescription: form.shortDescription.trim(),
                  pricePerMonth: form.pricePerMonth.trim() || 'Custom quote',
                  features,
                  badge: form.badge.trim() || undefined,
                  targetAudience: form.targetAudience.trim() || undefined,
                  ctaLabel: form.ctaLabel.trim(),
                  ctaUrl: form.ctaUrl.trim(),
                  contactEmail: form.contactEmail.trim() || undefined,
                  updatedAt: timestamp,
                  managedBy: role || 'Hosting Manager',
                };
              })
            );
            setStatusMessage('Hosting advertisement updated.');
          } else {
            const newAd: HostingAd = {
              id: generateId(),
              planName: form.planName.trim(),
              shortDescription: form.shortDescription.trim(),
              pricePerMonth: form.pricePerMonth.trim() || 'Custom quote',
              features,
              badge: form.badge.trim() || undefined,
              targetAudience: form.targetAudience.trim() || undefined,
              ctaLabel: form.ctaLabel.trim(),
              ctaUrl: form.ctaUrl.trim(),
              contactEmail: form.contactEmail.trim() || undefined,
              isFeatured: false,
              createdAt: timestamp,
              updatedAt: timestamp,
              managedBy: role || 'Hosting Manager',
            };
            setAds((prev) => [newAd, ...prev]);
            setStatusMessage('New hosting advertisement published.');
          }

          resetForm();
        };

  const handleEdit = (ad: HostingAd) => {
          if (!canManage) return;
          setEditingId(ad.id);
          setForm({
            planName: ad.planName,
            shortDescription: ad.shortDescription,
            pricePerMonth: ad.pricePerMonth,
            featuresText: ad.features.join('\n'),
            badge: ad.badge ?? '',
            targetAudience: ad.targetAudience ?? '',
            ctaLabel: ad.ctaLabel,
            ctaUrl: ad.ctaUrl,
            contactEmail: ad.contactEmail ?? '',
          });
        };

  const handleDelete = (id: string) => {
          if (!canManage) return;
          if (!confirm('Remove this hosting advertisement?')) return;
          setAds((prev) => prev.filter((ad) => ad.id !== id));
          setStatusMessage('Advertisement removed.');
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
          const avgPrice = (() => {
            const numericPrices = ads
              .map((ad) => Number(ad.pricePerMonth.replace(/[^0-9.]/g, '')))
              .filter((price) => !Number.isNaN(price));
            if (!numericPrices.length) return 'Custom pricing';
            const sum = numericPrices.reduce((acc, price) => acc + price, 0);
            return `$${Math.round(sum / numericPrices.length)}/mo avg`;
          })();
          return { total, featured, avgPrice };
        }, [ads]);

  return (
    <div className="space-y-10 p-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]"
                aria-hidden
              ></div>
              <div className="relative flex flex-col gap-8 p-10 lg:p-16">
                <div className="max-w-3xl space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
                    Lightning-fast cloud hosting
                  </span>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Deploy faster, scale smarter, and keep every byte blazing.
                  </h1>
                  <p className="text-lg text-blue-100">
                    Craft hosting packages that speak to builders, teams, and enterprises. Launch new offers in moments, track
                    performance, and keep your brand front-and-center with premium visual blocks.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-blue-100">Active advertisements</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <div className="text-3xl font-bold">{stats.featured}</div>
                    <div className="text-sm text-blue-100">Featured placements</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <div className="text-3xl font-bold">{stats.avgPrice}</div>
                    <div className="text-sm text-blue-100">Average advertised rate</div>
                  </div>
                </div>
              </div>
            </div>

          {canManage ? (
              <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <header className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage hosting advertisements</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Publish new offers, highlight seasonal promos, or keep pricing aligned with your go-to-market moves.
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Role: {role || 'Unknown'}
                  </div>
                </header>

                {statusMessage && (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                    {statusMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
                  <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan name</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.planName}
                        onChange={(e) => handleChange('planName', e.target.value)}
                        placeholder="e.g. HyperScale Pro"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price per month</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.pricePerMonth}
                        onChange={(e) => handleChange('pricePerMonth', e.target.value)}
                        placeholder="$79/mo"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short description</label>
                      <textarea
                        className="min-h-[80px] w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                        placeholder="Explain who this plan delights and the outcome it delivers."
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature bullet points</label>
                      <textarea
                        className="min-h-[120px] w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-mono dark:border-gray-700 dark:bg-gray-800"
                        value={form.featuresText}
                        onChange={(e) => handleChange('featuresText', e.target.value)}
                        placeholder={'One feature per line\nAutoscaling across three regions\nManaged backups and snapshots'}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">One feature per line. Markdown not required.</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Badge / promo tag</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.badge}
                        onChange={(e) => handleChange('badge', e.target.value)}
                        placeholder="Most popular"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target audience</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.targetAudience}
                        onChange={(e) => handleChange('targetAudience', e.target.value)}
                        placeholder="Agencies, SaaS teams"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CTA label</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.ctaLabel}
                        onChange={(e) => handleChange('ctaLabel', e.target.value)}
                        placeholder="Launch in 5 minutes"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CTA URL</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.ctaUrl}
                        onChange={(e) => handleChange('ctaUrl', e.target.value)}
                        placeholder="https://"
                        required
                        type="url"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact email (optional)</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        value={form.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        placeholder="team@example.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 lg:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                    >
                      {editingId ? 'Update advertisement' : 'Publish advertisement'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-sm font-medium text-gray-600 underline-offset-2 transition hover:text-gray-900 hover:underline dark:text-gray-300"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
              </section>
            ) : (
              <section className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-5 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                You have viewer access. Only users with either an Admin or Hosting role can publish new advertisements. Browse the
                offers below or contact the hosting team for changes.
              </section>
            )}

            <section className="space-y-6">
              <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Live hosting offers</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cards below are exactly what prospects see across the marketing funnel. Featured placements surface first.
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
                        ? 'border-blue-400 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/40 dark:to-gray-900'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                    }`}
                  >
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{ad.planName}</h3>
                        {ad.badge && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                            {ad.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ad.shortDescription || 'Add a description to help buyers self-select the right plan.'}
                      </p>
                      <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{ad.pricePerMonth}</p>
                        {ad.targetAudience && (
                          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">For {ad.targetAudience}</p>
                        )}
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        {ad.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  <footer className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={ad.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        {ad.ctaLabel}
                      </a>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Updated {formatTimestamp(ad.updatedAt)}</span>
                        {ad.managedBy && <span>· Managed by {ad.managedBy}</span>}
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            </section>

            {canManage && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <header className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Administrative actions</h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{ads.length} ads under management</span>
                </header>
                <div className="divide-y divide-gray-200 text-sm dark:divide-gray-700">
                {sortedAds.map((ad) => (
                  <div key={ad.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{ad.planName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ad.pricePerMonth} · {ad.features.length} features · {ad.isFeatured ? 'Featured' : 'Standard'} placement
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(ad.id)}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                            ad.isFeatured
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {ad.isFeatured ? 'Remove highlight' : 'Mark as featured'}
                        </button>
                        <button
                          onClick={() => handleEdit(ad)}
                          className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
    </div>
  );
};

export default HostingPage;

