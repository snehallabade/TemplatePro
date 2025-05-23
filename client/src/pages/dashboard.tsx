import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UploadModal from "@/components/upload-modal";
import { 
  Upload, 
  FileIcon, 
  BarChart3, 
  Clock, 
  FileText, 
  PlusCircle,
  Play,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { DashboardStats, Template } from "@shared/schema";

export default function Dashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  const recentTemplates = templates?.slice(0, 3) || [];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PDF Wizard Dashboard</h2>
            <p className="text-gray-600 mt-1">Your central hub for template management and PDF creation</p>
          </div>
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Templates Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.totalTemplates || 0}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Total templates available</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Link href="/templates">
                <Button variant="link" className="text-primary text-sm font-medium mt-4 p-0 h-auto">
                  Manage Templates →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Generated PDFs Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Generated PDFs</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.totalGeneratedPdfs || 0}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">PDFs generated</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <FileIcon className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <Link href="/generated-pdfs">
                <Button variant="link" className="text-primary text-sm font-medium mt-4 p-0 h-auto">
                  View Generated PDFs →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                  <p className="text-sm text-gray-900 mt-2 font-medium">
                    {stats?.totalTemplates ? "Last template uploaded" : "No activity yet"}
                  </p>
                  {statsLoading ? (
                    <Skeleton className="h-4 w-20 mt-1" />
                  ) : (
                    <p className="text-sm text-gray-500">
                      {stats?.recentActivity || "No recent activity"}
                    </p>
                  )}
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Usage Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Used Template</p>
                  {statsLoading ? (
                    <Skeleton className="h-4 w-24 mt-2" />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2 font-medium">
                      {stats?.mostUsedTemplate || "No templates used yet"}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Based on PDF generation</p>
                </div>
                <div className="bg-violet-50 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between p-4 h-auto bg-primary/5 hover:bg-primary/10 border-primary/20"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary p-2 rounded-lg">
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Upload Templates</p>
                      <p className="text-sm text-gray-600">Add new Word document templates</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>

                <Link href="/templates">
                  <Button
                    variant="outline"
                    className="w-full justify-between p-4 h-auto bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-600 p-2 rounded-lg">
                        <PlusCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Generate PDF</p>
                        <p className="text-sm text-gray-600">Create PDF from existing template</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </Link>

                <Link href="/user-guide">
                  <Button
                    variant="outline"
                    className="w-full justify-between p-4 h-auto bg-amber-50 hover:bg-amber-100 border-amber-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-amber-600 p-2 rounded-lg">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">View Tutorial</p>
                        <p className="text-sm text-gray-600">Learn how to use PDF Wizard</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Templates Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Templates</h3>
                <Link href="/templates">
                  <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto">
                    View All →
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {templatesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  ))
                ) : recentTemplates.length > 0 ? (
                  recentTemplates.map((template) => (
                    <div key={template.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-600">
                          {template.placeholders.length} placeholders | {template.sections} section{template.sections !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Link href={`/generator/${template.id}`}>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No templates uploaded yet</p>
                    <Button onClick={() => setUploadModalOpen(true)} size="sm">
                      Upload your first template
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
}
