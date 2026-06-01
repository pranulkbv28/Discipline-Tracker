import { saveSession } from "@/services/session-storage";
import { Session } from "@/types/session";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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

export default function ReviewSessionPage() {
  const { activity, detectedDuration, startedAt, endedAt } =
    useLocalSearchParams<{
      activity: string;
      detectedDuration: string;
      startedAt: string;
      endedAt: string;
    }>();

  const [useDetectedDuration, setUseDetectedDuration] = useState(true);
  const [accomplishment, setAccomplishment] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const detectedDurationSeconds = Number(detectedDuration);

  const actualDurationSeconds =
    (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60;
  const isInvalidDuration =
    !useDetectedDuration && actualDurationSeconds > detectedDurationSeconds;

  const isZeroDuration = !useDetectedDuration && actualDurationSeconds <= 0;

  const disableSave = isInvalidDuration || isZeroDuration;

  const handleDiscardSession = async () => {
    router.replace("/");
  };

  const handleSaveSession = async () => {
    const session: Session = {
      id: `${Date.now()}-${Math.random()}`,
      activity: activity as Session["activity"],
      startedAt: Number(startedAt),
      endedAt: Number(endedAt),
      detectedDuration: Number(detectedDuration),
      actualDuration: useDetectedDuration
        ? Number(detectedDuration)
        : actualDurationSeconds,
      notes: accomplishment,
      source: "timer",
      createdAt: Date.now(),
    };

    await saveSession(session);

    console.log("Saved Session:", session);

    router.replace("/sessions");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{activity}</Text>

          <Text style={styles.duration}>
            {formatTime(Number(detectedDuration))}
          </Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setUseDetectedDuration(true)}
            >
              <Text style={styles.radio}>
                {useDetectedDuration ? "◉" : "○"}
              </Text>

              <Text style={styles.radioLabel}>Use detected duration</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setUseDetectedDuration(false)}
            >
              <Text style={styles.radio}>
                {!useDetectedDuration ? "◉" : "○"}
              </Text>

              <Text style={styles.radioLabel}>Enter actual focus time</Text>
            </TouchableOpacity>
          </View>

          {!useDetectedDuration && (
            <>
              <Text style={styles.sectionTitle}>Actual Focus Time</Text>

              <View style={styles.durationInputContainer}>
                <View style={styles.durationField}>
                  <Text style={styles.durationLabel}>Hours</Text>

                  <TextInput
                    style={styles.durationInput}
                    keyboardType="numeric"
                    value={hours}
                    onChangeText={setHours}
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                  />
                </View>

                <View style={styles.durationField}>
                  <Text style={styles.durationLabel}>Minutes</Text>

                  <TextInput
                    style={styles.durationInput}
                    keyboardType="numeric"
                    value={minutes}
                    onChangeText={setMinutes}
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                  />
                </View>
              </View>

              <Text style={styles.calculatedDuration}>
                Calculated Duration: {formatTime(actualDurationSeconds)}
              </Text>
            </>
          )}

          <Text style={styles.sectionTitle}>Session Notes (Optional)</Text>

          <TextInput
            style={styles.input}
            placeholder="What did you complete?"
            placeholderTextColor="#6b7280"
            value={accomplishment}
            onChangeText={setAccomplishment}
          />

          {isInvalidDuration && (
            <Text style={styles.errorText}>
              Actual focus time cannot exceed detected duration.
            </Text>
          )}

          {isZeroDuration && (
            <Text style={styles.errorText}>
              Actual focus time must be greater than zero.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              disableSave && styles.disabledSaveButton,
            ]}
            disabled={disableSave}
            onPress={handleSaveSession}
          >
            <Text style={styles.saveButtonText}>Save Session</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscardSession}
          >
            <Text style={styles.discardButtonText}>Discard Session</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
  },
  label: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
  },
  duration: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 32,
  },
  toggleContainer: {
    marginBottom: 32,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radio: {
    color: "#fff",
    fontSize: 22,
    marginRight: 12,
  },
  radioLabel: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  durationInputContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  durationField: {
    flex: 1,
  },
  durationLabel: {
    color: "#9ca3af",
    marginBottom: 8,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 18,
  },
  calculatedDuration: {
    color: "#fff",
    marginBottom: 24,
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 12,
    fontSize: 14,
  },
  disabledSaveButton: {
    backgroundColor: "#4b5563",
  },
  discardButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  discardButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
