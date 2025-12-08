import { RhizClient, InteractionCreate, PeopleClient, PersonCreate, NlpClient } from "./protocol-sdk";
import { RelationshipDetail, OpportunityMatch } from "./protocol-sdk/types";
import { Session } from "./types";
import { withTimeout } from "./errorHandling";

// Initialize the Rhiz Protocol Client
const baseUrl = process.env.NEXT_PUBLIC_RHIZ_API_URL || "http://localhost:8000";
const getAccessToken = async () => process.env.RHIZ_API_TOKEN || null;
export const ownerId = process.env.RHIZ_OWNER_ID || "event-maker-app";

export const client = new RhizClient({
  baseUrl,
  getAccessToken,
});

// Initialize People Client for identity management
export const peopleClient = new PeopleClient({
  baseUrl,
  getAccessToken,
});

// Initialize NLP Client for intelligence
export const nlpClient = new NlpClient({
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
    tags?: string[];
  }): Promise<{ id: string; externalUserId?: string; did?: string; handle?: string }> => {
    try {
      // Try to find existing person by email if provided
      if (args.email) {
        try {
          const existingPeople = await withTimeout(
            peopleClient.listPeople({
              owner_id: ownerId,
              email: args.email,
              limit: 1,
            }),
            3000,
            "Identity search timed out"
          );
          
          if (existingPeople.people.length > 0) {
            const person = existingPeople.people[0];
            console.log("Rhiz: Found existing person", person.person_id);
            return {
              id: person.person_id,
              externalUserId: args.externalUserId,
              did: person.did,
              handle: person.handle,
            };
          }
        } catch (searchError) {
          // If search fails, continue to create new person
          console.warn("Rhiz: Failed to search for existing person (or timed out)", searchError);
        }
      }

      // Create new person
      const personData: PersonCreate = {
        owner_id: ownerId,
        legal_name: args.name || args.email || "Anonymous User",
        preferred_name: args.name,
        emails: args.email ? [args.email] : [],
        tags: args.tags || [],
      };

      const person = await withTimeout(
        peopleClient.createPerson(personData),
        5000,
        "Identity creation timed out"
      );
      
      console.log("Rhiz: Created new person", person.person_id);
      
      return {
        id: person.person_id,
        externalUserId: args.externalUserId,
        did: person.did,
        handle: person.handle,
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

      await withTimeout(client.logInteraction(payload), 2000).catch(() => {});
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
  }): Promise<RelationshipDetail[]> => {
    try {
      // Get relationships sorted by strength
      const response = await withTimeout(
        client.listRelationships({
          owner_id: ownerId,
          source_person_id: args.identityId,
          limit: args.limit || 10,
          sort_by: "strength_score",
          sort_order: "desc",
          min_strength: 0.2, // Only show meaningful relationships
        }),
        5000,
        "Relationship fetch timed out"
      );
      
      // Return the relationships directly as Protocol Types
      // We perform a cast here because the SDK currently returns RelationshipRead[] 
      // but in a real scenario we'd query the detail endpoint or enrich it.
      // For now, we'll map what we have to RelationshipDetail structure
      
      return response.relationships.map(rel => ({
        ...rel,
        interaction_count: rel.frequency_score * 10, // Mock derivation
        latest_interaction_at: rel.last_interaction_at
      } as RelationshipDetail));
    } catch (error) {
      console.warn("Rhiz: Failed to get connection suggestions", error);
      return []; // Graceful degradation
    }
  },

  /**
   * Get potential matches (opportunities) for people you haven't met yet.
   * Uses NlpClient.suggestIntroduction under the hood.
   */
  getOpportunityMatches: async (args: {
    eventId: string;
    identityId: string;
    limit?: number;
  }): Promise<OpportunityMatch[]> => {
    try {
      // Delegate to the Protocol's NLP Engine
      return await withTimeout(
        nlpClient.findOpportunityMatches({
          personId: args.identityId,
          limit: args.limit
        }),
        5000,
        "Opportunity match fetch timed out"
      );
    } catch (error) {
      console.warn("Rhiz: Failed to get opportunity matches", error);
      return [];
    }
  },

  /**
   * Bulk ingest attendees into Rhiz Protocol
   * Creates people records for all attendees and returns their identities (including handles/DIDs)
   */
  ingestAttendees: async (args: {
    eventId: string;
    attendees: { id?: string; name: string; email?: string; tags?: string[] }[];
  }): Promise<{ created: number; failed: number; attendees: { id: string; externalUserId?: string; did?: string; handle?: string }[] }> => {
    try {
      console.log(`Rhiz: Ingesting ${args.attendees.length} attendees`);
      
      // Process in parallel using ensureIdentity to guarantee we get the full objects back
      // Using Promise.all can be heavy if array is huge, but for event sample (~20-50) it's fine.
      // We don't wrap the *entire* batch in a timeout, but rely on individual ensureIdentity timeouts.
      
      const promises = args.attendees.map(attendee => 
        rhizClient.ensureIdentity({
          name: attendee.name,
          email: attendee.email,
          tags: attendee.tags,
          externalUserId: attendee.id 
        })
      );

      const results = await Promise.all(promises);
      
      const successful = results.filter(r => !r.id.startsWith("local_"));
      const failed = results.filter(r => r.id.startsWith("local_"));

      console.log(`Rhiz: Successfully synced ${successful.length} people`);

      return {
        created: successful.length,
        failed: failed.length,
        attendees: results,
      };
    } catch (error) {
      console.warn("Rhiz: Failed to ingest attendees", error);
      return {
        created: 0,
        failed: args.attendees.length,
        attendees: [],
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
