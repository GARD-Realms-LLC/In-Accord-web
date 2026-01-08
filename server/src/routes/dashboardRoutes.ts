import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardControllers";

const router = Router();

router.get("/", getDashboardStats);

export default router;
