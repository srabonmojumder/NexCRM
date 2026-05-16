import { cookies } from "next/headers";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { SIDEBAR_COOKIE_NAME } from "@/store/ui-store";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Read the persisted sidebar state on the server so the layout renders in its
  // final shape on the first paint — no post-hydration flash on reload.
  const defaultCollapsed = cookies().get(SIDEBAR_COOKIE_NAME)?.value === "1";

  return (
    <DashboardLayout defaultCollapsed={defaultCollapsed}>
      {children}
    </DashboardLayout>
  );
}
