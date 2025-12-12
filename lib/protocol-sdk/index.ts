/**
 * Rhiz Protocol TypeScript SDK v0.4.2
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

export { NlpClient } from './nlp';
export type { NlpClientOptions } from './nlp';

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

export { ZkClient } from './zk';
export type { ZkClientOptions } from './zk';

// All types
export * from './types';

// Identity helper for identity resolution workflows
export { IdentityHelper } from './identity';
