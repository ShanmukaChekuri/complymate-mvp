"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store";

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  action: () => void;
  keywords?: string[];
  category: "navigation" | "actions" | "search" | "settings";
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { toggleSidebar } = useAppState();

  // Define available commands
  const commands: CommandAction[] = [
    // Navigation
    {
      id: "dashboard",
      title: "Go to Dashboard",
      description: "Navigate to the main dashboard",
      icon: "LayoutDashboard",
      category: "navigation",
      action: () => router.push("/dashboard"),
      keywords: ["home", "main", "overview"],
    },
    {
      id: "compliance",
      title: "Compliance Management",
      description: "View and manage compliance records",
      icon: "Shield",
      category: "navigation",
      action: () => router.push("/compliance"),
      keywords: ["safety", "regulations", "standards"],
    },
    {
      id: "incidents",
      title: "Incident Reports",
      description: "View and manage safety incidents",
      icon: "AlertTriangle",
      category: "navigation",
      action: () => router.push("/incidents"),
      keywords: ["accidents", "reports", "safety"],
    },
    {
      id: "training",
      title: "Training Management",
      description: "Manage employee training records",
      icon: "BookOpen",
      category: "navigation",
      action: () => router.push("/training"),
      keywords: ["courses", "certifications", "learning"],
    },
    {
      id: "team",
      title: "Team Management",
      description: "Manage team members and roles",
      icon: "Users",
      category: "navigation",
      action: () => router.push("/team"),
      keywords: ["employees", "staff", "people"],
    },
    {
      id: "reports",
      title: "Reports & Analytics",
      description: "View safety reports and analytics",
      icon: "BarChart3",
      category: "navigation",
      action: () => router.push("/reports"),
      keywords: ["analytics", "data", "insights"],
    },
    {
      id: "documents",
      title: "Document Management",
      description: "Manage safety documents and files",
      icon: "FileText",
      category: "navigation",
      action: () => router.push("/documents"),
      keywords: ["files", "papers", "records"],
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure application settings",
      icon: "Settings",
      category: "navigation",
      action: () => router.push("/settings"),
      keywords: ["config", "preferences", "options"],
    },

    // Actions
    {
      id: "report-incident",
      title: "Report Incident",
      description: "Create a new incident report",
      icon: "Plus",
      category: "actions",
      action: () => router.push("/incidents/new"),
      keywords: ["create", "new", "report", "accident"],
    },
    {
      id: "schedule-inspection",
      title: "Schedule Inspection",
      description: "Schedule a new safety inspection",
      icon: "Calendar",
      category: "actions",
      action: () => router.push("/compliance/inspections/new"),
      keywords: ["inspection", "audit", "check"],
    },
    {
      id: "assign-training",
      title: "Assign Training",
      description: "Assign training to team members",
      icon: "UserPlus",
      category: "actions",
      action: () => router.push("/training/assign"),
      keywords: ["assign", "course", "employee"],
    },
    {
      id: "generate-report",
      title: "Generate Report",
      description: "Create a new safety report",
      icon: "FileDown",
      category: "actions",
      action: () => router.push("/reports/generate"),
      keywords: ["export", "download", "create"],
    },

    // Settings
    {
      id: "toggle-sidebar",
      title: "Toggle Sidebar",
      description: "Show or hide the navigation sidebar",
      icon: "PanelLeft",
      category: "settings",
      action: () => toggleSidebar(),
      keywords: ["sidebar", "nav", "menu"],
    },
    {
      id: "theme-toggle",
      title: "Toggle Theme",
      description: "Switch between light and dark themes",
      icon: "Moon",
      category: "settings",
      action: () => {
        // This would be implemented with theme context
        console.log("Toggle theme");
      },
      keywords: ["dark", "light", "mode", "theme"],
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((command) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const matchesTitle = command.title.toLowerCase().includes(searchLower);
    const matchesDescription = command.description?.toLowerCase().includes(searchLower);
    const matchesKeywords = command.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchLower)
    );
    
    return matchesTitle || matchesDescription || matchesKeywords;
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category]!.push(command);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Execute command
  const executeCommand = useCallback((commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (command) {
      command.action();
      setOpen(false);
      setSearch("");
    }
  }, [commands]);

  return {
    open,
    setOpen,
    search,
    setSearch,
    commands: filteredCommands,
    groupedCommands,
    executeCommand,
  };
} 