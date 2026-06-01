import { formatDuration } from "@/utils/format-duration";
import {
  getActivityBreakdown,
  getTotalFocusTime,
  getTotalSessions,
} from "@/utils/stats";
import { useSessions } from "@/utils/use-sessions";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  const { sessions } = useSessions();

  const totalSessions = getTotalSessions(sessions);

  const totalFocusTime = getTotalFocusTime(sessions);

  const activityBreakdown = getActivityBreakdown(sessions);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Sessions</Text>

        <Text style={styles.summaryValue}>{totalSessions}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Focus Time</Text>

        <Text style={styles.summaryValue}>
          {formatDuration(totalFocusTime)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Activity Breakdown</Text>

      {Object.entries(activityBreakdown).map(([activity, duration]) => (
        <View key={activity} style={styles.activityCard}>
          <Text style={styles.activityName}>{activity}</Text>

          <Text style={styles.activityDuration}>
            {formatDuration(duration)}
          </Text>
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#1f2937",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 6,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  activityDuration: {
    color: "#60a5fa",
    fontSize: 16,
    fontWeight: "600",
  },
});
