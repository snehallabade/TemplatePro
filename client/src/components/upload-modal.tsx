import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, CloudUpload, X, Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface UploadResponse {
  template: any;
  placeholdersDetected: number;
}

export default function UploadModal({ open, onOpenChange, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await apiRequest('POST', '/api/templates/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setUploadResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Template uploaded successfully!",
        description: `Detected ${data.placeholdersDetected} placeholders`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload template",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    uploadMutation.mutate(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadResult(null);
    onOpenChange(false);
    if (onSuccess && uploadResult) {
      onSuccess();
    }
  };

  const progress = uploadMutation.isPending ? 50 : uploadResult ? 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby="upload-description">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Upload New Template
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Zone */}
          {!uploadResult && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center upload-zone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Drop your Word document here
              </h4>
              <p className="text-gray-600 mb-4">or click to browse files</p>
              <input
                type="file"
                accept=".docx,.doc"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                disabled={uploadMutation.isPending}
              />
              <label htmlFor="file-upload">
                <Button 
                  asChild 
                  disabled={uploadMutation.isPending}
                  className="cursor-pointer"
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </span>
                </Button>
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: .docx, .doc (Max 10MB)
              </p>
            </div>
          )}

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="space-y-3">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Uploading template and detecting placeholders...
              </p>
            </div>
          )}

          {/* Upload Success */}
          {uploadResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                <div>
                  <p className="text-emerald-800 font-medium">
                    Template uploaded successfully!
                  </p>
                  <p className="text-emerald-600 text-sm">
                    Found {uploadResult.placeholdersDetected} placeholders in document
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            {uploadResult ? "Close" : "Cancel"}
          </Button>
          {uploadResult && (
            <Button onClick={handleClose}>
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
