import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DistrictOverview } from './components/DistrictOverview';
import { CaseQueue } from './components/CaseQueue';
import { CaseDetail } from './components/CaseDetail';
import { AmbiguityQueue } from './components/AmbiguityQueue';
import { StakeholderGuideModal } from './components/StakeholderGuideModal';
import { CsvIngestModal } from './components/CsvIngestModal';
import { apiClient } from './api/client';
import {
  InvestigationCaseSummary,
  InvestigationCaseDetail,
  DistrictAnalytics,
  ConstituencySummary,
  AmbiguityItem
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'detail' | 'ambiguity'>('overview');
  const [constituencies, setConstituencies] = useState<ConstituencySummary[]>([]);
  const [selectedConstituency, setSelectedConstituency] = useState<string>('KA-24'); // Default to Bengaluru North
  const [cases, setCases] = useState<InvestigationCaseSummary[]>([]);
  const [caseDetail, setCaseDetail] = useState<InvestigationCaseDetail | null>(null);
  const [analytics, setAnalytics] = useState<DistrictAnalytics | null>(null);
  const [ambiguityItems, setAmbiguityItems] = useState<AmbiguityItem[]>([]);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedConstList, fetchedCases, fetchedAnalytics, fetchedAmbiguity] = await Promise.all([
        apiClient.getConstituencies(),
        apiClient.getCases(undefined, undefined, undefined, selectedConstituency),
        apiClient.getDistrictAnalytics(selectedConstituency),
        apiClient.getAmbiguityQueue()
      ]);
      
      setConstituencies(fetchedConstList);

      // If backend is fresh/empty, trigger one-time auto seed
      if (fetchedCases.length === 0 && fetchedConstList.length === 0) {
        await apiClient.seedRealtimeData();
        const [reConst, reCases, reAnalytics, reAmbiguity] = await Promise.all([
          apiClient.getConstituencies(),
          apiClient.getCases(undefined, undefined, undefined, selectedConstituency),
          apiClient.getDistrictAnalytics(selectedConstituency),
          apiClient.getAmbiguityQueue()
        ]);
        setConstituencies(reConst);
        setCases(reCases);
        setAnalytics(reAnalytics);
        setAmbiguityItems(reAmbiguity);
      } else {
        setCases(fetchedCases);
        setAnalytics(fetchedAnalytics);
        setAmbiguityItems(fetchedAmbiguity);
      }
    } catch (e) {
      console.error('Error fetching dashboard data', e);
    } finally {
      setLoading(false);
    }
  }, [selectedConstituency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConstituencyChange = (cCode: string) => {
    setSelectedConstituency(cCode);
    if (activeTab === 'detail') {
      setActiveTab('queue');
    }
  };

  const handleStreamClaim = async () => {
    setIsStreaming(true);
    try {
      await apiClient.triggerStreamClaim(selectedConstituency);
      await fetchData();
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSelectCase = async (caseId: string) => {
    setLoading(true);
    try {
      const detail = await apiClient.getCaseDetail(caseId);
      if (detail) {
        setCaseDetail(detail);
        setActiveTab('detail');
      } else {
        const summary = cases.find((c) => c.case_id === caseId || c.project_id === caseId);
        if (summary) {
          setCaseDetail({
            ...summary,
            evidence_graph: { directed: true, multigraph: false, nodes: [], links: [] },
            explanation_narrative: `${summary.school_name}: Automated ground audit evaluation flagged ${summary.primary_category.replace(/_/g, ' ')} with ${summary.ipi_score}/100 audit discrepancy score.`,
            lane_scores: {},
            project_details: {
              project_id: summary.project_id,
              mp_id: 'MP-LS-KA',
              work_description_raw: `Sanctioned work at ${summary.school_name}`,
              sanction_cost: summary.sanction_cost,
              recommendation_date: '2023-01-10',
              sanction_date: '2023-02-15',
              completion_date: '2023-08-20',
              canonical_asset_type: summary.canonical_asset_type,
              target_quantity: 1
            },
            school_details: {
              udise_code: summary.udise_code,
              name_canonical: summary.school_name,
              management_category: 'GOVERNMENT' as any,
              operational_status: 'OPERATIONAL' as any,
              latitude: 12.9716,
              longitude: 77.5946
            }
          });
          setActiveTab('detail');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTierFromOverview = (tier: number) => {
    setSelectedTier(tier);
    setActiveTab('queue');
  };

  const handleResetData = async () => {
    setLoading(true);
    try {
      await apiClient.seedRealtimeData();
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  const tier3Count = cases.filter((c) => c.risk_tier === 3).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t: any) => {
          setActiveTab(t);
        }}
        tier3Count={tier3Count}
        ambiguityCount={ambiguityItems.length}
        constituencies={constituencies}
        selectedConstituency={selectedConstituency}
        onSelectConstituency={handleConstituencyChange}
        onStreamClaim={handleStreamClaim}
        isStreaming={isStreaming}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onResetData={handleResetData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {loading && !caseDetail && cases.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            Loading Karnataka State MEEV Decision Core...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DistrictOverview
                analytics={analytics}
                onSelectTier={handleSelectTierFromOverview}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            )}

            {activeTab === 'queue' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-slate-900">
                    Prioritized Investigation Works Queue
                  </h1>
                </div>
                <CaseQueue
                  cases={cases}
                  onSelectCase={handleSelectCase}
                  selectedTier={selectedTier}
                  setSelectedTier={setSelectedTier}
                />
              </div>
            )}

            {activeTab === 'detail' && caseDetail && (
              <CaseDetail
                caseDetail={caseDetail}
                onBack={() => setActiveTab('queue')}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'ambiguity' && (
              <AmbiguityQueue
                items={ambiguityItems}
                onResolved={fetchData}
              />
            )}
          </>
        )}
      </main>

      <StakeholderGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <CsvIngestModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={fetchData}
      />

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Smart India Hackathon 2026 — MEEV (SIH26102) | Karnataka State 28 Parliamentary Constituencies Validator
      </footer>
    </div>
  );
};

export default App;

