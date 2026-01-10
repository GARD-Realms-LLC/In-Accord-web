"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
/* ROUTE IMPORTS */
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes")); // http://localhost:8000/dashboard
/* CONFIGURATION */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
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
const path_1 = __importDefault(require("path"));
app.use('/data', express_1.default.static(path_1.default.resolve(__dirname, '..', 'data')));
/* SERVER */
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
