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
          return;
        }

        const parsed = JSON.parse(raw) as UnknownUser;
        const canonical = collectCanonicalRoles(parsed, BOT_ROLE_SYNONYMS);
        const hasAdmin = canonical.has("admin");
        const hasBots = canonical.has("bots");

        setRoleLabel(formatRoleLabel(parsed));
        setCanManage(hasAdmin || hasBots);
      } catch {
        setRoleLabel("");
        setCanManage(false);
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

    if (editingId) {
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
            steward: roleLabel || "Bot steward",
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
        steward: roleLabel || "Bot steward",
      };
      setAds((prev) => [newAd, ...prev]);
      setStatusMessage("New Discord bot/app advertisement published.");
    }

    resetForm();
  };

  const handleEdit = (ad: BotAd) => {
    if (!canManage) return;
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
    if (!canManage) return;
    if (!confirm("Remove this Discord bot/app advertisement?")) return;
    setAds((prev) => prev.filter((ad) => ad.id !== id));
    setStatusMessage("Advertisement removed.");
    if (editingId === id) resetForm();
  };

  const toggleSpotlight = (id: string) => {
    if (!canManage) return;
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

      <section className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Discord Bot/App creators advertising</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Publish new automation offers, edit live placements, and keep your roster fresh. Anyone can browse; only Admin or Bots roles can publish or adjust listings.
            </p>
          </div>
          <div className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
            {roleLabel || "Role not detected"}
          </div>
        </header>

        {!canManage && (
          <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/80 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
            <strong className="font-semibold">Restricted actions:</strong> add, edit, or remove adverts once you have the Admin or Bots role. Browsing remains open to everyone.
          </div>
        )}

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Builder / Studio name</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.builderName}
                onChange={(event) => handleChange("builderName", event.target.value)}
                placeholder="Automation Guild"
                disabled={!canManage}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Price / Packaging</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.price}
                onChange={(event) => handleChange("price", event.target.value)}
                placeholder="$199 setup + $49/mo"
                disabled={!canManage}
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-800 dark:text-gray-200">Tagline</span>
            <input
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
              value={form.tagline}
              onChange={(event) => handleChange("tagline", event.target.value)}
              placeholder="Ship custom command suites and dashboards in days."
              disabled={!canManage}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-800 dark:text-gray-200">Highlights (one per line)</span>
            <textarea
              className="min-h-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
              value={form.highlightsText}
              onChange={(event) => handleChange("highlightsText", event.target.value)}
              placeholder={"24/7 on-call support\nCross-platform dashboard builds\nAuto-provisioning across regions"}
              disabled={!canManage}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Audience</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.targetAudience}
                onChange={(event) => handleChange("targetAudience", event.target.value)}
                placeholder="SaaS teams, community studios"
                disabled={!canManage}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Badge / Flag</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.badge}
                onChange={(event) => handleChange("badge", event.target.value)}
                placeholder="Launch partner"
                disabled={!canManage}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Contact email / handle</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.contact}
                onChange={(event) => handleChange("contact", event.target.value)}
                placeholder="contact@studio.dev"
                disabled={!canManage}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">CTA label</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.ctaLabel}
                onChange={(event) => handleChange("ctaLabel", event.target.value)}
                placeholder="Book a build sprint"
                disabled={!canManage}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">CTA URL</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={form.ctaUrl}
                onChange={(event) => handleChange("ctaUrl", event.target.value)}
                placeholder="https://example.com/book"
                disabled={!canManage}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {editingId ? "Editing an existing advertisement" : "Publishing creates a new advertisement"}
            </div>
            <div className="flex gap-3">
              {editingId && (
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={resetForm}
                  disabled={!canManage}
                >
                  Cancel edit
                </button>
              )}
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300"
                disabled={!canManage}
              >
                {editingId ? "Save changes" : "Publish advertisement"}
              </button>
            </div>
          </div>
        </form>

        {statusMessage && (
          <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200">
            {statusMessage}
          </div>
        )}
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={() => handleEdit(ad)}
                    disabled={!canManage}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/60 dark:text-red-300 dark:hover:bg-red-950/40"
                    onClick={() => handleDelete(ad.id)}
                    disabled={!canManage}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                      ad.isSpotlight
                        ? "border border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-50 dark:border-amber-400/60 dark:bg-amber-900/20 dark:text-amber-200"
                        : "border border-gray-300/text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => toggleSpotlight(ad.id)}
                    disabled={!canManage}
                  >
                    {ad.isSpotlight ? "Remove spotlight" : "Mark spotlight"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BotsPage;

