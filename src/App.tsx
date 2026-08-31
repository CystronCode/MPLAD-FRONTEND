import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { DistrictOverview } from './components/DistrictOverview';
import { CaseQueue } from './components/CaseQueue';
import { CaseDetail } from './components/CaseDetail';
import { AmbiguityQueue } from './components/AmbiguityQueue';
import { apiClient } from './api/client';
import { InvestigationCaseSummary, InvestigationCaseDetail, DistrictAnalytics, AmbiguityItem } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'detail' | 'ambiguity'>('overview');
  const [cases, setCases] = useState<InvestigationCaseSummary[]>([]);
  const [caseDetail, setCaseDetail] = useState<InvestigationCaseDetail | null>(null);
  const [analytics, setAnalytics] = useState<DistrictAnalytics | null>(null);
  const [ambiguityItems, setAmbiguityItems] = useState<AmbiguityItem[]>([]);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedCases, fetchedAnalytics, fetchedAmbiguity] = await Promise.all([
        apiClient.getCases(),
        apiClient.getDistrictAnalytics(),
        apiClient.getAmbiguityQueue()
      ]);
      setCases(fetchedCases);
      setAnalytics(fetchedAnalytics);
      setAmbiguityItems(fetchedAmbiguity);
    } catch (e) {
      console.error('Error fetching dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectCase = async (caseId: string) => {
    setLoading(true);
    try {
      const detail = await apiClient.getCaseDetail(caseId);
      setCaseDetail(detail);
      setActiveTab('detail');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTierFromOverview = (tier: number) => {
    setSelectedTier(tier);
    setActiveTab('queue');
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
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {loading && !caseDetail && cases.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            Loading MEEV Decision Core...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DistrictOverview
                analytics={analytics}
                onSelectTier={handleSelectTierFromOverview}
              />
            )}

            {activeTab === 'queue' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-slate-900">
                    Prioritized Investigation Case Queue
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

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Smart India Hackathon 2026 — MEEV (SIH26102) | MoSPI & MoE Inter-System Functional Validator
      </footer>
    </div>
  );
};

export default App;
