import { i18n } from "@/config/i18n";

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  contacts: string;
  profilePicture: string;
  company: {
    id: string;
    name: string;
    type: string;
  };
};

export interface ProjectSettings {
  id: number;
  title: string;
  email: string;
}

interface QuizDetail {
  id: number;
  title: string;
  questions: QuestionDetail[];
}

interface QuestionDetail {
  id: number;
  question: string;
  type: "MULTIPLE_CHOICE";
  options: string[];
}

interface QuizSessionDetail {
  id: number;
  userId: number;
  quizId: number;
  startTime: string;
  endTime: string;
  status: "IN_PROGRESS" | "COMPLETED" | "PENDING";
  score: number;
  createdAt: string;
  updatedAt: string;
  guestUserId: number | null;
  quiz: QuizDetail;
}

export interface QuizSessionResponse {
  data: {
    quizSession: QuizSessionDetail;
  };
  message: string;
}

export interface StatsResponse {
  message: string;
  data: {
    totalUsers: number;
    totalQuizzes: number;
    totalFeedback: number;
    userGrowth: {
      date: string;
      newUsers: number;
    }[];
    topQuizzes: {
      id: number;
      title: string;
      participants: number;
    }[];
  };
}

import { Dayjs } from "dayjs";

export interface Quiz {
  id?: string;
  fileId: number;
  title: string;
  description?: string;
  category: string;
  maxScore: number;
  duration: number;
  publishDate: Dayjs;
  expiryDate: Dayjs;
  subjectId: number;
  questions: Question[];
  File: {
    id: number;
  };
}

export interface Question {
  id?: number;
  question: string;
  type: string;
  options?: string[];
  answer: string;
}

export interface Subject {
  key: string;
  id: number;
  name: string;
}
export interface Achievement {
  id: number;
  name: string;
  description: string;
  criteriaType: string;
  criteriaThreshold: number;
}

export interface Idea {
  key?: string;
  id: number;
  title: string;
  description: string;
  updatedAt: string;
}

export interface AccessLogUser {
  id: number;
  username: string;
  email: string;
}

export interface UserActionResponse {
  id: number;
  userId?: number;
  action: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  user: AccessLogUser;
}

export interface UserActivity {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}
export interface ActivityActionResponse {
  id: number;
  userId: number;
  action: string;
  createdAt: string;
  user: UserActivity;
}

export interface UserFeedback {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}
export interface FeedbackActionResponse {
  id: number;
  userId: number;
  status: string;
  user: UserFeedback;
}

export interface QuizSession {
  quizId: number;
  userId: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  rank: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Metadata {
  page: number;
  hasNextPage: boolean;
  totalPages: number;
  hasPreviousPage: boolean;
  limit: number;
  total: number;
}

export interface NotificationsResponse {
  data: Notification[];
  metadata: Metadata;
  message: string;
}

export type Locale = (typeof i18n)["locales"][number];
