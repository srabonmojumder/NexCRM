import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Settings,
  Sparkles,
  Trello,
  Users,
  UserSquare2,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  shortcut?: string;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, shortcut: "D" },
      { href: "/analytics", label: "Analytics", icon: BarChart3, shortcut: "A" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/leads", label: "Leads", icon: Sparkles, badge: "8" },
      { href: "/clients", label: "Clients", icon: UserSquare2 },
      { href: "/pipeline", label: "Pipeline", icon: Trello },
      { href: "/invoices", label: "Invoices", icon: FileText, badge: "3" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/calendar", label: "Calendar", icon: Calendar },
      { href: "/messages", label: "Messages", icon: MessageSquare, badge: "3" },
      { href: "/team", label: "Team", icon: Users },
      { href: "/activity", label: "Activity", icon: Activity },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];
