import { Link, useLocation } from "wouter";
import { 
  Home, 
  Sprout, 
  Stethoscope, 
  LineChart, 
  FileText,
  Menu,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHealthCheck } from "@workspace/api-client-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Crop Predict", href: "/predict", icon: Sprout },
    { name: "Disease Detect", href: "/disease", icon: Stethoscope },
    { name: "Financials", href: "/finance", icon: LineChart },
    { name: "Subsidies", href: "/subsidies", icon: FileText },
  ];

  const NavLinks = () => (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.name} href={item.href}>
            <span
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/">
            <span className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground cursor-pointer tracking-tight">
              <Sprout className="h-6 w-6 text-primary" />
              AgriGuard AI
            </span>
          </Link>
        </div>
        <div className="flex-1 p-4">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60 bg-sidebar-accent/50 p-3 rounded-md">
            <Activity className={`h-4 w-4 ${health ? 'text-primary' : 'text-muted-foreground'}`} />
            <span>System Status: {health ? 'Online' : 'Checking...'}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Nav & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link href="/">
            <span className="flex items-center gap-2 font-bold text-lg text-foreground cursor-pointer">
              <Sprout className="h-5 w-5 text-primary" />
              AgriGuard
            </span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar border-r-0">
              <div className="py-6">
                <span className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground mb-6 px-3">
                  <Sprout className="h-6 w-6 text-primary" />
                  AgriGuard AI
                </span>
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
