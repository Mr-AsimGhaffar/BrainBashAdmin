import React from "react";
import { Card, Col } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const UserGrowthChart = () => {
  return (
    <div>
      <Col xs={24} lg={12}>
        <Card
          title="User Growth (Last 7 Days)"
          className="dark:bg-gray-800 dark:border-gray-700"
        >
          <LineChart width={500} height={300} data={userData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "8px",
                color: "#374151",
              }}
            />
            <Line type="monotone" dataKey="newUsers" stroke="#2563eb" />
          </LineChart>
        </Card>
      </Col>
    </div>
  );
};

export default UserGrowthChart;
