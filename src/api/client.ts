// frontend/src/api/client.ts
import axios from 'axios';
import {
  InvestigationCaseSummary,
  InvestigationCaseDetail,
  D3GraphPayload,
  DistrictAnalytics,
  AmbiguityItem
} from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = {
  getCases: async (tier?: number, minIpi?: number, status?: string): Promise<InvestigationCaseSummary[]> => {
    try {
      const res = await axios.get(`${API_BASE}/cases`, {
        params: { tier, min_ipi: minIpi, status }
      });
      return res.data;
    } catch (e) {
      console.warn('Backend unavailable, using fallback mock data', e);
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

  getDistrictAnalytics: async (): Promise<DistrictAnalytics | null> => {
    try {
      const res = await axios.get(`${API_BASE}/analytics/district`);
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

  triggerStreamClaim: async (claimData?: any): Promise<any> => {
    try {
      const blrStreams = [
        {
          work_id: `PRJ-BN-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
          mp_id: 'MP-LS-KA-24',
          district_lgd_code: 556,
          work_description: 'Construction of 2 Additional Class rooms at GHS Yelahanka Old Town',
          sanction_cost: 1450000.0,
          recommendation_date: '2023-03-15',
          sanction_date: '2023-04-10',
          completion_date: '2023-05-02',
          latitude: 13.1008,
          longitude: 77.5964
        },
        {
          work_id: `PRJ-BN-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
          mp_id: 'MP-LS-KA-24',
          district_lgd_code: 556,
          work_description: 'Setup of Smart Computer Lab at St Anthony English Medium School RT Nagar',
          sanction_cost: 1150000.0,
          recommendation_date: '2023-01-20',
          sanction_date: '2023-04-18',
          completion_date: '2023-10-10',
          latitude: 13.0233,
          longitude: 77.5935
        },
        {
          work_id: `PRJ-BN-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
          mp_id: 'MP-LS-KA-24',
          district_lgd_code: 556,
          work_description: 'Construction of 2 Additional Classrooms at GHS Vidyaranyapura',
          sanction_cost: 1420000.0,
          recommendation_date: '2023-03-01',
          sanction_date: '2023-03-25',
          completion_date: '2023-04-13',
          latitude: 13.0826,
          longitude: 77.5613
        },
        {
          work_id: `PRJ-BN-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
          mp_id: 'MP-LS-KA-24',
          district_lgd_code: 556,
          work_description: 'Construction of 2 Additional Classrooms at Govt PU College & High School Hebbal',
          sanction_cost: 1500000.0,
          recommendation_date: '2023-01-10',
          sanction_date: '2023-02-15',
          completion_date: '2023-08-20',
          latitude: 13.0359,
          longitude: 77.5971
        }
      ];

      const chosen = blrStreams[Math.floor(Math.random() * blrStreams.length)];
      const payload = claimData || chosen;
      const res = await axios.post(`${API_BASE}/ingest/stream`, payload);
      return res.data;
    } catch (e) {
      console.error('Failed to stream claim', e);
      return null;
    }
  }
};
