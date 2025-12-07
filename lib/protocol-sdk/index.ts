/**
 * Rhiz Protocol TypeScript SDK v0.2.0
 * 
 * Complete client library for the Rhiz Protocol API
 */

// Main client
// Main client
export { RhizClient } from './client';
export type { RhizClientOptions } from './client';

// Feature-specific clients
export { PeopleClient } from './people';
export type { PeopleClientOptions } from './people';

export { OrganizationsClient } from './organizations';
export type { OrganizationsClientOptions } from './organizations';

export { GoalsClient } from './goals';
export type { GoalsClientOptions } from './goals';

export { AgentsClient } from './agents';
export type { AgentsClientOptions } from './agents';

export { ProcessesClient } from './processes';
export type { ProcessesClientOptions } from './processes';

export { ChannelsClient } from './channels';
export type { ChannelsClientOptions } from './channels';

export { ContextTagsClient } from './contextTags';
export type { ContextTagsClientOptions } from './contextTags';

export { CustomAttributesClient } from './customAttributes';
export type { CustomAttributesClientOptions } from './customAttributes';

// All types
export * from './types';

// Note: Identity client is in sdk/identity.ts (separate file)
// Import it directly: import { IdentityClient } from '@rhiz/protocol-sdk/identity'
