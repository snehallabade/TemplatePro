import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Template } from "@shared/schema";
import { Link } from "wouter";

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
          
          <Link href={`/generator/${template.id}`}>
            <Button 
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-0"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
