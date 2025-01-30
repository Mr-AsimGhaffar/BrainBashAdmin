"use client";

import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FeedbackActionResponse } from "@/lib/definitions";
import dayjs from "dayjs";

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

  const handleExportCSV = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select feedback to export.");
      return;
    }

    try {
      const response = await fetch(`/api/feedback/exportFeedback`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "feedback_logs.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        message.success("CSV file downloaded successfully!");
      } else {
        message.error("Failed to export feedbacks.");
      }
    } catch (error) {
      console.error("Error exporting feedbacks:", error);
      message.error("An error occurred while exporting feedbacks.");
    }
  };

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

  const formatString = (str: any) => {
    if (!str) return "";
    return str
      .split("_")
      .map(
        (word: any) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
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
            {formatString(status)}
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
        <Button
          size="large"
          type="primary"
          onClick={handleExportCSV}
          disabled={selectedRowKeys.length === 0}
        >
          Export CSV
        </Button>
      </div>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        columns={columns}
        dataSource={feedback}
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
