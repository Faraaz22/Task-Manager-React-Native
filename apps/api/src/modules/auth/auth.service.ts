import { UserModel } from "./user.model";
import type { UserRecord } from "./auth.types";

const toRecord = (doc: any): UserRecord => ({
  id: String(doc._id),
  name: doc.name,
  email: doc.email,
  passwordHash: doc.passwordHash,
  createdAt: doc.createdAt,
});

export const authService = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? toRecord(doc) : null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const doc = await UserModel.findById(id);
    return doc ? toRecord(doc) : null;
  },

  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<UserRecord> {
    const doc = await UserModel.create(input);
    return toRecord(doc);
  },
};
