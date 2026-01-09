import { Router } from 'express';
import cfgCtrl from '../controllers/integrationConfigController';

const router = Router();

// GET current config (safe view, hides secrets)
router.get('/config', cfgCtrl.getConfig);

// POST save config (accepts github and discord objects)
router.post('/config', cfgCtrl.saveConfig);

// DELETE clear stored config
router.delete('/config', cfgCtrl.clearConfig);

export default router;
