"use client";

import React from "react";
import { ReportCard } from "@/components/reports/ReportCard";

const QuizReportPage = () => {
  return (
    <main className="mx-auto space-y-6">
      <p className="text-2xl font-semibold">Reports</p>
      <div>
        <ReportCard />
      </div>
    </main>
  );
};

export default QuizReportPage;
