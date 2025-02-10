"use client";

import React, { useState, useEffect } from "react";
import { Button, Checkbox, message } from "antd";
import { useUser } from "@/hooks/context/AuthContext";
import { useWidgetSettings } from "@/hooks/context/WidgetSettingsContext";

const ManageWidgets = () => {
  const { user } = useUser();
  const { settings, updateSettings } = useWidgetSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof typeof settings) => {
    setLocalSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("/api/updateUsers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, metadata: localSettings }),
      });

      if (response.ok) {
        message.success("Settings updated successfully");
        updateSettings(localSettings);
      } else {
        message.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      message.error("An error occurred while updating settings");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Widgets</h2>
      <Checkbox
        checked={localSettings.showDashboardCard}
        onChange={() => handleChange("showDashboardCard")}
      >
        Dashboard Card
      </Checkbox>
      <br />
      <Checkbox
        checked={localSettings.showUserGrowthChart}
        onChange={() => handleChange("showUserGrowthChart")}
      >
        User Growth Chart
      </Checkbox>
      <br />
      <Checkbox
        checked={localSettings.showQuizParticipationChart}
        onChange={() => handleChange("showQuizParticipationChart")}
      >
        Quiz Participation Chart
      </Checkbox>
      <br />
      <Button type="primary" onClick={handleSave} className="mt-4">
        Save Settings
      </Button>
    </div>
  );
};

export default ManageWidgets;
