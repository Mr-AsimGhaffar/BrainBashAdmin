"use client";
import { ProjectSettings } from "@/lib/definitions";
import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  settings: ProjectSettings | null;
  setSettings: (settings: ProjectSettings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: ProjectSettings | null;
}) => {
  const [settings, setSettings] = useState<ProjectSettings | null>(
    initialSettings
  );

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
