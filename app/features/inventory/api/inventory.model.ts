import "reflect-metadata";
import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "tbl_bean_inventory", timestamps: true } })
@index({ name: 1 }, { unique: true })
export class BeanInventoryEntity {
  @prop({ type: () => String, required: true, trim: true })
  name!: string;

  @prop({ type: () => String, required: true, trim: true })
  origin!: string;

  @prop({ type: () => Number, required: true, default: 0 })
  quantity_kg!: number;

  @prop({ type: () => Number, required: true, default: 2 })
  low_stock_threshold_kg!: number;

  @prop({ type: () => Number, required: true, default: 0.5 })
  critical_stock_threshold_kg!: number;

  @prop({ type: () => String, trim: true, default: "" })
  notes?: string;

  @prop({ type: () => Boolean, default: true })
  is_active!: boolean;
}

export const BeanInventoryModel = getModelForClass(BeanInventoryEntity);

export type BeanInventory = {
  id: string;
  name: string;
  origin: string;
  quantity_kg: number;
  low_stock_threshold_kg: number;
  critical_stock_threshold_kg: number;
  notes?: string;
  is_active: boolean;
  status: "ok" | "low" | "critical";
  createdAt: string;
  updatedAt: string;
};

export type CreateBeanInventoryDto = {
  name: string;
  origin: string;
  quantity_kg: number;
  low_stock_threshold_kg?: number;
  critical_stock_threshold_kg?: number;
  notes?: string;
};

export type UpdateBeanInventoryDto = Partial<CreateBeanInventoryDto>;

export type RestockBeanDto = {
  quantity_added: number;
  notes?: string;
};
