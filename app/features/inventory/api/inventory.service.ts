import { BeanInventoryModel, type BeanInventory, type CreateBeanInventoryDto, type UpdateBeanInventoryDto, type RestockBeanDto } from "./inventory.model";

function toPublic(doc: any): BeanInventory {
  const qty = doc.quantity_kg ?? 0;
  const low = doc.low_stock_threshold_kg ?? 2;
  const critical = doc.critical_stock_threshold_kg ?? 0.5;

  let status: BeanInventory["status"] = "ok";
  if (qty <= critical) status = "critical";
  else if (qty <= low) status = "low";

  return {
    id: doc._id.toString(),
    name: doc.name,
    origin: doc.origin,
    quantity_kg: qty,
    low_stock_threshold_kg: low,
    critical_stock_threshold_kg: critical,
    notes: doc.notes,
    is_active: doc.is_active,
    status,
    createdAt: doc.createdAt?.toISOString?.() ?? "",
    updatedAt: doc.updatedAt?.toISOString?.() ?? "",
  };
}

export const InventoryService = {
  async list(): Promise<BeanInventory[]> {
    const docs = await BeanInventoryModel.find({ is_active: true }).sort({ name: 1 });
    return docs.map(toPublic);
  },

  async getById(id: string): Promise<BeanInventory> {
    const doc = await BeanInventoryModel.findOne({ _id: id, is_active: true });
    if (!doc) throw new Error("Bean not found");
    return toPublic(doc);
  },

  async create(dto: CreateBeanInventoryDto): Promise<BeanInventory> {
    const existing = await BeanInventoryModel.findOne({ name: dto.name });
    if (existing) throw new Error(`Bean with name '${dto.name}' already exists`);

    const doc = await BeanInventoryModel.create({
      name: dto.name,
      origin: dto.origin,
      quantity_kg: dto.quantity_kg ?? 0,
      low_stock_threshold_kg: dto.low_stock_threshold_kg ?? 2,
      critical_stock_threshold_kg: dto.critical_stock_threshold_kg ?? 0.5,
      notes: dto.notes ?? "",
      is_active: true,
    });
    return toPublic(doc);
  },

  async update(id: string, dto: UpdateBeanInventoryDto): Promise<BeanInventory> {
    const doc = await BeanInventoryModel.findOneAndUpdate(
      { _id: id, is_active: true },
      { $set: dto },
      { new: true }
    );
    if (!doc) throw new Error("Bean not found");
    return toPublic(doc);
  },

  async restock(id: string, dto: RestockBeanDto): Promise<BeanInventory> {
    const doc = await BeanInventoryModel.findOne({ _id: id, is_active: true });
    if (!doc) throw new Error("Bean not found");

    doc.quantity_kg = (doc.quantity_kg ?? 0) + dto.quantity_added;
    if (dto.notes) doc.notes = dto.notes;
    await doc.save();
    return toPublic(doc);
  },

  async remove(id: string): Promise<void> {
    await BeanInventoryModel.findByIdAndUpdate(id, { is_active: false });
  },

  async getLowStockAlerts(): Promise<BeanInventory[]> {
    const all = await this.list();
    return all.filter((b) => b.status === "low" || b.status === "critical");
  },
};
