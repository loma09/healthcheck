import Topbar from "@/components/layout/Topbar";
import BigStats from "@/components/dashboard/BigStats";
import HealthChart from "@/components/dashboard/HealthChart";
import ModuleCards from "@/components/dashboard/ModuleCards";
import AIStrip from "@/components/dashboard/AIStrip";
import TipsCard from "@/components/dashboard/TipsCard";

export default function DashboardPage() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Topbar />
      <div className="page-body">

        {/* Page heading */}
        <div className="page-header fade-up fade-up-1">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-date">{dateStr}</p>
          </div>
        </div>

        {/* Big stats */}
        <div className="fade-up fade-up-2">
          <BigStats />
        </div>

        {/* Chart + Tips */}
        <div className="chart-section fade-up fade-up-3">
          <HealthChart />
          <TipsCard />
        </div>

        {/* Health Modules */}
        <div className="fade-up fade-up-4">
          <ModuleCards />
        </div>

        {/* AI Insight */}
        <div className="fade-up fade-up-5">
          <AIStrip />
        </div>

      </div>
    </>
  );
}
