import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    return await ctx.db.insert("tasks", {
      userId,
      text: args.text,
      isCompleted: false,
    });
  },
});

export const toggleCompleted = mutation({
  args: {
    id: v.id("tasks"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return;
    }

    const task = await ctx.db.get(args.id);

    if (!task || task.userId !== userId) {
      return;
    }

    await ctx.db.patch(args.id, {
      isCompleted: args.isCompleted,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return;
    }

    const task = await ctx.db.get(args.id);

    if (!task || task.userId !== userId) {
      return;
    }

    await ctx.db.delete(args.id);
  },
});