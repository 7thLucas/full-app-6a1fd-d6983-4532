import "reflect-metadata";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export class SalesCategoryBreakdown {
  @prop({ type: () => String, required: true })
  category!: string;

  @prop({ type: () => Number, required: true, default: 0 })
  amount!: number;

  @prop({ type: () => Number, required: true, default: 0 })
  transactions!: number;
}

export class HourlySalesEntry {
  @prop({ type: () => Number, required: true })
  hour!: number; // 0-23

  @prop({ type: () => Number, required: true, default: 0 })
  amount!: number;

  @prop({ type: () => Number, required: true, default: 0 })
  transactions!: number;
}

@modelOptions({ schemaOptions: { collection: "tbl_daily_sales", timestamps: true } })
export class DailySalesEntity {
  @prop({ type: () => String, required: true })
  date!: string; // ISO date string YYYY-MM-DD

  @prop({ type: () => Number, required: true, default: 0 })
  total_revenue!: number;

  @prop({ type: () => Number, required: true, default: 0 })
  total_transactions!: number;

  @prop({ type: () => [SalesCategoryBreakdown], default: [] })
  category_breakdown!: SalesCategoryBreakdown[];

  @prop({ type: () => [HourlySalesEntry], default: [] })
  hourly_breakdown!: HourlySalesEntry[];

  @prop({ type: () => String, trim: true, default: "" })
  notes?: string;
}

export const DailySalesModel = getModelForClass(DailySalesEntity);

export type SalesCategoryBreakdownDto = {
  category: string;
  amount: number;
  transactions: number;
};

export type HourlySalesEntryDto = {
  hour: number;
  amount: number;
  transactions: number;
};

export type DailySales = {
  id: string;
  date: string;
  total_revenue: number;
  total_transactions: number;
  average_ticket: number;
  category_breakdown: SalesCategoryBreakdownDto[];
  hourly_breakdown: HourlySalesEntryDto[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDailySalesDto = {
  date: string;
  total_revenue: number;
  total_transactions: number;
  category_breakdown?: SalesCategoryBreakdownDto[];
  hourly_breakdown?: HourlySalesEntryDto[];
  notes?: string;
};

export type UpdateDailySalesDto = Partial<Omit<CreateDailySalesDto, "date">>;
