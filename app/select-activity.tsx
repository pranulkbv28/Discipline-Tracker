import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
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

export default function SelectActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol size={28} name="chevron.left" color={"white"} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Activity</Text>
      </View>

      {activities.map((activity) => (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/active-session", params: { activity } })
          }
          key={activity}
          style={styles.activityButton}
        >
          <Text style={styles.activityText}>{activity}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButton: {
    marginRight: 26,
    padding: 12,
    backgroundColor: "#1f29378d",
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  activityButton: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#1f2937",
  },
  activityText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
