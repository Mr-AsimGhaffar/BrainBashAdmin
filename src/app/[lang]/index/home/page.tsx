import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import QuizzezParticipationChart from "@/components/dashboard/QuizzezParticipationChart";

const HomePage = () => {
  return (
    <main className="mx-auto space-y-6">
      hello
      <div>{/* <DashboardCard /> */}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>{/* <UserGrowthChart /> */}</div>
        <div>{/* <QuizzezParticipationChart /> */}</div>
      </div>
    </main>
  );
};

export default HomePage;
