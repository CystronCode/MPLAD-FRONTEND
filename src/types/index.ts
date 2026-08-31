// frontend/src/types/index.ts
// Shared TypeScript Interfaces for MEEV Frontend

export enum CanonicalAssetType {
  ADDITIONAL_CLASSROOM = 'ADDITIONAL_CLASSROOM',
  TOILET_BLOCK = 'TOILET_BLOCK',
  DRINKING_WATER = 'DRINKING_WATER',
  COMPUTER_LAB = 'COMPUTER_LAB',
  SCIENCE_LAB = 'SCIENCE_LAB',
  LIBRARY_ROOM = 'LIBRARY_ROOM',
  BOUNDARY_WALL = 'BOUNDARY_WALL',
  GENERIC_CIVIL_REPAIR = 'GENERIC_CIVIL_REPAIR',
}

export enum SchoolManagement {
  GOVERNMENT = 'GOVERNMENT',
  GOVT_AIDED = 'GOVT_AIDED',
  PRIVATE_UNAIDED = 'PRIVATE_UNAIDED',
}

export enum OperationalStatus {
  OPERATIONAL = 'OPERATIONAL',
  MERGED = 'MERGED',
  CLOSED = 'CLOSED',
}

export enum RiskTier {
  TIER_1_AUTO_ARCHIVE = 1,
  TIER_2_DESK_REVIEW = 2,
  TIER_3_FIELD_INSPECTION = 3,
}

export enum CaseStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  ESCALATED = 'ESCALATED',
  DISMISSED = 'DISMISSED',
  VERIFIED = 'VERIFIED',
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'PROJECT' | 'SCHOOL' | 'STATE' | 'CONTRADICTION' | 'RULE';
  properties: Record<string, any>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  relation: string;
  confidence?: number;
}

export interface D3GraphPayload {
  directed: boolean;
  multigraph: boolean;
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface InvestigationCaseSummary {
  case_id: string;
  project_id: string;
  school_name: string;
  udise_code: string;
  sanction_cost: number;
  canonical_asset_type: CanonicalAssetType;
  ipi_score: number;
  ipi_lower: number;
  ipi_upper: number;
  risk_tier: RiskTier;
  primary_category: string;
  status: CaseStatus;
  created_at?: string;
}

export interface InvestigationCaseDetail extends InvestigationCaseSummary {
  evidence_graph: D3GraphPayload;
  explanation_narrative: string;
  lane_scores: {
    STATUTORY?: { score: number; violations?: string[] };
    INSTITUTIONAL_NEED?: { score: number; metrics?: Record<string, any> };
    ASSET_REFLECTION?: { score: number; status?: string; observed_delta?: number; expected_delta?: number };
    TIMELINE_PHYSICS?: { score: number; violation?: string; duration_days?: number };
  };
  exception_adjustments?: Array<{ type: string; reduction: number; reason: string }>;
  project_details: {
    project_id: string;
    mp_id: string;
    work_description_raw: string;
    sanction_cost: number;
    recommendation_date: string;
    sanction_date: string;
    completion_date?: string;
    canonical_asset_type: CanonicalAssetType;
    target_quantity: number;
  };
  school_details: {
    udise_code: string;
    name_canonical: string;
    management_category: SchoolManagement;
    operational_status: OperationalStatus;
    latitude: number;
    longitude: number;
  };
}

export interface AmbiguityItem {
  project_id: string;
  work_description_raw: string;
  project_coords?: [number, number];
  candidates: Array<{
    udise_code: string;
    school_name: string;
    distance_meters: number;
    similarity_score: number;
    management: string;
    status: string;
  }>;
}

export interface DistrictAnalytics {
  district_name: string;
  total_projects: number;
  total_expenditure: number;
  tier_distribution: {
    tier_1: number;
    tier_2: number;
    tier_3: number;
  };
  average_ipi: number;
  anomaly_breakdown: Record<string, number>;
}
