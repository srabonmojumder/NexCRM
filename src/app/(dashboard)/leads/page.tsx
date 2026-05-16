"use client";

import { motion } from "framer-motion";
import {
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/page-header";
import { leads } from "@/data/mock";
import { cn, formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils";
import type { LeadStatus } from "@/types";

const statusVariant: Record<LeadStatus, "success" | "info" | "warning" | "destructive"> = {
  qualified: "success",
  contacted: "info",
  new: "warning",
  lost: "destructive",
};

export default function LeadsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchesQuery =
        !query ||
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.company.toLowerCase().includes(query.toLowerCase()) ||
        l.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || l.status === status;
      const matchesSource = source === "all" || l.source === source;
      return matchesQuery && matchesStatus && matchesSource;
    });
  }, [query, status, source]);

  const totalValue = filtered.reduce((sum, l) => sum + l.value, 0);
  const allSelected = selected.size > 0 && selected.size === filtered.length;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(filtered.map((l) => l.id)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Discover, qualify and convert your incoming opportunities."
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
              New lead
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total leads", value: leads.length, accent: "text-foreground" },
          {
            label: "Qualified",
            value: leads.filter((l) => l.status === "qualified").length,
            accent: "text-success",
          },
          {
            label: "Pipeline value",
            value: formatCurrency(totalValue),
            accent: "text-primary",
          },
          {
            label: "Avg. deal size",
            value: formatCurrency(Math.round(totalValue / Math.max(filtered.length, 1))),
            accent: "text-info",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card variant="glass" className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {s.label}
              </p>
              <p className={cn("font-display text-xl font-bold mt-1.5", s.accent)}>
                {s.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card variant="glass">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-foreground/5">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Search by name, company or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="flex-1 min-w-[120px] sm:flex-none sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="flex-1 min-w-[120px] sm:flex-none sm:w-[140px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="ads">Ads</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="glass" size="icon" aria-label="More filters">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow key={lead.id} data-state={selected.has(lead.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(lead.id)}
                      onCheckedChange={() => toggle(lead.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[11px]">
                          {getInitials(lead.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {lead.company}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[lead.status]} className="capitalize">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3" />
                      <span className="capitalize">{lead.source}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold tabular-nums">
                    {formatCurrency(lead.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={lead.ownerAvatar} alt={lead.owner} />
                        <AvatarFallback className="text-[9px]">
                          {getInitials(lead.owner)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{lead.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatRelativeTime(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="More actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4" />
                          Send email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4" />
                          Log call
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit lead</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t border-foreground/5 text-xs text-muted-foreground">
            <p>
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
              <span className="font-semibold text-foreground">{leads.length}</span> leads
            </p>
            <div className="flex items-center gap-2">
              <Button variant="glass" size="sm" disabled>
                Previous
              </Button>
              <Button variant="glass" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
