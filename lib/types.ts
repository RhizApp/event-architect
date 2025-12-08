import { PersonRead } from "@/lib/protocol-sdk/types";

// ... existing types ...

export type GraphAttendee = PersonRead & {
  imageFromUrl?: string;
  interests?: string[];
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  ownerUserId: string;
  createdAt: Date;
};

export type EventGoal =
  | "dealflow"
  | "community_building"
  | "education"
  | "healing"
  | "movement_building"
  | "internal_offsite"
  | "fundraising"
  | "networking"
  | "career_fair";

export type EventStatus = "draft" | "published" | "archived";

export type VenueType = "virtual" | "in_person" | "hybrid";

export type Event = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  timeZone: string;
  venueType: VenueType;
  status: EventStatus;
};

export type AttendeeProfileField = {
  id: string;
  label: string;
  type: "text" | "select" | "tags" | "textarea";
  required: boolean;
  options?: string[];
};

export type EventAppConfig = {
  id: string;
  eventId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  primaryGoals: EventGoal[];
  attendeeProfileFields: AttendeeProfileField[];
  matchmakingConfig: {
    enabled: boolean;
    inputSignals: string[];
    matchTypes: string[];
    meetingDurations: number[];
  };
  sessionConfig: {
    tracksEnabled: boolean;
    maxConcurrentSessions: number;
    sessionTypes: string[];
  };
  engagementConfig: {
    chatEnabled: boolean;
    qnaEnabled: boolean;
    pollsEnabled: boolean;
    liveFeedEnabled: boolean;
  };
  relationshipFeatures: {
    relationshipScoresVisible: boolean;
    warmPathHintsEnabled: boolean;
    introRequestsEnabled: boolean;
  };
  branding: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
    wordmark?: string;
    toneKeywords: string[];
  };
  designNotes?: string;
};

export type Attendee = {
  id: string;
  eventId: string;
  userId: string;
  rhizIdentityId: string;
  name: string;
  email: string;
  headline?: string;
  company?: string;
  tags: string[];
  intents: string[];
};

export type Session = {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  format: string;
  track?: string;
  room?: string;
  speakers: string[];
};

export type ConnectionSuggestion = {
  targetAttendeeId: string;
  score: number;
  reasonSummary: string;
  sharedTags: string[];
  sharedIntents: string[];
  talkingPoints: string[];
};
