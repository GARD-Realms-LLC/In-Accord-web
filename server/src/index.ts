import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

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
app.use(express.json({ limit: '50mb' }));
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
import path from 'path';
app.use('/data', express.static(path.resolve(__dirname, '..', 'data')));
import npmRoutes from './routes/npmRoutes';
app.use('/api/npm', npmRoutes);



/* SERVER */
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


