import React from 'react';
import { DistrictAnalytics } from '../types';
import { IndianRupee, AlertTriangle, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';

interface DistrictOverviewProps {
  analytics: DistrictAnalytics | null;
  onSelectTier: (tier: number) => void;
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({ analytics, onSelectTier }) => {
  const defaultAnalytics: DistrictAnalytics = analytics || {
    district_name: 'Kangra District (Himachal Pradesh)',
    total_projects: 250,
    total_expenditure: 31250000.0,
    tier_distribution: { tier_1: 182, tier_2: 46, tier_3: 22 },
    average_ipi: 24.3,
    anomaly_breakdown: {
      CRITICAL_REFLECTION_GAP: 14,
      PHYSICAL_VELOCITY_VIOLATION: 18,
      STATUTORY_INELIGIBLE_BENEFICIARY: 5,
      INSTITUTIONAL_SITING_INEFFICIENCY: 31
    }
  };

  const formattedSpend = `₹${(defaultAnalytics.total_expenditure / 10000000).toFixed(2)} Cr`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-teal-400">
              Inter-System Validation Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              {defaultAnalytics.district_name}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Cross-silo functional verification (e-SAKSHI &times; UDISE+) covering ~2,000 schools
            </p>

          </div>
          <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-lg border border-slate-600">
            <span className="text-xs text-slate-400">Average District IPI:</span>
            <span className="text-2xl font-black text-teal-300">
              {defaultAnalytics.average_ipi}/100
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outlay */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Monitored Outlay
            </span>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{formattedSpend}</span>
            <span className="text-xs text-slate-500 ml-2">across {defaultAnalytics.total_projects} projects</span>
          </div>
        </div>

        {/* Tier 3: Field Inspection Required */}
        <div
          onClick={() => onSelectTier(3)}
          className="bg-red-50 hover:bg-red-100/80 transition-colors cursor-pointer rounded-xl p-5 shadow-sm border border-red-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Tier 3: Mandatory Field Action
            </span>
            <div className="bg-red-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-red-700">
              {defaultAnalytics.tier_distribution.tier_3}
            </span>
            <span className="text-xs font-semibold text-red-600 flex items-center">
              Inspect Now <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>

        {/* Tier 2: Desk Review Required */}
        <div
          onClick={() => onSelectTier(2)}
          className="bg-amber-50 hover:bg-amber-100/80 transition-colors cursor-pointer rounded-xl p-5 shadow-sm border border-amber-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Tier 2: Desk Review
            </span>
            <div className="bg-amber-500 text-slate-900 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-800">
              {defaultAnalytics.tier_distribution.tier_2}
            </span>
            <span className="text-xs font-semibold text-amber-700 flex items-center">
              Review <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>

        {/* Tier 1: Auto-Archived */}
        <div
          onClick={() => onSelectTier(1)}
          className="bg-emerald-50 hover:bg-emerald-100/80 transition-colors cursor-pointer rounded-xl p-5 shadow-sm border border-emerald-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Tier 1: Fully Reflected
            </span>
            <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-800">
              {defaultAnalytics.tier_distribution.tier_1}
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              Archived <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>
      </div>

      {/* Anomaly Breakdown Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Multi-Lane Systematic Anomaly Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">
              Asset Non-Reflection (Lane 3)
            </span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.CRITICAL_REFLECTION_GAP || 0} cases
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Reported completed in e-SAKSHI but 0 delta in UDISE+
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">
              Velocity Violations (Lane 4)
            </span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.PHYSICAL_VELOCITY_VIOLATION || 0} cases
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Claimed completed in &lt; 45 days violating RCC curing physics
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">
              Ineligible Beneficiaries (Lane 1)
            </span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.STATUTORY_INELIGIBLE_BENEFICIARY || 0} cases
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Private unaided institutions (Ch 6 MPLADS Guidelines)
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">
              Siting Inefficiencies (Lane 2)
            </span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.INSTITUTIONAL_SITING_INEFFICIENCY || 0} cases
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Sanctioned to collapsing enrollment (&lt; 15 SCR)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
