import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  originalContent: text("original_content").notNull(),
  placeholders: jsonb("placeholders").notNull().$type<Placeholder[]>(),
  sections: integer("sections").notNull().default(1),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const generatedPdfs = pgTable("generated_pdfs", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => templates.id),
  name: text("name").notNull(),
  formData: jsonb("form_data").notNull().$type<Record<string, any>>(),
  pdfContent: text("pdf_content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const placeholderTypeEnum = z.enum(["text", "number", "date", "image"]);

export const placeholderSchema = z.object({
  name: z.string(),
  type: placeholderTypeEnum,
  label: z.string(),
  required: z.boolean().default(true),
});

export type Placeholder = z.infer<typeof placeholderSchema>;

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  uploadedAt: true,
});

export const insertGeneratedPdfSchema = createInsertSchema(generatedPdfs).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertGeneratedPdf = z.infer<typeof insertGeneratedPdfSchema>;
export type GeneratedPdf = typeof generatedPdfs.$inferSelect;

// Form data schema for PDF generation
export const pdfFormDataSchema = z.record(z.string(), z.any());
export type PdfFormData = z.infer<typeof pdfFormDataSchema>;

// Stats schema for dashboard
export const dashboardStatsSchema = z.object({
  totalTemplates: z.number(),
  totalGeneratedPdfs: z.number(),
  recentActivity: z.string().optional(),
  mostUsedTemplate: z.string().optional(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
