import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  clearActiveSession,
  saveActiveSession,
} from "@/services/active-session-storage";
import { ActiveSession } from "@/types/active-session";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveSessionPage() {
  const [showExitModal, setShowExitModal] = useState(false);

  const { activity, startedAt } = useLocalSearchParams<{
    activity: string;
    startedAt?: string;
  }>();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const sessionStartedAt = useRef(startedAt ? Number(startedAt) : Date.now());

  useEffect(() => {
    const initializeSession = async () => {
      const activeSession: ActiveSession = {
        activity,
        startedAt: sessionStartedAt.current,
      };
      await saveActiveSession(activeSession);
    };

    initializeSession();

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - sessionStartedAt.current) / 1000,
      );

      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activity]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setShowExitModal(true);
        return true;
      },
    );

    return () => subscription.remove();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleEndSession = async () => {
    await clearActiveSession();

    router.push({
      pathname: "/review-session",
      params: {
        activity,
        detectedDuration: elapsedSeconds.toString(),
        startedAt: sessionStartedAt.current.toString(),
        endedAt: Date.now().toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "ios" && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowExitModal(true)}
            style={styles.backButton}
          >
            <IconSymbol size={28} name="chevron.left" color="white" />
          </TouchableOpacity>

          <Text style={styles.activityTitle}>{activity}</Text>
        </View>
      )}

      {Platform.OS !== "ios" && (
        <Text style={styles.activityTitle}>{activity}</Text>
      )}

      <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>

      <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
        <Text style={styles.endButtonText}>End Session</Text>
      </TouchableOpacity>

      <Modal visible={showExitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Leave Activity?</Text>

            <Text style={styles.modalText}>Your session is still running.</Text>

            <TouchableOpacity
              style={styles.resumeButton}
              onPress={() => setShowExitModal(false)}
            >
              <Text style={styles.modalButtonText}>Continue Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endModalButton}
              onPress={async () => {
                setShowExitModal(false);

                await handleEndSession();
              }}
            >
              <Text style={styles.modalButtonText}>End Session</Text>
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
  },
  activityTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  timer: {
    fontSize: 48,
    marginTop: Platform.OS === "ios" ? 20 : 50,
    color: "#fff",
    fontWeight: "700",
  },
  endButton: {
    marginTop: 40,
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  endButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
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
  modalText: {
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
  endModalButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#1f2937",
    marginRight: 16,
  },
});
