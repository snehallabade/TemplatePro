import { 
  templates, 
  generatedPdfs, 
  users,
  type Template, 
  type InsertTemplate, 
  type GeneratedPdf, 
  type InsertGeneratedPdf,
  type DashboardStats,
  type Placeholder,
  type User,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Template operations
  createTemplate(template: InsertTemplate, userId?: string): Promise<Template>;
  getTemplate(id: number, userId?: string): Promise<Template | undefined>;
  getAllTemplates(userId?: string): Promise<Template[]>;
  searchTemplates(query: string, userId?: string): Promise<Template[]>;
  deleteTemplate(id: number, userId?: string): Promise<boolean>;
  
  // Generated PDF operations
  createGeneratedPdf(pdf: InsertGeneratedPdf, userId?: string): Promise<GeneratedPdf>;
  getGeneratedPdf(id: number, userId?: string): Promise<GeneratedPdf | undefined>;
  getAllGeneratedPdfs(userId?: string): Promise<GeneratedPdf[]>;
  getGeneratedPdfsByTemplate(templateId: number, userId?: string): Promise<GeneratedPdf[]>;
  deleteGeneratedPdf(id: number, userId?: string): Promise<boolean>;
  
  // Dashboard stats
  getDashboardStats(userId?: string): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for authentication)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Template operations
  async createTemplate(insertTemplate: InsertTemplate, userId?: string): Promise<Template> {
    const templateData = {
      name: insertTemplate.name,
      filename: insertTemplate.filename,
      originalContent: insertTemplate.originalContent,
      placeholders: insertTemplate.placeholders,
      sections: insertTemplate.sections || 1,
      userId: userId || null
    };
    
    const [template] = await db
      .insert(templates)
      .values(templateData)
      .returning();
    return template;
  }

  async getTemplate(id: number, userId?: string): Promise<Template | undefined> {
    const conditions = userId 
      ? and(eq(templates.id, id), eq(templates.userId, userId))
      : eq(templates.id, id);
    
    const [template] = await db.select().from(templates).where(conditions);
    return template;
  }

  async getAllTemplates(userId?: string): Promise<Template[]> {
    const conditions = userId ? eq(templates.userId, userId) : undefined;
    
    const result = await db
      .select()
      .from(templates)
      .where(conditions)
      .orderBy(templates.uploadedAt);
    
    return result;
  }

  async searchTemplates(query: string, userId?: string): Promise<Template[]> {
    const allTemplates = await this.getAllTemplates(userId);
    const lowerQuery = query.toLowerCase();
    return allTemplates.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.filename.toLowerCase().includes(lowerQuery)
    );
  }

  async deleteTemplate(id: number, userId?: string): Promise<boolean> {
    const conditions = userId 
      ? and(eq(templates.id, id), eq(templates.userId, userId))
      : eq(templates.id, id);
    
    const result = await db.delete(templates).where(conditions);
    return result.rowCount > 0;
  }

  // Generated PDF operations
  async createGeneratedPdf(insertPdf: InsertGeneratedPdf, userId?: string): Promise<GeneratedPdf> {
    const [pdf] = await db
      .insert(generatedPdfs)
      .values({ ...insertPdf, userId })
      .returning();
    return pdf;
  }

  async getGeneratedPdf(id: number, userId?: string): Promise<GeneratedPdf | undefined> {
    const conditions = userId 
      ? and(eq(generatedPdfs.id, id), eq(generatedPdfs.userId, userId))
      : eq(generatedPdfs.id, id);
    
    const [pdf] = await db.select().from(generatedPdfs).where(conditions);
    return pdf;
  }

  async getAllGeneratedPdfs(userId?: string): Promise<GeneratedPdf[]> {
    const conditions = userId ? eq(generatedPdfs.userId, userId) : undefined;
    
    const result = await db
      .select()
      .from(generatedPdfs)
      .where(conditions)
      .orderBy(generatedPdfs.createdAt);
    
    return result;
  }

  async getGeneratedPdfsByTemplate(templateId: number, userId?: string): Promise<GeneratedPdf[]> {
    const conditions = userId 
      ? and(eq(generatedPdfs.templateId, templateId), eq(generatedPdfs.userId, userId))
      : eq(generatedPdfs.templateId, templateId);
    
    const result = await db
      .select()
      .from(generatedPdfs)
      .where(conditions)
      .orderBy(generatedPdfs.createdAt);
    
    return result;
  }

  async deleteGeneratedPdf(id: number, userId?: string): Promise<boolean> {
    const conditions = userId 
      ? and(eq(generatedPdfs.id, id), eq(generatedPdfs.userId, userId))
      : eq(generatedPdfs.id, id);
    
    const result = await db.delete(generatedPdfs).where(conditions);
    return result.rowCount > 0;
  }

  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    const allTemplates = await this.getAllTemplates(userId);
    const allPdfs = await this.getAllGeneratedPdfs(userId);
    
    // Find most used template
    const templateUsage = new Map<number, number>();
    allPdfs.forEach(pdf => {
      const count = templateUsage.get(pdf.templateId) || 0;
      templateUsage.set(pdf.templateId, count + 1);
    });
    
    let mostUsedTemplate = "";
    let maxUsage = 0;
    for (const [templateId, usage] of templateUsage.entries()) {
      if (usage > maxUsage) {
        maxUsage = usage;
        const template = allTemplates.find(t => t.id === templateId);
        if (template) {
          mostUsedTemplate = template.name;
        }
      }
    }

    // Recent activity
    let recentActivity = "";
    if (allTemplates.length > 0) {
      const latestTemplate = allTemplates[allTemplates.length - 1];
      const timeDiff = Date.now() - latestTemplate.uploadedAt.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      recentActivity = hours < 1 ? "Less than an hour ago" : `${hours} hours ago`;
    }

    return {
      totalTemplates: allTemplates.length,
      totalGeneratedPdfs: allPdfs.length,
      recentActivity,
      mostUsedTemplate: mostUsedTemplate || undefined,
    };
  }
}

export const storage = new DatabaseStorage();
