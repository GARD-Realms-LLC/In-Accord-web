import { Request, Response } from "express";
import { db } from '../db';
import { products, salesSummary, purchaseSummaryTable, expenseSummary, expenseByCategory } from '../schema';
import { desc } from 'drizzle-orm';

export const getDashboardStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const popularProducts = await db.select().from(products).orderBy(desc(products.stockQuantity)).limit(15);
        const saleSummary = await db.select().from(salesSummary).orderBy(desc(salesSummary.date)).limit(5);
        const purchaseSummary = await db.select().from(purchaseSummaryTable).orderBy(desc(purchaseSummaryTable.date)).limit(5);
        const expenseSummaryRows = await db.select().from(expenseSummary).orderBy(desc(expenseSummary.date)).limit(5);
        const expenseByCategorySummaryRaw = await db.select().from(expenseByCategory).orderBy(desc(expenseByCategory.date)).limit(5);
        type ExpenseByCategoryRecord = (typeof expenseByCategorySummaryRaw)[number];
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item: ExpenseByCategoryRecord) => ({
            ...item,
            amount: item.amount ? item.amount.toString() : '',
        }));
        res.json({
            popularProducts,
            salesSummary: saleSummary,
            purchaseSummary,
            expenseSummary: expenseSummaryRows,
            expenseByCategorySummary,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard metrics" });


    }
}


