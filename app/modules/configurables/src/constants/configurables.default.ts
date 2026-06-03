/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline?: string;
  brandColor: TBrandColor;
  backgroundColor?: string;
  surfaceColor?: string;
  textPrimaryColor?: string;
  textSecondaryColor?: string;
  borderColor?: string;
  successColor?: string;
  warningColor?: string;
  dangerColor?: string;
  shopName?: string;
  shopAddress?: string;
  lowStockThresholdDefault?: number;
  criticalStockThresholdDefault?: number;
  peakHours?: string[];
  salesCategories?: string[];
  dashboardWelcomeMessage?: string;
  enableShiftAlerts?: boolean;
  enableLowStockAlerts?: boolean;
  currencySymbol?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "BrewOps",
  logoUrl: "FILL_LOGO_URL_HERE",
  tagline: "Coffee Shop Operations, Simplified",
  brandColor: {
    primary: "#3B1F0A",
    secondary: "#C8832A",
    accent: "#E8A020",
  },
  backgroundColor: "#FAF6F0",
  surfaceColor: "#FFFFFF",
  textPrimaryColor: "#1A0F00",
  textSecondaryColor: "#7A6A5A",
  borderColor: "#E8DDD0",
  successColor: "#4A7C59",
  warningColor: "#E8A020",
  dangerColor: "#C0392B",
  shopName: "My Coffee Shop",
  shopAddress: "123 Main St",
  lowStockThresholdDefault: 2,
  criticalStockThresholdDefault: 0.5,
  peakHours: ["Morning Rush (7-10am)", "Lunch (11am-1pm)", "Afternoon (3-5pm)"],
  salesCategories: ["Espresso Drinks", "Drip Coffee", "Cold Brew", "Tea", "Food", "Merchandise"],
  dashboardWelcomeMessage: "Good morning! Here's your operations overview.",
  enableShiftAlerts: true,
  enableLowStockAlerts: true,
  currencySymbol: "$",
};
