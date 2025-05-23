import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Edit, FileIcon, AlertCircle, CheckCircle } from "lucide-react";

export default function UserGuide() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Help and Guide</h2>
            <p className="text-gray-600 mt-1">Learn how to use the PDF Generator system</p>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Design Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Template Design</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create professional Word templates (.docx) with predefined placeholders for dynamic content
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Placeholder Syntax</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use curly braces to create placeholders in your template
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <code className="text-sm font-mono text-gray-800">
                    {`{PLACEHOLDER_NAME}`}
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Supported Sections</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>LOGO</strong> - Placeholder for company logo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Submission Summary</strong> - Includes details like Insured FEIN, Account Name etc.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Broker Information</strong> - Producer and broker info</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Underwriting Guidance</strong> - Flags and catastrophic risk indicators</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Prior Quarter Info</strong> - Comparative account metrics</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Critical Data Summary</strong> - SIC/NAICS codes and policy details</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Loss Information</strong> - Details and flags about losses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Third Party Data</strong> - External indices and data</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Using the Application */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5 text-emerald-600" />
                <span>Using the Application</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">Step 1</Badge>
                  <span className="font-medium text-gray-900">Upload Templates</span>
                </div>
                <p className="text-sm text-gray-600">
                  Navigate to the Templates page and upload your Word documents. The system will automatically detect placeholders.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">Step 2</Badge>
                  <span className="font-medium text-gray-900">Generate PDF</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Go to generate PDF page and follow these steps:
                </p>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1 ml-4">
                  <li>Select your template from the dropdown</li>
                  <li>Fill in the form with data for each section</li>
                  <li>Toggle sections on/off as needed</li>
                  <li>Preview the generated PDF</li>
                  <li>Download the final document</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span>Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Template Design</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use consistent formatting in your Word document</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Keep placeholder names descriptive but concise</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Test your template with sample data before using in production</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use standard fonts that are widely available</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Avoid complex formatting like text boxes or floating elements</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileIcon className="h-5 w-5 text-blue-600" />
                <span>Data Entry</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Prepare your data before starting the PDF generation process</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use appropriate format for dates (MM/DD/YYYY)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Keep text entries concise to avoid overflow issues</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>For repeated data consider creating multiple templates</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Save your form data for future use</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Additional Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <span>File Upload</span>
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Maximum file size: 10MB</li>
                  <li>• Supported formats: .docx, .doc</li>
                  <li>• Use drag-and-drop for faster uploads</li>
                  <li>• Ensure proper file permissions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FileIcon className="h-4 w-4 text-emerald-600" />
                  <span>PDF Management</span>
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Generated PDFs are automatically saved</li>
                  <li>• Use descriptive names for easy identification</li>
                  <li>• Regular cleanup of old PDFs recommended</li>
                  <li>• Preview before final download</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
