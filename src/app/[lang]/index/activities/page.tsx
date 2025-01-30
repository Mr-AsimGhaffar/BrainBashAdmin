"use client";

import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ActivityActionResponse } from "@/lib/definitions";
import dayjs from "dayjs";

export default function AccessLogsPage() {
  const [activities, setActivities] = useState<ActivityActionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activity/getActivities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(
          data.data.map((item: ActivityActionResponse) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch activities");
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      message.error("An error occurred while fetching activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const columns: ColumnsType<ActivityActionResponse> = [
    {
      title: <span className="flex items-center gap-2">ID</span>,
      dataIndex: "id",
      key: "id",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Username</span>,
      key: "username",
      className: "font-workSans",
      render: (_, record) => <span>{record.user?.username}</span>,
    },
    {
      title: <span className="flex items-center gap-2">Action</span>,
      dataIndex: "action",
      key: "action",
      className: "font-workSans",
      render: (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    },
    {
      title: <span className="flex items-center gap-2">TimeStamp</span>,
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "font-workSans",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold font-montserrat mb-6">
          User Activities
        </h1>
      </div>

      <Table
        columns={columns}
        dataSource={activities}
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
