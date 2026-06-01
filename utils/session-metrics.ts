import { Session } from "@/types/session";

export const getTodaysSessionsCount = (sessions: Session[]): number => {
  const today = new Date();

  return sessions.filter((session) => {
    const sessionDate = new Date(session.createdAt);

    return (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    );
  }).length;
};

export const getCurrentStreak = (sessions: Session[]): number => {
  if (sessions.length === 0) {
    return 0;
  }

  const sessionDates = new Set(
    sessions.map((session) => {
      const date = new Date(session.createdAt);

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).getTime();
    }),
  );

  let streak = 0;

  const currentDate = new Date();

  while (true) {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - streak,
    ).getTime();

    if (!sessionDates.has(dateToCheck)) {
      break;
    }

    streak++;
  }

  return streak;
};
