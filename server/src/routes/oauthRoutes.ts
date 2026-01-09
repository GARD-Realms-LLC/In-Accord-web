import { Router } from 'express';
import oauthCtrl from '../controllers/oauthControllers';

const router = Router();

router.get('/github/url', oauthCtrl.githubAuthUrl);
router.get('/github/callback', oauthCtrl.githubCallback);

router.get('/discord/url', oauthCtrl.discordAuthUrl);
router.get('/discord/callback', oauthCtrl.discordCallback);

router.get('/status', oauthCtrl.integrationStatus);

export default router;
