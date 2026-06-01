import { Session } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSIONS_KEY = "sessions";

export const saveSession = async (session: Session) => {
  try {
    const existingSessions = await getSessions();

    const updatedSessions = [...existingSessions, session];

    await AsyncStorage.setItem(
      SESSIONS_KEY,

      JSON.stringify(updatedSessions),
    );
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export const getSessions = async (): Promise<Session[]> => {
  try {
    const sessions = await AsyncStorage.getItem(SESSIONS_KEY);

    return sessions ? (JSON.parse(sessions) as Session[]) : [];
  } catch (error) {
    console.error("Error getting sessions:", error);

    return [];
  }
};
