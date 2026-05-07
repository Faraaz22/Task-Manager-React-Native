import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { createTaskSchema } from "@task-tracker/shared";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface Props {
  onSubmit: (input: { title: string; description?: string }) => Promise<void> | void;
  submitting?: boolean;
  initialValues?: { title?: string; description?: string };
  submitLabel?: string;
  resetOnSuccess?: boolean;
}

export function TaskForm({
  onSubmit,
  submitting,
  initialValues,
  submitLabel = "Add task",
  resetOnSuccess = true,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [error, setError] = useState<string | undefined>();

  const handle = async () => {
    const parsed = createTaskSchema.safeParse({
      title,
      description: description || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.title?.[0] ?? "Invalid input");
      return;
    }
    setError(undefined);
    try {
      await onSubmit(parsed.data);
      if (resetOnSuccess) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      Alert.alert(
        "Couldn't save task",
        err instanceof Error ? err.message : "Try again"
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChangeText={setTitle}
        error={error}
        autoCapitalize="sentences"
      />
      <Input
        placeholder="Add a note (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        autoCapitalize="sentences"
        style={styles.multiline}
      />
      <Button title={submitLabel} onPress={handle} loading={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  multiline: { minHeight: 72, textAlignVertical: "top" },
});
