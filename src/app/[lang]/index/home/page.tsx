"use client";

import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import QuizzezParticipationChart from "@/components/dashboard/QuizzezParticipationChart";
import { useWidgetSettings } from "@/hooks/context/WidgetSettingsContext";

const HomePage = () => {
  const { settings } = useWidgetSettings();
  return (
    <main className="mx-auto space-y-6">
      <p className="text-2xl font-semibold">Admin Dashboard</p>
      {settings.showDashboardCard && (
        <div>
          <DashboardCard />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {settings.showUserGrowthChart && (
          <div>
            <UserGrowthChart />
          </div>
        )}
        {settings.showQuizParticipationChart && (
          <div>
            <QuizzezParticipationChart />
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
