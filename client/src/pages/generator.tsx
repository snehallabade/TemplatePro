import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PdfPreview from "@/components/pdf-preview";
import { ChevronLeft, Download, PrinterCheck, Save, FileText } from "lucide-react";
import { Template, Placeholder } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Generator() {
  const params = useParams();
  const templateId = params.templateId ? parseInt(params.templateId) : null;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewContent, setPreviewContent] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: template, isLoading: templateLoading } = useQuery<Template>({
    queryKey: [`/api/templates/${templateId}`],
    enabled: !!templateId,
  });

  const previewMutation = useMutation({
    mutationFn: async ({ templateId, formData }: { templateId: number; formData: Record<string, any> }) => {
      const response = await apiRequest('POST', '/api/preview', { templateId, formData });
      return response.json();
    },
    onSuccess: (data) => {
      setPreviewContent(data.content);
    },
    onError: (error: any) => {
      toast({
        title: "Preview failed",
        description: error.message || "Failed to generate preview",
        variant: "destructive",
      });
    },
  });

  const generatePdfMutation = useMutation({
    mutationFn: async ({ templateId, formData, name }: { templateId: number; formData: Record<string, any>; name: string }) => {
      const response = await apiRequest('POST', '/api/generate-pdf', { templateId, formData, name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/generated-pdfs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "PDF generated successfully!",
        description: "Your PDF has been saved to Generated PDFs.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "PDF generation failed",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneratePreview = () => {
    if (templateId) {
      previewMutation.mutate({ templateId, formData });
    }
  };

  const handleSavePdf = () => {
    if (templateId && template) {
      const name = `${template.name} - ${new Date().toLocaleDateString()}`;
      generatePdfMutation.mutate({ templateId, formData, name });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "PDF download will begin shortly.",
    });
    // In a real implementation, this would trigger actual PDF download
  };

  const handlePrint = () => {
    window.print();
  };

  // Auto-generate preview when form data changes
  useEffect(() => {
    if (templateId && Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        handleGeneratePreview();
      }, 1000); // Debounce by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [formData, templateId]);

  const renderFormField = (placeholder: Placeholder) => {
    const value = formData[placeholder.name] || "";

    return (
      <div key={placeholder.name} className="space-y-2">
        <div className="flex items-center space-x-4">
          <Label className="w-32 text-sm font-medium text-gray-700 flex-shrink-0">
            {placeholder.label}
          </Label>
          
          <Select value={placeholder.type} disabled>
            <SelectTrigger className="w-24 bg-gray-800 text-white text-xs border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>

          {placeholder.type === "image" ? (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    handleInputChange(placeholder.name, e.target?.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="flex-1"
            />
          ) : placeholder.type === "date" ? (
            <Input
              type="date"
              value={value}
              onChange={(e) => handleInputChange(placeholder.name, e.target.value)}
              className="flex-1"
            />
          ) : placeholder.type === "number" ? (
            <Input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(placeholder.name, e.target.value)}
              placeholder={placeholder.label}
              className="flex-1"
            />
          ) : (
            <Input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(placeholder.name, e.target.value)}
              placeholder={placeholder.label}
              className="flex-1"
            />
          )}
        </div>
      </div>
    );
  };

  if (!templateId) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Template Selected</h3>
            <p className="text-gray-600 mb-4">Please select a template to start generating PDFs.</p>
            <Link href="/templates">
              <Button>Browse Templates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/templates">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              {templateLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <span className="font-medium text-gray-900">{template?.filename}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrint}
            >
              <PrinterCheck className="h-4 w-4 mr-2" />
              PrinterCheck
            </Button>
            <Button 
              size="sm"
              onClick={handleSavePdf}
              disabled={generatePdfMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {generatePdfMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        {/* Form Panel */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Enter Document Data</h3>
            <p className="text-gray-600 mb-8">Fill in the information for your PDF document</p>

            {templateLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : template ? (
              <div className="space-y-6">
                {template.placeholders.map(renderFormField)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Template not found</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2">
          <PdfPreview
            template={template || null}
            formData={formData}
            onGeneratePreview={handleGeneratePreview}
            isLoading={previewMutation.isPending}
            previewContent={previewContent}
          />
        </div>
      </div>
    </div>
  );
}
