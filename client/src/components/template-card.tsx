import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { Template } from "@shared/schema";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TemplateCardProps {
  template: Template;
}

const colors = [
  "bg-primary-100",
  "bg-emerald-100", 
  "bg-violet-100",
  "bg-amber-100",
  "bg-blue-100",
  "bg-pink-100"
];

export default function TemplateCard({ template }: TemplateCardProps) {
  const colorClass = colors[template.id % colors.length];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await apiRequest('DELETE', `/api/templates/${templateId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Template deleted",
        description: "Template has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      deleteMutation.mutate(template.id);
    }
  };

  return (
    <Card className="template-card overflow-hidden">
      <CardContent className="p-4">
        {/* Template preview thumbnail */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="bg-gray-200 h-2 rounded w-3/4"></div>
            <div className="bg-gray-200 h-2 rounded w-1/2"></div>
            <div className="bg-gray-200 h-2 rounded w-2/3"></div>
            <div className="space-y-1 mt-3">
              <div className={`${colorClass} h-1 rounded w-full`}></div>
              <div className={`${colorClass} h-1 rounded w-4/5`}></div>
              <div className={`${colorClass} h-1 rounded w-3/5`}></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-600">{template.filename}</p>
          </div>
          
          <div className="text-sm text-gray-600">
            <span>{template.placeholders.length} placeholders</span> | 
            <span className="ml-1">{template.sections} section{template.sections !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/generator/${template.id}`} className="flex-1">
              <Button 
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-0"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </Link>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
