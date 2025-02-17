import React from "react";
import Profile from "@/components/settings/Profile";
import { getProjectSettings } from "@/lib/data";
import { SettingsProvider } from "@/hooks/context/ProjectSettingContext";

export default async function SettingsPage() {
  const projectSettings = await getProjectSettings();
  const renderContent = () => {
    return <Profile params={{ lang: "en" }} />;
  };

  return (
    <div>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-6">Project Settings</h1>
        <SettingsProvider initialSettings={projectSettings}>
          {renderContent()}
        </SettingsProvider>
      </div>
    </div>
  );
}
