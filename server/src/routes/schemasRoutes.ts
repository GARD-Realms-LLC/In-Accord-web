import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { safeReadJsonSync, safeWriteJsonSync } from '../lib/safeJson';

const router = Router();
const dataFile = path.resolve(__dirname, '..', '..', 'data', 'custom_tables.json');

const ALLOWED_FIELD_TYPES = ['string', 'number', 'boolean', 'date', 'text'];

function readFileSafe() {
  try {
    if (!fs.existsSync(path.dirname(dataFile))) fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify({ tables: [] }, null, 2));
    }
    return safeReadJsonSync(dataFile, { tables: [] });
  } catch (err) {
    console.error('[Schemas] read error', err);
    return { tables: [] };
  }
}

function writeFileSafe(obj: any) {
  try {
    if (!fs.existsSync(path.dirname(dataFile))) fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    return safeWriteJsonSync(dataFile, obj);
    
  } catch (err) {
    console.error('[Schemas] write error', err);
    return false;
  }
}

// Optional API key middleware: if SCHEMAS_API_KEY is set, require it for POST/modify endpoints
function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = process.env.SCHEMAS_API_KEY;
  if (!key) return next(); // not configured — allow
  const provided = (req.headers['x-api-key'] as string) || (req.query.api_key as string) || req.headers['authorization'];
  if (!provided) {
    return res.status(401).json({ ok: false, error: 'API key required' });
  }
  // allow either raw header value or Bearer token
  const token = String(provided).replace(/^Bearer\s+/i, '');
  if (token !== key) return res.status(403).json({ ok: false, error: 'Invalid API key' });
  return next();
}

function validateTablesPayload(tables: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!Array.isArray(tables)) {
    return { valid: false, errors: ['tables must be an array'] };
  }
  tables.forEach((t: any, ti: number) => {
    if (!t || typeof t !== 'object') return errors.push(`table[${ti}] must be an object`);
    if (!t.id || typeof t.id !== 'string') errors.push(`table[${ti}].id must be a string`);
    if (!t.name || typeof t.name !== 'string') errors.push(`table[${ti}].name must be a string`);
    if (!Array.isArray(t.fields)) return errors.push(`table[${ti}].fields must be an array`);
    t.fields.forEach((f: any, fi: number) => {
      if (!f || typeof f !== 'object') return errors.push(`table[${ti}].fields[${fi}] must be an object`);
      if (!f.id || typeof f.id !== 'string') errors.push(`table[${ti}].fields[${fi}].id must be a string`);
      if (!f.name || typeof f.name !== 'string') errors.push(`table[${ti}].fields[${fi}].name must be a string`);
      if (!f.type || typeof f.type !== 'string') errors.push(`table[${ti}].fields[${fi}].type must be a string`);
      if (f.type && !ALLOWED_FIELD_TYPES.includes(f.type)) errors.push(`table[${ti}].fields[${fi}].type must be one of ${ALLOWED_FIELD_TYPES.join(', ')}`);
    });
  });
  return { valid: errors.length === 0, errors };
}

router.get('/', (req, res) => {
  const data = readFileSafe();
  return res.json({ ok: true, tables: data.tables || [] });
});

router.post('/', requireApiKey, (req, res) => {
  const { tables } = req.body;
  const validation = validateTablesPayload(tables);
  if (!validation.valid) return res.status(400).json({ ok: false, errors: validation.errors });
  const ok = writeFileSafe({ tables });
  if (!ok) return res.status(500).json({ ok: false, error: 'failed to write' });
  return res.json({ ok: true, tables });
});

export default router;
