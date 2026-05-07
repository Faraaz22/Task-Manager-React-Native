import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#374151" },
  message: { fontSize: 13, color: "#6b7280", textAlign: "center" },
});
