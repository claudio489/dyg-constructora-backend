import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;

export function getDb() {
  if (!instance && env.databaseUrl) {
    try {
      instance = drizzle(env.databaseUrl, {
        schema: fullSchema,
      });
    } catch (e) {
      console.error("[DB] Failed to connect:", e);
      instance = null;
    }
  }
  return instance;
}

export function isDbAvailable(): boolean {
  return !!env.databaseUrl && !!instance;
}
