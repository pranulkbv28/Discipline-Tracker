import { ActiveSession } from "@/types/active-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_SESSION_KEY = "@discipline-tracker/active-session";

export const saveActiveSession = async (session: ActiveSession) => {
  try {
    await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving active session:", error);
  }
};

export const getActiveSession = async (): Promise<ActiveSession | null> => {
  try {
    const session = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);

    return session ? (JSON.parse(session) as ActiveSession) : null;
  } catch (error) {
    console.error("Error getting active session:", error);

    return null;
  }
};

export const clearActiveSession = async () => {
  try {
    await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (error) {
    console.error("Error clearing active session:", error);
  }
};
