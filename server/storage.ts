import { 
  templates, 
  generatedPdfs, 
  type Template, 
  type InsertTemplate, 
  type GeneratedPdf, 
  type InsertGeneratedPdf,
  type DashboardStats,
  type Placeholder
} from "@shared/schema";

export interface IStorage {
  // Template operations
  createTemplate(template: InsertTemplate): Promise<Template>;
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  searchTemplates(query: string): Promise<Template[]>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Generated PDF operations
  createGeneratedPdf(pdf: InsertGeneratedPdf): Promise<GeneratedPdf>;
  getGeneratedPdf(id: number): Promise<GeneratedPdf | undefined>;
  getAllGeneratedPdfs(): Promise<GeneratedPdf[]>;
  getGeneratedPdfsByTemplate(templateId: number): Promise<GeneratedPdf[]>;
  deleteGeneratedPdf(id: number): Promise<boolean>;
  
  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private templates: Map<number, Template>;
  private generatedPdfs: Map<number, GeneratedPdf>;
  private currentTemplateId: number;
  private currentPdfId: number;

  constructor() {
    this.templates = new Map();
    this.generatedPdfs = new Map();
    this.currentTemplateId = 1;
    this.currentPdfId = 1;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const template: Template = {
      ...insertTemplate,
      id,
      uploadedAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).sort((a, b) => 
      b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async searchTemplates(query: string): Promise<Template[]> {
    const allTemplates = await this.getAllTemplates();
    const lowerQuery = query.toLowerCase();
    return allTemplates.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.filename.toLowerCase().includes(lowerQuery)
    );
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  async createGeneratedPdf(insertPdf: InsertGeneratedPdf): Promise<GeneratedPdf> {
    const id = this.currentPdfId++;
    const pdf: GeneratedPdf = {
      ...insertPdf,
      id,
      createdAt: new Date(),
    };
    this.generatedPdfs.set(id, pdf);
    return pdf;
  }

  async getGeneratedPdf(id: number): Promise<GeneratedPdf | undefined> {
    return this.generatedPdfs.get(id);
  }

  async getAllGeneratedPdfs(): Promise<GeneratedPdf[]> {
    return Array.from(this.generatedPdfs.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getGeneratedPdfsByTemplate(templateId: number): Promise<GeneratedPdf[]> {
    const allPdfs = await this.getAllGeneratedPdfs();
    return allPdfs.filter(pdf => pdf.templateId === templateId);
  }

  async deleteGeneratedPdf(id: number): Promise<boolean> {
    return this.generatedPdfs.delete(id);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const allTemplates = await this.getAllTemplates();
    const allPdfs = await this.getAllGeneratedPdfs();
    
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
        const template = this.templates.get(templateId);
        if (template) {
          mostUsedTemplate = template.name;
        }
      }
    }

    // Recent activity
    let recentActivity = "";
    if (allTemplates.length > 0) {
      const latestTemplate = allTemplates[0];
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

export const storage = new MemStorage();
