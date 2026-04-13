import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Sprout,
  Stethoscope,
  LineChart,
  FileText,
  Menu,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHealthCheck } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Crop Prediction", href: "/predict", icon: Sprout },
  { name: "Disease Detection", href: "/disease", icon: Stethoscope },
  { name: "Financial Analysis", href: "/finance", icon: LineChart },
  { name: "Subsidies", href: "/subsidies", icon: FileText },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();

  return (
    <nav className="space-y-0.5">
      {navigation.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.name} href={item.href} onClick={onNavigate}>
            <span
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer group",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground")} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: health } = useHealthCheck();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-sidebar-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <Link href="/">
            <span className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Sprout className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-base text-sidebar-foreground leading-tight">AgriGuard AI</p>
                <p className="text-[10px] text-sidebar-foreground/50 leading-tight">Precision Agriculture</p>
              </div>
            </span>
          </Link>
        </div>

        <div className="flex-1 p-3 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-2 text-xs p-2.5 rounded-lg",
            health ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"
          )}>
            <div className={cn("w-2 h-2 rounded-full", health ? "bg-green-500 animate-pulse" : "bg-muted-foreground")} />
            <Activity className="h-3 w-3" />
            <span>System: {health ? "Online" : "Connecting..."}</span>
          </div>
        </div>
      </aside>

      {/* Mobile + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <Sprout className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-base">AgriGuard AI</span>
            </span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-sidebar p-0">
              <div className="p-5 border-b border-sidebar-border">
                <span className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Sprout className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-sidebar-foreground">AgriGuard AI</p>
                    <p className="text-[10px] text-sidebar-foreground/50">Precision Agriculture</p>
                  </div>
                </span>
              </div>
              <div className="p-3">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
