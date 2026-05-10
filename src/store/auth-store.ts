import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userProfile } from "@/data/mock";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  organization: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email?: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: userProfile,
      isAuthenticated: true,
      signIn: (email) =>
        set({
          user: email ? { ...userProfile, email } : userProfile,
          isAuthenticated: true,
        }),
      signOut: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "nexcrm-auth" }
  )
);
