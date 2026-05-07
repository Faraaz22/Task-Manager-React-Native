import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { extractErrorMessage } from "../../api/client";
import { TaskForm } from "../../components/TaskForm";
import { EmptyState } from "../../components/EmptyState";
import { useTask } from "../../hooks/useTask";
import { useUpdateTask } from "../../hooks/useUpdateTask";

export function TaskEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTask(id);
  const updateMutation = useUpdateTask();

  const onSubmit = async (input: { title: string; description?: string }) => {
    if (!id) return;
    await new Promise<void>((resolve, reject) => {
      updateMutation.mutate(
        { id, input },
        {
          onSuccess: () => {
            resolve();
            router.back();
          },
          onError: (err) => {
            Alert.alert("Update failed", extractErrorMessage(err));
            reject(err);
          },
        }
      );
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Edit task</Text>
        <View style={{ width: 56 }} />
      </View>

      <View style={styles.body}>
        {!task ? (
          <EmptyState
            title="Task not found"
            message="It may have been deleted. Pull to refresh on the list."
          />
        ) : (
          <View style={styles.card}>
            <TaskForm
              initialValues={{
                title: task.title,
                description: task.description,
              }}
              submitLabel="Save changes"
              submitting={updateMutation.isPending}
              resetOnSuccess={false}
              onSubmit={onSubmit}
            />
          </View>
        )}
      </View>
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
    paddingBottom: 12,
    justifyContent: "space-between",
  },
  back: { color: "#4f46e5", fontSize: 16, fontWeight: "600", width: 56 },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  body: { padding: 20, gap: 16 },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
