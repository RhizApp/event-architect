import { rhizClient } from "@/lib/rhizClient";
import { EventAppConfig } from "@/lib/types";

export async function syncEventToProtocol(
  eventId: string,
  config: EventAppConfig
) {
  // 1. Sync Attendees
  if (
    config.content?.sampleAttendees &&
    config.content.sampleAttendees.length > 0
  ) {
    try {
      const result = await rhizClient.ingestAttendees({
        eventId,
        attendees: config.content.sampleAttendees.map((a) => ({
          id: a.person_id,
          name: a.legal_name || a.preferred_name || "Unknown",
          email: a.emails?.[0],
          tags: a.tags,
          avatarUrl: a.imageFromUrl,
        })),
      });

      // Merge back handles
      config.content.sampleAttendees = config.content.sampleAttendees.map(
        (a) => {
          const synced = result.attendees.find((r) => r.id === a.person_id);
          if (synced) {
            return { ...a, handle: synced.handle, did: synced.did };
          }
          return a;
        }
      );
    } catch (err) {
      console.error("Rhiz: Failed to sync attendees", err);
    }
  }

  // 2. Sync Speakers
  if (config.content?.speakers) {
    try {
      const speakerAttendees = config.content.speakers.map((s) => ({
        id: s.handle,
        name: s.name,
        tags: ["Speaker", s.role],
      }));

      const result = await rhizClient.ingestAttendees({
        eventId,
        attendees: speakerAttendees,
      });

      result.attendees.forEach((r, i) => {
        if (
          config.content &&
          config.content.speakers &&
          config.content.speakers[i]
        ) {
          config.content.speakers[i].handle =
            r.handle || config.content.speakers[i].handle;
          config.content.speakers[i].did =
            r.did || config.content.speakers[i].did;
        }
      });
    } catch (err) {
      console.error("Rhiz: Failed to sync speakers", err);
    }
  }

  // 3. Sync Sessions
  if (config.content?.schedule) {
    await rhizClient.ingestSessions({
      eventId,
      sessions: config.content.schedule,
    });
  }
}
