import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import { safeTryParseString } from './lib/safeJson';

// Defensive: make JSON.parse tolerant globally to avoid uncaught parse exceptions
// This prevents third-party or legacy code calling JSON.parse on malformed input
// from crashing the running process. Returns null on parse failure.
try {
    const _origJSONParse = JSON.parse;
    // @ts-ignore
    JSON.parse = function (text: string, reviver?: any) {
        try {
            return _origJSONParse.call(JSON, text, reviver);
        } catch (e) {
            return null;
        }
    } as any;
} catch (e) {
    // ignore if can't override
}

/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes"; // http://localhost:8000/dashboard

/* CONFIGURATION */
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Global process guards to prevent uncaught exceptions from crashing the server
process.on('uncaughtException', (err: Error) => {
    try {
        const preview = (err && err.message) ? err.message.slice(0, 400) : String(err);
        const entry = `[${new Date().toISOString()}] uncaughtException: ${preview}\nstack=${(err && err.stack) ? err.stack.split('\n').slice(0,5).join('\n') : 'no-stack'}\n`;
        try { fs.appendFileSync(path.resolve(__dirname, '..', '..', 'logs', 'error.log'), entry, 'utf8'); } catch {}
        console.error('uncaughtException', preview);
    } catch {}
});

process.on('unhandledRejection', (reason) => {
    try {
        const preview = typeof reason === 'string' ? reason.slice(0,400) : (reason && (reason as any).message) ? (reason as any).message.slice(0,400) : String(reason);
        const entry = `[${new Date().toISOString()}] unhandledRejection: ${preview}\n`;
        try { fs.appendFileSync(path.resolve(__dirname, '..', '..', 'logs', 'error.log'), entry, 'utf8'); } catch {}
        console.error('unhandledRejection', preview);
    } catch {}
});

// Example: Broadcast a test event every 10 seconds (remove or replace in production)
setInterval(() => {
    io.emit('liveUpdate', { message: 'This is a live update from the server', timestamp: Date.now() });
}, 10000);
interface RequestWithRawBody extends Request {
    rawBody?: string;
}

// Use body-parser to capture raw bodies safely (via verify) and let us apply a tolerant parse.
// This avoids ad-hoc stream consumption while still capturing raw content for diagnostics.
app.use(bodyParser.json({
    limit: '50mb',
    strict: false,
    verify: (req: Request, res: Response, buf: Buffer) => {
        try {
            (req as RequestWithRawBody).rawBody = buf && buf.length ? buf.toString('utf8') : '';
        } catch (e) {
            (req as RequestWithRawBody).rawBody = '';
        }
    }
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    verify: (req: Request, res: Response, buf: Buffer) => {
        try {
            (req as RequestWithRawBody).rawBody = buf && buf.length ? buf.toString('utf8') : '';
        } catch (e) {
            (req as RequestWithRawBody).rawBody = '';
        }
    }
}));

// After body-parsers: if body is absent but we have a raw body, attempt a tolerant parse.
app.use((req: Request, res: Response, next: NextFunction) => {
    try {
        const raw = (req as RequestWithRawBody).rawBody || '';
        if (raw && (req as any).body == null) {
            const parsed = safeTryParseString(raw);
            if (parsed !== null) {
                (req as any).body = parsed;
            } else {
                // Mark so specific handlers can decide how to treat malformed payloads
                (req as any).jsonParseError = true;
            }
        }
    } catch (e) {
        // Don't let this middleware crash the server; just continue.
        (req as any).jsonParseError = true;
    }
    return next();
});

// Request preview logger (safe, short previews) — helps identify malformed producers without storing full bodies
// (debug) request-preview logging removed during cleanup

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Allow images from data: and https so inline/base64 avatars and external images can load in the frontend
app.use(
    // @ts-ignore - use helmet.contentSecurityPolicy middleware
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
        },
    })
);
app.use(morgan("common"));
app.use(cors());

/* ROUTES */
app.use("/dashboard", dashboardRoutes);
import supportRoutes from "./routes/supportRoutes";
app.use('/api/support', supportRoutes);
import schemasRoutes from './routes/schemasRoutes';
app.use('/api/schemas', schemasRoutes);
import usersRoutes from './routes/usersRoutes';
app.use('/api/admin/users', usersRoutes);
import oauthRoutes from './routes/oauthRoutes';
app.use('/api/auth', oauthRoutes);
import integrationRoutes from './routes/integrationRoutes';
app.use('/api/integrations', integrationRoutes);
import sessionsRoutes from './routes/sessionsRoutes';
app.use('/api/admin/sessions', sessionsRoutes);
import authRoutes from './routes/authRoutes';
app.use('/api/admin/auth', authRoutes);
import backupRoutes from './routes/backupRoutes';
app.use('/api/backup', backupRoutes);
// Serve static `/data` files and ensure a UTF-8 charset is present for text-like responses
app.use(
    '/data',
    express.static(path.resolve(__dirname, '..', 'data'), {
        setHeaders: (res, filePath) => {
            try {
                const current = res.getHeader('Content-Type');
                if (typeof current === 'string') {
                    // if a charset is not already present and the content looks like text/JSON/JS/XML, add utf-8
                    if (!/charset=/i.test(current) && /^(text\/|application\/(json|javascript|xml))/i.test(current)) {
                        res.setHeader('Content-Type', `${current}; charset=utf-8`);
                    }
                }
            } catch (err) {
                // don't let header-setting failures crash the server
                console.warn('Failed to set charset header for static asset', filePath, err);
            }
        },
    })
);
import npmRoutes from './routes/npmRoutes';
app.use('/api/npm', npmRoutes);
import adminRoutes from './routes/adminRoutes';
app.use('/api/admin', adminRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const isJsonSyntaxError = err instanceof SyntaxError && (err as any).status === 400 && 'body' in err;
    if (isJsonSyntaxError) {
            const rawBody = (req as RequestWithRawBody).rawBody;
            // Keep logs concise and avoid writing full raw payloads which may be large or contain sensitive data.
            const preview = rawBody?.slice(0, 200) ?? '';
            const parsedPreview = safeTryParseString(rawBody);
            const parsedPreviewStr = parsedPreview ? JSON.stringify(parsedPreview).slice(0, 400) : 'null';
            const logEntry = `[${new Date().toISOString()}] JSON parse error: ${err.message}\npreview=${preview}\nparsedPreview=${parsedPreviewStr}\n`;
            try {
                fs.appendFileSync(path.resolve(__dirname, '..', '..', 'logs', 'error.log'), logEntry, 'utf8');
            } catch (writeErr) {
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        const preview = err && err.message ? String(err.message).slice(0, 400) : String(err).slice(0,400);
        const stack = err && err.stack ? err.stack.split('\n').slice(0,6).join('\n') : 'no-stack';
        const entry = `[${new Date().toISOString()}] unhandledRouteError: ${preview}\nstack=${stack}\n`;
        try { fs.appendFileSync(path.resolve(__dirname, '..', '..', 'logs', 'error.log'), entry, 'utf8'); } catch {}
    } catch {}
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


