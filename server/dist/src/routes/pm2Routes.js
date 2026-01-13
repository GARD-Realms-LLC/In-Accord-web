"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const router = express_1.default.Router();
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
function pm2Cmd(cmd) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`pm2 ${cmd}`, (err, stdout, stderr) => {
            if (err)
                return reject({ err, stdout, stderr });
            resolve({ stdout, stderr });
        });
    });
}
router.get('/status', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stdout } = yield pm2Cmd(`show ${BACKEND_PROCESS_NAME}`);
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
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.stderr || e.message });
    }
}));
router.post('/start', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stdout } = yield pm2Cmd(`start ${BACKEND_PROCESS_NAME}`);
        res.json({ success: true, output: stdout });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.stderr || e.message });
    }
}));
router.post('/stop', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stdout } = yield pm2Cmd(`stop ${BACKEND_PROCESS_NAME}`);
        res.json({ success: true, output: stdout });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.stderr || e.message });
    }
}));
router.post('/restart', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stdout } = yield pm2Cmd(`restart ${BACKEND_PROCESS_NAME}`);
        res.json({ success: true, output: stdout });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.stderr || e.message });
    }
}));
router.get('/logs', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stdout } = yield pm2Cmd(`logs ${BACKEND_PROCESS_NAME} --lines 100 --nostream`);
        res.json({ success: true, logs: stdout });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.stderr || e.message });
    }
}));
exports.default = router;
