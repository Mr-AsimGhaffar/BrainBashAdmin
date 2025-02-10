"use client";

import React, { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UserGrowth {
  date: string;
  newUsers: number;
}

const UserGrowthChart = () => {
  const [userData, setUserData] = useState<UserGrowth[]>([]);
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
        setUserData(data.data.userGrowth);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getLast7DaysData = (data: UserGrowth[]) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= sevenDaysAgo && itemDate <= today;
    });
  };

  const filteredData = getLast7DaysData(userData);

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
      <Card title="User Growth (Last 7 Days)" className="text-center font-bold">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#374151"
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
              interval="preserveEnd"
              padding={{ right: 35 }}
            />
            <YAxis
              stroke="#374151"
              label={{ value: "New Users", angle: -90, position: "insideLeft" }}
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
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, fill: "#2563eb" }}
              activeDot={{ r: 6 }}
              fill="url(#lineGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default UserGrowthChart;
