"use server";

import { b as baml } from "@/lib/baml_client/baml_client";
import { EventAppConfig } from "@/lib/baml_client/baml_client/types";
import { rhizClient } from "@/lib/rhizClient";
import { Attendee } from "@/lib/types";
import { 
  BAMLGenerationError, 
  ValidationError,
  TimeoutError 
} from "@/lib/errors";
import { 
  retryWithBackoff, 
  withTimeout,
  logError
} from "@/lib/errorHandling";

/**
 * Generate event configuration with comprehensive error handling
 * Includes: validation, retry logic, timeout protection, and typed errors
 */
export async function generateEventConfig(formData: FormData) {
  // Extract and validate form data
  const eventBasics = (formData.get("eventBasics") as string) || "";
  const eventDate = (formData.get("eventDate") as string) || "";
  const eventLocation = (formData.get("eventLocation") as string) || "";
  const goalsStr = (formData.get("goals") as string) || "";
  const goals = goalsStr.split(",").map(s => s.trim()).filter(Boolean);
  const audience = (formData.get("audience") as string) || "General Audience";
  const relationshipIntent = (formData.get("relationshipIntent") as string) || "medium";
  const sessionShape = (formData.get("sessionShape") as string) || "standard";
  const matchmakingAppetite = (formData.get("matchmakingAppetite") as string) || "high";
  const tools = (formData.get("tools") as string) || "standard";
  const tone = (formData.get("tone") as string) || "professional";

  // Validate required fields
  if (!eventBasics || eventBasics.length < 10) {
    throw new ValidationError(
      "Event description must be at least 10 characters",
      "eventBasics",
      eventBasics
    );
  }

  if (!eventDate) {
    throw new ValidationError(
      "Event date is required",
      "eventDate"
    );
  }

  if (!eventLocation) {
    throw new ValidationError(
      "Event location is required",
      "eventLocation"
    );
  }

  if (goals.length === 0) {
    throw new ValidationError(
      "At least one goal is required",
      "goals"
    );
  }

  console.log("Generating config with inputs:", { 
    eventBasics: eventBasics.substring(0, 50) + "...", 
    eventDate, 
    eventLocation, 
    goals, 
    audience, 
    relationshipIntent, 
    tone 
  });

  try {
    // Wrap BAML call with retry logic and timeout
    const config = await retryWithBackoff<EventAppConfig>(
      async () => {
        // 30 second timeout for BAML generation
        return await withTimeout(
          baml.GenerateEventAppConfig(
            eventBasics,
            eventDate,
            eventLocation,
            goals,
            audience,
            relationshipIntent,
            sessionShape,
            matchmakingAppetite,
            tools,
            tone
          ),
          30000, // 30s timeout
          "Event generation took too long. Please try again."
        );
      },
      {
        maxRetries: 3,
        initialDelayMs: 1000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt}/3 after error:`, error.message);
          logError(error, { 
            attempt, 
            action: 'generateEventConfig',
            eventBasics: eventBasics.substring(0, 100)
          });
        }
      }
    );

    // Generate a stable event ID
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log("Successfully generated event config. Event ID:", eventId);

    // Sync with Rhiz Protocol
    const syncPromises: Promise<void>[] = [];

    // 1. Sync Sample Attendees
    if (config.content?.sampleAttendees) {
      const attendeePromises = config.content.sampleAttendees.map(async (a, idx) => {
        // Assign stable ID if missing
        if (!a.id) a.id = `attendee_${idx}_${Date.now()}`;
        
        const email = `${a.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        
        try {
          const identity = await rhizClient.ensureIdentity({
            email,
            name: a.name,
            externalUserId: a.id
          });
          
          // Update object with handle & did (cast to any to bypass strict BAML types)
          if (identity.handle) (a as any).handle = identity.handle;
          if (identity.did) (a as any).did = identity.did;
          (a as any).rhizId = identity.id;
          
        } catch (e) {
          console.warn(`Failed to sync attendee ${a.name}`, e);
        }
      });
      syncPromises.push(...attendeePromises);
    }

    // 2. Sync Speakers (so they have identities in the graph)
    if (config.content?.speakers) {
      const speakerPromises = config.content.speakers.map(async (s, idx) => {
        const email = `${s.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        
        try {
          const identity = await rhizClient.ensureIdentity({
             email,
             name: s.name,
             externalUserId: `speaker_${idx}`
          });
          
          if (identity.handle) (s as any).handle = identity.handle;
          if (identity.did) (s as any).did = identity.did;
          
        } catch (e) {
          console.warn(`Failed to sync speaker ${s.name}`, e);
        }
      });
      syncPromises.push(...speakerPromises);
    }

    // Wait for all sync operations to complete
    if (syncPromises.length > 0) {
      console.log(`Rhiz: Syncing ${syncPromises.length} identities...`);
      await Promise.all(syncPromises);
      console.log("Rhiz: Sync complete");
    }
    
    // enhance config with metadata
    // We cast to any to avoid strict BAML type checks preventing the extra property
    return { ...config, eventId } as EventAppConfig & { eventId: string };

  } catch (error: unknown) {
    // Log detailed error information
    logError(error instanceof Error ? error : new Error(String(error)), {
      action: 'generateEventConfig',
      inputs: { eventBasics: eventBasics.substring(0, 100), eventDate, eventLocation }
    });

    // Convert to typed error if needed
    if (error instanceof ValidationError || 
        error instanceof TimeoutError || 
        error instanceof BAMLGenerationError) {
      throw error;
    }

    // Wrap unknown errors in BAMLGenerationError
    throw new BAMLGenerationError(
      "Failed to generate event configuration",
      error instanceof Error ? error : new Error(String(error)),
      { eventBasics: eventBasics.substring(0, 100) }
    );
  }
}

/**
 * Update existing event configuration (for live edit mode)
 */
export async function updateEventConfig(
  eventId: string,
  updates: Partial<EventAppConfig>
) {
  // TODO: Implement when adding data persistence
  console.log("Update event config:", eventId, updates);
  throw new Error("Not yet implemented");
}
