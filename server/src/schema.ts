import { pgTable, varchar, real, integer, timestamp, bigint } from 'drizzle-orm/pg-core';

export const users = pgTable('Users', {
  userId: varchar('userId', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  githubLogin: varchar('githubLogin', { length: 255 }),
  discordLogin: varchar('discordLogin', { length: 255 }),
  description: varchar('description', { length: 255 }),
  lastLogin: timestamp('lastLogin'),
});

export const expenses = pgTable('Expenses', {
  expenseId: varchar('expenseId', { length: 255 }).primaryKey(),
  category: varchar('category', { length: 255 }),
  amount: real('amount'),
  timestamp: timestamp('timestamp'),
});

export const sales = pgTable('Sales', {
  saleId: varchar('saleId', { length: 255 }).primaryKey(),
  productId: varchar('productId', { length: 255 }),
  timestamp: timestamp('timestamp'),
  quantity: integer('quantity'),
  unitPrice: real('unitPrice'),
  totalAmount: real('totalAmount'),
});

export const purchases = pgTable('Purchases', {
  purchaseId: varchar('purchaseId', { length: 255 }).primaryKey(),
  productId: varchar('productId', { length: 255 }),
  timestamp: timestamp('timestamp'),
  quantity: integer('quantity'),
  unitCost: real('unitCost'),
  totalCost: real('totalCost'),
});

export const products = pgTable('Products', {
  productId: varchar('productId', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  price: real('price'),
  rating: real('rating'),
  stockQuantity: integer('stockQuantity'),
});

export const salesSummary = pgTable('SalesSummary', {
  salesSummaryId: varchar('salesSummaryId', { length: 255 }).primaryKey(),
  totalValue: real('totalValue'),
  changePercentage: real('changePercentage'),
  date: timestamp('date'),
});

export const purchaseSummaryTable = pgTable('PurchaseSummary', {
  purchaseSummaryId: varchar('purchaseSummaryId', { length: 255 }).primaryKey(),
  totalPurchased: real('totalPurchased'),
  changePercentage: real('changePercentage'),
  date: timestamp('date'),
});

export const expenseSummary = pgTable('ExpenseSummary', {
  expenseSummaryId: varchar('expenseSummaryId', { length: 255 }).primaryKey(),
  totalExpenses: real('totalExpenses'),
  date: timestamp('date'),
});

export const expenseByCategory = pgTable('ExpenseByCategory', {
  expenseByCategoryId: varchar('expenseByCategoryId', { length: 255 }).primaryKey(),
  expenseSummaryId: varchar('expenseSummaryId', { length: 255 }),
  category: varchar('category', { length: 255 }),
  amount: bigint('amount', { mode: 'bigint' }),
  date: timestamp('date'),
});
