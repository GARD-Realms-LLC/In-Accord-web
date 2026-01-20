import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

function tailFile(filePath: string, lines = 100) {
  try {
    if (!fs.existsSync(filePath)) return '';
    const raw = fs.readFileSync(filePath, 'utf8');
    const arr = raw.replace(/\r/g, '').split('\n');
    return arr.slice(-lines).join('\n');
  } catch (e) {
    return '';
  }
}

// Return recent logs (safe, read-only). Intended for local debugging only.
router.get('/logs', (req: Request, res: Response) => {
  try {
    const logsDir = path.resolve(__dirname, '..', '..', 'logs');
    const errorLog = tailFile(path.join(logsDir, 'error.log'), 200);
    const previewLog = tailFile(path.join(logsDir, 'request_preview.log'), 200);
    return res.json({ success: true, errorLog, previewLog });
  } catch (e) {
    return res.status(500).json({ success: false, error: 'Failed to read logs' });
  }
});

export default router;
