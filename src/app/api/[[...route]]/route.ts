import { Hono } from "hono";
import { cors } from "hono/cors";
// import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { auth } from "~/lib/auth";

export const runtime = "nodejs";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

const app = new Hono().basePath("/api");
app.use(
  "*", // or replace with "*" to enable cors for all routes
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    ], // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
// enable cors
/* if (process.env.NODE_ENV !== "development") {
  app.use(
    "/api/auth/**", // or replace with "*" to enable cors for all routes
    cors({
      origin: [
        "http://localhost:3000",
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
      ], // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  );
} */

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Next.js!",
  });
});

app.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/.well-known/openid-configuration", async (c) => {
  return c.json({
    issuer: BASE_URL,
    jwks_uri: `${BASE_URL}/.well-known/jwks.json`,
    authorization_endpoiont: `${BASE_URL}/api/auth/oauth/authorize`,
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
