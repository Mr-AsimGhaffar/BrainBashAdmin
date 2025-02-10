"use client";

import { StatsResponse } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Card } from "antd";

interface StatCardProps {
  title: string;
  value: number;
  loading: boolean;
}

async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch("/api/stats/getStats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export function DashboardCard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats?.data.totalUsers || 0}
        loading={loading}
      />
      <StatCard
        title="Total Quizzes"
        value={stats?.data.totalQuizzes || 0}
        loading={loading}
      />
    </div>
  );
}

function StatCard({ title, value, loading }: StatCardProps) {
  return (
    <Card loading={loading} className="text-center">
      <p className="text-base">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  );
}
