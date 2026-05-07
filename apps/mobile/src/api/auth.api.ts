import type {
  AuthResponse,
  LoginInput,
  SignupInput,
} from "@task-tracker/shared";
import { apiClient } from "./client";

export const authApi = {
  signup: async (input: SignupInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/signup", input);
    return data;
  },
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", input);
    return data;
  },
};
