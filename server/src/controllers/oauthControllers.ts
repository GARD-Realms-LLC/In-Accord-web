import { Request, Response } from 'express';
import integrationStore from '../integrationStore';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
const CONFIG_PATH = path.resolve(__dirname, '..', '..', 'data', 'oauth-config.json');

async function readStoredConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8').catch(() => '{}');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

export async function githubAuthUrl(req: Request, res: Response) {
  const stored = await readStoredConfig();
  const clientId = process.env.GITHUB_CLIENT_ID || stored.github?.clientId || '';
  const redirect = process.env.GITHUB_REDIRECT_URI || stored.github?.redirectUri || `${BASE_URL}/api/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user%20user:email`;
  res.json({ url });
}

export async function githubCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const stored = await readStoredConfig();
  const clientId = process.env.GITHUB_CLIENT_ID || stored.github?.clientId;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || stored.github?.clientSecret;
  const redirect = process.env.GITHUB_REDIRECT_URI || stored.github?.redirectUri || `${BASE_URL}/api/auth/github/callback`;
  if (!clientId || !clientSecret) return res.status(500).json({ error: 'Server not configured with GitHub client credentials' });

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirect })
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token as string | undefined;
    if (!accessToken) return res.status(500).json({ error: 'Failed to obtain access token', details: tokenJson });

    const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `token ${accessToken}`, 'User-Agent': 'In-Accord' } });
    const userJson = await userRes.json();

    integrationStore.github = { connected: true, accessToken, profile: userJson };
    return res.json({ success: true, profile: userJson });
  } catch (e: any) {
    console.error('GitHub callback error', e);
    return res.status(500).json({ error: 'Callback processing failed', details: String(e) });
  }
}

export async function discordAuthUrl(req: Request, res: Response) {
  const stored = await readStoredConfig();
  const clientId = process.env.DISCORD_CLIENT_ID || stored.discord?.clientId || '';
  const redirect = process.env.DISCORD_REDIRECT_URI || stored.discord?.redirectUri || `${BASE_URL}/api/auth/discord/callback`;
  const url = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&scope=identify%20email&redirect_uri=${encodeURIComponent(redirect)}`;
  res.json({ url });
}

export async function discordCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const stored = await readStoredConfig();
  const clientId = process.env.DISCORD_CLIENT_ID || stored.discord?.clientId;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || stored.discord?.clientSecret;
  const redirect = process.env.DISCORD_REDIRECT_URI || stored.discord?.redirectUri || `${BASE_URL}/api/auth/discord/callback`;
  if (!clientId || !clientSecret) return res.status(500).json({ error: 'Server not configured with Discord client credentials' });

  try {
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect);

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token as string | undefined;
    if (!accessToken) return res.status(500).json({ error: 'Failed to obtain access token', details: tokenJson });

    const userRes = await fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${accessToken}` } });
    const userJson = await userRes.json();

    integrationStore.discord = { connected: true, accessToken, profile: userJson };
    return res.json({ success: true, profile: userJson });
  } catch (e: any) {
    console.error('Discord callback error', e);
    return res.status(500).json({ error: 'Callback processing failed', details: String(e) });
  }
}

export function integrationStatus(req: Request, res: Response) {
  return res.json({ github: integrationStore.github?.connected || false, discord: integrationStore.discord?.connected || false });
}

export default {
  githubAuthUrl,
  githubCallback,
  discordAuthUrl,
  discordCallback,
  integrationStatus
};
