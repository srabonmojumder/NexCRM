import {
  activity,
  clients,
  conversations,
  deals,
  events,
  invoices,
  leads,
  messages,
  notifications,
  team,
} from "@/data/mock";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async getLeads() {
    await wait(120);
    return leads;
  },
  async getClients() {
    await wait(120);
    return clients;
  },
  async getDeals() {
    await wait(120);
    return deals;
  },
  async getTeam() {
    await wait(120);
    return team;
  },
  async getEvents() {
    await wait(120);
    return events;
  },
  async getConversations() {
    await wait(120);
    return conversations;
  },
  async getMessages(conversationId: string) {
    await wait(120);
    return messages[conversationId] ?? [];
  },
  async getInvoices() {
    await wait(120);
    return invoices;
  },
  async getActivity() {
    await wait(120);
    return activity;
  },
  async getNotifications() {
    await wait(120);
    return notifications;
  },
};
