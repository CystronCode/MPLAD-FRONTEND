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
  }
};
