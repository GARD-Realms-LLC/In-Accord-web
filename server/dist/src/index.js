"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const safeJson_1 = require("./lib/safeJson");
// Defensive: make JSON.parse tolerant globally to avoid uncaught parse exceptions
// This prevents third-party or legacy code calling JSON.parse on malformed input
// from crashing the running process. Returns null on parse failure.
try {
    const _origJSONParse = JSON.parse;
    // @ts-ignore
    JSON.parse = function (text, reviver) {
        try {
            return _origJSONParse.call(JSON, text, reviver);
        }
        catch (e) {
            return null;
        }
    };
}
catch (e) {
    // ignore if can't override
}
/* ROUTE IMPORTS */
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes")); // http://localhost:8000/dashboard
/* CONFIGURATION */
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Global process guards to prevent uncaught exceptions from crashing the server
process.on('uncaughtException', (err) => {
    try {
        const preview = (err && err.message) ? err.message.slice(0, 400) : String(err);
        const entry = `[${new Date().toISOString()}] uncaughtException: ${preview}\nstack=${(err && err.stack) ? err.stack.split('\n').slice(0, 5).join('\n') : 'no-stack'}\n`;
        try {
            fs_1.default.appendFileSync(path_1.default.resolve(__dirname, '..', '..', 'logs', 'error.log'), entry, 'utf8');
        }
        catch (_a) { }
        console.error('uncaughtException', preview);
    }
    catch (_b) { }
});
process.on('unhandledRejection', (reason) => {
    try {
        const preview = typeof reason === 'string' ? reason.slice(0, 400) : (reason && reason.message) ? reason.message.slice(0, 400) : String(reason);
        const entry = `[${new Date().toISOString()}] unhandledRejection: ${preview}\n`;
        try {
            fs_1.default.appendFileSync(path_1.default.resolve(__dirname, '..', '..', 'logs', 'error.log'), entry, 'utf8');
        }
        catch (_a) { }
        console.error('unhandledRejection', preview);
    }
    catch (_b) { }
});
// Example: Broadcast a test event every 10 seconds (remove or replace in production)
setInterval(() => {
    io.emit('liveUpdate', { message: 'This is a live update from the server', timestamp: Date.now() });
}, 10000);
// Use body-parser to capture raw bodies safely (via verify) and let us apply a tolerant parse.
// This avoids ad-hoc stream consumption while still capturing raw content for diagnostics.
app.use(body_parser_1.default.json({
    limit: '50mb',
    strict: false,
    verify: (req, res, buf) => {
        try {
            req.rawBody = buf && buf.length ? buf.toString('utf8') : '';
        }
        catch (e) {
            req.rawBody = '';
        }
    }
}));
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
    verify: (req, res, buf) => {
        try {
            req.rawBody = buf && buf.length ? buf.toString('utf8') : '';
        }
        catch (e) {
            req.rawBody = '';
        }
    }
}));
// After body-parsers: if body is absent but we have a raw body, attempt a tolerant parse.
app.use((req, res, next) => {
    try {
        const raw = req.rawBody || '';
        if (raw && req.body == null) {
            const parsed = (0, safeJson_1.safeTryParseString)(raw);
            if (parsed !== null) {
                req.body = parsed;
            }
            else {
                // Mark so specific handlers can decide how to treat malformed payloads
                req.jsonParseError = true;
            }
        }
    }
    catch (e) {
        // Don't let this middleware crash the server; just continue.
        req.jsonParseError = true;
    }
    return next();
});
// Request preview logger (safe, short previews) — helps identify malformed producers without storing full bodies
// (debug) request-preview logging removed during cleanup
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Allow images from data: and https so inline/base64 avatars and external images can load in the frontend
app.use(
// @ts-ignore - use helmet.contentSecurityPolicy middleware
helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
    },
}));
app.use((0, morgan_1.default)("common"));
app.use((0, cors_1.default)());
/* ROUTES */
app.use("/dashboard", dashboardRoutes_1.default);
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
app.use('/api/support', supportRoutes_1.default);
const schemasRoutes_1 = __importDefault(require("./routes/schemasRoutes"));
app.use('/api/schemas', schemasRoutes_1.default);
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
app.use('/api/admin/users', usersRoutes_1.default);
const oauthRoutes_1 = __importDefault(require("./routes/oauthRoutes"));
app.use('/api/auth', oauthRoutes_1.default);
const integrationRoutes_1 = __importDefault(require("./routes/integrationRoutes"));
app.use('/api/integrations', integrationRoutes_1.default);
const sessionsRoutes_1 = __importDefault(require("./routes/sessionsRoutes"));
app.use('/api/admin/sessions', sessionsRoutes_1.default);
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
app.use('/api/admin/auth', authRoutes_1.default);
const backupRoutes_1 = __importDefault(require("./routes/backupRoutes"));
app.use('/api/backup', backupRoutes_1.default);
// Serve static `/data` files and ensure a UTF-8 charset is present for text-like responses
app.use('/data', express_1.default.static(path_1.default.resolve(__dirname, '..', 'data'), {
    setHeaders: (res, filePath) => {
        try {
            const current = res.getHeader('Content-Type');
            if (typeof current === 'string') {
                // if a charset is not already present and the content looks like text/JSON/JS/XML, add utf-8
                if (!/charset=/i.test(current) && /^(text\/|application\/(json|javascript|xml))/i.test(current)) {
                    res.setHeader('Content-Type', `${current}; charset=utf-8`);
                }
            }
        }
        catch (err) {
            // don't let header-setting failures crash the server
            console.warn('Failed to set charset header for static asset', filePath, err);
        }
    },
}));
const npmRoutes_1 = __importDefault(require("./routes/npmRoutes"));
app.use('/api/npm', npmRoutes_1.default);
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
app.use('/api/admin', adminRoutes_1.default);
app.use((err, req, res, next) => {
    var _a;
    const isJsonSyntaxError = err instanceof SyntaxError && err.status === 400 && 'body' in err;
    if (isJsonSyntaxError) {
        const rawBody = req.rawBody;
        // Keep logs concise and avoid writing full raw payloads which may be large or contain sensitive data.
        const preview = (_a = rawBody === null || rawBody === void 0 ? void 0 : rawBody.slice(0, 200)) !== null && _a !== void 0 ? _a : '';
        const parsedPreview = (0, safeJson_1.safeTryParseString)(rawBody);
        const parsedPreviewStr = parsedPreview ? JSON.stringify(parsedPreview).slice(0, 400) : 'null';
        const logEntry = `[${new Date().toISOString()}] JSON parse error: ${err.message}\npreview=${preview}\nparsedPreview=${parsedPreviewStr}\n`;
        try {
            fs_1.default.appendFileSync(path_1.default.resolve(__dirname, '..', '..', 'logs', 'error.log'), logEntry, 'utf8');
        }
        catch (writeErr) {
            console.warn('Failed to append JSON parse error log', writeErr);
        }
        console.error('JSON parse error:', err.message, preview);
        res.status(400).json({
            success: false,
            error: 'Invalid JSON payload',
            details: err.message,
            rawBodyPreview: preview
        });
        return;
    }
    next(err);
});
// Final generic error handler to prevent any route error from crashing the process.
app.use((err, req, res, next) => {
    try {
        const preview = err && err.message ? String(err.message).slice(0, 400) : String(err).slice(0, 400);
        const stack = err && err.stack ? err.stack.split('\n').slice(0, 6).join('\n') : 'no-stack';
        const entry = `[${new Date().toISOString()}] unhandledRouteError: ${preview}\nstack=${stack}\n`;
        try {
            fs_1.default.appendFileSync(path_1.default.resolve(__dirname, '..', '..', 'logs', 'error.log'), entry, 'utf8');
        }
        catch (_a) { }
    }
    catch (_b) { }
    console.error('Unhandled route error:', (err && err.message) ? err.message : err);
    if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
    // do not call next(err) to avoid default crash behavior
});
/* SERVER */
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
