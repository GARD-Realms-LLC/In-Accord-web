"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CanonicalBotRole = "admin" | "bots";

type UnknownUser = {
  role?: unknown;
  roles?: unknown;
  [key: string]: unknown;
};

interface BotAd {
  id: string;
  builderName: string;
  tagline: string;
  price: string;
  highlights: string[];
  badge?: string;
  targetAudience?: string;
  ctaLabel: string;
  ctaUrl: string;
  contact?: string;
  isSpotlight?: boolean;
  createdAt: string;
  updatedAt: string;
  steward?: string;
}

interface BotAdForm {
  builderName: string;
  tagline: string;
  price: string;
  highlightsText: string;
  badge: string;
  targetAudience: string;
  ctaLabel: string;
  ctaUrl: string;
  contact: string;
}

const STORAGE_KEY = "discord_bot_ads";

const BOT_ROLE_SYNONYMS: Record<string, CanonicalBotRole> = {
  admin: "admin",
  administrator: "admin",
  admins: "admin",
  superadmin: "admin",
  sysadmin: "admin",
  "system admin": "admin",
  "system-admin": "admin",
  "bot admin": "bots",
  "bot-admin": "bots",
  "bots admin": "bots",
  bot: "bots",
  bots: "bots",
  "bot builder": "bots",
  "bot builders": "bots",
  "bot-builder": "bots",
  "bot dev": "bots",
  "bot developer": "bots",
  "automation lead": "bots",
  automation: "bots",
  "bot ops": "bots",
  "bot-ops": "bots",
  "automation squad": "bots",
};

const collectCanonicalRoles = (
  user: UnknownUser,
  synonyms: Record<string, CanonicalBotRole>,
): Set<CanonicalBotRole> => {
  const canonical = new Set<CanonicalBotRole>();

  const register = (value: unknown) => {
    if (typeof value !== "string") return;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;

    const accept = (candidate: string) => {
      const mapped = synonyms[candidate];
      if (mapped) canonical.add(mapped);
    };

    accept(normalized);
    const tokens = normalized.split(/[^a-z0-9]+/g).filter(Boolean);
    tokens.forEach(accept);
  };

  register(user?.role);
  if (Array.isArray(user?.roles)) {
    user.roles.forEach(register);
  }

  return canonical;
};

const formatRoleLabel = (user: UnknownUser): string => {
  if (Array.isArray(user?.roles) && user.roles.length) {
    return user.roles
      .filter((role) => typeof role === "string" && role.trim().length)
      .join(", ");
  }
  if (typeof user?.role === "string" && user.role.trim().length) {
    return user.role;
  }
  return "";
};

const DEFAULT_ADS: BotAd[] = [
  {
    id: "bot-factory-collective",
    builderName: "Bot Factory Collective",
    tagline: "Launch custom Discord bots with economy loops, moderation AI, and onboarding funnels in under two weeks.",
    price: "From $249 setup + $59/mo",
    highlights: [
      "Persona-driven conversational flows with fallback to human support",
      "On-call escalation to senior devs during major launches",
      "Analytics cockpit covering retention, conversion, and engagement KPIs",
      "Library of 40+ event automations kept evergreen for new Discord platform changes",
    ],
    badge: "Community favourite",
    targetAudience: "Creators, SaaS teams, community studios",
    ctaLabel: "Book a scoping session",
    ctaUrl: "https://example.com/bot-factory",
    contact: "team@botfactory.gg",
    isSpotlight: true,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
    steward: "System",
  },
  {
    id: "automation-taskforce",
    builderName: "Automation Taskforce",
    tagline: "Deploy high-availability Discord apps with slash commands, dashboards, and billing integration.",
    price: "Custom retainers",
    highlights: [
      "Dedicated SRE on-call with latency and uptime SLA dashboards",
      "Elastic infrastructure with autoscaling containers across three regions",
      "Paid subscription tooling with Stripe, Ko-fi, and Patreon sync",
      "Security reviews, permission audits, and compliance-ready docs",
    ],
    badge: "Enterprise ready",
    targetAudience: "Enterprises, large creator networks, esports leagues",
    ctaLabel: "Schedule an architecture review",
    ctaUrl: "https://example.com/automation-taskforce",
    contact: "hello@automationtaskforce.dev",
    isSpotlight: false,
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-01T12:00:00.000Z",
    steward: "System",
  },
];

const emptyForm: BotAdForm = {
  builderName: "",
  tagline: "",
  price: "",
  highlightsText: "",
  badge: "",
  targetAudience: "",
  ctaLabel: "",
  ctaUrl: "",
  contact: "",
};

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `bot-ad-${Math.random().toString(36).slice(2, 10)}`;
};

