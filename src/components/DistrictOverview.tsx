import React from 'react';
import { DistrictAnalytics } from '../types';
import { IndianRupee, AlertTriangle, CheckCircle2, Search, ArrowUpRight, ShieldCheck, MapPin, Building2 } from 'lucide-react';

interface DistrictOverviewProps {
  analytics: DistrictAnalytics | null;
  onSelectTier: (tier: number) => void;
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({ analytics, onSelectTier }) => {
  const defaultAnalytics: DistrictAnalytics = analytics || {
    district_name: 'Bengaluru North Parliamentary Constituency (Karnataka)',
    total_projects: 8,
    total_expenditure: 8890000.0,
    tier_distribution: { tier_1: 4, tier_2: 1, tier_3: 3 },
    average_ipi: 34.8,
    anomaly_breakdown: {
      CRITICAL_REFLECTION_GAP: 3,
      PHYSICAL_VELOCITY_VIOLATION: 2,
      STATUTORY_INELIGIBLE_BENEFICIARY: 1,
      INSTITUTIONAL_SITING_INEFFICIENCY: 1
    }
  };

  const formattedSpend = `₹${(defaultAnalytics.total_expenditure / 10000000).toFixed(2)} Cr`;

  return (
    <div className="space-y-6">
      {/* Top Banner - Executive Overview for DM / MP */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Live MPLADS Fund Oversight
              </span>
              <span className="text-slate-400 text-xs flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                District Collectorate & MP Decision Support
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
              {defaultAnalytics.district_name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Cross-verifying claimed e-SAKSHI disbursements against annual UDISE+ physical school infrastructure audits.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-slate-800/90 px-4 py-3 rounded-xl border border-slate-600 shadow-inner">
              <span className="text-xs text-slate-400 block font-medium">Constituency Audit Priority:</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-black text-teal-300">
                  {defaultAnalytics.average_ipi}/100
                </span>
                <span className="text-xs text-teal-400 font-semibold">
                  {defaultAnalytics.average_ipi >= 50 ? 'Requires Action' : 'High Integrity'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monitored Outlay */}
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
            <span className="text-xs text-slate-500 ml-2">across {defaultAnalytics.total_projects} sanctioned works</span>
          </div>
        </div>

        {/* Priority 1: Field Inspection Required */}
        <div
          onClick={() => onSelectTier(3)}
          className="bg-red-50 hover:bg-red-100/90 transition-all cursor-pointer rounded-xl p-5 shadow-sm border border-red-200 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Priority 1: Field Inspection
            </span>
            <div className="bg-red-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-red-700">
              {defaultAnalytics.tier_distribution.tier_3} Works
            </span>
            <span className="text-xs font-bold text-red-700 flex items-center bg-red-200/70 px-2 py-0.5 rounded-full">
              Warrant Audit <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <span className="text-xs text-red-600/90 block mt-1">Discrepancies found on ground</span>
        </div>

        {/* Priority 2: Desk Review Required */}
        <div
          onClick={() => onSelectTier(2)}
          className="bg-amber-50 hover:bg-amber-100/90 transition-all cursor-pointer rounded-xl p-5 shadow-sm border border-amber-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Priority 2: Desk Review
            </span>
            <div className="bg-amber-500 text-slate-900 p-2 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-800">
              {defaultAnalytics.tier_distribution.tier_2} Works
            </span>
            <span className="text-xs font-semibold text-amber-700 flex items-center">
              Audit Docs <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <span className="text-xs text-amber-700/80 block mt-1">Administrative timeline delays</span>
        </div>

        {/* Priority 3: Clean & Verified on Ground */}
        <div
          onClick={() => onSelectTier(1)}
          className="bg-emerald-50 hover:bg-emerald-100/90 transition-all cursor-pointer rounded-xl p-5 shadow-sm border border-emerald-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Verified on Ground
            </span>
            <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-800">
              {defaultAnalytics.tier_distribution.tier_1} Works
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              Confirmed <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <span className="text-xs text-emerald-700/80 block mt-1">Confirmed in school census</span>
        </div>
      </div>

      {/* Ground Truth Anomaly Breakdown for District Collector & MP */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Key Audit Discrepancies Requiring Collectorate Attention
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated bitemporal checks comparing claimed completion dates with physical ground census reports.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
            Bitemporal Verification Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Missing on Ground */}
          <div className="p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              Missing Infrastructure on Ground
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.CRITICAL_REFLECTION_GAP || 0} works
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Disbursed 100% in e-SAKSHI, but 0 new classrooms/toilets recorded in official school census.
            </p>
          </div>

          {/* Unrealistic Construction Speed */}
          <div className="p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              Unrealistic Construction Speed
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.PHYSICAL_VELOCITY_VIOLATION || 0} works
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Claimed completed in &lt; 30 days, violating mandatory structural RCC concrete curing standards.
            </p>
          </div>

          {/* Ineligible Private Institutions */}
          <div className="p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              Ineligible Private Beneficiary
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.STATUTORY_INELIGIBLE_BENEFICIARY || 0} works
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Public MPLADS funds allocated to private unaided institutions (MPLADS Guidelines Ch 6 Violation).
            </p>
          </div>

          {/* Excess Siting / Low Enrollment */}
          <div className="p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              Excess Siting / Low Enrollment
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {defaultAnalytics.anomaly_breakdown.INSTITUTIONAL_SITING_INEFFICIENCY || 0} works
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Sanctioned additional rooms to schools with declining enrollment (&lt; 15 students per classroom).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
