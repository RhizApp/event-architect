import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { EventAppConfig } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function createEventInDb(
  eventId: string,
  config: EventAppConfig,
  eventType: string,
  ownerId: string
) {
  try {
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      await db.insert(events).values({
        slug: eventId,
        name: config.content?.eventName || "Untitled Event",
        config: config as unknown as object, // cast for jsonb
        type: eventType, // Save the selected mode
        ownerId: ownerId,
        status: "draft",
        updatedAt: new Date(),
      });
      console.log("DB: Saved event", eventId);
      return true;
    }
  } catch (dbError) {
    console.error("DB: Failed to save event (non-fatal)", dbError);
    // Determine if we should throw or just log. Ideally throw if critical.
    // For now logging as non-fatal to match previous behavior, but usually DB save fail is fatal for creation flow.
    // Actually, let's rethrow so the UI knows it failed to persist.
    throw dbError;
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1);

    if (!result || result.length === 0) {
      return null;
    }

    // Cast config to correct type
    return {
      ...result[0],
      config: result[0].config as EventAppConfig,
    };
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export async function updateEventInDb(
  eventId: string,
  newConfig: EventAppConfig
) {
  await db
    .update(events)
    .set({
      config: newConfig as unknown as object, // cast for jsonb
      updatedAt: new Date(),
      name: newConfig.content?.eventName,
    })
    .where(eq(events.slug, eventId));
}
