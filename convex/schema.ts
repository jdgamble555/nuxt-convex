import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    userId: v.id("users"),
    text: v.string(),
    isCompleted: v.boolean(),
  }).index("by_user", ["userId"]),
});