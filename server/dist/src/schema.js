"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseByCategory = exports.expenseSummary = exports.purchaseSummaryTable = exports.salesSummary = exports.products = exports.purchases = exports.sales = exports.expenses = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('Users', {
    userId: (0, pg_core_1.varchar)('userId', { length: 255 }).primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    website: (0, pg_core_1.varchar)('website', { length: 255 }),
    githubLogin: (0, pg_core_1.varchar)('githubLogin', { length: 255 }),
    discordLogin: (0, pg_core_1.varchar)('discordLogin', { length: 255 }),
    description: (0, pg_core_1.varchar)('description', { length: 255 }),
    lastLogin: (0, pg_core_1.timestamp)('lastLogin'),
});
exports.expenses = (0, pg_core_1.pgTable)('Expenses', {
    expenseId: (0, pg_core_1.varchar)('expenseId', { length: 255 }).primaryKey(),
    category: (0, pg_core_1.varchar)('category', { length: 255 }),
    amount: (0, pg_core_1.real)('amount'),
    timestamp: (0, pg_core_1.timestamp)('timestamp'),
});
exports.sales = (0, pg_core_1.pgTable)('Sales', {
    saleId: (0, pg_core_1.varchar)('saleId', { length: 255 }).primaryKey(),
    productId: (0, pg_core_1.varchar)('productId', { length: 255 }),
    timestamp: (0, pg_core_1.timestamp)('timestamp'),
    quantity: (0, pg_core_1.integer)('quantity'),
    unitPrice: (0, pg_core_1.real)('unitPrice'),
    totalAmount: (0, pg_core_1.real)('totalAmount'),
});
exports.purchases = (0, pg_core_1.pgTable)('Purchases', {
    purchaseId: (0, pg_core_1.varchar)('purchaseId', { length: 255 }).primaryKey(),
    productId: (0, pg_core_1.varchar)('productId', { length: 255 }),
    timestamp: (0, pg_core_1.timestamp)('timestamp'),
    quantity: (0, pg_core_1.integer)('quantity'),
    unitCost: (0, pg_core_1.real)('unitCost'),
    totalCost: (0, pg_core_1.real)('totalCost'),
});
exports.products = (0, pg_core_1.pgTable)('Products', {
    productId: (0, pg_core_1.varchar)('productId', { length: 255 }).primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }),
    price: (0, pg_core_1.real)('price'),
    rating: (0, pg_core_1.real)('rating'),
    stockQuantity: (0, pg_core_1.integer)('stockQuantity'),
});
exports.salesSummary = (0, pg_core_1.pgTable)('SalesSummary', {
    salesSummaryId: (0, pg_core_1.varchar)('salesSummaryId', { length: 255 }).primaryKey(),
    totalValue: (0, pg_core_1.real)('totalValue'),
    changePercentage: (0, pg_core_1.real)('changePercentage'),
    date: (0, pg_core_1.timestamp)('date'),
});
exports.purchaseSummaryTable = (0, pg_core_1.pgTable)('PurchaseSummary', {
    purchaseSummaryId: (0, pg_core_1.varchar)('purchaseSummaryId', { length: 255 }).primaryKey(),
    totalPurchased: (0, pg_core_1.real)('totalPurchased'),
    changePercentage: (0, pg_core_1.real)('changePercentage'),
    date: (0, pg_core_1.timestamp)('date'),
});
exports.expenseSummary = (0, pg_core_1.pgTable)('ExpenseSummary', {
    expenseSummaryId: (0, pg_core_1.varchar)('expenseSummaryId', { length: 255 }).primaryKey(),
    totalExpenses: (0, pg_core_1.real)('totalExpenses'),
    date: (0, pg_core_1.timestamp)('date'),
});
exports.expenseByCategory = (0, pg_core_1.pgTable)('ExpenseByCategory', {
    expenseByCategoryId: (0, pg_core_1.varchar)('expenseByCategoryId', { length: 255 }).primaryKey(),
    expenseSummaryId: (0, pg_core_1.varchar)('expenseSummaryId', { length: 255 }),
    category: (0, pg_core_1.varchar)('category', { length: 255 }),
    amount: (0, pg_core_1.bigint)('amount', { mode: 'bigint' }),
    date: (0, pg_core_1.timestamp)('date'),
});
