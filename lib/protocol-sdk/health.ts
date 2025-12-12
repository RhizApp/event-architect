/**
 * Health Client for Rhiz Protocol Intelligence & Insights API
 * 
 * Provides methods for:
 * - Relationship health scoring
 * - Engagement recommendations
 * - Risk alerts
 * - Network clustering
 * - Warm path finding
 */

export interface HealthClientOptions {
  baseUrl: string;
  getAccessToken: () => Promise<string>;
}

export interface RelationshipHealth {
  relationship_id: string;
  health_score: number;
  current_trust: number;
  predicted_trust: number;
  future_decay_trust: number;
  days_since_last_interaction: number | null;
  days_until_risk: number | null;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  engagement_priority: 'low' | 'medium' | 'high' | 'urgent';
  last_interaction_at: string | null;
}

export interface EngagementRecommendation {
  relationship_id: string;
  target_person_id: string;
  target_person_name: string;
  health_score: number;
  current_trust: number;
  days_since_last_interaction: number | null;
  risk_level: string;
  engagement_priority: string;
  recommended_action: string;
  last_interaction_at: string | null;
}

export interface EngagementRecommendationsResponse {
  recommendations: EngagementRecommendation[];
  total: number;
  limit: number;
}

export interface RiskAlert {
  relationship_id: string;
  target_person_id: string;
  target_person_name: string;
  risk_level: string;
  health_score: number;
  current_trust: number;
  days_since_last_interaction: number | null;
  days_until_risk: number | null;
  alert_message: string;
  last_interaction_at: string | null;
}

export interface RiskAlertsResponse {
  alerts: RiskAlert[];
  total: number;
}

export interface NetworkCluster {
  cluster_name: string;
  member_count: number;
  member_ids: string[];
}

export interface NetworkClustersResponse {
  clusters: NetworkCluster[];
  total_clusters: number;
}

export interface NetworkDensityResponse {
  density: number;
  interpretation: 'highly connected' | 'moderately connected' | 'sparsely connected';
}

export interface PathNode {
  person_id: string;
  person_name: string;
  trust_score: number | null;
}

export interface WarmPathResponse {
  path: PathNode[];
  path_strength: number;
  hop_count: number;
  suggestion: string | null;
}

export class HealthClient {
  private baseUrl: string;
  private getAccessToken: () => Promise<string>;

  constructor(options: HealthClientOptions) {
    this.baseUrl = options.baseUrl;
    this.getAccessToken = options.getAccessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get health metrics for a specific relationship
   * 
   * @param relationshipId - Relationship ID
   * @param daysAhead - Days ahead to predict decay (default: 90, range: 1-365)
   */
  async getRelationshipHealth(
    relationshipId: string,
    daysAhead: number = 90
  ): Promise<RelationshipHealth> {
    return this.request<RelationshipHealth>(
      `/v1/intelligence/relationship/${relationshipId}/health?days_ahead=${daysAhead}`
    );
  }

  /**
   * Get prioritized engagement recommendations
   * 
   * @param params - Optional filters
   * @param params.limit - Maximum recommendations (default: 10, range: 1-50)
   * @param params.priority - Filter by priority: low, medium, high, urgent
   */
  async getEngagementRecommendations(params?: {
    limit?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<EngagementRecommendationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.priority) queryParams.set('priority', params.priority);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<EngagementRecommendationsResponse>(
      `/v1/intelligence/relationships/engagement-recommendations${query}`
    );
  }

  /**
   * Get risk alerts for dormant or at-risk relationships
   * 
   * @param params - Optional filters
   * @param params.riskLevel - Filter by risk level: low, medium, high, critical
   */
  async getRiskAlerts(params?: {
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<RiskAlertsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.riskLevel) queryParams.set('risk_level', params.riskLevel);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<RiskAlertsResponse>(
      `/v1/intelligence/relationships/risk-alerts${query}`
    );
  }

  /**
   * Find network clusters/communities using Label Propagation Algorithm
   * 
   * @param params - Optional parameters
   * @param params.minClusterSize - Minimum people per cluster (default: 3, range: 2-10)
   */
  async getNetworkClusters(params?: {
    minClusterSize?: number;
  }): Promise<NetworkClustersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.minClusterSize) queryParams.set('min_cluster_size', params.minClusterSize.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<NetworkClustersResponse>(
      `/v1/intelligence/network/clusters${query}`
    );
  }

  /**
   * Calculate network density (actual connections / possible connections)
   */
  async getNetworkDensity(): Promise<NetworkDensityResponse> {
    return this.request<NetworkDensityResponse>(
      '/v1/intelligence/network/density'
    );
  }

  /**
   * Find the warmest introduction path between two people
   * 
   * @param fromPersonId - Starting person ID
   * @param toPersonId - Target person ID
   * @param maxHops - Maximum hops allowed (default: 5, range: 2-10)
   */
  async findWarmPath(
    fromPersonId: string,
    toPersonId: string,
    maxHops: number = 5
  ): Promise<WarmPathResponse> {
    return this.request<WarmPathResponse>(
      `/v1/intelligence/network/warm-path?from_person_id=${fromPersonId}&to_person_id=${toPersonId}&max_hops=${maxHops}`
    );
  }
}
