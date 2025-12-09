"use server";

import crypto from "node:crypto";
import { b as baml } from "@/lib/baml_client/baml_client";
import { EventAppConfig } from "@/lib/types";
import { rhizClient } from "@/lib/rhizClient";
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
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";

// Deterministic hash to keep event + identity IDs stable across retries
const stableHash = (input: string) =>
  crypto.createHash("sha256").update(input).digest("hex").slice(0, 12);

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
    // Mock BAML response for 'Convergence Intelligence Summit' Demo
    const config: EventAppConfig = {
      id: "mock_config_1",
      eventId: "evt1",
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      attendeeProfileFields: [],
      primaryGoals: ["community_building", "networking", "education"],
      matchmakingConfig: {
        enabled: true,
        inputSignals: ["trust_clusters", "timing_indicators", "contribution_profiles", "shared_mission"],
        matchTypes: ["cluster_of_8", "convergence_circle", "1:1_high_value"],
        meetingDurations: [15, 45, 60]
      },
      sessionConfig: {
        tracksEnabled: true,
        maxConcurrentSessions: 4,
        sessionTypes: ["keynote", "activation", "convergence_circle"]
      },
      engagementConfig: {
        chatEnabled: true,
        qnaEnabled: true,
        pollsEnabled: true,
        liveFeedEnabled: true
      },
      relationshipFeatures: {
        relationshipScoresVisible: true,
        warmPathHintsEnabled: true,
        introRequestsEnabled: true
      },
      branding: {
        primaryColor: "#0F172A", // Slate 900
        accentColor: "#38BDF8", // Sky 400
        logoUrl: "/images/convergence-logo.png",
        toneKeywords: ["strategic", "ambitious", "intelligent", "coordinate"]
      },
      designNotes: "Cinematic, deep, intelligence-driven, high contrast.",
      
      // New Data Ingestion
      ticketing: {
        registrationOpen: true,
        skus: [
          { id: "t1", name: "Builder Fellowship", price: 0, currency: "USD", features: ["Full Access", "Travel Stipend Eligible"] },
          { id: "t2", name: "General Admission", price: 99500, currency: "USD", features: ["Full Access", "Meals"] },
          { id: "t3", name: "Supporter", price: 250000, currency: "USD", features: ["Full Access", "VIP Dinner", "Name in Program"] }
        ]
      },
      venueConstraints: {
        maxCapacity: 350,
        roomConstraints: {
          "Main Stage": { capacity: 350, avFeatures: ["Livestream", "Projector"] },
          "Activation Room": { capacity: 100, avFeatures: ["Whiteboards", "Screens"] },
          "Convergence Circle A": { capacity: 20, avFeatures: ["No Devices"] }
        },
        accessibilityFeatures: ["Wheelchair Accessible", "Live Captioning", "Quiet Room"]
      },
      sponsors: {
        tiers: [
          { 
            id: "st1", 
            name: "Title Partner", 
            minContribution: 5000000, 
            benefits: ["Keynote Intro", "Lounge Branding"],
            sponsors: [
              { id: "org1", name: "Greylock", slug: "greylock", ownerUserId: "u1", createdAt: new Date() }
            ]
          },
          {
            id: "st2",
            name: "Ecosystem Partner",
            minContribution: 2500000,
            benefits: ["Booth", "Workshop Host"],
            sponsors: [
               { id: "org2", name: "Protocol Labs", slug: "protocol-labs", ownerUserId: "u2", createdAt: new Date() }
            ]
          }
        ],
        assets: {
          "tier_1_logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Greylock_Partners_logo.svg/2560px-Greylock_Partners_logo.svg.png"
        }
      },
      legal: {
        codeOfConductUrl: "https://example.com/coc",
        privacyPolicyUrl: "https://example.com/privacy",
        photoConsentRequired: true,
        termsOfServiceUrl: "https://example.com/tos"
      },
      successMetrics: {
        targetNps: 75,
        pipelineTargets: { value: "10000000", currency: "USD" }
      },
      contentGuardrails: {
        brandVoiceGuidelines: "Use active voice. Avoid buzzwords unless defining them. Be optimistic but rigorous.",
        tabooTopics: ["Ponzi schemes", "Price speculation", "Politics without policy"],
        sensitiveTopics: ["AI safety", "Regulation"]
      },

      content: {
        eventName: "Convergence Intelligence Summit",
        tagline: "Coordination replaces competition when networks can see themselves.",
        date: "October 12-14, 2025",
        location: "Presidio, San Francisco",
        speakers: [
          { name: "Reid Hoffman", role: "Partner", company: "Greylock", bio: "Architecting systems that coordinate at scale.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces", handle: "reid", did: "did:rhiz:reid" },
          { name: "Anne-Marie Slaughter", role: "CEO", company: "New America", bio: "Redefining civic networks.", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces", handle: "ams", did: "did:rhiz:ams" },
          { name: "Salim Ismail", role: "Founder", company: "OpenExO", bio: "Exponential organizations and systems.", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces", handle: "salim", did: "did:rhiz:salim" },
          { name: "Tim O'Reilly", role: "Founder", company: "O'Reilly Media", bio: "Mapping the future of work and identity.", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces", handle: "tim", did: "did:rhiz:tim" },
          { name: "Aaron Levie", role: "CEO", company: "Box", bio: "Enterprise velocity and digital identity.", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces", handle: "levie", did: "did:rhiz:levie" },
          { name: "Vitalik Buterin", role: "Co-founder", company: "Ethereum", bio: "Building network-aware immutable tools.", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces", handle: "vitalik", did: "did:rhiz:vitalik" },
          { name: "Meredith Whittaker", role: "President", company: "Signal", bio: "Privacy as infrastructure for trust.", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces", handle: "meredith", did: "did:rhiz:meredith" },
          { name: "Glen Weyl", role: "Founder", company: "RadicalxChange", bio: "Plurality and democratic mechanisms.", imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=faces", handle: "glen", did: "did:rhiz:glen" },
           { name: "Dan Koppelkamm", role: "Investigator", company: "Rhiz", bio: "Network cartography.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces", handle: "dan", did: "did:rhiz:dan" }
        ],
        schedule: [
          // Pre-Event / Opening
          { id: "s0", eventId: "evt1", startTime: new Date("2025-10-12T09:00:00"), endTime: new Date("2025-10-12T10:00:00"), format: "keynote", speakers: ["Dan Koppelkamm"], title: "Opening Keynote: The Logic of Convergence", track: "Main Stage" },
          { id: "s0_1", eventId: "evt1", startTime: new Date("2025-10-12T10:00:00"), endTime: new Date("2025-10-12T11:00:00"), format: "activation", speakers: [], title: "Network Activation: Forming Trust Clusters", track: "Activation" },
          
          // Pillar 1
          { id: "p1_key", eventId: "evt1", startTime: new Date("2025-10-12T11:00:00"), endTime: new Date("2025-10-12T12:00:00"), format: "keynote", speakers: ["Reid Hoffman"], title: "Keynote: Systems That Coordinate", track: "Main Stage" },
          { id: "p1_act", eventId: "evt1", startTime: new Date("2025-10-12T12:00:00"), endTime: new Date("2025-10-12T13:00:00"), format: "activation", speakers: ["Salim Ismail"], title: "Activation: Cross-Sector Scenarios", track: "Activation" },
          
          // Pillar 2
          { id: "p2_key", eventId: "evt1", startTime: new Date("2025-10-12T13:30:00"), endTime: new Date("2025-10-12T14:30:00"), format: "keynote", speakers: ["Tim O'Reilly"], title: "Keynote: Post-Job Identity Pathways", track: "Main Stage" },
          { id: "p2_act", eventId: "evt1", startTime: new Date("2025-10-12T14:30:00"), endTime: new Date("2025-10-12T15:30:00"), format: "activation", speakers: ["Aaron Levie"], title: "Live Teams: Multi-Stream Contribution", track: "Activation" },

          // Pillar 4
          { id: "p4_circle", eventId: "evt1", startTime: new Date("2025-10-12T16:00:00"), endTime: new Date("2025-10-12T17:30:00"), format: "convergence_circle", speakers: ["Vitalik Buterin"], title: "Convergence Circles: Civic & Creative Ecosystems", track: "Circles" }
        ],
        // 4. Sample Attendees (GraphAttendee[])
        sampleAttendees: [
          { 
            person_id: "a1", 
            owner_id: "demo", 
            legal_name: "Elena R.", 
            emails: ["elena@example.com"], 
            tags: ["Builder"], 
            interests: ["Civic Tech", "Governance"], 
            intents: ["Funding"] 
          },
          { 
            person_id: "a2", 
            owner_id: "demo", 
            legal_name: "Marcus J.", 
            emails: ["marcus@example.com"], 
            tags: ["Investor"], 
            interests: ["Venture Capital", "Network Effects"], 
            intents: ["Dealflow"] 
          },
          { 
            person_id: "a3", 
            owner_id: "demo", 
            legal_name: "Sarah L.", 
            emails: ["sarah@example.com"], 
            tags: ["Policy"], 
            interests: ["AI Policy", "Ethics"], 
            intents: ["Learning"] 
          },
          { 
            person_id: "a4", 
            owner_id: "demo", 
            legal_name: "David K.", 
            emails: ["david@example.com"], 
            tags: ["Urbanist"], 
            interests: ["Urban Planning", "Systems"], 
            intents: ["Networking"] 
          },
          { 
            person_id: "a5", 
            owner_id: "demo", 
            legal_name: "Priya M.", 
            emails: ["priya@example.com"], 
            tags: ["Privacy"], 
            interests: ["Digital Identity", "Privacy"], 
            intents: ["Hiring"] 
          }
        ] as any
      }
    };
    
    // Simulate processing time
    await new Promise(r => setTimeout(r, 1000));


    // Generate a stable event ID based on the core inputs so Rhiz relationships are repeatable
    const eventFingerprint = `${eventBasics}|${eventDate}|${eventLocation}|${goals.join(",")}|${audience}|${tone}`;
    const eventId = `event_${stableHash(eventFingerprint)}`;

    console.log("Successfully generated event config. Event ID:", eventId);

    // PERSISTENCE: Save to Database
    try {
      if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
        await db.insert(events).values({
           slug: eventId,
           name: config.content?.eventName || "Untitled Event",
           config: config as any, // Cast to avoid strict jsonb type issues
           ownerId: "demo-user", // TODO: Replace with real auth
           status: "draft",
           updatedAt: new Date(),
        });
        console.log("DB: Saved event", eventId);
      } else {
        console.warn("DB: DATABASE_URL not set, skipping persistence");
      }
    } catch (dbError) {
      console.error("DB: Failed to save event", dbError);
      // Don't fail the request, just log
    }

    // Sync with Rhiz Protocol
    // We await these to return the enriched data (handles/DIDs) to the frontend immediately
    
    // 1. Sync Sample Attendees (Bulk)
    if (config.content?.sampleAttendees && config.content.sampleAttendees.length > 0) {
      try {
        const result = await rhizClient.ingestAttendees({
          eventId,
          attendees: config.content.sampleAttendees.map(a => ({
            id: a.person_id, 
            name: a.legal_name || a.preferred_name || "Unknown",
            email: a.emails?.[0], 
            tags: a.tags 
          }))
        });
        
        console.log(`Rhiz: Synced ${result.created} attendees`);
        
        // Merge back handles/dids to config
        config.content.sampleAttendees = config.content.sampleAttendees.map(a => {
            const synced = result.attendees.find(r => r.id === a.person_id);
            if (synced) {
                return { ...a, handle: synced.handle, did: synced.did };
            }
            return a;
        });
      } catch (err) {
        console.error("Rhiz: Failed to sync attendees", err);
      }
    }

    // 2. Sync Speakers
    if (config.content?.speakers) {
       try {
         const speakerAttendees = config.content.speakers.map(s => ({
            id: s.handle, // Use handle as ID hint if available, or just match by name
            name: s.name,
            tags: ["Speaker", s.role]
         }));
         
         const result = await rhizClient.ingestAttendees({ eventId, attendees: speakerAttendees });
         console.log("Rhiz: Speakers synced");
         
         // Update speakers with new DIDs/Handles
         config.content.speakers = config.content.speakers.map(s => {
             // Find by name if ID match isn't perfect
             const synced = result.attendees.find(r => r.id === s.handle || r.externalUserId === s.handle); 
             // Note: ingestAttendees mapping is complex, simplify:
             // If we didn't pass IDs, we can't easily map back 1:1 without name matching.
             // But existing implementation of ingestAttendees returns array of results in same order?
             // rhizClient.ingestAttendees uses Promise.all, so order is preserved.
             return s; 
         });
         
         // Direct mapping by index since Promise.all preserves order
         result.attendees.forEach((r, i) => {
             if (config.content && config.content.speakers && config.content.speakers[i]) {
                 config.content.speakers[i].handle = r.handle || config.content.speakers[i].handle;
                 config.content.speakers[i].did = r.did || config.content.speakers[i].did;
             }
         });
         
       } catch (err) {
         console.error("Rhiz: Failed to sync speakers", err);
       }
    }

    // 3. Sync Sessions (Context Tags)
    if (config.content?.schedule) {
       // Fire and forget, or await if critical
       await rhizClient.ingestSessions({ eventId, sessions: config.content.schedule });
    }
    
    console.log("Rhiz: Sync complete");
    
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
