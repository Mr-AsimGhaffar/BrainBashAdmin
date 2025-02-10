"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser } from "./AuthContext";

interface WidgetSettings {
  showDashboardCard: boolean;
  showUserGrowthChart: boolean;
  showQuizParticipationChart: boolean;
}

interface SettingContextType {
  settings: WidgetSettings;
  updateSettings: (newSettings: WidgetSettings) => void;
  fetchSettings: () => void;
}

export const WidgetSetting = createContext<SettingContextType | undefined>(
  undefined
);

export const WidgetSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useUser();
  const [settings, setSettings] = useState<WidgetSettings>({
    showDashboardCard: true,
    showUserGrowthChart: true,
    showQuizParticipationChart: true,
  });

  const fetchSettings = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`/api/getUserById?id=${user.id}`);
        const data = await response.json();
        if (response.ok && data.metadata) {
          setSettings(data.metadata);
        }
      } catch (error) {
        console.error("Error fetching widget settings:", error);
      }
    }
  };

  const updateSettings = (newSettings: WidgetSettings) => {
    setSettings(newSettings);
    fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return (
    <WidgetSetting.Provider value={{ settings, updateSettings, fetchSettings }}>
      {children}
    </WidgetSetting.Provider>
  );
};

export const useWidgetSettings = () => {
  const context = useContext(WidgetSetting);
  if (!context) {
    throw new Error(
      "useWidgetSettings must be used within WidgetSettingsProvider"
    );
  }
  return context;
};
