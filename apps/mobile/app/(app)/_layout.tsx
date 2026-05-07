import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { Spinner } from "../../src/components/ui/Spinner";

export default function AppLayout() {
  const { isHydrating, isAuthenticated } = useAuth();
  if (isHydrating) return <Spinner />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
