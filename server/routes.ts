import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import mammoth from "mammoth";
import { insertTemplateSchema, insertGeneratedPdfSchema, pdfFormDataSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/msword') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx and .doc files are allowed'));
    }
  },
});

// Utility function to extract placeholders from text
function extractPlaceholders(text: string) {
  const placeholderRegex = /\{([^}]+)\}/g;
  const placeholders = [];
  const placeholderNames = new Set<string>();
  
  let match;
  while ((match = placeholderRegex.exec(text)) !== null) {
    const name = match[1].trim();
    if (!placeholderNames.has(name)) {
      placeholderNames.add(name);
      
      // Determine placeholder type based on name patterns
      let type: "text" | "number" | "date" | "image" = "text";
      const lowerName = name.toLowerCase();
      
      if (lowerName.includes('logo') || lowerName.includes('image') || lowerName.includes('photo')) {
        type = "image";
      } else if (lowerName.includes('date') || lowerName.includes('time')) {
        type = "date";
      } else if (lowerName.includes('id') || lowerName.includes('number') || lowerName.includes('amount') || lowerName.includes('count')) {
        type = "number";
      }
      
      placeholders.push({
        name,
        type,
        label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        required: true,
      });
    }
  }
  
  return placeholders;
}

// Utility function to replace placeholders in text
function replacePlaceholders(text: string, formData: Record<string, any>) {
  let result = text;
  
  for (const [key, value] of Object.entries(formData)) {
    const placeholder = `{${key}}`;
    const replacement = value ? String(value) : `[${key}]`;
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
  }
  
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const { search } = req.query;
      let templates;
      
      if (search && typeof search === 'string') {
        templates = await storage.searchTemplates(search);
      } else {
        templates = await storage.getAllTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/templates/upload", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Extract text from Word document
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      const documentText = result.value;
      
      // Extract placeholders
      const placeholders = extractPlaceholders(documentText);
      
      // Count sections (basic heuristic - could be improved)
      const sections = Math.max(1, (documentText.match(/\n\s*\n/g) || []).length);

      const templateData = {
        name: req.file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
        filename: req.file.originalname,
        originalContent: documentText,
        placeholders,
        sections,
      };

      const validatedData = insertTemplateSchema.parse(templateData);
      const template = await storage.createTemplate(validatedData);
      
      res.json({
        template,
        placeholdersDetected: placeholders.length,
      });
    } catch (error) {
      console.error("Template upload error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload template" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTemplate(id);
      
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Generated PDF routes
  app.get("/api/generated-pdfs", async (req, res) => {
    try {
      const pdfs = await storage.getAllGeneratedPdfs();
      res.json(pdfs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generated PDFs" });
    }
  });

  app.get("/api/generated-pdfs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pdf = await storage.getGeneratedPdf(id);
      
      if (!pdf) {
        return res.status(404).json({ message: "Generated PDF not found" });
      }
      
      res.json(pdf);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generated PDF" });
    }
  });

  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const { templateId, formData, name } = req.body;
      
      // Validate input
      const validatedFormData = pdfFormDataSchema.parse(formData);
      
      // Get template
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Replace placeholders in content
      const processedContent = replacePlaceholders(template.originalContent, validatedFormData);
      
      // Create generated PDF record
      const pdfData = {
        templateId,
        name: name || `${template.name} - ${new Date().toLocaleDateString()}`,
        formData: validatedFormData,
        pdfContent: processedContent,
      };
      
      const validatedPdfData = insertGeneratedPdfSchema.parse(pdfData);
      const generatedPdf = await storage.createGeneratedPdf(validatedPdfData);
      
      res.json(generatedPdf);
    } catch (error) {
      console.error("PDF generation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  app.delete("/api/generated-pdfs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGeneratedPdf(id);
      
      if (!success) {
        return res.status(404).json({ message: "Generated PDF not found" });
      }
      
      res.json({ message: "Generated PDF deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete generated PDF" });
    }
  });

  // Preview endpoint
  app.post("/api/preview", async (req, res) => {
    try {
      const { templateId, formData } = req.body;
      
      // Validate input
      const validatedFormData = pdfFormDataSchema.parse(formData);
      
      // Get template
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Replace placeholders in content
      const processedContent = replacePlaceholders(template.originalContent, validatedFormData);
      
      res.json({
        content: processedContent,
        placeholders: template.placeholders,
      });
    } catch (error) {
      console.error("Preview generation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate preview" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
