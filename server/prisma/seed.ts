import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// __filename and __dirname are available in CommonJS

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    let modelName = path.basename(fileName, path.extname(fileName));
    if (modelName === "permissions") return "Permission";
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Delete in child-first order to avoid FK constraint errors

  const deleteFileNames = [
    "expenseByCategory.json",
    "sales.json",
    "purchases.json",
    "expenses.json",
    "users.json",
    "expenseSummary.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "products.json",
    "permissions.json",
  ];

  // Insert in parent-first order for FK dependencies
  const insertFileNames = [
    "permissions.json",
    "products.json",
    "users.json",
    "expenseSummary.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "expenses.json",
    "sales.json",
    "purchases.json",
    "expenseByCategory.json",
  ];

  await deleteAllData(deleteFileNames);

  for (const fileName of insertFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let modelName = path.basename(fileName, path.extname(fileName));
    if (modelName === "permissions") modelName = "Permission";
    else modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
