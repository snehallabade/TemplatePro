import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import UploadModal from "@/components/upload-modal";
import TemplateCard from "@/components/template-card";
import { Search, Plus, FileText } from "lucide-react";
import { Template } from "@shared/schema";

export default function Templates() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates', searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/templates?search=${encodeURIComponent(searchQuery)}`
        : '/api/templates';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Management</h2>
            <p className="text-gray-600 mt-1">Upload and manage Word templates with predefined placeholders</p>
          </div>
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </header>

      <div className="p-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Templates</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-32 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : templates && templates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing 1-{templates.length} of {templates.length} templates
              </p>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Templates Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                {searchQuery ? (
                  <>
                    <p className="text-gray-500 mb-4">
                      No templates found matching "{searchQuery}"
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-6">
                      You haven't uploaded any templates yet. Upload your first Word document to get started.
                    </p>
                    <Button onClick={() => setUploadModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Your First Template
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
}
