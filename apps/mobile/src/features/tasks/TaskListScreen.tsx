import { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { Task } from "@task-tracker/shared";
import { extractErrorMessage } from "../../api/client";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { FilterBar } from "../../components/FilterBar";
import { TaskForm } from "../../components/TaskForm";
import { TaskItem } from "../../components/TaskItem";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useCreateTask } from "../../hooks/useCreateTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useTasks } from "../../hooks/useTasks";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import type { TasksFilter } from "../../api/tasks.api";

export function TaskListScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState<TasksFilter>("all");
  const tasksQuery = useTasks(filter);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const tasks = tasksQuery.data ?? [];
  const remaining = tasks.filter((t) => !t.completed).length;

  const onToggle = (task: Task) => {
    updateMutation.mutate(
      { id: task.id, input: { completed: !task.completed } },
      { onError: (err) => Alert.alert("Update failed", extractErrorMessage(err)) }
    );
  };

  const onDelete = (task: Task) => {
    const run = () =>
      deleteMutation.mutate(task.id, {
        onError: (err) =>
          Platform.OS === "web"
            ? window.alert(extractErrorMessage(err))
            : Alert.alert("Delete failed", extractErrorMessage(err)),
      });

    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${task.title}"?`)) run();
      return;
    }
    Alert.alert("Delete task", `Delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: run },
    ]);
  };

  const onPressItem = (task: Task) => {
    router.push(`/(app)/task/${task.id}`);
  };

  const onCreate = async (input: { title: string; description?: string }) => {
    await createMutation.mutateAsync(input);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            {user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Your tasks"}
          </Text>
          <Text style={styles.subtitle}>
            {tasksQuery.isLoading
              ? "Loading…"
              : remaining === 0
              ? "All done. Nice work."
              : `${remaining} task${remaining === 1 ? "" : "s"} to go`}
          </Text>
        </View>
        <Pressable
          onPress={logout}
          hitSlop={8}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.cardLabel}>New task</Text>
        <TaskForm onSubmit={onCreate} submitting={createMutation.isPending} />
      </View>

      <View style={styles.filterWrap}>
        <FilterBar value={filter} onChange={setFilter} />
      </View>

      {tasksQuery.isLoading ? (
        <Spinner />
      ) : tasksQuery.isError ? (
        <ErrorState
          message={extractErrorMessage(tasksQuery.error, "Failed to load tasks")}
          onRetry={() => tasksQuery.refetch()}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={onToggle}
              onDelete={onDelete}
              onPress={onPressItem}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl
              refreshing={tasksQuery.isRefetching}
              onRefresh={tasksQuery.refetch}
              tintColor="#4f46e5"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title={filter === "all" ? "No tasks yet" : "Nothing here"}
              message={
                filter === "all"
                  ? "Add your first task using the form above."
                  : "Try a different filter."
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 12,
  },
  greeting: { fontSize: 24, fontWeight: "700", color: "#111827", letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  logoutText: { color: "#374151", fontSize: 13, fontWeight: "600" },
  formCard: {
    margin: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  filterWrap: { paddingHorizontal: 20, paddingBottom: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
});
