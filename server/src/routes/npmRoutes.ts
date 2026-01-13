import { Router } from 'express';
import { runNpmScript } from '../controllers/npmTerminalController';

const router = Router();

router.post('/run', runNpmScript);
router.use((req, res, next) => {
	if (req.path === '/run') {
		console.log(`[npmRoutes] Incoming request:`, {
			method: req.method,
			headers: req.headers,
			body: req.body
		});
		if (req.method === 'OPTIONS') {
			res.status(204).json({ success: true, message: 'OPTIONS received' });
			return;
		}
		if (req.method === 'POST') {
			console.log('[npmRoutes] POST body:', req.body);
		}
	}
	next();
});

export default router;
