import React, { useState } from 'react';
import { InvestigationCaseSummary } from '../types';
import { Search, ChevronRight, AlertTriangle, CheckCircle2, FileQuestion, ArrowRight } from 'lucide-react';

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
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />
            Priority 1: Field Warrant
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <FileQuestion className="w-3 h-3 mr-1 text-amber-600" />
            Priority 2: Desk Audit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Verified Clean
          </span>
        );
    }
  };

  const formatCategory = (cat: string) => {
    if (cat.includes('REFLECTION')) return 'Missing on Ground (0 Delta)';
    if (cat.includes('VELOCITY')) return 'Unrealistic Construction Speed';
    if (cat.includes('STATUTORY')) return 'Ineligible Private Beneficiary';
    if (cat.includes('SITING')) return 'Low-Enrollment Siting';
    return 'Fully Reflected & Clean';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search school name, UDISE code, or Project ID..."
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
            <option value="ALL">All Collectorate Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ESCALATED">Warrant Issued / Escalated</option>
            <option value="DISMISSED">Dismissed with Justification</option>
            <option value="VERIFIED">Audited & Verified</option>
          </select>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTier(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedTier === null
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Works ({cases.length})
          </button>
          <button
            onClick={() => setSelectedTier(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedTier === 3
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            Priority 1: Field Audit ({cases.filter((c) => c.risk_tier === 3).length})
          </button>
          <button
            onClick={() => setSelectedTier(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedTier === 2
                ? 'bg-amber-500 text-slate-900 shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Priority 2: Desk Audit ({cases.filter((c) => c.risk_tier === 2).length})
          </button>
          <button
            onClick={() => setSelectedTier(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedTier === 1
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Verified Clean ({cases.filter((c) => c.risk_tier === 1).length})
          </button>
        </div>
      </div>

      {/* Case Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Priority Level</th>
              <th className="py-3.5 px-4">School & Work Description</th>
              <th className="py-3.5 px-4">Outlay</th>
              <th className="py-3.5 px-4">Ground Discrepancy Found</th>
              <th className="py-3.5 px-4">Audit Score</th>
              <th className="py-3.5 px-4">Enforcement Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No works found matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getTierBadge(c.risk_tier)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {c.school_name}
                    </div>
                    <div className="text-slate-500 font-mono text-xs flex items-center space-x-2 mt-0.5">
                      <span>Work: {c.project_id}</span>
                      <span>•</span>
                      <span>UDISE: {c.udise_code}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                    ₹{(c.sanction_cost / 100000).toFixed(2)} Lakhs
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">
                      {formatCategory(c.primary_category)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`font-black text-sm ${
                        c.ipi_score >= 70
                          ? 'text-red-600'
                          : c.ipi_score >= 40
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {c.ipi_score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        c.status === 'ESCALATED'
                          ? 'bg-red-100 text-red-800'
                          : c.status === 'DISMISSED'
                          ? 'bg-slate-100 text-slate-600'
                          : c.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                      Inspect Work <ChevronRight className="w-4 h-4 ml-0.5" />
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
