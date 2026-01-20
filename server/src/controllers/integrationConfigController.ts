import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { safeReadJson } from '../lib/safeJson';

const CONFIG_PATH = path.resolve(__dirname, '..', '..', 'data', 'oauth-config.json');

async function ensureDataDir() {
  const dir = path.dirname(CONFIG_PATH);
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

export async function getConfig(req: Request, res: Response) {
  try {
    await ensureDataDir();
    const json = (await safeReadJson(CONFIG_PATH, {})) || {};
    // Do not return secrets by default unless explicitly requested
    const safe = { github: { clientId: json.github?.clientId || '', enabled: !!json.github?.enabled, connected: !!json.github?.connected }, discord: { clientId: json.discord?.clientId || '', enabled: !!json.discord?.enabled, connected: !!json.discord?.connected } };
    res.json({ config: safe });
  } catch (e: any) {
    console.error('Failed to read oauth config', e);
    res.status(500).json({ error: 'Failed to read config' });
  }
}

export async function saveConfig(req: Request, res: Response) {
  try {
    const body = req.body || {};
    await ensureDataDir();
    // Only accept specific shape to avoid accidental overrides
    const current = (await safeReadJson(CONFIG_PATH, {})) || {};

    const next = { ...current };
    if (body.github) {
      next.github = { ...(next.github || {}), ...{ clientId: body.github.clientId || '', clientSecret: body.github.clientSecret || '', redirectUri: body.github.redirectUri || '', enabled: !!body.github.enabled, connected: !!body.github.connected } };
    }
    if (body.discord) {
      next.discord = { ...(next.discord || {}), ...{ clientId: body.discord.clientId || '', clientSecret: body.discord.clientSecret || '', redirectUri: body.discord.redirectUri || '', enabled: !!body.discord.enabled, connected: !!body.discord.connected } };
    }

    await fs.writeFile(CONFIG_PATH, JSON.stringify(next, null, 2), { mode: 0o600 });
    res.json({ success: true });
  } catch (e: any) {
    console.error('Failed to save oauth config', e);
    res.status(500).json({ error: 'Failed to save config' });
  }
}

export async function clearConfig(req: Request, res: Response) {
  try {
    await ensureDataDir();
    await fs.writeFile(CONFIG_PATH, JSON.stringify({}, null, 2), { mode: 0o600 });
    res.json({ success: true });
  } catch (e: any) {
    console.error('Failed to clear oauth config', e);
    res.status(500).json({ error: 'Failed to clear config' });
  }
}

export default { getConfig, saveConfig, clearConfig };
