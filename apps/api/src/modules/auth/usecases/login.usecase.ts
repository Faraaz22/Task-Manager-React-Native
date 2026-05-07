import type { LoginInput, AuthResponse } from "@task-tracker/shared";
import { AppError } from "../../../utils/AppError";
import { comparePassword } from "../../../utils/hash";
import { signToken } from "../../../utils/jwt";
import { authService } from "../auth.service";

export async function loginUseCase(input: LoginInput): Promise<AuthResponse> {
  const user = await authService.findByEmail(input.email);
  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = signToken({ sub: user.id });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  };
}
