"use client";

import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FeedbackActionResponse } from "@/lib/definitions";
import FormatString from "@/utils/FormatString";
import handleExportFeedback from "@/components/export/ExportFeedback";

export default function AccessLogsPage() {
  const [feedback, setFeedback] = useState<FeedbackActionResponse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feedback/getFeedback`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFeedback(
          data.data.map((item: FeedbackActionResponse) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      message.error("An error occurred while fetching feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/feedback/updateFeedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        message.success(`Feedback marked as ${status}`);
        fetchFeedback();
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to update feedback status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("An error occurred while updating the status");
    }
  };

  const columns: ColumnsType<FeedbackActionResponse> = [
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
      title: <span className="flex items-center gap-2">Message</span>,
      dataIndex: "message",
      key: "message",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Status</span>,
      dataIndex: "status",
      key: "status",
      className: "font-workSans",
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          PENDING: "blue",
          RESOLVED: "green",
          REVIEWED: "yellow",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {FormatString(status)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => updateStatus(record.id, "RESOLVED")}
            disabled={record.status === "RESOLVED"}
            className="bg-blue-500 text-white"
          >
            Mark as Resolved
          </Button>
          <Button
            onClick={() => updateStatus(record.id, "REVIEWED")}
            disabled={record.status === "REVIEWED"}
            className="bg-green-600 text-white"
          >
            Mark as Reviewed
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-montserrat mb-6">Feedback</h1>
        <Button size="large" type="primary" onClick={handleExportFeedback}>
          Export CSV
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={feedback}
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
