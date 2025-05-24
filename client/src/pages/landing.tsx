import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, Zap, Shield, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PDF Wizard</h1>
          </div>
          <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Word Templates into 
            <span className="text-primary"> Dynamic PDFs</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Upload your Word documents with placeholders, fill in the data, and generate professional PDFs instantly. 
            Perfect for contracts, reports, certificates, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need for PDF generation
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make document generation simple and efficient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Easy Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Simply drag and drop your Word documents. We automatically detect placeholders and prepare your template.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle>Smart Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Intelligent placeholder detection supports text, numbers, dates, and images. Fill forms with live preview.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle>Instant Download</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate professional PDFs instantly. Download, print, or save for later use with just one click.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-violet-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-violet-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your documents and data are secure. Templates are stored safely and only accessible to you.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle>Template Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage all your templates in one place. Search, organize, and reuse templates efficiently.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>User Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Intuitive interface designed for everyone. No technical knowledge required to get started.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your Word templates into dynamic PDFs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold mb-4">Upload Template</h4>
              <p className="text-gray-600">
                Upload your Word document with placeholders like {"{"}COMPANY_NAME{"}"} or {"{"}LOGO{"}"}.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold mb-4">Fill Data</h4>
              <p className="text-gray-600">
                Fill in the detected placeholders with your actual data. See live preview as you type.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold mb-4">Generate PDF</h4>
              <p className="text-gray-600">
                Download your professionally formatted PDF with all placeholders replaced with real data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to streamline your document workflow?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have simplified their PDF generation process. Get started in minutes.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-lg px-12 py-4"
          >
            Start Creating PDFs Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">PDF Wizard</h1>
          </div>
          <p className="text-gray-400">
            Transform your documents with intelligent PDF generation
          </p>
        </div>
      </footer>
    </div>
  );
}