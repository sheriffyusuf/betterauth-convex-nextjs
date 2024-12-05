import { v } from "convex/values";

import { internalMutation, query, QueryCtx } from "./_generated/server";

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    console.log("no identity");
    return null;
  }
  return identity;
}

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const createUser = internalMutation({
  args: {
    betterAuthId: v.string(),
    email: v.string(),
    name: v.string(),
    phoneNumber: v.string(),
    emailVerified: v.boolean(),
    imageUrl: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", args);
    return userId;
  },
});
