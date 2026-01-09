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
exports.githubAuthUrl = githubAuthUrl;
exports.githubCallback = githubCallback;
exports.discordAuthUrl = discordAuthUrl;
exports.discordCallback = discordCallback;
exports.integrationStatus = integrationStatus;
const integrationStore_1 = __importDefault(require("../integrationStore"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
const CONFIG_PATH = path_1.default.resolve(__dirname, '..', '..', 'data', 'oauth-config.json');
function readStoredConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const raw = yield promises_1.default.readFile(CONFIG_PATH, 'utf8').catch(() => '{}');
            return raw ? JSON.parse(raw) : {};
        }
        catch (e) {
            return {};
        }
    });
}
function githubAuthUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const stored = yield readStoredConfig();
        const clientId = process.env.GITHUB_CLIENT_ID || ((_a = stored.github) === null || _a === void 0 ? void 0 : _a.clientId) || '';
        const redirect = process.env.GITHUB_REDIRECT_URI || ((_b = stored.github) === null || _b === void 0 ? void 0 : _b.redirectUri) || `${BASE_URL}/api/auth/github/callback`;
        const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user%20user:email`;
        res.json({ url });
    });
}
function githubCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const code = req.query.code;
        if (!code)
            return res.status(400).json({ error: 'Missing code' });
        const stored = yield readStoredConfig();
        const clientId = process.env.GITHUB_CLIENT_ID || ((_a = stored.github) === null || _a === void 0 ? void 0 : _a.clientId);
        const clientSecret = process.env.GITHUB_CLIENT_SECRET || ((_b = stored.github) === null || _b === void 0 ? void 0 : _b.clientSecret);
        const redirect = process.env.GITHUB_REDIRECT_URI || ((_c = stored.github) === null || _c === void 0 ? void 0 : _c.redirectUri) || `${BASE_URL}/api/auth/github/callback`;
        if (!clientId || !clientSecret)
            return res.status(500).json({ error: 'Server not configured with GitHub client credentials' });
        try {
            const tokenRes = yield fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirect })
            });
            const tokenJson = yield tokenRes.json();
            const accessToken = tokenJson.access_token;
            if (!accessToken)
                return res.status(500).json({ error: 'Failed to obtain access token', details: tokenJson });
            const userRes = yield fetch('https://api.github.com/user', { headers: { Authorization: `token ${accessToken}`, 'User-Agent': 'In-Accord' } });
            const userJson = yield userRes.json();
            integrationStore_1.default.github = { connected: true, accessToken, profile: userJson };
            return res.json({ success: true, profile: userJson });
        }
        catch (e) {
            console.error('GitHub callback error', e);
            return res.status(500).json({ error: 'Callback processing failed', details: String(e) });
        }
    });
}
function discordAuthUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const stored = yield readStoredConfig();
        const clientId = process.env.DISCORD_CLIENT_ID || ((_a = stored.discord) === null || _a === void 0 ? void 0 : _a.clientId) || '';
        const redirect = process.env.DISCORD_REDIRECT_URI || ((_b = stored.discord) === null || _b === void 0 ? void 0 : _b.redirectUri) || `${BASE_URL}/api/auth/discord/callback`;
        const url = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&scope=identify%20email&redirect_uri=${encodeURIComponent(redirect)}`;
        res.json({ url });
    });
}
function discordCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const code = req.query.code;
        if (!code)
            return res.status(400).json({ error: 'Missing code' });
        const stored = yield readStoredConfig();
        const clientId = process.env.DISCORD_CLIENT_ID || ((_a = stored.discord) === null || _a === void 0 ? void 0 : _a.clientId);
        const clientSecret = process.env.DISCORD_CLIENT_SECRET || ((_b = stored.discord) === null || _b === void 0 ? void 0 : _b.clientSecret);
        const redirect = process.env.DISCORD_REDIRECT_URI || ((_c = stored.discord) === null || _c === void 0 ? void 0 : _c.redirectUri) || `${BASE_URL}/api/auth/discord/callback`;
        if (!clientId || !clientSecret)
            return res.status(500).json({ error: 'Server not configured with Discord client credentials' });
        try {
            const params = new URLSearchParams();
            params.append('client_id', clientId);
            params.append('client_secret', clientSecret);
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('redirect_uri', redirect);
            const tokenRes = yield fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });
            const tokenJson = yield tokenRes.json();
            const accessToken = tokenJson.access_token;
            if (!accessToken)
                return res.status(500).json({ error: 'Failed to obtain access token', details: tokenJson });
            const userRes = yield fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${accessToken}` } });
            const userJson = yield userRes.json();
            integrationStore_1.default.discord = { connected: true, accessToken, profile: userJson };
            return res.json({ success: true, profile: userJson });
        }
        catch (e) {
            console.error('Discord callback error', e);
            return res.status(500).json({ error: 'Callback processing failed', details: String(e) });
        }
    });
}
function integrationStatus(req, res) {
    var _a, _b;
    return res.json({ github: ((_a = integrationStore_1.default.github) === null || _a === void 0 ? void 0 : _a.connected) || false, discord: ((_b = integrationStore_1.default.discord) === null || _b === void 0 ? void 0 : _b.connected) || false });
}
exports.default = {
    githubAuthUrl,
    githubCallback,
    discordAuthUrl,
    discordCallback,
    integrationStatus
};
