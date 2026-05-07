import { Redirect } from "expo-router";
import { useAuth } from "../src/hooks/useAuth";
import { Spinner } from "../src/components/ui/Spinner";

export default function Index() {
  const { isHydrating, isAuthenticated } = useAuth();
  if (isHydrating) return <Spinner />;
  return <Redirect href={isAuthenticated ? "/(app)" : "/(auth)/login"} />;
}
