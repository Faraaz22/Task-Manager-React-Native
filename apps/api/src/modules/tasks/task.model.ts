import { Schema, model, InferSchemaType, HydratedDocument, Types } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    completed: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, createdAt: -1 });

export type TaskDoc = HydratedDocument<InferSchemaType<typeof taskSchema>>;
export type TaskObjectId = Types.ObjectId;

export const TaskModel = model("Task", taskSchema);
