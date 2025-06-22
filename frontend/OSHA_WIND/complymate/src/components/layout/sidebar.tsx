"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  Menu,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Compliance",
    href: "/compliance",
    icon: Shield,
    badge: "3",
  },
  {
    name: "Incidents",
    href: "/incidents",
    icon: AlertTriangle,
    badge: "2",
  },
  {
    name: "Training",
    href: "/training",
    icon: BookOpen,
    badge: "5",
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
    badge: null,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    badge: null,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">ComplyMate</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">ComplyMate v1.0</div>
            <div>Enterprise Safety Platform</div>
          </div>
        </div>
      )}
    </div>
  );
} 