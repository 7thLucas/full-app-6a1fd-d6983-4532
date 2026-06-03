import { createLogger } from "~/lib/logger";
import { BeanInventoryModel } from "./inventory.model";

const logger = createLogger("InventorySeed");

export async function seedBeanInventory(): Promise<void> {
  try {
    const count = await BeanInventoryModel.countDocuments({ is_active: true });
    if (count > 0) {
      logger.info("Bean inventory already seeded, skipping.");
      return;
    }

    const beans = [
      {
        name: "Ethiopia Yirgacheffe",
        origin: "Ethiopia",
        quantity_kg: 8.5,
        low_stock_threshold_kg: 3,
        critical_stock_threshold_kg: 1,
        notes: "Light roast, floral & citrus notes",
        is_active: true,
      },
      {
        name: "Colombia Huila",
        origin: "Colombia",
        quantity_kg: 1.8,
        low_stock_threshold_kg: 3,
        critical_stock_threshold_kg: 1,
        notes: "Medium roast, caramel & apple notes",
        is_active: true,
      },
      {
        name: "Guatemala Antigua",
        origin: "Guatemala",
        quantity_kg: 0.4,
        low_stock_threshold_kg: 2,
        critical_stock_threshold_kg: 0.5,
        notes: "Medium-dark, chocolate & spice",
        is_active: true,
      },
      {
        name: "Brazil Santos",
        origin: "Brazil",
        quantity_kg: 12.0,
        low_stock_threshold_kg: 4,
        critical_stock_threshold_kg: 1.5,
        notes: "Dark roast, nutty & chocolatey",
        is_active: true,
      },
      {
        name: "Kenya AA",
        origin: "Kenya",
        quantity_kg: 2.2,
        low_stock_threshold_kg: 2.5,
        critical_stock_threshold_kg: 0.8,
        notes: "Bright & fruity, berry notes",
        is_active: true,
      },
    ];

    await BeanInventoryModel.insertMany(beans);
    logger.info(`Seeded ${beans.length} beans into inventory.`);
  } catch (error) {
    logger.error("Failed to seed bean inventory:", error);
  }
}
