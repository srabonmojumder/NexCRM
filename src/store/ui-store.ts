import { create } from "zustand";

/**
 * The sidebar collapsed state is persisted in a cookie (not localStorage) so the
 * server can read it during SSR and render the correct layout immediately.
 * This avoids the hydration flash where the sidebar/content jump after load.
 */
export const SIDEBAR_COOKIE_NAME = "nexcrm-sidebar-collapsed";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function persistSidebarCookie(collapsed: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${
    collapsed ? "1" : "0"
  }; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

/**
 * Read the persisted sidebar state on the client. Used for static hosting
 * (Firebase) where there is no server to read the cookie during render — the
 * value is applied after mount to avoid a hydration mismatch.
 */
export function readSidebarCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c === `${SIDEBAR_COOKIE_NAME}=1`);
}

interface UIState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  notificationsOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
  setNotificationsOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  notificationsOpen: false,
  toggleSidebar: () =>
    set((s) => {
      const sidebarCollapsed = !s.sidebarCollapsed;
      persistSidebarCookie(sidebarCollapsed);
      return { sidebarCollapsed };
    }),
  setSidebarCollapsed: (sidebarCollapsed) => {
    persistSidebarCookie(sidebarCollapsed);
    set({ sidebarCollapsed });
  },
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
}));
