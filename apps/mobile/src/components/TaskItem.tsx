import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Task } from "@task-tracker/shared";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onPress?: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onPress }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        onPress={() => onToggle(task)}
        hitSlop={8}
        style={[styles.checkbox, task.completed && styles.checkboxDone]}
      >
        {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <Pressable
        onPress={onPress ? () => onPress(task) : undefined}
        style={({ pressed }) => [styles.content, pressed && { opacity: 0.6 }]}
      >
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          {new Date(task.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onDelete(task)}
        hitSlop={8}
        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
        accessibilityLabel="Delete task"
      >
        <Text style={styles.deleteIcon}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "700" },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600", color: "#111827" },
  titleDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  description: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  meta: { fontSize: 11, color: "#9ca3af", marginTop: 6 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: { color: "#dc2626", fontSize: 18, fontWeight: "700", lineHeight: 20 },
});
