import Topbar from "@/components/layout/Topbar";
import { UserProvider } from "@/lib/user-context";
import OnboardingGuard from "@/components/layout/OnboardingGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <OnboardingGuard>
        <div className="app-shell-full">
          <Topbar />
          <main className="main-content-full">{children}</main>
        </div>
      </OnboardingGuard>
    </UserProvider>
  );
}
