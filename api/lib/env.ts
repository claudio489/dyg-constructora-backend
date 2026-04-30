import "dotenv/config";

function get(name: string, defaultValue?: string): string {
  return process.env[name] ?? defaultValue ?? "";
}

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    console.warn(`[env] Missing ${name} — some features may not work`);
  }
  return value ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  mpTicket: get("MP_TICKET"),
  kimiApiKey: get("KIMI_API_KEY"),
  port: parseInt(get("PORT", "10000"), 10),
};
