import React from "react";
import { Card, Col } from "antd";
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

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
    <div>
      <Col xs={24} lg={12}>
        <Card
          title="Top 5 Quizzes by Participation"
          className="dark:bg-gray-800 dark:border-gray-700"
        >
          <BarChart width={500} height={300} data={[]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                border: "none",
                borderRadius: "8px",
                color: "#374151",
              }}
            />
            <Bar dataKey="participants" fill="#2563eb" />
          </BarChart>
        </Card>
      </Col>
    </div>
  );
};

export default QuizzezParticipationChart;
