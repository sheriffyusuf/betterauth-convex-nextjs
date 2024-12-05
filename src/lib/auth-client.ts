import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "https://betterauth-convex-nextjs.vercel.app",
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signUp, signIn, signOut, useSession, getSession } = authClient;
