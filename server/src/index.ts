import express from "express";
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
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
import path from 'path';
app.use('/data', express.static(path.resolve(__dirname, '..', 'data')));



/* SERVER */
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 


