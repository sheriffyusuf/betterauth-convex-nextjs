import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const user = {
  betterAuthId: v.string(),
  name: v.string(),
  email: v.string(),
  phoneNumber: v.string(),
  emailVerified: v.boolean(),
  imageUrl: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
};

export default defineSchema({
  users: defineTable(user),
});
