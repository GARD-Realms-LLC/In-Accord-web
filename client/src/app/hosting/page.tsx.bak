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
              setCanManage(false);
              return;
            }
            const parsed = JSON.parse(raw);
            const roleTokens = extractRoleTokens(parsed);
            const hasAdmin = roleTokens.includes('admin');
            const hasHosting = roleTokens.includes('hosting');
            setCanManage(hasHosting || hasAdmin);
          } catch {
            setCanManage(false);
          }
        }, []);

  const sortedAds = useMemo(() => {
          return [...ads].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }, [ads]);

  const handleDelete = (id: string) => {
          if (!canManage) return;
          if (!confirm('Remove this hosting advertisement?')) return;
          setAds((prev) => prev.filter((ad) => ad.id !== id));
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

          {!canManage && (
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
    </div>
  );
};

export default HostingPage;

