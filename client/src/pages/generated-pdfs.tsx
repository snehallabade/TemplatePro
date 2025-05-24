import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Save, Trash2, FileIcon } from "lucide-react";
import { GeneratedPdf } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GeneratedPdfs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pdfs, isLoading } = useQuery<GeneratedPdf[]>({
    queryKey: ['/api/generated-pdfs'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/generated-pdfs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/generated-pdfs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "PDF deleted",
        description: "The generated PDF has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete PDF",
        variant: "destructive",
      });
    },
  });

  const handleDownload = (pdf: GeneratedPdf) => {
    if (pdf.pdfUrl) {
      const filename = pdf.pdfUrl.split('/').pop();
      const downloadUrl = `/api/pdfs/${filename}/download`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${pdf.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${pdf.name}...`,
      });
    } else {
      toast({
        title: "Download failed",
        description: "PDF file not available",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (pdf: GeneratedPdf) => {
    if (pdf.pdfUrl) {
      const filename = pdf.pdfUrl.split('/').pop();
      const previewUrl = `/api/pdfs/${filename}`;
      
      // Open PDF in new tab for preview
      window.open(previewUrl, '_blank');
      
      toast({
        title: "Opening preview",
        description: `Opening preview for ${pdf.name}...`,
      });
    } else {
      toast({
        title: "Preview failed",
        description: "PDF file not available",
        variant: "destructive",
      });
    }
  };

  const handleSave = (pdf: GeneratedPdf) => {
    toast({
      title: "Save options",
      description: "PDF save options would be shown here.",
    });
    // In a real implementation, this would show save options
  };

  const handleDelete = (pdf: GeneratedPdf) => {
    if (confirm(`Are you sure you want to delete "${pdf.name}"?`)) {
      deleteMutation.mutate(pdf.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generated PDFs</h2>
            <p className="text-gray-600 mt-1">View and manage your previously generated PDF documents</p>
          </div>
        </div>
      </header>

      <div className="p-8">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pdfs && pdfs.length > 0 ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated PDFs</CardTitle>
                <p className="text-sm text-gray-600">Manage your previously generated PDFs</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {pdfs.map((pdf) => (
                    <div key={pdf.id} className="border-b border-gray-100 last:border-b-0 p-6">
                      <div className="flex items-center space-x-4">
                        {/* PDF Preview Thumbnail */}
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 w-16 h-16 flex items-center justify-center">
                          <FileIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{pdf.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              PDF
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Created {formatDate(pdf.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Template ID: {pdf.templateId}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(pdf)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(pdf)}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(pdf)}
                            className="text-xs"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pdf)}
                            disabled={deleteMutation.isPending}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Generated PDFs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6">
                  You haven't generated any PDFs yet. Start by selecting a template and filling out the form.
                </p>
                <Button 
                  onClick={() => window.location.href = '/templates'}
                >
                  Browse Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
