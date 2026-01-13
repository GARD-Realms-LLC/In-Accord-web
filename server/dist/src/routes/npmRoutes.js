"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const npmTerminalController_1 = require("../controllers/npmTerminalController");
const router = (0, express_1.Router)();
router.post('/run', npmTerminalController_1.runNpmScript);
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
exports.default = router;
