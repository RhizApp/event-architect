import { RhizClient, InteractionCreate, PeopleClient, PersonCreate } from "./protocol-sdk";
import { Attendee, ConnectionSuggestion, Session } from "./types";

// Initialize the Rhiz Protocol Client
const baseUrl = process.env.NEXT_PUBLIC_RHIZ_API_URL || "http://localhost:8000";
const getAccessToken = async () => process.env.RHIZ_API_TOKEN || null;
const ownerId = process.env.RHIZ_OWNER_ID || "event-maker-app";

export const client = new RhizClient({
  baseUrl,
  getAccessToken,
});

// Initialize People Client for identity management
export const peopleClient = new PeopleClient({
  baseUrl,
  getAccessToken,
});

export const rhizClient = {
  /**
   * Ensure a person exists in Rhiz Protocol
   * Creates a new person or returns existing one based on email
   */
  ensureIdentity: async (args: {
    externalUserId?: string;
    email?: string;
    name?: string;
  }): Promise<{ id: string; externalUserId?: string; did?: string }> => {
    try {
      // Try to find existing person by email if provided
      if (args.email) {
        try {
          const existingPeople = await peopleClient.listPeople({
            owner_id: ownerId,
            email: args.email,
            limit: 1,
          });
          
          if (existingPeople.people.length > 0) {
            const person = existingPeople.people[0];
            console.log("Rhiz: Found existing person", person.person_id);
            return {
              id: person.person_id,
              externalUserId: args.externalUserId,
              did: person.did,
            };
          }
        } catch (searchError) {
          // If search fails, continue to create new person
          console.warn("Rhiz: Failed to search for existing person", searchError);
        }
      }

      // Create new person
      const personData: PersonCreate = {
        owner_id: ownerId,
        legal_name: args.name || args.email || "Anonymous User",
        preferred_name: args.name,
        emails: args.email ? [args.email] : [],
      };

      const person = await peopleClient.createPerson(personData);
      console.log("Rhiz: Created new person", person.person_id);
      
      return {
        id: person.person_id,
        externalUserId: args.externalUserId,
        did: person.did,
      };
    } catch (error) {
      console.warn("Rhiz: Failed to ensure identity, using fallback", error);
      // Fallback to local ID if API is unavailable
      return {
        id: "local_" + Math.random().toString(36).substring(7),
        externalUserId: args.externalUserId,
      };
    }
  },

  recordInteraction: async (args: {
    eventId: string;
    fromIdentityId: string;
    toIdentityId?: string;
    type: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> => {
    try {
      const payload: InteractionCreate = {
        owner_id: args.eventId, // Using eventId as owner for context
        actor_person_id: args.fromIdentityId,
        partner_person_id: args.toIdentityId,
        timestamp: new Date().toISOString(),
        summary: `Interaction type: ${args.type}`,
        context_tags: ["event_interaction", args.type],
        // outcome_tag: args.metadata?.outcome as string,
      };

      await client.logInteraction(payload);
    } catch (error) {
      console.warn("Failed to log interaction to Rhiz Protocol:", error);
      // Don't throw, just log warning so app doesn't crash
    }
  },

  /**
   * Get suggested connections with rich relationship data
   * Returns people with strongest relationships first
   */
  getSuggestedConnections: async (args: {
    eventId: string;
    identityId: string;
    limit?: number;
  }): Promise<ConnectionSuggestion[]> => {
    try {
      // Get relationships sorted by strength
      const response = await client.listRelationships({
        owner_id: ownerId,
        source_person_id: args.identityId,
        limit: args.limit || 10,
        sort_by: "strength_score",
        sort_order: "desc",
        min_strength: 0.2, // Only show meaningful relationships
      });
      
      // Map to ConnectionSuggestion with rich data
      return response.relationships.map(rel => {
        // Generate reason based on strength score
        let reasonSummary = "New connection";
        if (rel.strength_score >= 0.7) {
          reasonSummary = "Strong existing relationship";
        } else if (rel.strength_score >= 0.4) {
          reasonSummary = "Moderate connection with growth potential";
        } else if (rel.strength_score >= 0.2) {
          reasonSummary = "Emerging connection";
        }

        // Add interaction context if available
        if (rel.interaction_count > 10) {
          reasonSummary += ` (${rel.interaction_count} interactions)`;
        }

        return {
          targetAttendeeId: rel.target_person_id,
          score: rel.strength_score,
          reasonSummary,
          sharedTags: [], // Could be populated from relationship metadata
          sharedIntents: [], // Could be populated from context tags
          talkingPoints: rel.latest_interaction_at 
            ? [`Last interaction: ${new Date(rel.latest_interaction_at).toLocaleDateString()}`]
            : [],
        };
      });
    } catch (error) {
      console.warn("Rhiz: Failed to get connection suggestions", error);
      return []; // Graceful degradation
    }
  },

  /**
   * Bulk ingest attendees into Rhiz Protocol
   * Creates people records for all attendees
   */
  ingestAttendees: async (args: {
    eventId: string;
    attendees: Attendee[];
  }): Promise<{ created: number; failed: number; personIds: string[] }> => {
    try {
      console.log(`Rhiz: Ingesting ${args.attendees.length} attendees`);
      
      // Convert attendees to PersonCreate format
      const peopleData: PersonCreate[] = args.attendees.map(attendee => ({
        owner_id: ownerId,
        legal_name: attendee.name,
        preferred_name: attendee.name,
        emails: attendee.email ? [attendee.email] : [],
        tags: attendee.tags || [],
      }));

      // Use bulk create API
      const result = await peopleClient.bulkCreatePeople(peopleData);
      
      console.log(`Rhiz: Successfully created ${result.count} people`);
      if (result.errors && result.errors.length > 0) {
        console.warn(`Rhiz: ${result.errors.length} attendees failed to create`);
      }

      return {
        created: result.count,
        failed: result.skipped + result.errors.length,
        personIds: result.ids,
      };
    } catch (error) {
      console.warn("Rhiz: Failed to ingest attendees", error);
      return {
        created: 0,
        failed: args.attendees.length,
        personIds: [],
      };
    }
  },

  ingestSessions: async (args: {
    eventId: string;
    sessions: Session[];
  }): Promise<void> => {
    console.log("Rhiz: ingestSessions", args);
    // TODO: Map sessions to Context Tags or Goals
  },
};
