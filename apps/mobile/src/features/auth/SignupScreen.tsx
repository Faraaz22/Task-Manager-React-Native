import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { signupSchema } from "@task-tracker/shared";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { extractErrorMessage } from "../../api/client";

export function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const parsed = signupSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({
        name: f.name?.[0],
        email: f.email?.[0],
        password: f.password?.[0],
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await signup(parsed.data);
      router.replace("/(app)");
    } catch (err) {
      Alert.alert("Sign up failed", extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>✓</Text>
          </View>
          <Text style={styles.brandName}>Task Tracker</Text>
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start tracking your tasks</Text>

        <View style={styles.form}>
          <Input label="Name" value={name} onChangeText={setName} error={errors.name} placeholder="Jane Doe" autoCapitalize="words" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            placeholder="At least 6 characters"
          />
          <Button title="Sign up" onPress={onSubmit} loading={submitting} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" style={styles.link}>
            Log in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  brand: { alignItems: "center", marginBottom: 32, gap: 8 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  brandName: { fontSize: 14, fontWeight: "600", color: "#6b7280", letterSpacing: 0.4 },
  title: { fontSize: 28, fontWeight: "700", color: "#111827", letterSpacing: -0.4 },
  subtitle: { fontSize: 15, color: "#6b7280", marginTop: 4, marginBottom: 24 },
  form: { gap: 14 },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 24 },
  footerText: { color: "#6b7280" },
  link: { color: "#4f46e5", fontWeight: "600" },
});
