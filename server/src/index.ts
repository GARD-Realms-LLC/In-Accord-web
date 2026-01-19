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

// Example: Broadcast a test event every 10 seconds (remove or replace in production)
setInterval(() => {
    io.emit('liveUpdate', { message: 'This is a live update from the server', timestamp: Date.now() });
}, 10000);
interface RequestWithRawBody extends Request {
    rawBody?: string;
}

app.use(express.json({
    limit: '50mb',
    verify: (req, _res, buf) => {
        try {
            (req as RequestWithRawBody).rawBody = buf.toString('utf8');
        } catch (error) {
            console.warn('Unable to capture raw request body', error);
        }
    }
}));
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const isJsonSyntaxError = err instanceof SyntaxError && (err as any).status === 400 && 'body' in err;
    if (isJsonSyntaxError) {
        const rawBody = (req as RequestWithRawBody).rawBody;
        const logEntry = `[${new Date().toISOString()}] JSON parse error: ${err.message}\nraw=${rawBody}\n`;
        try {
            fs.appendFileSync(path.resolve(__dirname, '..', '..', 'logs', 'error.log'), logEntry, 'utf8');
        } catch (writeErr) {
            console.warn('Failed to append JSON parse error log', writeErr);
        }
        console.error('JSON parse error:', err.message, rawBody);
        res.status(400).json({
            success: false,
            error: 'Invalid JSON payload',
            details: err.message,
            rawBodyPreview: rawBody?.slice(0, 200)
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


