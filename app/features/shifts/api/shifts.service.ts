import { BaristaShiftModel, ShiftStatus, ShiftPeriod, type BaristaShift, type CreateShiftDto, type UpdateShiftDto } from "./shifts.model";

function toPublic(doc: any): BaristaShift {
  return {
    id: doc._id.toString(),
    date: doc.date,
    barista_name: doc.barista_name,
    barista_email: doc.barista_email,
    start_time: doc.start_time,
    end_time: doc.end_time,
    period: doc.period ?? ShiftPeriod.Morning,
    role: doc.role ?? "Barista",
    status: doc.status ?? ShiftStatus.Scheduled,
    is_peak_hour: doc.is_peak_hour ?? false,
    notes: doc.notes,
    createdAt: doc.createdAt?.toISOString?.() ?? "",
    updatedAt: doc.updatedAt?.toISOString?.() ?? "",
  };
}

export const ShiftsService = {
  async listByWeek(weekStart: string): Promise<BaristaShift[]> {
    // weekStart is YYYY-MM-DD for Monday
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const endStr = end.toISOString().split("T")[0];

    const docs = await BaristaShiftModel.find({
      date: { $gte: weekStart, $lte: endStr },
    }).sort({ date: 1, start_time: 1 });
    return docs.map(toPublic);
  },

  async listByDate(date: string): Promise<BaristaShift[]> {
    const docs = await BaristaShiftModel.find({ date }).sort({ start_time: 1 });
    return docs.map(toPublic);
  },

  async getById(id: string): Promise<BaristaShift> {
    const doc = await BaristaShiftModel.findById(id);
    if (!doc) throw new Error("Shift not found");
    return toPublic(doc);
  },

  async create(dto: CreateShiftDto): Promise<BaristaShift> {
    const doc = await BaristaShiftModel.create({
      date: dto.date,
      barista_name: dto.barista_name,
      barista_email: dto.barista_email ?? "",
      start_time: dto.start_time,
      end_time: dto.end_time,
      period: dto.period ?? ShiftPeriod.Morning,
      role: dto.role ?? "Barista",
      status: dto.status ?? ShiftStatus.Scheduled,
      is_peak_hour: dto.is_peak_hour ?? false,
      notes: dto.notes ?? "",
    });
    return toPublic(doc);
  },

  async update(id: string, dto: UpdateShiftDto): Promise<BaristaShift> {
    const doc = await BaristaShiftModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
    if (!doc) throw new Error("Shift not found");
    return toPublic(doc);
  },

  async remove(id: string): Promise<void> {
    const result = await BaristaShiftModel.findByIdAndDelete(id);
    if (!result) throw new Error("Shift not found");
  },

  async getWeekSummary(weekStart: string): Promise<{
    totalShifts: number;
    coveredShifts: number;
    uncoveredShifts: number;
    peakHourShifts: number;
    baristas: string[];
  }> {
    const shifts = await this.listByWeek(weekStart);
    const baristas = [...new Set(shifts.map((s) => s.barista_name))];
    return {
      totalShifts: shifts.length,
      coveredShifts: shifts.filter((s) => s.status === ShiftStatus.Covered || s.status === ShiftStatus.Scheduled).length,
      uncoveredShifts: shifts.filter((s) => s.status === ShiftStatus.Uncovered).length,
      peakHourShifts: shifts.filter((s) => s.is_peak_hour).length,
      baristas,
    };
  },
};
