import { create } from "zustand";
import { notifications as initial } from "@/data/mock";
import type { AppNotification } from "@/types";

interface NotificationsState {
  items: AppNotification[];
  unreadCount: () => number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  remove: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: initial,
  unreadCount: () => get().items.filter((n) => !n.read).length,
  markAllRead: () =>
    set({ items: get().items.map((n) => ({ ...n, read: true })) }),
  markRead: (id) =>
    set({
      items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }),
  remove: (id) =>
    set({ items: get().items.filter((n) => n.id !== id) }),
}));
