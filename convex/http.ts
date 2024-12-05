import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
const http = httpRouter();

const handleBetterAuthWebhook = httpAction(async (ctx, request) => {
  const { data, type } = await request.json();
  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        betterAuthId: data.id,
        name: data.name,
        email: data.email,
        imageUrl: data.image ?? "",
        phoneNumber: data.phoneNumber,
        emailVerified: data.emailVerified,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });

      break;
    case "user.deleted":
      break;
    default:
      break;
  }
  return new Response(null, { status: 200 });
});

http.route({
  path: "/better-auth",
  method: "POST",
  handler: handleBetterAuthWebhook,
});

export default http;
