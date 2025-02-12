"use client";

import { useEffect, useState } from "react";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  NotificationsResponse,
  Notification,
  Metadata,
} from "@/lib/definitions";
import { Card, Spin, Alert, Button } from "antd";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications/getAllNotifications");
        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data: NotificationsResponse = await res.json();
        const defaultReadNotifications = data.data.map((notification) => ({
          ...notification,
          isRead: true,
        }));
        setNotifications(defaultReadNotifications);
        setMetadata(data.metadata);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  if (loading) return <Spin className="flex justify-center mt-10" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBell className="w-6 h-6" /> Notifications ({metadata?.total || 0})
      </h1>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 shadow-md transition rounded-2xl border-l-4 ${
                notification.isRead ? "border-green-500" : "border-blue-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  {notification.isRead ? (
                    <FaCheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <FaTimesCircle className="text-blue-500 w-5 h-5" />
                  )}
                  {notification.isRead && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
