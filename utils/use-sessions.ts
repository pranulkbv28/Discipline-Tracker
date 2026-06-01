import { getSessions } from "@/services/session-storage";
import { Session } from "@/types/session";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);

      const savedSessions = await getSessions();

      setSessions(savedSessions);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions]),
  );

  return {
    sessions,
    loading,
    reloadSessions: loadSessions,
  };
};
