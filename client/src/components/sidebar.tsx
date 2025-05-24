import { Link, useLocation } from "wouter";
import { FileText, Home, FileIcon, HelpCircle, FileOutput, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Generated PDFs", href: "/generated-pdfs", icon: FileIcon },
  { name: "User Guide", href: "/user-guide", icon: HelpCircle },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  // Demo user for testing
  const user = {
    id: 'demo-user',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    profileImageUrl: null
  };

  const handleLogout = () => {
    // For demo mode, just reload the page
    window.location.reload();
  };

  return (
    <aside className="w-72 sidebar-gradient text-white flex-shrink-0">
      <div className="p-6">
        {/* Logo Section */}
        <Link href="/">
          <div className="flex items-center space-x-3 mb-8 cursor-pointer hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FileOutput className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">PDF Wizard</h1>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors cursor-pointer",
                    isActive
                      ? "nav-active"
                      : "nav-inactive hover:bg-white hover:bg-opacity-10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="mt-auto pt-6 border-t border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName || user.lastName 
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : user.email || 'User'
                  }
                </p>
                {user.email && (
                  <p className="text-xs text-white/70 truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
