import { betterAuth } from "better-auth";
import { bearer, jwt } from "better-auth/plugins";

import { LibsqlDialect } from "@libsql/kysely-libsql";

// const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//     : "http://localhost:3000";

export const auth = betterAuth({
  database: {
    dialect: new LibsqlDialect({
      url: process.env.TURSO_DATABASE_URL || "",
      authToken: process.env.TURSO_AUTH_TOKEN || "",
    }),
    type: "sqlite",
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
        defaultValue: "",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt({
      jwks: { keyPairConfig: { alg: "RS256" } },
      jwt: {
        audience: "convex",
        issuer: "https://betterauth-convex-nextjs.vercel.app",
        expirationTime: "1h",
      },
    }),
    bearer(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // save user to convex using webhook
          try {
            const response = await fetch(
              `${process.env.CONVEX_SITE_URL}/better-auth`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: user, type: "user.created" }),
              }
            );
            console.log("user saved to convex", response);
          } catch (e) {
            console.log(e);
          }
        },
      },
      update: {
        //TODO: update user in convex using webhook
      },
    },
  },
});
