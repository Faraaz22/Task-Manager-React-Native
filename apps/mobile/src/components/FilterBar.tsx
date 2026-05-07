import { Pressable, StyleSheet, Text, View } from "react-native";
import type { TasksFilter } from "../api/tasks.api";

interface Props {
  value: TasksFilter;
  onChange: (next: TasksFilter) => void;
}

const OPTIONS: { value: TasksFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function FilterBar({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  pillActive: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  text: { color: "#374151", fontSize: 13, fontWeight: "500" },
  textActive: { color: "#fff" },
});
