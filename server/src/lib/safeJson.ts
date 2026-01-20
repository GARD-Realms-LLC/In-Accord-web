import fs from 'fs';
import fsp from 'fs/promises';

function tryParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    try {
      const sanitized = raw
        .replace(/\/\/.*$/gm, '')
        .replace(/,\s*([}\]])/gm, '$1');
      return JSON.parse(sanitized);
    } catch (err2) {
      return null;
    }
  }
}

export function safeTryParseString(raw: string | undefined | null) {
  if (typeof raw !== 'string') return null;
  try {
    return tryParse(raw);
  } catch {
    return null;
  }
}

export function safeReadJsonSync(filePath: string, defaultValue: any = null) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = tryParse(raw);
    return parsed === null ? defaultValue : parsed;
  } catch (e) {
    return defaultValue;
  }
}

export async function safeReadJson(filePath: string, defaultValue: any = null) {
  try {
    await fsp.access(filePath).catch(() => { throw new Error('NOFILE'); });
    const raw = await fsp.readFile(filePath, 'utf8');
    const parsed = tryParse(raw);
    return parsed === null ? defaultValue : parsed;
  } catch (e) {
    return defaultValue;
  }
}

export function safeWriteJsonSync(filePath: string, obj: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

export async function safeWriteJson(filePath: string, obj: any, options?: fs.WriteFileOptions) {
  try {
    await fsp.writeFile(filePath, JSON.stringify(obj, null, 2), options);
    return true;
  } catch (e) {
    return false;
  }
}