const formatTimestamp = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const BotsPage = () => {
  const [ads, setAds] = useState<BotAd[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ADS;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_ADS;
      const parsed = JSON.parse(stored) as BotAd[];
      if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ADS;
      return parsed;
    } catch {
      return DEFAULT_ADS;
    }
  });
  const [form, setForm] = useState<BotAdForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [roleLabel, setRoleLabel] = useState<string>("");
  const [canManage, setCanManage] = useState(false);
  const [currentUserIdentity, setCurrentUserIdentity] = useState<string | null>(null);
  const [currentUserIdentityKey, setCurrentUserIdentityKey] = useState<string | null>(null);

  const normalizeIdentity = (value?: string | null) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

  const isAdOwner = (ad: BotAd) => {
    if (!currentUserIdentityKey) return false;
    return normalizeIdentity(ad.steward) === currentUserIdentityKey;
  };

  const canManageAd = (ad: BotAd) => canManage || isAdOwner(ad);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    } catch {
      // ignore persistence issues
    }
  }, [ads]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const evaluateAccess = () => {
      try {
        const raw = window.localStorage.getItem("currentUser");
        if (!raw) {
          setRoleLabel("");
          setCanManage(false);
          setCurrentUserIdentity(null);
          setCurrentUserIdentityKey(null);
          return;
        }

        const parsed = JSON.parse(raw) as UnknownUser;
        const canonical = collectCanonicalRoles(parsed, BOT_ROLE_SYNONYMS);
        const hasAdmin = canonical.has("admin");
        const hasBots = canonical.has("bots");

        setRoleLabel(formatRoleLabel(parsed));
        setCanManage(hasAdmin || hasBots);

        const identityCandidate = [
          typeof parsed?.name === "string" ? parsed.name : undefined,
          typeof (parsed as { email?: unknown })?.email === "string" ? (parsed as { email?: string }).email : undefined,
          typeof (parsed as { username?: unknown })?.username === "string" ? (parsed as { username?: string }).username : undefined,
        ].find((value) => value && value.trim().length);

        if (identityCandidate) {
          const trimmed = identityCandidate.trim();
          setCurrentUserIdentity(trimmed);
          setCurrentUserIdentityKey(trimmed.toLowerCase());
        } else {
          setCurrentUserIdentity(null);
          setCurrentUserIdentityKey(null);
        }
      } catch {
        setRoleLabel("");
        setCanManage(false);
        setCurrentUserIdentity(null);
        setCurrentUserIdentityKey(null);
      }
    };

    evaluateAccess();

    const authEvents = ["userUpdated", "storage", "sessionCreated", "logout"] as const;
    authEvents.forEach((event) => window.addEventListener(event, evaluateAccess));
    return () => {
      authEvents.forEach((event) => window.removeEventListener(event, evaluateAccess));
    };
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 3500);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const sortedAds = useMemo(() => {
    return [...ads].sort((a, b) => (b.isSpotlight ? 1 : 0) - (a.isSpotlight ? 1 : 0));
  }, [ads]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (field: keyof BotAdForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) return;

    const highlights = form.highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!form.builderName.trim()) {
      setStatusMessage("Builder name is required.");
      return;
    }
    if (!form.ctaLabel.trim() || !form.ctaUrl.trim()) {
      setStatusMessage("CTA label and URL are required.");
      return;
    }

    const timestamp = new Date().toISOString();

    const stewardIdentity = currentUserIdentity || roleLabel || "Bot steward";

    if (editingId) {
      const targetAd = ads.find((ad) => ad.id === editingId);
      if (!targetAd) return;
      if (!canManageAd(targetAd)) {
        setStatusMessage("You can only update adverts you created.");
        return;
      }

      setAds((prev) =>
        prev.map((ad) => {
          if (ad.id !== editingId) return ad;
          return {
            ...ad,
            builderName: form.builderName.trim(),
            tagline: form.tagline.trim(),
            price: form.price.trim() || "Custom pricing",
            highlights,
            badge: form.badge.trim() || undefined,
            targetAudience: form.targetAudience.trim() || undefined,
            ctaLabel: form.ctaLabel.trim(),
            ctaUrl: form.ctaUrl.trim(),
            contact: form.contact.trim() || undefined,
            updatedAt: timestamp,
            steward: ad.steward ?? stewardIdentity,
          };
        })
      );
      setStatusMessage("Discord bot/app advertisement updated.");
    } else {
      const newAd: BotAd = {
        id: generateId(),
        builderName: form.builderName.trim(),
        tagline: form.tagline.trim(),
        price: form.price.trim() || "Custom pricing",
        highlights,
        badge: form.badge.trim() || undefined,
        targetAudience: form.targetAudience.trim() || undefined,
        ctaLabel: form.ctaLabel.trim(),
        ctaUrl: form.ctaUrl.trim(),
        contact: form.contact.trim() || undefined,
        isSpotlight: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        steward: stewardIdentity,
      };
      setAds((prev) => [newAd, ...prev]);
      setStatusMessage("New Discord bot/app advertisement published.");
    }

    resetForm();
  };

  const handleEdit = (ad: BotAd) => {
    if (!canManageAd(ad)) {
      setStatusMessage("You can only manage adverts you created.");
      return;
    }
    setEditingId(ad.id);
    setForm({
      builderName: ad.builderName,
      tagline: ad.tagline,
      price: ad.price,
      highlightsText: ad.highlights.join("\n"),
      badge: ad.badge ?? "",
      targetAudience: ad.targetAudience ?? "",
      ctaLabel: ad.ctaLabel,
      ctaUrl: ad.ctaUrl,
      contact: ad.contact ?? "",
    });
  };

  const handleDelete = (id: string) => {
    const target = ads.find((ad) => ad.id === id);
    if (!target) return;
    if (!canManageAd(target)) {
      setStatusMessage("You can only remove adverts you created.");
      return;
    }
    if (!confirm("Remove this Discord bot/app advertisement?")) return;
    setAds((prev) => prev.filter((ad) => ad.id !== id));
    setStatusMessage("Advertisement removed.");
    if (editingId === id) resetForm();
  };

  const toggleSpotlight = (id: string) => {
    const target = ads.find((ad) => ad.id === id);
    if (!target) return;
    if (!canManageAd(target)) {
      setStatusMessage("You can only update spotlight status on adverts you created.");
      return;
    }
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id !== id) return ad;
        return { ...ad, isSpotlight: !ad.isSpotlight };
      })
    );
  };

  const stats = useMemo(() => {
    const total = ads.length;
    const spotlight = ads.filter((ad) => ad.isSpotlight).length;
    const avgPrice = (() => {
      const numeric = ads
        .map((ad) => Number(ad.price.replace(/[^0-9.]/g, "")))
        .filter((value) => !Number.isNaN(value));
      if (!numeric.length) return "Custom pricing";
      const sum = numeric.reduce((acc, value) => acc + value, 0);
      return `$${Math.round(sum / numeric.length)}/mo avg`;
    })();
    return { total, spotlight, avgPrice };
  }, [ads]);

  return (
    <div className="flex flex-col gap-12 p-8 lg:gap-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_65%)]"
          aria-hidden
        ></div>
        <div className="relative flex flex-col gap-8 p-10 lg:p-16">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              Discord Bot &amp; App creator marketplace
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Spotlight your automation studio for the communities that need you.
            </h1>
            <p className="text-lg text-blue-100">
              Curate launch-ready Discord bot offerings, custom integrations, and app extensions. Feature your best work so teams can hire the right builders without the guesswork.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-blue-100">Active builder profiles</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="text-3xl font-bold">{stats.spotlight}</div>
              <div className="text-sm text-blue-100">Spotlight placements</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="text-3xl font-bold">{stats.avgPrice}</div>
              <div className="text-sm text-blue-100">Average advertised rate</div>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Live Discord bot/app listings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Spotlight ads surface first; toggle placements to keep offers fresh.</p>
          </div>
          <div className="rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
            Data syncs locally — perfect for mock data demos.
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {sortedAds.map((ad) => (
            <article
              key={ad.id}
              className={`relative flex h-full flex-col gap-5 rounded-2xl border p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900/70 ${
                ad.isSpotlight ? "border-indigo-400/70 bg-indigo-50/80 dark:border-indigo-500/50 dark:bg-indigo-900/10" : "border-gray-200 bg-white"
              }`}
            >
              {ad.badge && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:border-indigo-500/40 dark:text-indigo-200">
                  {ad.badge}
                </span>
              )}
              <div className="space-y-2">
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">{ad.builderName}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{ad.tagline}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {ad.price}
                </span>
                {ad.targetAudience && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {ad.targetAudience}
                  </span>
                )}
                {ad.contact && <span className="truncate text-gray-500 dark:text-gray-400">{ad.contact}</span>}
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {ad.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <a
                  href={ad.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
                >
                  {ad.ctaLabel}
                  <span aria-hidden>→</span>
                </a>
                <span className="text-xs text-gray-500 dark:text-gray-400">Updated {formatTimestamp(ad.updatedAt)}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Managed by {ad.steward || "Unknown"}</div>
                {canManageAd(ad) && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => handleEdit(ad)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-red-500/60 dark:text-red-300 dark:hover:bg-red-950/40"
                      onClick={() => handleDelete(ad.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                        ad.isSpotlight
                          ? "border border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-50 dark:border-amber-400/60 dark:bg-amber-900/20 dark:text-amber-200"
                          : "border border-gray-300/text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => toggleSpotlight(ad.id)}
                    >
                      {ad.isSpotlight ? "Remove spotlight" : "Mark spotlight"}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BotsPage;

