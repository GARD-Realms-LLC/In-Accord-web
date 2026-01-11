'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

// Use API base URL from env, or fallback to localhost:8000 for development
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface UserProfile {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  avatarUrl?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  passwordExpiresAt?: string;
  lastLogin?: string;
  website?: string;
  githubLogin?: string;
  discordLogin?: string;
  description?: string;
}

interface PasswordStrength {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  rules: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

type CanonicalBotRole = 'admin' | 'bots';

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

const BOT_AD_STORAGE_KEY = 'discord_bot_ads';
const HOSTING_AD_STORAGE_KEY = 'hosting_ads';

const BOT_ROLE_SYNONYMS: Record<string, CanonicalBotRole> = {
  admin: 'admin',
  administrator: 'admin',
  admins: 'admin',
  superadmin: 'admin',
  sysadmin: 'admin',
  'system admin': 'admin',
  'system-admin': 'admin',
  'bot admin': 'bots',
  'bot-admin': 'bots',
  'bots admin': 'bots',
  bot: 'bots',
  bots: 'bots',
  'bot builder': 'bots',
  'bot builders': 'bots',
  'bot-builder': 'bots',
  'bot dev': 'bots',
  'bot developer': 'bots',
  'automation lead': 'bots',
  automation: 'bots',
  'bot ops': 'bots',
  'bot-ops': 'bots',
  'automation squad': 'bots',
};

const collectCanonicalRoles = (
  user: UnknownUser,
  synonyms: Record<string, CanonicalBotRole>,
): Set<CanonicalBotRole> => {
  const canonical = new Set<CanonicalBotRole>();

  const register = (value: unknown) => {
    if (typeof value !== 'string') return;
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

const collectRoleTokens = (user: UnknownUser): Set<string> => {
  const tokens = new Set<string>();
  const register = (value: unknown) => {
    if (typeof value !== 'string') return;
    const matches = value.match(/[A-Za-z0-9]+/g);
    if (!matches) return;
    matches.forEach((match) => tokens.add(match.toLowerCase()));
  };

  register(user?.role);
  if (Array.isArray(user?.roles)) {
    user.roles.forEach(register);
  }

  return tokens;
};

const formatRoleLabel = (user: UnknownUser): string => {
  if (Array.isArray(user?.roles) && user.roles.length) {
    return user.roles
      .filter((role) => typeof role === 'string' && role.trim().length)
      .join(', ');
  }
  if (typeof user?.role === 'string' && user.role.trim().length) {
    return user.role;
  }
  return '';
};

const normalizeIdentity = (value?: string | null) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const emptyBotAdForm: BotAdForm = {
  builderName: '',
  tagline: '',
  price: '',
  highlightsText: '',
  badge: '',
  targetAudience: '',
  ctaLabel: '',
  ctaUrl: '',
  contact: '',
};

const emptyHostingAdForm: HostingAdForm = {
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

const generateBotAdId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `bot-ad-${Math.random().toString(36).slice(2, 10)}`;
};

const generateHostingAdId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `hosting-ad-${Math.random().toString(36).slice(2, 10)}`;
};

const formatBotAdTimestamp = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const checkPasswordStrength = (pwd: string): PasswordStrength => {
  const rules = {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  };

  const score = Object.values(rules).filter(Boolean).length;
  let level: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  
  if (score >= 4) level = 'strong';
  else if (score === 3) level = 'good';
  else if (score === 2) level = 'fair';

  return { score, level, rules };
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    username: '',
    website: '',
    githubLogin: '',
    discordLogin: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [botAdForm, setBotAdForm] = useState<BotAdForm>(emptyBotAdForm);
  const [botStatusMessage, setBotStatusMessage] = useState<string | null>(null);
  const [botRoleLabel, setBotRoleLabel] = useState('');
  const [canPublishBotAd, setCanPublishBotAd] = useState(false);
  const [botIdentity, setBotIdentity] = useState<string | null>(null);
  const [editingBotAdId, setEditingBotAdId] = useState<string | null>(null);
  const [userBotAds, setUserBotAds] = useState<BotAd[]>([]);
  const [hostingForm, setHostingForm] = useState<HostingAdForm>(emptyHostingAdForm);
  const [hostingStatusMessage, setHostingStatusMessage] = useState<string | null>(null);
  const [hostingRoleLabel, setHostingRoleLabel] = useState('');
  const [canPublishHostingAd, setCanPublishHostingAd] = useState(false);
  const [editingHostingAdId, setEditingHostingAdId] = useState<string | null>(null);
  const [hostingAds, setHostingAds] = useState<HostingAd[]>([]);
  const resetBotAdForm = useCallback(() => {
    setBotAdForm(emptyBotAdForm);
    setEditingBotAdId(null);
  }, []);
  const resetHostingForm = useCallback(() => {
    setHostingForm(emptyHostingAdForm);
    setEditingHostingAdId(null);
  }, []);

  const hostingAdsFromStorage = (): HostingAd[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(HOSTING_AD_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as HostingAd[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const setHostingAdsInStorage = (ads: HostingAd[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(HOSTING_AD_STORAGE_KEY, JSON.stringify(ads));
    window.dispatchEvent(new Event('hostingAdsUpdated'));
  };

  const handleHostingFormChange = (field: keyof HostingAdForm, value: string) => {
    setHostingForm((prev) => ({ ...prev, [field]: value }));
  };

  const resolveHostingManager = () => {
    const candidates = [
      profile?.name,
      profile?.email,
      botIdentity,
      hostingRoleLabel,
    ];
    const match = candidates.find((candidate) => candidate && candidate.toString().trim().length);
    return match ? match.toString().trim() : 'Hosting Manager';
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get current user from localStorage
        const currentUserStr = typeof window !== 'undefined' ? window.localStorage.getItem('currentUser') : null;
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

        if (!currentUser) {
          setMessage('Please log in first');
          setLoading(false);
          return;
        }

        // Fetch all users and find the current user
        const res = await fetch(`${API_BASE}/api/admin/users`);
        if (!res.ok) {
          console.error('Failed to fetch users:', res.status);
          setMessage('Failed to load profile from server');
          setLoading(false);
          return;
        }

        const data = await res.json();
        const users: UserProfile[] = data.users || [];
        
        if (!users || users.length === 0) {
          console.warn('No users returned from server');
          setMessage('No users found on server');
          setLoading(false);
          return;
        }

        // First try to find by userId/id
        let user = users.find(u => (u.id === currentUser.id || u.id === currentUser.userId || u.userId === currentUser.id || u.userId === currentUser.userId));
        
        // If not found, try by name and email
        if (!user) {
          user = users.find(u => u.name === currentUser.name || u.email === currentUser.email);
        }
        
        // If not found by exact match, try case-insensitive match
        if (!user) {
          user = users.find(u => 
            (u.name && u.name.toLowerCase() === currentUser.name?.toLowerCase()) || 
            (u.email && u.email.toLowerCase() === currentUser.email?.toLowerCase())
          );
        }

        // If still not found, use first user as fallback (for testing)
        if (!user && users.length > 0) {
          console.warn('User not found, using first user as fallback');
          user = users[0];
        }

        if (user) {
          setProfile(user);
          // Never hydrate password into form state
          const { password: _ignoredPassword, ...rest } = user as any;
          setFormData(rest);
          // Ensure avatar URL is absolute
          let avatarToShow = user.avatarUrl || currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
          if (avatarToShow && avatarToShow.startsWith('/data/')) {
            avatarToShow = `${API_BASE}${avatarToShow}`;
          }
          setAvatarUrl(avatarToShow);
        } else {
          console.error('No matching user found');
          setMessage('User profile not found');
        }
      } catch (e) {
        console.error('Failed to load profile', e);
        setMessage(`Failed to load profile: ${e instanceof Error ? e.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const evaluateAccess = () => {
      try {
        const raw = window.localStorage.getItem('currentUser');
        let parsedUser: UnknownUser = raw ? JSON.parse(raw) : {};

        if (!raw && profile) {
          parsedUser = {
            role: profile.role,
            roles: (profile as UnknownUser)?.roles,
            name: profile.name,
            email: profile.email,
            username: profile.username,
          } as UnknownUser;
        }

        const canonical = collectCanonicalRoles(parsedUser, BOT_ROLE_SYNONYMS);
        const hasAdmin = canonical.has('admin');
        const hasBots = canonical.has('bots');
        const roleTokens = collectRoleTokens(parsedUser);
        const hasHosting = roleTokens.has('hosting') || roleTokens.has('host');

        setCanPublishBotAd(hasAdmin || hasBots);
        const formattedRole = formatRoleLabel(parsedUser) || (typeof profile?.role === 'string' ? profile.role : '');
        setBotRoleLabel(formattedRole);
        setCanPublishHostingAd(hasAdmin || hasHosting);
        setHostingRoleLabel(formattedRole);

        const identityCandidate = [
          typeof (parsedUser as { name?: unknown })?.name === 'string' ? (parsedUser as { name?: string }).name : undefined,
          typeof (parsedUser as { email?: unknown })?.email === 'string' ? (parsedUser as { email?: string }).email : undefined,
          typeof (parsedUser as { username?: unknown })?.username === 'string' ? (parsedUser as { username?: string }).username : undefined,
          typeof profile?.name === 'string' ? profile.name : undefined,
          typeof profile?.email === 'string' ? profile.email : undefined,
        ].find((value) => value && value.trim().length);

        if (identityCandidate) {
          const trimmed = identityCandidate.trim();
          const normalized = normalizeIdentity(trimmed);
          setBotIdentity(normalized ? trimmed : null);
        } else {
          setBotIdentity(null);
        }
      } catch {
        setCanPublishBotAd(false);
        setBotRoleLabel('');
        setBotIdentity(null);
        setCanPublishHostingAd(false);
        setHostingRoleLabel('');
      }
    };

    evaluateAccess();

    const authEvents = ['userUpdated', 'storage', 'sessionCreated', 'logout'] as const;
    authEvents.forEach((event) => window.addEventListener(event, evaluateAccess));
    return () => {
      authEvents.forEach((event) => window.removeEventListener(event, evaluateAccess));
    };
  }, [profile]);

  useEffect(() => {
    if (!botStatusMessage) return;
    const timeout = window.setTimeout(() => setBotStatusMessage(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [botStatusMessage]);

  useEffect(() => {
    if (!hostingStatusMessage) return;
    const timeout = window.setTimeout(() => setHostingStatusMessage(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [hostingStatusMessage]);

  const identityKeys = useMemo(() => {
    const candidates = [
      botIdentity,
      profile?.name,
      profile?.email,
      profile?.username,
      profile?.discordLogin,
    ];

    const keys = new Set<string>();
    candidates.forEach((value) => {
      const normalized = normalizeIdentity(value);
      if (normalized) keys.add(normalized);
    });

    return Array.from(keys);
  }, [botIdentity, profile]);

  const refreshHostingAds = useCallback(() => {
    setHostingAds(hostingAdsFromStorage());
  }, []);

  useEffect(() => {
    refreshHostingAds();
    if (typeof window === 'undefined') return;
    const handler = () => refreshHostingAds();
    window.addEventListener('hostingAdsUpdated', handler);
    return () => window.removeEventListener('hostingAdsUpdated', handler);
  }, [refreshHostingAds]);

  const sortedHostingAds = useMemo(() => {
    return [...hostingAds].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [hostingAds]);

  const isBotAdOwner = useCallback(
    (ad: BotAd) => {
      const stewardKey = normalizeIdentity(ad.steward);
      if (!stewardKey) return false;
      return identityKeys.includes(stewardKey);
    },
    [identityKeys]
  );

  const refreshUserBotAds = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!identityKeys.length) {
      setUserBotAds([]);
      return;
    }

    try {
      const raw = window.localStorage.getItem(BOT_AD_STORAGE_KEY);
      if (!raw) {
        setUserBotAds([]);
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setUserBotAds([]);
        return;
      }

      const filtered = (parsed as BotAd[])
        .filter(isBotAdOwner)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      setUserBotAds(filtered);
    } catch {
      setUserBotAds([]);
    }
  }, [identityKeys, isBotAdOwner]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    refreshUserBotAds();
    window.addEventListener('botAdsUpdated', refreshUserBotAds);
    return () => {
      window.removeEventListener('botAdsUpdated', refreshUserBotAds);
    };
  }, [refreshUserBotAds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
      setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleBotAdSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof window === 'undefined') return;

    if (!canPublishBotAd) {
      setBotStatusMessage('You need the Admin or Bots role to publish ads.');
      return;
    }

    const highlights = botAdForm.highlightsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (!botAdForm.builderName.trim()) {
      setBotStatusMessage('Builder / studio name is required.');
      return;
    }

    if (!botAdForm.ctaLabel.trim() || !botAdForm.ctaUrl.trim()) {
      setBotStatusMessage('CTA label and URL are required.');
      return;
    }

    const timestamp = new Date().toISOString();
    const stewardIdentity = botIdentity || profile?.name || botRoleLabel || 'Bot steward';

    let existingAds: BotAd[] = [];
    try {
      const raw = window.localStorage.getItem(BOT_AD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existingAds = parsed as BotAd[];
        }
      }
    } catch {
      existingAds = [];
    }

    let updatedAds: BotAd[];
    let successMessage = 'Discord bot/app advertisement published!';

    if (editingBotAdId) {
      const targetAd = existingAds.find((ad) => ad.id === editingBotAdId);
      if (!targetAd) {
        setBotStatusMessage('Unable to locate the advertisement to update.');
        return;
      }

      if (!isBotAdOwner(targetAd)) {
        setBotStatusMessage('You can only edit advertisements you published.');
        return;
      }

      updatedAds = existingAds.map((ad) => {
        if (ad.id !== editingBotAdId) return ad;
        return {
          ...ad,
          builderName: botAdForm.builderName.trim(),
          tagline: botAdForm.tagline.trim(),
          price: botAdForm.price.trim() || 'Custom pricing',
          highlights,
          badge: botAdForm.badge.trim() || undefined,
          targetAudience: botAdForm.targetAudience.trim() || undefined,
          ctaLabel: botAdForm.ctaLabel.trim(),
          ctaUrl: botAdForm.ctaUrl.trim(),
          contact: botAdForm.contact.trim() || undefined,
          updatedAt: timestamp,
          steward: ad.steward || stewardIdentity,
        };
      });

      successMessage = 'Discord bot/app advertisement updated!';
    } else {
      const newAd: BotAd = {
        id: generateBotAdId(),
        builderName: botAdForm.builderName.trim(),
        tagline: botAdForm.tagline.trim(),
        price: botAdForm.price.trim() || 'Custom pricing',
        highlights,
        badge: botAdForm.badge.trim() || undefined,
        targetAudience: botAdForm.targetAudience.trim() || undefined,
        ctaLabel: botAdForm.ctaLabel.trim(),
        ctaUrl: botAdForm.ctaUrl.trim(),
        contact: botAdForm.contact.trim() || undefined,
        isSpotlight: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        steward: stewardIdentity,
      };

      updatedAds = [newAd, ...existingAds];
    }

    try {
      window.localStorage.setItem(BOT_AD_STORAGE_KEY, JSON.stringify(updatedAds));
      window.dispatchEvent(new Event('botAdsUpdated'));
    } catch {
      setBotStatusMessage('Unable to save advertisement locally. Please check storage permissions.');
      return;
    }

    setBotStatusMessage(successMessage);
    resetBotAdForm();
    refreshUserBotAds();
  };

  const handleBotAdEdit = (ad: BotAd) => {
    if (!canPublishBotAd) {
      setBotStatusMessage('You need the Admin or Bots role to manage advertisements.');
      return;
    }

    if (!isBotAdOwner(ad)) {
      setBotStatusMessage('You can only edit advertisements you published.');
      return;
    }

    setEditingBotAdId(ad.id);
    setBotAdForm({
      builderName: ad.builderName,
      tagline: ad.tagline,
      price: ad.price,
      highlightsText: ad.highlights.join('\n'),
      badge: ad.badge ?? '',
      targetAudience: ad.targetAudience ?? '',
      ctaLabel: ad.ctaLabel,
      ctaUrl: ad.ctaUrl,
      contact: ad.contact ?? '',
    });
  };

  const handleBotAdDelete = (ad: BotAd) => {
    if (typeof window === 'undefined') return;

    if (!canPublishBotAd) {
      setBotStatusMessage('You need the Admin or Bots role to manage advertisements.');
      return;
    }

    if (!isBotAdOwner(ad)) {
      setBotStatusMessage('You can only delete advertisements you published.');
      return;
    }

    if (!confirm('Remove this Discord bot/app advertisement?')) return;

    let existingAds: BotAd[] = [];
    try {
      const raw = window.localStorage.getItem(BOT_AD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existingAds = parsed as BotAd[];
        }
      }
    } catch {
      existingAds = [];
    }

    const updatedAds = existingAds.filter((current) => current.id !== ad.id);

    try {
      window.localStorage.setItem(BOT_AD_STORAGE_KEY, JSON.stringify(updatedAds));
      window.dispatchEvent(new Event('botAdsUpdated'));
    } catch {
      setBotStatusMessage('Unable to update advertisements in local storage.');
      return;
    }

    if (editingBotAdId === ad.id) {
      resetBotAdForm();
    }

    setBotStatusMessage('Advertisement removed.');
    refreshUserBotAds();
  };

  const handleBotAdToggleSpotlight = (ad: BotAd) => {
    if (typeof window === 'undefined') return;

    if (!canPublishBotAd) {
      setBotStatusMessage('You need the Admin or Bots role to manage advertisements.');
      return;
    }

    if (!isBotAdOwner(ad)) {
      setBotStatusMessage('You can only update spotlight status on advertisements you published.');
      return;
    }

    let existingAds: BotAd[] = [];
    try {
      const raw = window.localStorage.getItem(BOT_AD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existingAds = parsed as BotAd[];
        }
      }
    } catch {
      existingAds = [];
    }

    const updatedAds = existingAds.map((current) => {
      if (current.id !== ad.id) return current;
      return {
        ...current,
        isSpotlight: !current.isSpotlight,
        updatedAt: new Date().toISOString(),
      };
    });

    try {
      window.localStorage.setItem(BOT_AD_STORAGE_KEY, JSON.stringify(updatedAds));
      window.dispatchEvent(new Event('botAdsUpdated'));
    } catch {
      setBotStatusMessage('Unable to update advertisements in local storage.');
      return;
    }

    setBotStatusMessage(ad.isSpotlight ? 'Spotlight removed.' : 'Spotlight enabled.');
    refreshUserBotAds();
  };

  const handleHostingAdSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canPublishHostingAd || typeof window === 'undefined') return;

    const features = hostingForm.featuresText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (!hostingForm.planName.trim()) {
      setHostingStatusMessage('Plan name is required.');
      return;
    }

    if (!hostingForm.ctaLabel.trim() || !hostingForm.ctaUrl.trim()) {
      setHostingStatusMessage('CTA label and URL are required.');
      return;
    }

    const timestamp = new Date().toISOString();
    const managedBy = resolveHostingManager();

    const existing = hostingAdsFromStorage();
    let updatedAds: HostingAd[] = existing;

    if (editingHostingAdId) {
      const target = existing.find((ad) => ad.id === editingHostingAdId);
      if (!target) {
        setHostingStatusMessage('Unable to find advertisement to update.');
        return;
      }

      updatedAds = existing.map((ad) =>
        ad.id === editingHostingAdId
          ? {
              ...ad,
              planName: hostingForm.planName.trim(),
              shortDescription: hostingForm.shortDescription.trim(),
              pricePerMonth: hostingForm.pricePerMonth.trim() || 'Custom quote',
              features,
              badge: hostingForm.badge.trim() || undefined,
              targetAudience: hostingForm.targetAudience.trim() || undefined,
              ctaLabel: hostingForm.ctaLabel.trim(),
              ctaUrl: hostingForm.ctaUrl.trim(),
              contactEmail: hostingForm.contactEmail.trim() || undefined,
              updatedAt: timestamp,
              managedBy,
            }
          : ad,
      );
      setHostingStatusMessage('Hosting advertisement updated.');
    } else {
      const newAd: HostingAd = {
        id: generateHostingAdId(),
        planName: hostingForm.planName.trim(),
        shortDescription: hostingForm.shortDescription.trim(),
        pricePerMonth: hostingForm.pricePerMonth.trim() || 'Custom quote',
        features,
        badge: hostingForm.badge.trim() || undefined,
        targetAudience: hostingForm.targetAudience.trim() || undefined,
        ctaLabel: hostingForm.ctaLabel.trim(),
        ctaUrl: hostingForm.ctaUrl.trim(),
        contactEmail: hostingForm.contactEmail.trim() || undefined,
        isFeatured: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        managedBy,
      };

      updatedAds = [newAd, ...existing];
      setHostingStatusMessage('New hosting advertisement published.');
    }

    try {
      setHostingAdsInStorage(updatedAds);
      setHostingAds(updatedAds);
      resetHostingForm();
    } catch {
      setHostingStatusMessage('Failed to save hosting advertisement.');
    }
  };

  const handleHostingAdEdit = (ad: HostingAd) => {
    if (!canPublishHostingAd) return;
    setEditingHostingAdId(ad.id);
    setHostingForm({
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
    setHostingStatusMessage('Editing hosting advertisement.');
  };

  const handleHostingAdDelete = (id: string) => {
    if (!canPublishHostingAd || typeof window === 'undefined') return;
    if (!window.confirm('Remove this hosting advertisement?')) return;

    const remaining = hostingAdsFromStorage().filter((ad) => ad.id !== id);
    setHostingAdsInStorage(remaining);
    setHostingAds(remaining);

    if (editingHostingAdId === id) {
      resetHostingForm();
    }

    setHostingStatusMessage('Hosting advertisement removed.');
  };

  const handleHostingAdToggleFeatured = (id: string) => {
    if (!canPublishHostingAd || typeof window === 'undefined') return;

    const updated = hostingAdsFromStorage().map((ad) =>
      ad.id === id
        ? { ...ad, isFeatured: !ad.isFeatured, updatedAt: new Date().toISOString() }
        : ad,
    );

    setHostingAdsInStorage(updated);
    setHostingAds(updated);

    const target = updated.find((ad) => ad.id === id);
    if (target) {
      setHostingStatusMessage(target.isFeatured ? 'Marked as featured.' : 'Highlight removed.');
    }
  };
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setMessage('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setMessage('Email is required');
      return;
    }
    
    // Validate password if changing
    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        setMessage('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setMessage('Password must be at least 8 characters');
        return;
      }
      const strength = checkPasswordStrength(password);
      if (strength.level === 'weak') {
        setMessage('Password is too weak. Please use uppercase, lowercase, numbers, and special characters');
        return;
      }
    }

    setSaving(true);
    setMessage('');

    try {
      const userId = profile?.id || profile?.userId;
      if (!userId) {
        setMessage('User ID not found');
        setSaving(false);
        return;
      }

      // Upload avatar first when it's a new data URL so the profile save only stores a URL
      let avatarToUse = avatarUrl;
      if (avatarUrl && avatarUrl.startsWith('data:')) {
        console.log('Uploading avatar to server...');
        const avatarRes = await fetch(`${API_BASE}/api/admin/users/avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, dataUrl: avatarUrl }),
        });

        if (!avatarRes.ok) {
          const errorData = await avatarRes.json().catch(() => ({}));
          console.error('Failed to upload avatar:', avatarRes.status, errorData);
          setMessage(`Failed to upload avatar: ${errorData.error || avatarRes.statusText}`);
          setSaving(false);
          return;
        }

        const avatarData = await avatarRes.json();
        console.log('Avatar uploaded successfully:', avatarData);
        avatarToUse = avatarData.url || avatarUrl;
        setAvatarUrl(avatarToUse);
        setFormData(prev => ({ ...prev, avatarUrl: avatarToUse }));
      }

      // Send updated profile to server
      console.log('Saving profile with avatar:', avatarToUse);
      const response = await fetch(`${API_BASE}/api/admin/users/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user: { 
            ...formData,
            avatarUrl: avatarToUse,
            id: userId, 
            userId,
            ...(password && { password })
          } 
        }),
      });

      if (response.ok) {
        console.log('Profile saved successfully');
        const updatedProfile = { ...formData, avatarUrl: avatarToUse };
        setProfile(updatedProfile);
        setAvatarUrl(avatarToUse);
        setEditMode(false);
        setPassword('');
        setPasswordConfirm('');
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);

        // Update localStorage while preserving permission metadata
        const existingUserRaw = window.localStorage.getItem('currentUser');
        const existingUser = existingUserRaw ? JSON.parse(existingUserRaw) : {};
        const updatedUser = {
          ...existingUser,
          id: userId,
          userId: userId,
          name: formData.name,
          email: formData.email,
          username: formData.username,
          role: formData.role,
          avatar: avatarToUse,
          avatarUrl: avatarToUse,
        };
        console.log('Profile: Saving updatedUser to localStorage:', updatedUser);
        window.localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('Profile: userUpdated event dispatching...');
        
        // Update session avatar on server
        const sessionId = window.localStorage.getItem('sessionId');
        if (sessionId) {
          try {
            await fetch(`${API_BASE}/api/admin/sessions/update-avatar`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, avatar: avatarToUse }),
            });
          } catch (e) {
            console.warn('Failed to update session avatar', e);
          }
        }
        
        // Notify other components (like Navbar) that the user was updated
        window.dispatchEvent(new Event('userUpdated'));
        console.log('Profile: userUpdated event dispatched');
      } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to save profile:', response.status, errorData);
          setMessage(`Failed to save profile: ${errorData.error || response.statusText}`);
      }
    } catch (e) {
      console.error('Error saving profile', e);
      setMessage(`Error saving profile: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {
      name: '',
      email: '',
      username: '',
      website: '',
      githubLogin: '',
      discordLogin: '',
      description: '',
    });
    setPassword('');
    setPasswordConfirm('');
    setEditMode(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setMessage('Please type the exact confirmation text');
      return;
    }

    setDeleting(true);
    setMessage('');

    try {
      const userId = profile?.id || profile?.userId;
      if (!userId) {
        setMessage('User ID not found');
        setDeleting(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setMessage('Account deleted successfully');
        // Clear localStorage and redirect after a short delay
        setTimeout(() => {
          window.localStorage.removeItem('currentUser');
          window.localStorage.removeItem('sessionId');
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage('Failed to delete account');
      }
    } catch (e) {
      console.error('Error deleting account', e);
      setMessage('Error deleting account');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <div className="text-center text-red-600">{message || 'Please log in to view your profile'}</div>
      </div>
    );
  }

  return (
    <div className="p-4 w-3/4 mx-auto">
      {/* Header */}
      <section className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
      </section>
      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Avatar Section */}
        <div className="mb-4 text-center">
          <img
            src={avatarUrl}
            alt={formData.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`;
            }}
          />
          {editMode && (
            <div className="flex justify-center gap-2">
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm cursor-pointer">
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">{profile.email}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <p className="px-3 py-2 text-gray-900 dark:text-white">{profile.username || '—'}</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <p className="px-3 py-2 text-gray-900 dark:text-white">{profile.role || '—'}</p>
              </div>
            </div>
          </div>

          {/* Social & Web Links */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Social & Web Links</h3>
            
            <div className="space-y-3">
              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                {editMode ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">
                    {formData.website ? (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {formData.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </p>
                )}
              </div>

              {/* GitHub Login */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Username</label>
                {editMode ? (
                  <input
                    type="text"
                    name="githubLogin"
                    value={formData.githubLogin || ''}
                    onChange={handleInputChange}
                    placeholder="your-github-username"
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">
                    {formData.githubLogin ? (
                      <a href={`https://github.com/${formData.githubLogin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        @{formData.githubLogin}
                      </a>
                    ) : (
                      '—'
                    )}
                  </p>
                )}
              </div>

              {/* Discord Login */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discord Username</label>
                {editMode ? (
                  <input
                    type="text"
                    name="discordLogin"
                    value={formData.discordLogin || ''}
                    onChange={handleInputChange}
                    placeholder="Discord#1234"
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">{formData.discordLogin || '—'}</p>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">About</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Description</label>
              {editMode ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="px-3 py-2 text-gray-900 dark:text-white whitespace-pre-wrap">{formData.description || '—'}</p>
              )}
            </div>
          </div>

          {/* Password Reset */}
          {editMode && (
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Change Password</h3>
              
              <div className="space-y-3">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (leave blank to keep current)"
                    autoComplete="new-password"
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strength:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => {
                          const strength = checkPasswordStrength(password);
                          const filled = i < strength.score;
                          const bgColor =
                            strength.level === 'strong'
                              ? 'bg-green-500'
                              : strength.level === 'good'
                              ? 'bg-blue-500'
                              : strength.level === 'fair'
                              ? 'bg-yellow-500'
                              : 'bg-red-500';
                          return (
                            <div
                              key={i}
                              className={`h-2 w-8 rounded ${filled ? bgColor : 'bg-gray-300 dark:bg-gray-600'}`}
                            />
                          );
                        })}
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          checkPasswordStrength(password).level === 'strong'
                            ? 'text-green-600 dark:text-green-400'
                            : checkPasswordStrength(password).level === 'good'
                            ? 'text-blue-600 dark:text-blue-400'
                            : checkPasswordStrength(password).level === 'fair'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {checkPasswordStrength(password).level.charAt(0).toUpperCase() + checkPasswordStrength(password).level.slice(1)}
                      </span>
                    </div>

                    {/* Password Rules */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-1">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                      {(() => {
                        const rules = checkPasswordStrength(password).rules;
                        return (
                          <>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={rules.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                {rules.minLength ? '✓' : '○'}
                              </span>
                              <span className={rules.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                At least 8 characters
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={rules.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                {rules.hasUppercase ? '✓' : '○'}
                              </span>
                              <span className={rules.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                One uppercase letter (A-Z)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={rules.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                {rules.hasLowercase ? '✓' : '○'}
                              </span>
                              <span className={rules.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                One lowercase letter (a-z)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={rules.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                {rules.hasNumber ? '✓' : '○'}
                              </span>
                              <span className={rules.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                One number (0-9)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={rules.hasSpecial ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                {rules.hasSpecial ? '✓' : '○'}
                              </span>
                              <span className={rules.hasSpecial ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                                One special character (!@#$%^&* etc)
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                {password && passwordConfirm && password !== passwordConfirm && (
                  <p className="text-sm text-red-600 dark:text-red-400">✗ Passwords do not match</p>
                )}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Account Created</label>
                <p className="text-gray-900 dark:text-white">{profile.createdAt || '—'}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <p className="text-gray-900 dark:text-white">{profile.status || 'Active'}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Last Login</label>
                <p className="text-gray-900 dark:text-white">{profile.lastLogin || '—'}</p>
              </div>
              {profile.passwordExpiresAt && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Password Expires</label>
                  <p className="text-gray-900 dark:text-white">{profile.passwordExpiresAt}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 justify-between items-center">
          <div className="flex gap-3">
            {!editMode ? (
              <button
                onClick={() => {
                  setPassword('');
                  setPasswordConfirm('');
                  setEditMode(true);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {editMode && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Delete Account
            </button>
          )}
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border-l-4 border-red-600">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delete Account</h2>
              
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-4 mb-4">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  ⚠️ Warning: This action cannot be undone
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Once you delete your account, there is no going back. All your data will be permanently removed including:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc list-inside space-y-1">
                  <li>Your profile information</li>
                  <li>All your account data</li>
                  <li>Your settings and preferences</li>
                </ul>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  To confirm deletion, type: <span className="font-bold">DELETE MY ACCOUNT</span>
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type confirmation text here"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE MY ACCOUNT' || deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-10 border-t-2 border-gray-300 dark:border-gray-700" aria-hidden="true" />

  <div className="mb-4" aria-hidden="true" />
  <div className="mb-4" aria-hidden="true" />

      <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Published Advertisements</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manage Discord bot and app listings that sync to the Bots marketplace experience.
        </p>
      </section>

      <section className="mb-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Discord Bot/App creators advertising</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Publish new automation offers that will appear on the Bots marketplace page. Listings save locally for demos and prototypes.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
            {botRoleLabel || 'Role not detected'}
          </span>
        </header>

        {!canPublishBotAd && (
          <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/80 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
            <strong className="font-semibold">Restricted actions:</strong> add adverts once you have the Admin or Bots role. Browsing remains open to everyone.
          </div>
        )}

        <form className="grid gap-6" onSubmit={handleBotAdSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Builder / Studio name</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.builderName}
                onChange={(event) => handleBotAdChange('builderName', event.target.value)}
                placeholder="Automation Guild"
                disabled={!canPublishBotAd}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Price / Packaging</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.price}
                onChange={(event) => handleBotAdChange('price', event.target.value)}
                placeholder="$199 setup + $49/mo"
                disabled={!canPublishBotAd}
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-800 dark:text-gray-200">Tagline</span>
            <input
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
              value={botAdForm.tagline}
              onChange={(event) => handleBotAdChange('tagline', event.target.value)}
              placeholder="Ship custom command suites and dashboards in days."
              disabled={!canPublishBotAd}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-gray-800 dark:text-gray-200">Highlights (one per line)</span>
            <textarea
              className="min-h-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
              value={botAdForm.highlightsText}
              onChange={(event) => handleBotAdChange('highlightsText', event.target.value)}
              placeholder={'24/7 on-call support\nCross-platform dashboard builds\nAuto-provisioning across regions'}
              disabled={!canPublishBotAd}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Audience</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.targetAudience}
                onChange={(event) => handleBotAdChange('targetAudience', event.target.value)}
                placeholder="SaaS teams, community studios"
                disabled={!canPublishBotAd}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Badge / Flag</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.badge}
                onChange={(event) => handleBotAdChange('badge', event.target.value)}
                placeholder="Launch partner"
                disabled={!canPublishBotAd}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Contact email / handle</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.contact}
                onChange={(event) => handleBotAdChange('contact', event.target.value)}
                placeholder="contact@studio.dev"
                disabled={!canPublishBotAd}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">CTA label</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.ctaLabel}
                onChange={(event) => handleBotAdChange('ctaLabel', event.target.value)}
                placeholder="Book a build sprint"
                disabled={!canPublishBotAd}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">CTA URL</span>
              <input
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                value={botAdForm.ctaUrl}
                onChange={(event) => handleBotAdChange('ctaUrl', event.target.value)}
                placeholder="https://example.com/book"
                disabled={!canPublishBotAd}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {editingBotAdId
                ? 'Editing an existing advertisement. Save to update the live listing.'
                : 'Publishing creates a new advertisement that syncs to the Bots marketplace.'}
            </div>
            <div className="flex gap-3">
              {editingBotAdId ? (
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={resetBotAdForm}
                  disabled={!canPublishBotAd}
                >
                  Cancel edit
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={resetBotAdForm}
                  disabled={!canPublishBotAd && !botAdForm.builderName && !botAdForm.tagline && !botAdForm.highlightsText}
                >
                  Clear form
                </button>
              )}
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300"
                disabled={!canPublishBotAd}
              >
                {editingBotAdId ? 'Save changes' : 'Publish advertisement'}
              </button>
            </div>
          </div>
        </form>

        {botStatusMessage && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200">
            {botStatusMessage}
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Manage your listings anytime from the Bots dashboard. Only Admin or Bots roles can edit or remove live placements.
        </p>
      </section>

      <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Live Discord bot/app listings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track and adjust the listings you published. Changes here mirror what appears on the Bots marketplace page.
            </p>
          </div>
          <span className="rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
            {userBotAds.length} {userBotAds.length === 1 ? 'listing' : 'listings'}
          </span>
        </header>

        {userBotAds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Publish an advertisement above to populate your personal roster.
          </div>
        ) : (
          <>
            {!canPublishBotAd && (
              <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/60 dark:bg-amber-900/20 dark:text-amber-200">
                Buttons stay disabled until you regain the Admin or Bots role.
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              {userBotAds.map((ad) => (
                <article
                  key={ad.id}
                  className={`relative flex h-full flex-col gap-5 rounded-2xl border p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900/70 ${
                    ad.isSpotlight
                      ? 'border-indigo-400/70 bg-indigo-50/80 dark:border-indigo-500/50 dark:bg-indigo-900/10'
                      : 'border-gray-200 bg-white'
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
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated {formatBotAdTimestamp(ad.updatedAt)}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Managed by {ad.steward || 'Unknown'}</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        onClick={() => handleBotAdEdit(ad)}
                        disabled={!canPublishBotAd}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/60 dark:text-red-300 dark:hover:bg-red-950/40"
                        onClick={() => handleBotAdDelete(ad)}
                        disabled={!canPublishBotAd}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                          ad.isSpotlight
                            ? 'border border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-50 dark:border-amber-400/60 dark:bg-amber-900/20 dark:text-amber-200'
                            : 'border border-gray-300/text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleBotAdToggleSpotlight(ad)}
                        disabled={!canPublishBotAd}
                      >
                        {ad.isSpotlight ? 'Remove spotlight' : 'Mark spotlight'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

        <div className="h-12" aria-hidden="true" />

      <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20">
        <h2 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Hosting marketplace spotlight</h2>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
          Surface premium plans and curated bundles before managing the full hosting catalogue below.
        </p>
      </section>

      <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Manage hosting advertisements</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Publish new offers, highlight seasonal promos, or keep pricing aligned with your go-to-market moves.
            </p>
          </div>
          <div className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Role: {hostingRoleLabel || 'Unknown'}
          </div>
        </header>

        {!canPublishHostingAd && (
          <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-400/60 dark:bg-emerald-900/20 dark:text-emerald-200">
            You need the Admin or Hosting role to publish hosting advertisements. Browse live offers from the Hosting page instead.
          </div>
        )}

        <form onSubmit={handleHostingAdSubmit} className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan name</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.planName}
                onChange={(event) => handleHostingFormChange('planName', event.target.value)}
                placeholder="e.g. HyperScale Pro"
                disabled={!canPublishHostingAd}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price per month</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.pricePerMonth}
                onChange={(event) => handleHostingFormChange('pricePerMonth', event.target.value)}
                placeholder="$79/mo"
                disabled={!canPublishHostingAd}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short description</label>
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.shortDescription}
                onChange={(event) => handleHostingFormChange('shortDescription', event.target.value)}
                placeholder="Explain who this plan delights and the outcome it delivers."
                disabled={!canPublishHostingAd}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature bullet points</label>
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-mono dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.featuresText}
                onChange={(event) => handleHostingFormChange('featuresText', event.target.value)}
                placeholder={'One feature per line\nAutoscaling across three regions\nManaged backups and snapshots'}
                disabled={!canPublishHostingAd}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">One feature per line. Markdown not required.</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Badge / promo tag</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.badge}
                onChange={(event) => handleHostingFormChange('badge', event.target.value)}
                placeholder="Most popular"
                disabled={!canPublishHostingAd}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target audience</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.targetAudience}
                onChange={(event) => handleHostingFormChange('targetAudience', event.target.value)}
                placeholder="Agencies, SaaS teams"
                disabled={!canPublishHostingAd}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CTA label</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.ctaLabel}
                onChange={(event) => handleHostingFormChange('ctaLabel', event.target.value)}
                placeholder="Launch in 5 minutes"
                disabled={!canPublishHostingAd}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CTA URL</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.ctaUrl}
                onChange={(event) => handleHostingFormChange('ctaUrl', event.target.value)}
                placeholder="https://"
                disabled={!canPublishHostingAd}
                required
                type="url"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact email (optional)</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                value={hostingForm.contactEmail}
                onChange={(event) => handleHostingFormChange('contactEmail', event.target.value)}
                placeholder="team@example.com"
                disabled={!canPublishHostingAd}
                type="email"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={!canPublishHostingAd}
            >
              {editingHostingAdId ? 'Update advertisement' : 'Publish advertisement'}
            </button>
            {editingHostingAdId && (
              <button
                type="button"
                onClick={resetHostingForm}
                className="text-sm font-medium text-gray-600 underline-offset-2 transition hover:text-gray-900 hover:underline dark:text-gray-300"
                disabled={!canPublishHostingAd}
              >
                Cancel edit
              </button>
            )}
            {!editingHostingAdId && (
              <button
                type="button"
                onClick={resetHostingForm}
                className="text-sm font-medium text-gray-600 underline-offset-2 transition hover:text-gray-900 hover:underline dark:text-gray-300"
                disabled={!canPublishHostingAd && !hostingForm.planName && !hostingForm.ctaLabel && !hostingForm.ctaUrl}
              >
                Clear form
              </button>
            )}
          </div>
        </form>

        {hostingStatusMessage && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
            {hostingStatusMessage}
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Published ads immediately sync to the Hosting marketplace page for prospects to explore.
        </p>
      </section>

        <div className="h-12" aria-hidden="true" />

      {canPublishHostingAd && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Administrative actions</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">{hostingAds.length} ads under management</span>
          </header>
          {hostingAds.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Publish a hosting advertisement above to populate your management list.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 text-sm dark:divide-gray-700">
              {sortedHostingAds.map((ad) => (
                <div key={ad.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ad.planName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ad.pricePerMonth} · {ad.features.length} features · {ad.isFeatured ? 'Featured' : 'Standard'} placement
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleHostingAdToggleFeatured(ad.id)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                        ad.isFeatured
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {ad.isFeatured ? 'Remove highlight' : 'Mark as featured'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHostingAdEdit(ad)}
                      className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHostingAdDelete(ad.id)}
                      className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Profile;