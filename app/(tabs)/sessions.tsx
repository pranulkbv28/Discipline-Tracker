import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyles}>SessionScreen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textStyles: {
    color: "#ffffff",
    backgroundColor: "red",
    width: "100%",
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
