import { i18n } from "@/config/i18n";

export type User = {
  id: string;
  username: string;
  email: string;
  role: {
    name: string;
  };
  status: string;
  contacts: string;
  profilePicture: string;
  company: {
    id: string;
    name: string;
    type: string;
  };
};

export type Activity = {
  id: number;
  createdAt: string;
  action: string;
  table: string;
  endpoint: string;
  payload: {
    cost: string;
    carId: number;
    tripId: number;
    pickupLat: number;
    waypoints: any[];
    dropoffLat: number;
    pickupLong: number;
    dropoffLong: number;
    endLocation: string;
    startLocation: string;
  };
  resourceId: number;
  deletedAt: string | null;
  userId: number;
  User: {
    firstName: string;
    lastName: string;
    id: number;
  };
};

export interface StatsResponse {
  message: string;
  data: {
    thisMonth: {
      companies: number;
      drivers: number;
      trips: number;
      users: number;
      cars: number;
    };
    today: {
      companies: number;
      drivers: number;
      trips: number;
      users: number;
      cars: number;
    };
    rentalAgreements: {
      _count: number;
      status: "PENDING" | "COMPLETED";
    }[];
    companies: {
      _count: number;
      status: "ACTIVE" | "IN_ACTIVE";
    }[];
    invoices: any[]; // If the invoices structure is known, define it here.
    drivers: {
      _count: number;
      status: "AVAILABLE" | "ON_TRIP" | "ON_LEAVE" | "OFF_DUTY" | "SUSPENDED";
    }[];
    trips: {
      _count: number;
      status:
        | "COMPLETED"
        | "CANCELLED"
        | "NOT_ASSIGNED"
        | "ASSIGNED"
        | "SCHEDULED"
        | "ON_THE_WAY"
        | "ARRIVED"
        | "LOADING_IN_PROGRESS"
        | "LOADING_COMPLETE"
        | "ON_THE_WAY_DESTINATION"
        | "ARRIVED_DESTINATION";
    }[];
    bookings: {
      currentMonthBookings: number;
      previousMonthBookings: number;
      percentageChange: number;
    };
    totalCarsStats: {
      currentMonthCars: number;
      previousMonthCars: number;
      carsChangePercentage: number;
    };
    invoiceDivisionData: {
      tripRevenue: {
        current: string;
        previous: string;
        changePercentage: string;
      };
      rentalRevenue: {
        current: string;
        previous: string;
        changePercentage: string;
      };
    };
    cars: { status: string; percentage: number }[];
    invoiceHistoricalData: {
      [year: string]: {
        [month: string]: number;
      };
    };
    topBookedCars: {
      id: number;
      category: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
      };
      brand: {
        id: number;
        name: string;
        logoId: string | null;
        createdAt: string;
        updatedAt: string;
      };
      model: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
      };
      count: number;
    }[];
  };
}

import { Dayjs } from "dayjs";

export interface Quiz {
  id?: string;
  title: string;
  description?: string;
  category: string;
  maxScore: number;
  duration: number;
  publishDate: Dayjs;
  expiryDate: Dayjs;
  subjectId: number;
  questions: Question[];
}

export interface Question {
  id?: number;
  question: string;
  type: string;
  options?: string[];
  answer: string;
}

export type Report = {
  filename: string;
  url: string;
};

export type TeamMember = {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
};

export type Locale = (typeof i18n)["locales"][number];
