import { Session } from "@/types/session";

export const getTotalFocusTime = (sessions: Session[]): number => {
  return sessions.reduce((total, session) => total + session.actualDuration, 0);
};

export const getTotalSessions = (sessions: Session[]): number => {
  return sessions.length;
};

export const getActivityBreakdown = (sessions: Session[]) => {
  const breakdown: Record<string, number> = {};

  sessions.forEach((session) => {
    breakdown[session.activity] =
      (breakdown[session.activity] ?? 0) + session.actualDuration;
  });

  return breakdown;
};
