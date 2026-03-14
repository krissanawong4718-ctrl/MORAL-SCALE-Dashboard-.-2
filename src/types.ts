export interface SchoolData {
  id: string;
  date: string;
  network: string;
  schoolName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalStudents: number;
  lateStudents: number; // Negative
  onTimeStudents: number; // Positive
  workSubmission: number; // Positive
  returnedItems: number; // Positive
  otherGoodDeeds: number; // Positive
}

export interface DashboardStats {
  totalPositive: number;
  totalNegative: number;
  percentagePositive: number;
  trend: number; // percentage change from previous period
}
