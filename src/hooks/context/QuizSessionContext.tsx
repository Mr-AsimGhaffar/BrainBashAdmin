"use client";
import { QuizSessionResponse } from "@/lib/definitions";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface QuizSessionContextType {
  quizSession: any | null;
  setQuizSession: (session: any | null) => void;
}

const QuizSessionContext = createContext<QuizSessionContextType | undefined>(
  undefined
);

export const useQuizSession = () => {
  const context = useContext(QuizSessionContext);
  if (!context) {
    throw new Error("useQuizSession must be used within a QuizSessionProvider");
  }
  return context;
};

interface QuizSessionProviderProps {
  children: ReactNode;
}

export const QuizSessionProvider = ({ children }: QuizSessionProviderProps) => {
  const [quizSession, setQuizSession] = useState<any | null>(null);

  return (
    <QuizSessionContext.Provider value={{ quizSession, setQuizSession }}>
      {children}
    </QuizSessionContext.Provider>
  );
};
