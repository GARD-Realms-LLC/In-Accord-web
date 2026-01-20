"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
function tailFile(filePath, lines = 100) {
    try {
        if (!fs_1.default.existsSync(filePath))
            return '';
        const raw = fs_1.default.readFileSync(filePath, 'utf8');
        const arr = raw.replace(/\r/g, '').split('\n');
        return arr.slice(-lines).join('\n');
    }
    catch (e) {
        return '';
    }
}
// Return recent logs (safe, read-only). Intended for local debugging only.
router.get('/logs', (req, res) => {
    try {
        const logsDir = path_1.default.resolve(__dirname, '..', '..', 'logs');
        const errorLog = tailFile(path_1.default.join(logsDir, 'error.log'), 200);
        const previewLog = tailFile(path_1.default.join(logsDir, 'request_preview.log'), 200);
        return res.json({ success: true, errorLog, previewLog });
    }
    catch (e) {
        return res.status(500).json({ success: false, error: 'Failed to read logs' });
    }
});
exports.default = router;
