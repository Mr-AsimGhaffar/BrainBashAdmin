"use client";

import { StatsResponse } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import handleExportUser from "../export/ExportUser";
import handleExportFeedback from "../export/ExportFeedback";
import handleExportQuizzes from "../export/ExportQuizzes";

interface StatCardProps {
  title: string;
  value: number;
  loading: boolean;
}

async function fetchReports(): Promise<StatsResponse> {
  const response = await fetch("/api/stats/getStats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export function ReportCard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReports()
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Users"
          value={stats?.data.totalUsers || 0}
          loading={loading}
        />
        <StatCard
          title="Quizzes"
          value={stats?.data.totalQuizzes || 0}
          loading={loading}
        />
        <StatCard
          title="Feedback"
          value={stats?.data.totalFeedback || 0}
          loading={loading}
        />
      </div>
      <div className="py-8 flex items-center gap-4">
        <Button type="primary" onClick={handleExportUser}>
          Export Users
        </Button>
        <Button type="primary" onClick={handleExportQuizzes}>
          Export Quizzes
        </Button>
        <Button type="primary" onClick={handleExportFeedback}>
          Export Feedback
        </Button>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading }: StatCardProps) {
  return (
    <>
      <Card loading={loading} className="text-center">
        <p className="text-base">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </Card>
    </>
  );
}
