"use client";

import {
  Bell,
  Building2,
  CreditCard,
  Globe,
  Key,
  Mail,
  Palette,
  Plug,
  Save,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "api", label: "API", icon: Key },
];

const integrations = [
  { name: "Slack", desc: "Send notifications to Slack channels", connected: true },
  { name: "Gmail", desc: "Sync emails and contacts", connected: true },
  { name: "Stripe", desc: "Payments & invoicing", connected: true },
  { name: "HubSpot", desc: "Two-way contact sync", connected: false },
  { name: "Salesforce", desc: "Migrate or mirror your CRM", connected: false },
  { name: "Zapier", desc: "Connect 5,000+ apps", connected: true },
];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState("profile");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, organization, billing and integrations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="lg:sticky lg:top-24 self-start">
          <Card variant="glass" className="p-2">
            <ul className="space-y-0.5">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setActive(t.id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </aside>

        <div className="space-y-4">
          {active === "profile" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>How your account appears across NexCRM.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-white/10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{getInitials(user?.name ?? "")}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Button variant="glass" size="sm">
                      Upload new photo
                    </Button>
                    <p className="text-[11px] text-muted-foreground">
                      PNG or JPG, max 2MB
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user?.role} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} icon={<Mail className="h-4 w-4" />} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1 (555) 000-0000" icon={<Smartphone className="h-4 w-4" />} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="gradient">
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "organization" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Workspace settings for {user?.organization}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company name</Label>
                    <Input defaultValue={user?.organization} icon={<Building2 className="h-4 w-4" />} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input defaultValue="https://nexcrm.io" icon={<Globe className="h-4 w-4" />} />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">US Dollar (USD)</SelectItem>
                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                        <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                        <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="ny">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">America / New York</SelectItem>
                        <SelectItem value="la">America / Los Angeles</SelectItem>
                        <SelectItem value="ldn">Europe / London</SelectItem>
                        <SelectItem value="ber">Europe / Berlin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="gradient">
                  <Save className="h-4 w-4" />
                  Save organization
                </Button>
              </CardContent>
            </Card>
          )}

          {active === "appearance" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the way NexCRM looks for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "dark", label: "Dark", preview: "bg-gradient-to-br from-slate-900 to-slate-800" },
                      { id: "light", label: "Light", preview: "bg-gradient-to-br from-white to-slate-100" },
                      { id: "auto", label: "System", preview: "bg-gradient-to-br from-slate-900 via-slate-500 to-white" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        className="rounded-xl border border-white/10 p-3 hover:border-primary/40 transition-colors text-left"
                      >
                        <div className={cn("h-20 w-full rounded-lg mb-2", t.preview)} />
                        <p className="text-sm font-medium">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <SettingRow
                  label="Compact density"
                  description="Tighter padding and smaller font sizes."
                />
                <SettingRow
                  label="Reduce motion"
                  description="Minimise animations across the app."
                />
                <SettingRow
                  label="High contrast"
                  description="Boost color contrast for readability."
                />
              </CardContent>
            </Card>
          )}

          {active === "notifications" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Pick what you want to hear about and where.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <SettingRow
                  label="Deal won or lost"
                  description="Realtime alerts for closed-won and closed-lost deals."
                  defaultChecked
                />
                <SettingRow
                  label="New lead assigned"
                  description="When a lead is routed or assigned to you."
                  defaultChecked
                />
                <SettingRow
                  label="Mentions in comments"
                  description="When a teammate @mentions you anywhere."
                  defaultChecked
                />
                <SettingRow
                  label="Daily digest"
                  description="A summary of yesterday's activity, weekday mornings."
                />
                <SettingRow
                  label="Weekly performance"
                  description="Pipeline & revenue snapshot every Monday."
                  defaultChecked
                />
                <SettingRow
                  label="Product updates"
                  description="New features, releases & changelog."
                />
              </CardContent>
            </Card>
          )}

          {active === "billing" && (
            <div className="space-y-4">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Plan</CardTitle>
                  <CardDescription>You&apos;re currently on the Enterprise plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-center justify-between">
                    <div>
                      <Badge variant="default">Enterprise</Badge>
                      <p className="font-display text-2xl font-bold mt-2">$2,400 / mo</p>
                      <p className="text-xs text-muted-foreground mt-1">Annual billing · Renews Jan 1, 2027</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="glass">Manage</Button>
                      <Button variant="gradient">Upgrade</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Payment method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-white/10 p-4 flex items-center gap-4">
                    <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-xs text-white">
                      VISA
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Visa ending in 4242</p>
                      <p className="text-[11px] text-muted-foreground">Expires 04/29</p>
                    </div>
                    <Button variant="glass" size="sm">Update</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {active === "security" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your account safe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <SettingRow
                  label="Two-factor authentication"
                  description="Use an authenticator app for an extra layer of security."
                  defaultChecked
                />
                <SettingRow
                  label="Single sign-on (SSO)"
                  description="SAML / OIDC SSO for your organization."
                  defaultChecked
                />
                <SettingRow
                  label="Session timeout"
                  description="Automatically sign out after 8 hours of inactivity."
                />
                <Separator className="my-3" />
                <Button variant="outline" size="sm">
                  View login history
                </Button>
              </CardContent>
            </Card>
          )}

          {active === "integrations" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect NexCRM with the tools you already use.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrations.map((int) => (
                    <div
                      key={int.name}
                      className="rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center font-bold text-sm text-white">
                        {int.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{int.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{int.desc}</p>
                      </div>
                      <Button
                        variant={int.connected ? "outline" : "gradient"}
                        size="sm"
                      >
                        {int.connected ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {active === "api" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>API keys</CardTitle>
                <CardDescription>Programmatically access your NexCRM data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Production key</p>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <code className="block rounded-lg bg-black/40 px-3 py-2 text-xs font-mono text-muted-foreground">
                    nx_live_••••••••••••••••••••••••••••u92r
                  </code>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="glass" size="sm">Copy</Button>
                    <Button variant="glass" size="sm">Reveal</Button>
                    <Button variant="ghost" size="sm" className="text-destructive ml-auto">
                      Revoke
                    </Button>
                  </div>
                </div>
                <Button variant="gradient">
                  <Key className="h-4 w-4" />
                  Generate new key
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
