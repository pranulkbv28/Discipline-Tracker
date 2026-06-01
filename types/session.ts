export type Session = {
  id: string;
  activity: string;
  startedAt: number;
  detectedDuration: number;
  actualDuration: number;
  notes?: string;
  source: "timer" | "manual";
  createdAt: number;
  endedAt: number;
};
