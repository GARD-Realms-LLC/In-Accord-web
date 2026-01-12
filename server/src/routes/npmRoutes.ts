import { Router } from 'express';
import { runNpmScript } from '../controllers/npmTerminalController';

const router = Router();

router.post('/run', runNpmScript);

export default router;
