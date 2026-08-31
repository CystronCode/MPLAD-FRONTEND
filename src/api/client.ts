// frontend/src/api/client.ts
import axios from 'axios';
import {
  InvestigationCaseSummary,
  InvestigationCaseDetail,
  D3GraphPayload,
  DistrictAnalytics,
  ConstituencySummary,
  AmbiguityItem
} from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = {
  getConstituencies: async (): Promise<ConstituencySummary[]> => {
    try {
      const res = await axios.get(`${API_BASE}/analytics/constituencies`);
      return res.data;
    } catch (e) {
      console.warn('Failed to fetch constituencies list', e);
      return [];
    }
  },

  getCases: async (
    tier?: number,
    minIpi?: number,
    status?: string,
    constituencyCode?: string
  ): Promise<InvestigationCaseSummary[]> => {
    try {
      const res = await axios.get(`${API_BASE}/cases`, {
        params: {
          tier,
          min_ipi: minIpi,
          status,
          constituency_code: constituencyCode && constituencyCode !== 'ALL' ? constituencyCode : undefined
        }
      });
      return res.data;
    } catch (e) {
      console.warn('Backend unavailable, using fallback empty list', e);
      return [];
    }
  },

  getCaseDetail: async (caseId: string): Promise<InvestigationCaseDetail | null> => {
    try {
      const res = await axios.get(`${API_BASE}/cases/${caseId}`);
      return res.data;
    } catch (e) {
      console.error('Failed to fetch case detail', e);
      return null;
    }
  },

  getEvidenceGraph: async (caseId: string): Promise<D3GraphPayload | null> => {
    try {
      const res = await axios.get(`${API_BASE}/cases/${caseId}/evidence-graph`);
      return res.data;
    } catch (e) {
      console.error('Failed to fetch evidence graph', e);
      return null;
    }
  },

  getDistrictAnalytics: async (constituencyCode?: string): Promise<DistrictAnalytics | null> => {
    try {
      const res = await axios.get(`${API_BASE}/analytics/district`, {
        params: {
          constituency_code: constituencyCode && constituencyCode !== 'ALL' ? constituencyCode : undefined
        }
      });
      return res.data;
    } catch (e) {
      console.error('Failed to fetch district analytics', e);
      return null;
    }
  },

  getAmbiguityQueue: async (): Promise<AmbiguityItem[]> => {
    try {
      const res = await axios.get(`${API_BASE}/ambiguity-queue`);
      return res.data;
    } catch (e) {
      console.error('Failed to fetch ambiguity queue', e);
      return [];
    }
  },

  resolveAmbiguity: async (projectId: string, resolvedUdiseCode: string): Promise<boolean> => {
    try {
      await axios.post(`${API_BASE}/ambiguity-queue/${projectId}/resolve`, {
        resolved_udise_code: resolvedUdiseCode,
        investigator_id: 'DISTRICT_COLLECTOR_DESK'
      });
      return true;
    } catch (e) {
      console.error('Failed to resolve ambiguity', e);
      return false;
    }
  },

  recordDecision: async (caseId: string, decision: string, notes?: string): Promise<any> => {
    try {
      const res = await axios.post(`${API_BASE}/cases/${caseId}/decision`, {
        decision,
        notes: notes || 'Triage review completed via MEEV UI',
        investigator_id: 'DISTRICT_COLLECTOR_DESK'
      });
      return res.data;
    } catch (e) {
      console.error('Failed to record decision', e);
      return null;
    }
  },

  getNoticeDownloadUrl: (caseId: string): string => {
    return `${API_BASE}/cases/${caseId}/notice/pdf`;
  },

  seedRealtimeData: async (): Promise<boolean> => {
    try {
      await axios.post(`${API_BASE}/ingest/seed-realtime?clear_first=true`);
      return true;
    } catch (e) {
      console.error('Failed to seed real-time data', e);
      return false;
    }
  },

  triggerStreamClaim: async (constituencyCode?: string, claimData?: any): Promise<any> => {
    try {
      const cCode = (constituencyCode && constituencyCode !== 'ALL') ? constituencyCode : 'KA-24';
      
      const payload = claimData || {
        work_id: `PRJ-${cCode}-LIVE-STREAM`,
        mp_id: `MP-LS-${cCode}`,
        district_lgd_code: 556,
        work_description: `Construction of 2 Additional Class rooms in ${cCode} Parliamentary Constituency`,
        sanction_cost: 1450000.0,
        recommendation_date: '2023-03-15',
        sanction_date: '2023-04-10',
        completion_date: '2023-05-02',
        latitude: 13.1008,
        longitude: 77.5964
      };
      
      const res = await axios.post(`${API_BASE}/ingest/stream`, payload);
      return res.data;
    } catch (e) {
      console.error('Failed to stream claim', e);
      return null;
    }
  },

  triggerCsvPipeline: async (): Promise<any> => {
    try {
      const res = await axios.post(`${API_BASE}/ingest/csv-pipeline`);
      return res.data;
    } catch (e) {
      console.error('Failed to run CSV ingestion pipeline', e);
      return null;
    }
  }
};

