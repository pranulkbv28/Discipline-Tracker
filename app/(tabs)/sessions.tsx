import { getSessions } from "@/services/session-storage";
import { Session } from "@/types/session";
import { formatDuration } from "@/utils/format-duration";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessionScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const savedSessions = await getSessions();

      setSessions(savedSessions.sort((a, b) => b.createdAt - a.createdAt));
    };

    loadSessions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Session }) => (
          <View style={styles.sessionCard}>
            <Text style={styles.activity}>{item.activity}</Text>
            <Text style={styles.duration}>
              {formatDuration(item.actualDuration)}
            </Text>
            <Text style={styles.time}>
              {new Date(item.startedAt).toLocaleString()}
            </Text>
            {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sessionCard: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activity: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  duration: {
    color: "#60a5fa",
    marginBottom: 8,
  },
  notes: {
    color: "#d1d5db",
  },
  time: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 8,
  },
});
