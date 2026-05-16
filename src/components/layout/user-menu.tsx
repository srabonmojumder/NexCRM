"use client";

import {
  Building2,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function UserMenu() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition-colors hover:bg-foreground/5">
          <Avatar className="h-8 w-8 ring-2 ring-foreground/10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
              {user.role}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="px-2 py-2.5 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Badge variant="default" className="shrink-0">
            {user.plan}
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Building2 className="h-4 w-4" />
            Organization
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/invoices">
            <CreditCard className="h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="h-4 w-4" />
          Help & support
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/login" className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 !text-destructive" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
