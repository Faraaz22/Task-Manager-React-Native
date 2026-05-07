import type { SignupInput, AuthResponse } from "@task-tracker/shared";
import { AppError } from "../../../utils/AppError";
import { hashPassword } from "../../../utils/hash";
import { signToken } from "../../../utils/jwt";
import { authService } from "../auth.service";

export async function signupUseCase(input: SignupInput): Promise<AuthResponse> {
  const existing = await authService.findByEmail(input.email);
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await authService.createUser({
    name: input.name,
    email: input.email,
    passwordHash,
  });

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
