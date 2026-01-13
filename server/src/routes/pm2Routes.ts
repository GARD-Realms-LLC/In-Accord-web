import express from 'express';
import { exec } from 'child_process';

const router = express.Router();
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
    res.json({ success: true, status: stdout });
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
    const { stdout } = await pm2Cmd(`logs ${BACKEND_PROCESS_NAME} --lines 100 --nostream`);
    res.json({ success: true, logs: stdout });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.stderr || e.message });
  }
});

export default router;
