import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell-full">
      <Topbar />
      <main className="main-content-full">{children}</main>
    </div>
  );
}
