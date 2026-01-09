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
exports.getConfig = getConfig;
exports.saveConfig = saveConfig;
exports.clearConfig = clearConfig;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const CONFIG_PATH = path_1.default.resolve(__dirname, '..', '..', 'data', 'oauth-config.json');
function ensureDataDir() {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = path_1.default.dirname(CONFIG_PATH);
        try {
            yield promises_1.default.mkdir(dir, { recursive: true });
        }
        catch (_a) { }
    });
}
function getConfig(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            yield ensureDataDir();
            const raw = yield promises_1.default.readFile(CONFIG_PATH, 'utf8').catch(() => '{}');
            const json = raw ? JSON.parse(raw) : {};
            // Do not return secrets by default unless explicitly requested
            const safe = { github: { clientId: ((_a = json.github) === null || _a === void 0 ? void 0 : _a.clientId) || '', enabled: !!((_b = json.github) === null || _b === void 0 ? void 0 : _b.enabled), connected: !!((_c = json.github) === null || _c === void 0 ? void 0 : _c.connected) }, discord: { clientId: ((_d = json.discord) === null || _d === void 0 ? void 0 : _d.clientId) || '', enabled: !!((_e = json.discord) === null || _e === void 0 ? void 0 : _e.enabled), connected: !!((_f = json.discord) === null || _f === void 0 ? void 0 : _f.connected) } };
            res.json({ config: safe });
        }
        catch (e) {
            console.error('Failed to read oauth config', e);
            res.status(500).json({ error: 'Failed to read config' });
        }
    });
}
function saveConfig(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body || {};
            yield ensureDataDir();
            // Only accept specific shape to avoid accidental overrides
            const currentRaw = yield promises_1.default.readFile(CONFIG_PATH, 'utf8').catch(() => '{}');
            const current = currentRaw ? JSON.parse(currentRaw) : {};
            const next = Object.assign({}, current);
            if (body.github) {
                next.github = Object.assign(Object.assign({}, (next.github || {})), { clientId: body.github.clientId || '', clientSecret: body.github.clientSecret || '', redirectUri: body.github.redirectUri || '', enabled: !!body.github.enabled, connected: !!body.github.connected });
            }
            if (body.discord) {
                next.discord = Object.assign(Object.assign({}, (next.discord || {})), { clientId: body.discord.clientId || '', clientSecret: body.discord.clientSecret || '', redirectUri: body.discord.redirectUri || '', enabled: !!body.discord.enabled, connected: !!body.discord.connected });
            }
            yield promises_1.default.writeFile(CONFIG_PATH, JSON.stringify(next, null, 2), { mode: 0o600 });
            res.json({ success: true });
        }
        catch (e) {
            console.error('Failed to save oauth config', e);
            res.status(500).json({ error: 'Failed to save config' });
        }
    });
}
function clearConfig(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ensureDataDir();
            yield promises_1.default.writeFile(CONFIG_PATH, JSON.stringify({}, null, 2), { mode: 0o600 });
            res.json({ success: true });
        }
        catch (e) {
            console.error('Failed to clear oauth config', e);
            res.status(500).json({ error: 'Failed to clear config' });
        }
    });
}
exports.default = { getConfig, saveConfig, clearConfig };
