import express from 'express';
import { exec } from 'child_process';

const router = express.Router();
console.log('[pm2Routes] Router loaded');

router.use((req, res, next) => {
  console.log(`[pm2Routes] ${req.method} ${req.originalUrl}`);
  next();
});
// Diagnostic route to confirm router is loaded
router.get('/test', (_req, res) => {
  res.json({ success: true, message: 'pm2Routes is loaded!' });
});
const BACKEND_PROCESS_NAME = 'inaccord-backend';

function pm2Cmd(cmd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(`pm2 ${cmd}`, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout, stderr });
      resolve({ stdout, stderr });
    });
  });
}

router.get('/status', async (_req, res) => {
  try {
    const { stdout } = await pm2Cmd(`show ${BACKEND_PROCESS_NAME}`);
    // Remove ANSI escape codes
    const ansiRegex = /\u001b\[[0-9;]*m|\x1b\[[0-9;]*m|\u001b\(B/g;
    const cleanOut = stdout.replace(ansiRegex, '');
    // Find the table row for 'status' and extract the value
    let cleanStatus = 'unknown';
    const statusRow = cleanOut.split('\n').find(line => line.trim().startsWith('│ status'));
    if (statusRow) {
      // The format is: │ status            │ online │
      const columns = statusRow.split('│').map(s => s.trim()).filter(Boolean);
      if (columns.length >= 2) {
        cleanStatus = columns[1].toLowerCase();
      }
    }
    res.json({ success: true, status: cleanStatus, raw: cleanOut });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.stderr || e.message });
  }
});

router.post('/start', async (_req, res) => {
  try {
    const { stdout } = await pm2Cmd(`start ${BACKEND_PROCESS_NAME}`);
    res.json({ success: true, output: stdout });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.stderr || e.message });
  }
});

router.post('/stop', async (_req, res) => {
  try {
    const { stdout } = await pm2Cmd(`stop ${BACKEND_PROCESS_NAME}`);
    res.json({ success: true, output: stdout });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.stderr || e.message });
  }
});

router.post('/restart', async (_req, res) => {
  try {
    const { stdout } = await pm2Cmd(`restart ${BACKEND_PROCESS_NAME}`);
    res.json({ success: true, output: stdout });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.stderr || e.message });
  }
});

router.get('/logs', async (_req, res) => {
  try {
    const { stdout, stderr } = await pm2Cmd(`logs ${BACKEND_PROCESS_NAME} --lines 100 --nostream`);
    // Remove ANSI escape codes for clean logs
    const ansiRegex = /\u001b\[[0-9;]*m|\x1b\[[0-9;]*m|\u001b\(B/g;
    const cleanOut = stdout.replace(ansiRegex, '');
    // Split logs into lines, filter out empty lines
    const logLines = cleanOut.split(/\r?\n/).filter(line => line.trim().length > 0);
    res.json({
      success: true,
      logs: logLines,
      raw: cleanOut,
      stderr,
      debug: {
        lineCount: logLines.length,
        firstLine: logLines[0] || null,
        lastLine: logLines[logLines.length - 1] || null
      }
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.stderr || e.message, debug: e });
  }
});

export default router;
