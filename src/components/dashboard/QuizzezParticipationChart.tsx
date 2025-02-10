"use client";

import React, { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TopQuiz {
  id: number;
  title: string;
  participants: number;
}

const QuizzesParticipationChart = () => {
  const [quizData, setQuizData] = useState<TopQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/getStats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setQuizData(data.data.topQuizzes.slice(0, 5));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-md">
      <Card
        title="Top 5 Quizzes by Participation"
        className="text-center font-bold"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quizData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="title"
              stroke="#374151"
              label={{
                value: "Quiz Name",
                position: "insideBottom",
                offset: -5,
              }}
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
              radius={[10, 10, 0, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.5} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default QuizzesParticipationChart;
