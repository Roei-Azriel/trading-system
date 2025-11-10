/**
 * env.ts
 * Optionally validate and export environment variables.
 * Keep it simple for now; you can add Zod validation later.
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 8080),
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "change-me"
};
