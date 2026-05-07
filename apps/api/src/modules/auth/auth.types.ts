import type { AuthResponse, User } from "@task-tracker/shared";

export type { AuthResponse, User };

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
