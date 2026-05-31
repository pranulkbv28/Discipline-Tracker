import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔥 Discipline Tracker</Text>

      <Text style={styles.metric}>Current Streak: 0 Days</Text>

      <Text style={styles.metric}>Today&apos;s Sessions: 0</Text>

      <TouchableOpacity
        onPress={() => router.push("/select-activity")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Start Session</Text>
      </TouchableOpacity>
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

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
