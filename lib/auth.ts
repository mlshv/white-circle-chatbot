import "server-only";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user } from "./db/schema";

const ANON_USER_ID = "00000000-0000-0000-0000-000000000000";
const ANON_EMAIL = "anonymous@local";

export type UserType = "regular";

export type AnonymousSession = {
  user: {
    id: string;
    email: string;
    type: UserType;
  };
  expires: string;
};

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

let ensured = false;

async function ensureAnonymousUser() {
  if (ensured) return;
  try {
    const rows = await db
      .select()
      .from(user)
      .where(eq(user.id, ANON_USER_ID))
      .limit(1);
    if (rows.length === 0) {
      await db.insert(user).values({
        id: ANON_USER_ID,
        email: ANON_EMAIL,
        password: null,
      });
    }
    ensured = true;
  } catch (error) {
    console.error("Failed to ensure anonymous user:", error);
    throw error;
  }
}

export async function getAnonymousSession(): Promise<AnonymousSession> {
  await ensureAnonymousUser();
  return {
    user: {
      id: ANON_USER_ID,
      email: ANON_EMAIL,
      type: "regular",
    },
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
