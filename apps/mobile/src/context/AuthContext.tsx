import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginInput, SignupInput, User } from "@task-tracker/shared";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "../lib/storage";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const stored = await tokenStorage.get();
      if (stored) setToken(stored);
      setIsHydrating(false);
    })();
  }, []);

  const applySession = async (next: { user: User; token: string }) => {
    await tokenStorage.set(next.token);
    setToken(next.token);
    setUser(next.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isHydrating,
      isAuthenticated: Boolean(token),
      login: async (input) => {
        const res = await authApi.login(input);
        await applySession(res);
      },
      signup: async (input) => {
        const res = await authApi.signup(input);
        await applySession(res);
      },
      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // proceed with local cleanup even if server call fails
        }
        await tokenStorage.remove();
        setToken(null);
        setUser(null);
        queryClient.clear();
      },
    }),
    [user, token, isHydrating, queryClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
