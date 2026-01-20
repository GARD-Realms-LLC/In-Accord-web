"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/* ROUTE IMPORTS */
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
// Example: Broadcast a test event every 10 seconds (remove or replace in production)
setInterval(() => {
    io.emit('liveUpdate', { message: 'This is a live update from the server', timestamp: Date.now() });
}, 10000);
app.use(express_1.default.json({
    limit: '50mb',
    verify: (req, _res, buf) => {
        try {
            req.rawBody = buf.toString('utf8');
        }
        catch (error) {
            console.warn('Unable to capture raw request body', error);
        }
    }
}));
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
app.use((err, req, res, next) => {
    const isJsonSyntaxError = err instanceof SyntaxError && err.status === 400 && 'body' in err;
    if (isJsonSyntaxError) {
        const rawBody = req.rawBody;
        const logEntry = `[${new Date().toISOString()}] JSON parse error: ${err.message}\nraw=${rawBody}\n`;
        try {
            fs_1.default.appendFileSync(path_1.default.resolve(__dirname, '..', '..', 'logs', 'error.log'), logEntry, 'utf8');
        }
        catch (writeErr) {
            console.warn('Failed to append JSON parse error log', writeErr);
        }
        console.error('JSON parse error:', err.message, rawBody);
        res.status(400).json({
            success: false,
            error: 'Invalid JSON payload',
            details: err.message,
            rawBodyPreview: rawBody === null || rawBody === void 0 ? void 0 : rawBody.slice(0, 200)
        });
        return;
    }
    next(err);
});
/* SERVER */
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
