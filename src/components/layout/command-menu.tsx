"use client";

import {
  Activity,
  BarChart3,
  Calendar,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Trello,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useUIStore } from "@/store/ui-store";

export function CommandMenu() {
  const { commandOpen, setCommandOpen } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  const go = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search anything — leads, clients, deals, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/leads")}>
            <UserPlus />
            Create new lead
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/pipeline")}>
            <Sparkles />
            Add deal to pipeline
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/calendar")}>
            <Calendar />
            Schedule a meeting
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/invoices")}>
            <FileText />
            New invoice
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}>
            <LayoutDashboard />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/analytics")}>
            <BarChart3 />
            Analytics
          </CommandItem>
          <CommandItem onSelect={() => go("/leads")}>
            <Sparkles />
            Leads
          </CommandItem>
          <CommandItem onSelect={() => go("/clients")}>
            <Users />
            Clients
          </CommandItem>
          <CommandItem onSelect={() => go("/pipeline")}>
            <Trello />
            Sales Pipeline
          </CommandItem>
          <CommandItem onSelect={() => go("/messages")}>
            <MessageSquare />
            Messages
          </CommandItem>
          <CommandItem onSelect={() => go("/team")}>
            <Users />
            Team
          </CommandItem>
          <CommandItem onSelect={() => go("/activity")}>
            <Activity />
            Activity
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => go("/settings")}>
            <Settings />
            Workspace settings
          </CommandItem>
          <CommandItem onSelect={() => go("/notifications")}>
            <Search />
            Notification preferences
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
