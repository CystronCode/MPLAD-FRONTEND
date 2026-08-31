import React, { useState } from 'react';
import { InvestigationCaseSummary } from '../types';
import { Search, ChevronRight } from 'lucide-react';

interface CaseQueueProps {
  cases: InvestigationCaseSummary[];
  onSelectCase: (caseId: string) => void;
  selectedTier: number | null;
  setSelectedTier: (tier: number | null) => void;
}

export const CaseQueue: React.FC<CaseQueueProps> = ({
  cases,
  onSelectCase,
  selectedTier,
  setSelectedTier
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    if (selectedTier && c.risk_tier !== selectedTier) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.school_name.toLowerCase().includes(q) ||
        c.project_id.toLowerCase().includes(q) ||
        c.udise_code.includes(q) ||
        c.primary_category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 3:
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200">TIER 3 (FIELD ACTION)</span>;
      case 2:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">TIER 2 (DESK REVIEW)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">TIER 1 (ARCHIVED)</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search school, UDISE, or Project ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ESCALATED">Escalated</option>
            <option value="DISMISSED">Dismissed</option>
            <option value="VERIFIED">Verified</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedTier(null)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedTier === null ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tiers ({cases.length})
            </button>
            <button
              onClick={() => setSelectedTier(3)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedTier === 3 ? 'bg-red-600 text-white shadow-sm' : 'text-red-700 hover:bg-red-100'
              }`}
            >
              Tier 3
            </button>
            <button
              onClick={() => setSelectedTier(2)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedTier === 2 ? 'bg-amber-500 text-slate-900 shadow-sm' : 'text-amber-800 hover:bg-amber-100'
              }`}
            >
              Tier 2
            </button>
            <button
              onClick={() => setSelectedTier(1)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedTier === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Tier 1
            </button>
          </div>
        </div>
      </div>

      {/* Case Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/75 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Priority & Tier</th>
              <th className="py-3 px-4">School & UDISE Code</th>
              <th className="py-3 px-4">MPLADS Project</th>
              <th className="py-3 px-4">Sanction Cost</th>
              <th className="py-3 px-4">Anomaly Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No investigation cases match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-sm text-slate-900">{c.ipi_score}</span>
                      {getTierBadge(c.risk_tier)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.school_name}</div>
                    <div className="text-[11px] font-mono text-slate-500">UDISE: {c.udise_code}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-800 font-semibold">{c.project_id}</span>
                    <div className="text-[11px] text-slate-500">{c.canonical_asset_type}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    ₹{(c.sanction_cost / 100000).toFixed(2)} Lakh
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                      {c.primary_category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'ESCALATED'
                          ? 'bg-red-100 text-red-800'
                          : c.status === 'DISMISSED'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center">
                      Inspect <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
