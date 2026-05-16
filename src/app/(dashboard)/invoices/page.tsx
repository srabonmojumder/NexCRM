"use client";

import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/page-header";
import { invoices } from "@/data/mock";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { InvoiceStatus } from "@/types";

const statusMeta: Record<
  InvoiceStatus,
  { label: string; variant: "success" | "info" | "warning" | "destructive" | "secondary"; icon: React.ComponentType<{ className?: string }> }
> = {
  paid: { label: "Paid", variant: "success", icon: CheckCircle2 },
  sent: { label: "Sent", variant: "info", icon: Send },
  draft: { label: "Draft", variant: "secondary", icon: FileText },
  overdue: { label: "Overdue", variant: "destructive", icon: Clock },
  cancelled: { label: "Cancelled", variant: "secondary", icon: XCircle },
};

export default function InvoicesPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = useMemo(() => {
    return invoices.filter((i) => {
      const matchesQuery =
        !query ||
        i.client.toLowerCase().includes(query.toLowerCase()) ||
        i.number.toLowerCase().includes(query.toLowerCase());
      const matchesTab = tab === "all" || i.status === tab;
      return matchesQuery && matchesTab;
    });
  }, [query, tab]);

  const totals = {
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    pending: invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0),
    draft: invoices.filter((i) => i.status === "draft").reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Issue, track and reconcile every invoice in one place."
        actions={
          <>
            <Button variant="glass" size="sm" className="hidden sm:inline-flex">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="glass" size="icon-sm" className="sm:hidden" aria-label="Export">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              Create invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Paid (MTD)", value: totals.paid, accent: "text-success" },
          { label: "Pending", value: totals.pending, accent: "text-info" },
          { label: "Drafts", value: totals.draft, accent: "text-muted-foreground" },
          { label: "Overdue", value: totals.overdue, accent: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} variant="glass" className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {s.label}
            </p>
            <p className={cn("font-display text-xl font-bold mt-1.5", s.accent)}>
              {formatCurrency(s.value)}
            </p>
          </Card>
        ))}
      </div>

      <Card variant="glass">
        <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-foreground/5">
          <Tabs value={tab} onValueChange={setTab} className="min-w-0">
            <TabsList className="overflow-x-auto scrollbar-thin max-w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="md:ml-auto md:w-72">
            <Input
              placeholder="Search invoices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => {
              const meta = statusMeta[inv.status];
              const Icon = meta.icon;
              return (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-mono font-semibold">{inv.number}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {inv.items.length} {inv.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(inv.client)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{inv.client}</p>
                        <p className="text-[11px] text-muted-foreground">{inv.clientEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={meta.variant} className="capitalize">
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(inv.issuedAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(inv.dueAt)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold tabular-nums">
                    {formatCurrency(inv.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4" />
                          Resend
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDownToLine className="h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Void invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t border-foreground/5 text-xs text-muted-foreground">
          <p>
            {filtered.length} of {invoices.length} invoices
          </p>
          <p>
            Total: <span className="font-semibold text-foreground tabular-nums">
              {formatCurrency(filtered.reduce((s, i) => s + i.amount, 0))}
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}
