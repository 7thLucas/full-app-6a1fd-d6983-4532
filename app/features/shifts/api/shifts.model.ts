import "reflect-metadata";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export enum ShiftStatus {
  Scheduled = "scheduled",
  Covered = "covered",
  Uncovered = "uncovered",
  Completed = "completed",
}

export enum ShiftPeriod {
  Opening = "opening",
  Morning = "morning",
  Midday = "midday",
  Afternoon = "afternoon",
  Closing = "closing",
  Full = "full",
}

@modelOptions({ schemaOptions: { collection: "tbl_barista_shifts", timestamps: true } })
export class BaristaShiftEntity {
  @prop({ type: () => String, required: true })
  date!: string; // YYYY-MM-DD

  @prop({ type: () => String, required: true, trim: true })
  barista_name!: string;

  @prop({ type: () => String, required: true, trim: true })
  barista_email?: string;

  @prop({ type: () => String, required: true })
  start_time!: string; // "07:00"

  @prop({ type: () => String, required: true })
  end_time!: string; // "15:00"

  @prop({ type: () => String, enum: ShiftPeriod, default: ShiftPeriod.Morning })
  period!: ShiftPeriod;

  @prop({ type: () => String, trim: true, default: "Barista" })
  role!: string;

  @prop({ type: () => String, enum: ShiftStatus, default: ShiftStatus.Scheduled })
  status!: ShiftStatus;

  @prop({ type: () => Boolean, default: false })
  is_peak_hour!: boolean;

  @prop({ type: () => String, trim: true, default: "" })
  notes?: string;
}

export const BaristaShiftModel = getModelForClass(BaristaShiftEntity);

export type BaristaShift = {
  id: string;
  date: string;
  barista_name: string;
  barista_email?: string;
  start_time: string;
  end_time: string;
  period: ShiftPeriod;
  role: string;
  status: ShiftStatus;
  is_peak_hour: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateShiftDto = {
  date: string;
  barista_name: string;
  barista_email?: string;
  start_time: string;
  end_time: string;
  period?: ShiftPeriod;
  role?: string;
  status?: ShiftStatus;
  is_peak_hour?: boolean;
  notes?: string;
};

export type UpdateShiftDto = Partial<Omit<CreateShiftDto, "date">>;
