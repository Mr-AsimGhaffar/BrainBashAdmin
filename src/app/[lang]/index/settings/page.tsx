import React from "react";
import Profile from "@/components/settings/Profile";
import { UserProvider } from "@/hooks/context/AuthContext";
import { getUser } from "@/lib/data";

export default async function SettingsPage() {
  const user = await getUser();
  const renderContent = () => {
    return <Profile />;
  };

  return (
    <div>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <UserProvider initialUser={user}>{renderContent()}</UserProvider>
      </div>
    </div>
  );
}
