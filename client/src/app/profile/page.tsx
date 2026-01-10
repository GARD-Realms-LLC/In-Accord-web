'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

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
          setAvatarUrl(user.avatarUrl || currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`);
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
        return;
      }

      // Upload avatar first when it's a new data URL so the profile save only stores a URL
      let avatarToUse = avatarUrl;
      if (avatarUrl && avatarUrl.startsWith('data:')) {
        const avatarRes = await fetch(`${API_BASE}/api/admin/users/avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, dataUrl: avatarUrl }),
        });

        if (!avatarRes.ok) {
          const errorData = await avatarRes.json().catch(() => ({}));
          console.error('Failed to upload avatar:', avatarRes.status, errorData);
          setMessage(`Failed to upload avatar: ${errorData.error || avatarRes.statusText}`);
          return;
        }

        const avatarData = await avatarRes.json();
        avatarToUse = avatarData.url || avatarUrl;
        setAvatarUrl(avatarToUse);
        setFormData(prev => ({ ...prev, avatarUrl: avatarToUse }));
      }

      // Send updated profile to server
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
        setProfile(formData);
        setEditMode(false);
        setPassword('');
        setPasswordConfirm('');
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);

        // Update localStorage
        const updatedUser = {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          avatar: avatarToUse,
        };
        window.localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to save profile:', response.status, errorData);
          setMessage(`Failed to save profile: ${errorData.error || response.statusText}`);
      }
    } catch (e) {
      console.error('Error saving profile', e);
      setMessage('Error saving profile');
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
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
      </div>

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
    </div>
  );
};

export default Profile;