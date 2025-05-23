import { Link, useLocation } from "wouter";
import { FileText, Home, FileIcon, HelpCircle, FileOutput } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Generated PDFs", href: "/generated-pdfs", icon: FileIcon },
  { name: "User Guide", href: "/user-guide", icon: HelpCircle },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-72 sidebar-gradient text-white flex-shrink-0">
      <div className="p-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <FileOutput className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">PDF Wizard</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors",
                    isActive
                      ? "nav-active"
                      : "nav-inactive hover:bg-white hover:bg-opacity-10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
