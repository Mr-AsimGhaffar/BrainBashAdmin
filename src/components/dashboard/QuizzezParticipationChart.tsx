"use client";

import React from "react";
import { Card } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const userData = [
  { date: "2024-11-18", newUsers: 0 },
  { date: "2024-11-19", newUsers: 1 },
  { date: "2024-11-20", newUsers: 0 },
  { date: "2024-11-21", newUsers: 0 },
  { date: "2024-11-22", newUsers: 0 },
  { date: "2024-11-23", newUsers: 0 },
  { date: "2024-11-24", newUsers: 0 },
];

const QuizzezParticipationChart = () => {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Card
        title="Top 5 Quizzes by Participation"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          border: "none",
          backgroundColor: "#ffffff",
        }}
      >
        <BarChart width={500} height={300} data={userData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#374151"
            label={{ value: "Quiz Name", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            stroke="#374151"
            label={{
              value: "Participants",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#374151",
            }}
            labelStyle={{ color: "#2563eb" }}
          />
          <Legend wrapperStyle={{ bottom: -10 }} />
          <Bar
            dataKey="participants"
            fill="url(#barGradient)"
            radius={[10, 10, 0, 0]} // Rounded top corners
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </BarChart>
      </Card>
    </div>
  );
};

export default QuizzezParticipationChart;
