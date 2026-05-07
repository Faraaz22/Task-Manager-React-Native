import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

const webStorage = {
  get: async (key: string) =>
    typeof window !== "undefined" ? window.localStorage.getItem(key) : null,
  set: async (key: string, value: string) => {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  remove: async (key: string) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

const nativeStorage = {
  get: (key: string) => SecureStore.getItemAsync(key),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
};

const backend = Platform.OS === "web" ? webStorage : nativeStorage;

export const tokenStorage = {
  get: () => backend.get(TOKEN_KEY),
  set: (token: string) => backend.set(TOKEN_KEY, token),
  remove: () => backend.remove(TOKEN_KEY),
};
