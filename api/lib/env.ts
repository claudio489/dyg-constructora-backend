import "dotenv/config";

function get(name: string, defaultValue?: string): string {
  return process.env[name] ?? defaultValue ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: get("DATABASE_URL"),
  mpTicket: get("MP_TICKET"),
  kimiApiKey: get("KIMI_API_KEY"),
  port: parseInt(get("PORT", "10000"), 10),
};
