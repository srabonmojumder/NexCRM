export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type LeadSource = "website" | "referral" | "social" | "ads" | "event" | "outbound";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  owner: string;
  ownerAvatar: string;
  createdAt: string;
  tags?: string[];
  location?: { lat: number; lng: number; city: string };
}

export type ClientTier = "starter" | "growth" | "enterprise";
export type ClientStatus = "active" | "churned" | "trial" | "paused";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  tier: ClientTier;
  status: ClientStatus;
  mrr: number;
  ltv: number;
  joinedAt: string;
  lastActivity: string;
  industry: string;
  location: { lat: number; lng: number; city: string; country: string };
}

export type DealStage = "prospecting" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Deal {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  stage: DealStage;
  value: number;
  probability: number;
  closeDate: string;
  owner: string;
  ownerAvatar: string;
  tags?: string[];
}

export type TeamRole = "admin" | "manager" | "rep" | "support";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  department: string;
  avatar: string;
  status: "online" | "away" | "offline" | "busy";
  performance: number;
  dealsClosed: number;
  revenue: number;
  joinedAt: string;
  location: string;
}

export type EventType = "meeting" | "call" | "demo" | "follow-up" | "internal";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: EventType;
  attendees: string[];
  location?: string;
  description?: string;
  color?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  online: boolean;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  number: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
  }>;
}

export type ActivityKind =
  | "deal_created"
  | "deal_won"
  | "deal_lost"
  | "lead_added"
  | "client_added"
  | "meeting_scheduled"
  | "invoice_paid"
  | "invoice_sent"
  | "comment"
  | "task_completed"
  | "team_joined";

export interface Activity {
  id: string;
  kind: ActivityKind;
  actor: string;
  actorAvatar: string;
  target: string;
  description: string;
  meta?: string;
  timestamp: string;
}

export type NotificationLevel = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  delta: number;
  format: "currency" | "number" | "percent";
  series: number[];
}
