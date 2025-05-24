import PDFDocument from 'pdfkit';
import fs from 'fs-extra';
import path from 'path';
import { Template, GeneratedPdf } from '@shared/schema';

export interface PdfGenerationOptions {
  template: Template;
  formData: Record<string, any>;
  outputPath?: string;
}

export class PdfGenerator {
  private static ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static async generatePdf(options: PdfGenerationOptions): Promise<{ filePath: string; buffer: Buffer }> {
    const { template, formData } = options;
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72
      }
    });

    // Create output directory
    const outputDir = path.join(process.cwd(), 'generated-pdfs');
    this.ensureDirectoryExists(outputDir);

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${template.name}-${timestamp}.pdf`;
    const filePath = path.join(outputDir, filename);

    // Create buffer to capture PDF content
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Process template content and replace placeholders
    const processedContent = this.replacePlaceholders(template.originalContent, formData);
    
    // Split content into paragraphs
    const paragraphs = processedContent.split('\n').filter(p => p.trim());
    
    let currentY = doc.y;
    const lineHeight = 20;
    const pageHeight = doc.page.height - 144; // Account for margins

    for (const paragraph of paragraphs) {
      // Check if we need a new page
      if (currentY > pageHeight) {
        doc.addPage();
        currentY = 72; // Reset to top margin
      }

      // Check for image placeholders in the paragraph
      const imageMatches = paragraph.match(/\[IMAGE:([^\]]+)\]/g);
      
      if (imageMatches) {
        for (const imageMatch of imageMatches) {
          const placeholderName = imageMatch.replace(/\[IMAGE:([^\]]+)\]/, '$1');
          const imageData = formData[placeholderName];
          
          if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image')) {
            try {
              // Convert base64 to buffer
              const base64Data = imageData.split(',')[1];
              const imageBuffer = Buffer.from(base64Data, 'base64');
              
              // Add image to PDF
              doc.image(imageBuffer, doc.x, currentY, {
                width: 200,
                height: 150
              });
              currentY += 160; // Space after image
            } catch (error) {
              console.error('Error adding image to PDF:', error);
              // Add placeholder text instead
              doc.fontSize(12).text(`[Image: ${placeholderName}]`, doc.x, currentY);
              currentY += lineHeight;
            }
          } else {
            // Add placeholder text
            doc.fontSize(12).text(`[Image: ${placeholderName}]`, doc.x, currentY);
            currentY += lineHeight;
          }
        }
      } else {
        // Regular text paragraph
        const cleanText = paragraph.replace(/\[IMAGE:[^\]]+\]/g, '').trim();
        if (cleanText) {
          doc.fontSize(12).text(cleanText, doc.x, currentY, {
            width: doc.page.width - 144, // Account for margins
            align: 'left'
          });
          currentY += lineHeight * Math.ceil(cleanText.length / 80); // Rough line estimation
        }
      }
      
      currentY += 10; // Space between paragraphs
    }

    // End the document
    doc.end();

    // Wait for PDF generation to complete
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        
        // Write to file
        fs.writeFileSync(filePath, pdfBuffer);
        
        resolve({
          filePath,
          buffer: pdfBuffer
        });
      });

      doc.on('error', reject);
    });
  }

  private static replacePlaceholders(content: string, formData: Record<string, any>): string {
    let result = content;
    
    for (const [key, value] of Object.entries(formData)) {
      const placeholder = `{${key}}`;
      
      // Handle different types of placeholders
      if (key.toLowerCase().includes('logo') || key.toLowerCase().includes('image')) {
        // Replace image placeholders with special markers
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `[IMAGE:${key}]`);
      } else {
        // Replace text placeholders
        const replacement = value ? String(value) : `[${key}]`;
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
      }
    }
    
    return result;
  }

  static async deletePdf(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting PDF file:', error);
      return false;
    }
  }

  static getPdfUrl(filename: string): string {
    return `/api/pdfs/${filename}`;
  }
}