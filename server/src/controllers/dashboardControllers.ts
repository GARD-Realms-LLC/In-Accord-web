import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; 

const prisma = new PrismaClient();

export const getDashboardStats = async (
    req: Request,
     res: Response
    ): Promise<void> => {
    try {
        const popularProducts = await prisma.products.findMany({
            take: 15,
           orderBy: {
            stockQuantity: "desc"
           }, 
        });
        const saleSummary = await prisma.salesSummary.findMany({
            take: 5,
           orderBy: {
            date: "desc",
           },
        });
    } catch (error) {
     res.status(500).json({ message: "Error retrieving dashboard metrics" });
    } 
};

