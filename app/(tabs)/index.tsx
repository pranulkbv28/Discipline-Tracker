import {
  clearActiveSession,
  getActiveSession,
} from "@/services/active-session-storage";
import { ActiveSession } from "@/types/active-session";
import {
  getCurrentStreak,
  getTodaysSessionsCount,
} from "@/utils/session-metrics";
import { useSessions } from "@/utils/use-sessions";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { sessions } = useSessions();

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const todaySessionsCount = getTodaysSessionsCount(sessions);
  const currentStreak = getCurrentStreak(sessions);

  useFocusEffect(
    useCallback(() => {
      const checkActiveSession = async () => {
        const session = await getActiveSession();

        if (session) {
          setActiveSession(session);

          setShowRecoveryModal(true);
        }
      };

      checkActiveSession();
    }, []),
  );

  const getDetectedDuration = () => {
    if (!activeSession) {
      return "0m";
    }

    const elapsedMinutes = Math.floor(
      (Date.now() - activeSession.startedAt) / 1000 / 60,
    );

    return `${elapsedMinutes}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔥 Discipline Tracker</Text>

      <Text style={styles.metric}>
        Current Streak: {currentStreak} Day
        {currentStreak === 1 ? "" : "s"}
      </Text>

      <Text style={styles.metric}>
        Today&apos;s Sessions: {todaySessionsCount}
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/select-activity")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Start Session</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/manual-session")}
        style={styles.manual}
      >
        <Text style={styles.buttonText}>Manual Session</Text>
      </TouchableOpacity>

      <Modal visible={showRecoveryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Found Unfinished Session</Text>

            <Text style={styles.modalActivity}>{activeSession?.activity}</Text>

            <Text style={styles.modalDuration}>
              Detected Duration: {getDetectedDuration()}
            </Text>

            <TouchableOpacity
              style={styles.resumeButton}
              onPress={() => {
                if (!activeSession) {
                  return;
                }

                setShowRecoveryModal(false);

                router.replace({
                  pathname: "/active-session",

                  params: {
                    activity: activeSession.activity,

                    startedAt: activeSession.startedAt.toString(),
                  },
                });
              }}
            >
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.discardButton}
              onPress={async () => {
                await clearActiveSession();

                setActiveSession(null);

                setShowRecoveryModal(false);
              }}
            >
              <Text style={styles.buttonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
  },
  metric: {
    fontSize: 18,
    marginBottom: 12,
    color: "white",
  },
  button: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#2563eb",
  },
  manual: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#00b112",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalActivity: {
    color: "#60a5fa",
    fontSize: 20,
    marginBottom: 12,
  },
  modalDuration: {
    color: "#d1d5db",
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  discardButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
