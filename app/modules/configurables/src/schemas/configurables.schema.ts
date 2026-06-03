/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "backgroundColor",
      type: "color",
      required: false,
      label: "Background Color",
    },
    {
      fieldName: "surfaceColor",
      type: "color",
      required: false,
      label: "Surface / Card Color",
    },
    {
      fieldName: "textPrimaryColor",
      type: "color",
      required: false,
      label: "Text Primary Color",
    },
    {
      fieldName: "textSecondaryColor",
      type: "color",
      required: false,
      label: "Text Secondary Color",
    },
    {
      fieldName: "borderColor",
      type: "color",
      required: false,
      label: "Border Color",
    },
    {
      fieldName: "successColor",
      type: "color",
      required: false,
      label: "Success Color",
    },
    {
      fieldName: "warningColor",
      type: "color",
      required: false,
      label: "Warning Color",
    },
    {
      fieldName: "dangerColor",
      type: "color",
      required: false,
      label: "Danger Color",
    },
    {
      fieldName: "shopName",
      type: "string",
      required: false,
      label: "Coffee Shop Name",
    },
    {
      fieldName: "shopAddress",
      type: "string",
      required: false,
      label: "Shop Address",
    },
    {
      fieldName: "lowStockThresholdDefault",
      type: "number",
      required: false,
      label: "Default Low Stock Threshold (kg)",
      min: 0,
      max: 100,
    },
    {
      fieldName: "criticalStockThresholdDefault",
      type: "number",
      required: false,
      label: "Default Critical Stock Threshold (kg)",
      min: 0,
      max: 50,
    },
    {
      fieldName: "peakHours",
      type: "array",
      required: false,
      label: "Peak Hour Labels",
      item: { type: "string", required: true },
    },
    {
      fieldName: "salesCategories",
      type: "array",
      required: false,
      label: "Sales Categories",
      item: { type: "string", required: true },
    },
    {
      fieldName: "dashboardWelcomeMessage",
      type: "string",
      required: false,
      label: "Dashboard Welcome Message",
    },
    {
      fieldName: "enableShiftAlerts",
      type: "boolean",
      required: false,
      label: "Enable Shift Coverage Alerts",
    },
    {
      fieldName: "enableLowStockAlerts",
      type: "boolean",
      required: false,
      label: "Enable Low Stock Alerts",
    },
    {
      fieldName: "currencySymbol",
      type: "string",
      required: false,
      label: "Currency Symbol",
      maxLength: 3,
    },
  ],
};
