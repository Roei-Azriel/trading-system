export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 30004),
  DATABASE_URL: process.env.DATABASE_URL || "",
};
