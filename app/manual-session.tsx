import { saveSession } from "@/services/session-storage";
import { Session } from "@/types/session";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const activities = [
  "Workout",
  "Data Science",
  "DSA",
  "Java",
  "Cybersecurity",
  "Reading",
];

export default function ManualSessionPage() {
  const [selectedActivity, setSelectedActivity] = useState("");

  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");

  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  const [notes, setNotes] = useState("");

  const createTodayTimestamp = (hours: number, minutes: number) => {
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
  };

  const handleSave = async () => {
    if (!selectedActivity) {
      Alert.alert("Validation", "Please select an activity.");
      return;
    }

    const startH = Number(startHour);
    const startM = Number(startMinute);

    const endH = Number(endHour);
    const endM = Number(endMinute);

    if (
      Number.isNaN(startH) ||
      Number.isNaN(startM) ||
      Number.isNaN(endH) ||
      Number.isNaN(endM)
    ) {
      Alert.alert("Validation", "Please enter valid times.");
      return;
    }

    const startedAt = createTodayTimestamp(startH, startM);

    const endedAt = createTodayTimestamp(endH, endM);

    if (endedAt <= startedAt) {
      Alert.alert("Validation", "End time must be after start time.");
      return;
    }

    const durationSeconds = Math.floor((endedAt - startedAt) / 1000);

    const session: Session = {
      id: `${Date.now()}-${Math.random()}`,

      activity: selectedActivity,

      startedAt,
      endedAt,

      detectedDuration: durationSeconds,
      actualDuration: durationSeconds,

      notes,

      source: "manual",

      createdAt: Date.now(),
    };

    await saveSession(session);

    router.replace("/sessions");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Manual Session</Text>

          <Text style={styles.sectionTitle}>Activity</Text>

          {activities.map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.activityButton,
                selectedActivity === activity && styles.selectedActivityButton,
              ]}
              onPress={() => setSelectedActivity(activity)}
            >
              <Text style={styles.activityText}>{activity}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Start Time</Text>

          <View style={styles.timeContainer}>
            <TextInput
              style={styles.timeInput}
              placeholder="HH"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={startHour}
              onChangeText={setStartHour}
            />

            <Text style={styles.timeSeparator}>:</Text>

            <TextInput
              style={styles.timeInput}
              placeholder="MM"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={startMinute}
              onChangeText={setStartMinute}
            />
          </View>

          <Text style={styles.sectionTitle}>End Time</Text>

          <View style={styles.timeContainer}>
            <TextInput
              style={styles.timeInput}
              placeholder="HH"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={endHour}
              onChangeText={setEndHour}
            />

            <Text style={styles.timeSeparator}>:</Text>

            <TextInput
              style={styles.timeInput}
              placeholder="MM"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={endMinute}
              onChangeText={setEndMinute}
            />
          </View>

          <Text style={styles.sectionTitle}>Notes (Optional)</Text>

          <TextInput
            style={styles.notesInput}
            placeholder="What did you complete?"
            placeholderTextColor="#6b7280"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Session</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#9ca3af",
    marginBottom: 10,
    marginTop: 16,
    textTransform: "uppercase",
  },

  activityButton: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  selectedActivityButton: {
    borderWidth: 2,
    borderColor: "#2563eb",
  },

  activityText: {
    color: "#fff",
    fontSize: 16,
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },

  timeSeparator: {
    color: "#fff",
    fontSize: 24,
    marginHorizontal: 12,
  },

  notesInput: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    minHeight: 100,
    marginBottom: 24,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
