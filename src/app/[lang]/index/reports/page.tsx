"use client";

import React, { useEffect, useState } from "react";
import { ReportCard } from "@/components/reports/ReportCard";

type ReportData = {
  totalParticipants: number;
  averageScore: number;
};

const HomePage = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/quizzes/getQuizReports?id=${1}`);
        if (!response.ok) throw new Error("Failed to fetch report");
        const data = await response.json();
        setReportData(data.data as ReportData);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <main className="mx-auto space-y-6">
      <p className="text-2xl font-semibold">Reports</p>
      <div>
        <ReportCard />
      </div>
      <div>
        {reportData && (
          <>
            <p className="text-lg">
              Total Participants: {reportData.totalParticipants || "0"}
            </p>
            <p className="text-lg">
              Average Score: {reportData.averageScore || "0"}
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
