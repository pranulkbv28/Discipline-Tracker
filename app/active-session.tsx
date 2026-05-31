import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveSessionPage() {
  const { activity } = useLocalSearchParams<{
    activity: string;
  }>();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startedAt = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);

      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.activityTitle}>{activity}</Text>

      <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>

      <TouchableOpacity
        style={styles.endButton}
        onPress={() =>
          router.push({
            pathname: "/review-session",
            params: {
              activity,
              detectedDuration: elapsedSeconds,
            },
          })
        }
      >
        <Text style={styles.endButtonText}>End Session</Text>
      </TouchableOpacity>
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
    marginTop: 50,
    color: "#fff",
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
});
