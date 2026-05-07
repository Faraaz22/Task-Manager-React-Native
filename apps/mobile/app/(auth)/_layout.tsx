import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { Spinner } from "../../src/components/ui/Spinner";

export default function AuthLayout() {
  const { isHydrating, isAuthenticated } = useAuth();
  if (isHydrating) return <Spinner />;
  if (isAuthenticated) return <Redirect href="/(app)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
