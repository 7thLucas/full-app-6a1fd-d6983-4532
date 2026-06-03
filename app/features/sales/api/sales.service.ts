import { DailySalesModel, type DailySales, type CreateDailySalesDto, type UpdateDailySalesDto } from "./sales.model";

function toPublic(doc: any): DailySales {
  const total = doc.total_revenue ?? 0;
  const txns = doc.total_transactions ?? 0;
  return {
    id: doc._id.toString(),
    date: doc.date,
    total_revenue: total,
    total_transactions: txns,
    average_ticket: txns > 0 ? parseFloat((total / txns).toFixed(2)) : 0,
    category_breakdown: doc.category_breakdown ?? [],
    hourly_breakdown: doc.hourly_breakdown ?? [],
    notes: doc.notes,
    createdAt: doc.createdAt?.toISOString?.() ?? "",
    updatedAt: doc.updatedAt?.toISOString?.() ?? "",
  };
}

export const SalesService = {
  async listRecent(days = 30): Promise<DailySales[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const docs = await DailySalesModel.find({ date: { $gte: cutoffStr } }).sort({ date: -1 });
    return docs.map(toPublic);
  },

  async getByDate(date: string): Promise<DailySales | null> {
    const doc = await DailySalesModel.findOne({ date });
    return doc ? toPublic(doc) : null;
  },

  async getById(id: string): Promise<DailySales> {
    const doc = await DailySalesModel.findById(id);
    if (!doc) throw new Error("Sales record not found");
    return toPublic(doc);
  },

  async create(dto: CreateDailySalesDto): Promise<DailySales> {
    const existing = await DailySalesModel.findOne({ date: dto.date });
    if (existing) throw new Error(`Sales record for ${dto.date} already exists. Use update instead.`);
    const doc = await DailySalesModel.create({
      date: dto.date,
      total_revenue: dto.total_revenue,
      total_transactions: dto.total_transactions,
      category_breakdown: dto.category_breakdown ?? [],
      hourly_breakdown: dto.hourly_breakdown ?? [],
      notes: dto.notes ?? "",
    });
    return toPublic(doc);
  },

  async upsert(dto: CreateDailySalesDto): Promise<DailySales> {
    const doc = await DailySalesModel.findOneAndUpdate(
      { date: dto.date },
      {
        $set: {
          total_revenue: dto.total_revenue,
          total_transactions: dto.total_transactions,
          category_breakdown: dto.category_breakdown ?? [],
          hourly_breakdown: dto.hourly_breakdown ?? [],
          notes: dto.notes ?? "",
        },
      },
      { new: true, upsert: true }
    );
    return toPublic(doc);
  },

  async update(id: string, dto: UpdateDailySalesDto): Promise<DailySales> {
    const doc = await DailySalesModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
    if (!doc) throw new Error("Sales record not found");
    return toPublic(doc);
  },

  async getSummary(days = 7): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    averageTicket: number;
    dailyAvgRevenue: number;
    records: DailySales[];
  }> {
    const records = await this.listRecent(days);
    const totalRevenue = records.reduce((s, r) => s + r.total_revenue, 0);
    const totalTransactions = records.reduce((s, r) => s + r.total_transactions, 0);
    return {
      totalRevenue,
      totalTransactions,
      averageTicket: totalTransactions > 0 ? parseFloat((totalRevenue / totalTransactions).toFixed(2)) : 0,
      dailyAvgRevenue: records.length > 0 ? parseFloat((totalRevenue / records.length).toFixed(2)) : 0,
      records,
    };
  },
};
