"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserActionResponse } from "@/lib/definitions";
import dayjs from "dayjs";

export default function AccessLogsPage() {
  const [accessLogs, setAccessLogs] = useState<UserActionResponse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccessLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/accessLogs/getAccessLogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccessLogs(
          data.data.map((item: UserActionResponse) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch access logs");
      }
    } catch (error) {
      console.error("Error fetching access logs:", error);
      message.error("An error occurred while fetching access logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  const handleExportCSV = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select logs to export.");
      return;
    }

    try {
      const response = await fetch(`/api/accessLogs/exportAccessLogs`, {
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
        a.download = "access_logs.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        message.success("CSV file downloaded successfully!");
      } else {
        message.error("Failed to export logs.");
      }
    } catch (error) {
      console.error("Error exporting logs:", error);
      message.error("An error occurred while exporting logs.");
    }
  };

  const columns: ColumnsType<UserActionResponse> = [
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-montserrat mb-6">Access Logs</h1>
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
        dataSource={accessLogs}
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
