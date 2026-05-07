import { StyleSheet, Text, View } from "react-native";
import { Button } from "./ui/Button";

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title="Retry" onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 24, gap: 8, alignItems: "center" },
  title: { fontSize: 16, fontWeight: "600", color: "#dc2626" },
  message: { fontSize: 13, color: "#6b7280", textAlign: "center" },
});
