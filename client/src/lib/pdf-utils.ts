// Utility functions for PDF generation and manipulation

export interface PdfGenerationOptions {
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const defaultPdfOptions: PdfGenerationOptions = {
  format: 'A4',
  orientation: 'portrait',
  margins: {
    top: 72,    // 1 inch in points
    right: 72,
    bottom: 72,
    left: 72,
  },
};

/**
 * Validates file type for Word document upload
 */
export function validateWordDocument(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
  ];
  
  return validTypes.includes(file.type);
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates maximum file size (10MB)
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Extracts filename without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Generates a unique filename for PDF output
 */
export function generatePdfFilename(templateName: string, timestamp?: Date): string {
  const date = timestamp || new Date();
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  
  return `${templateName}-${dateString}-${timeString}.pdf`;
}

/**
 * Validates placeholder name format
 */
export function validatePlaceholderName(name: string): boolean {
  // Allow letters, numbers, underscores, and hyphens
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(name) && name.length > 0 && name.length <= 50;
}

/**
 * Formats placeholder name for display
 */
export function formatPlaceholderLabel(name: string): string {
  return name
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Determines placeholder type based on name patterns
 */
export function inferPlaceholderType(name: string): 'text' | 'number' | 'date' | 'image' {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('logo') || lowerName.includes('image') || lowerName.includes('photo')) {
    return 'image';
  }
  
  if (lowerName.includes('date') || lowerName.includes('time')) {
    return 'date';
  }
  
  if (lowerName.includes('id') || lowerName.includes('number') || 
      lowerName.includes('amount') || lowerName.includes('count') ||
      lowerName.includes('qty') || lowerName.includes('quantity')) {
    return 'number';
  }
  
  return 'text';
}

/**
 * Sanitizes form data for PDF generation
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = '';
    } else if (typeof value === 'string') {
      // Remove any potentially harmful characters
      sanitized[key] = value.replace(/[<>]/g, '');
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Converts base64 image to blob for processing
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Validates image file for placeholder replacement
 */
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Creates a preview-safe version of content
 */
export function createPreviewContent(content: string, formData: Record<string, any>): string {
  let preview = content;
  
  // Replace placeholders with form data or placeholder text
  for (const [key, value] of Object.entries(formData)) {
    const placeholder = new RegExp(`\\{${key}\\}`, 'g');
    const replacement = value ? String(value) : `[${key}]`;
    preview = preview.replace(placeholder, replacement);
  }
  
  return preview;
}
