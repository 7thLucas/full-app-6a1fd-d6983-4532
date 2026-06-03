import { createLogger } from "~/lib/logger";
import { DailySalesModel } from "./sales.model";

const logger = createLogger("SalesSeed");

export async function seedDailySales(): Promise<void> {
  try {
    const count = await DailySalesModel.countDocuments();
    if (count > 0) {
      logger.info("Sales data already seeded, skipping.");
      return;
    }

    const today = new Date();
    const records = [];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Weekends get less traffic
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseRevenue = isWeekend ? 320 : 480;
      const variance = Math.random() * 120 - 60;
      const totalRevenue = parseFloat((baseRevenue + variance).toFixed(2));
      const totalTransactions = Math.floor(totalRevenue / (isWeekend ? 7.5 : 8.2));

      records.push({
        date: dateStr,
        total_revenue: totalRevenue,
        total_transactions: totalTransactions,
        category_breakdown: [
          { category: "Espresso Drinks", amount: parseFloat((totalRevenue * 0.42).toFixed(2)), transactions: Math.floor(totalTransactions * 0.40) },
          { category: "Drip Coffee", amount: parseFloat((totalRevenue * 0.18).toFixed(2)), transactions: Math.floor(totalTransactions * 0.22) },
          { category: "Cold Brew", amount: parseFloat((totalRevenue * 0.15).toFixed(2)), transactions: Math.floor(totalTransactions * 0.15) },
          { category: "Tea", amount: parseFloat((totalRevenue * 0.08).toFixed(2)), transactions: Math.floor(totalTransactions * 0.10) },
          { category: "Food", amount: parseFloat((totalRevenue * 0.12).toFixed(2)), transactions: Math.floor(totalTransactions * 0.10) },
          { category: "Merchandise", amount: parseFloat((totalRevenue * 0.05).toFixed(2)), transactions: Math.floor(totalTransactions * 0.03) },
        ],
        hourly_breakdown: [
          { hour: 7, amount: parseFloat((totalRevenue * 0.15).toFixed(2)), transactions: Math.floor(totalTransactions * 0.14) },
          { hour: 8, amount: parseFloat((totalRevenue * 0.18).toFixed(2)), transactions: Math.floor(totalTransactions * 0.17) },
          { hour: 9, amount: parseFloat((totalRevenue * 0.14).toFixed(2)), transactions: Math.floor(totalTransactions * 0.13) },
          { hour: 10, amount: parseFloat((totalRevenue * 0.10).toFixed(2)), transactions: Math.floor(totalTransactions * 0.10) },
          { hour: 11, amount: parseFloat((totalRevenue * 0.08).toFixed(2)), transactions: Math.floor(totalTransactions * 0.08) },
          { hour: 12, amount: parseFloat((totalRevenue * 0.11).toFixed(2)), transactions: Math.floor(totalTransactions * 0.11) },
          { hour: 13, amount: parseFloat((totalRevenue * 0.08).toFixed(2)), transactions: Math.floor(totalTransactions * 0.08) },
          { hour: 14, amount: parseFloat((totalRevenue * 0.06).toFixed(2)), transactions: Math.floor(totalTransactions * 0.07) },
          { hour: 15, amount: parseFloat((totalRevenue * 0.05).toFixed(2)), transactions: Math.floor(totalTransactions * 0.07) },
          { hour: 16, amount: parseFloat((totalRevenue * 0.05).toFixed(2)), transactions: Math.floor(totalTransactions * 0.05) },
        ],
        notes: "",
      });
    }

    await DailySalesModel.insertMany(records);
    logger.info(`Seeded ${records.length} days of sales data.`);
  } catch (error) {
    logger.error("Failed to seed sales data:", error);
  }
}
