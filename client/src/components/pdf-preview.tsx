import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Template } from "@shared/schema";

interface PdfPreviewProps {
  template: Template | null;
  formData: Record<string, any>;
  onGeneratePreview: () => void;
  isLoading: boolean;
  previewContent?: string;
}

export default function PdfPreview({ 
  template, 
  formData, 
  onGeneratePreview, 
  isLoading, 
  previewContent 
}: PdfPreviewProps) {
  const [displayContent, setDisplayContent] = useState<string>("");

  useEffect(() => {
    if (previewContent) {
      setDisplayContent(previewContent);
    } else if (template) {
      // Show template with placeholders
      setDisplayContent(template.originalContent);
    }
  }, [previewContent, template]);

  // Helper function to format content for display
  const formatContentForDisplay = (content: string) => {
    if (!content) return "";
    
    // Split content into paragraphs and format for display
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Highlight unfilled placeholders
      const highlightedParagraph = paragraph.replace(
        /\{([^}]+)\}/g, 
        '<span class="bg-yellow-200 px-1 rounded text-xs font-mono border">[$1]</span>'
      );
      
      return `<p key="${index}" class="mb-4 leading-relaxed">${highlightedParagraph}</p>`;
    }).join('');
  };

  if (!template) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Select a template to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto preview-scroll">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
          <Button 
            onClick={onGeneratePreview}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Preview
              </>
            )}
          </Button>
        </div>

        {/* PDF Preview */}
        <Card className="pdf-preview bg-white overflow-hidden">
          <CardHeader className="bg-gray-100 py-2 px-4 border-b">
            <CardTitle className="text-sm text-gray-600">PDF Preview</CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 min-h-[600px] bg-white">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <div className="space-y-2 mt-8">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div 
                  className="space-y-4"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContentForDisplay(displayContent) 
                  }}
                />
                
                {!previewContent && (
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Fill in the form fields and click "Generate Preview" 
                      to see how your placeholders will be replaced in the final PDF.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder Legend */}
        {template.placeholders.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Detected Placeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {template.placeholders.map((placeholder, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {`{${placeholder.name}}`}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                      {placeholder.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
