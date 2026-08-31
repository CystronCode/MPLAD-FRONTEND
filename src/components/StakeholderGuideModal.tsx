import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';

interface StakeholderGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StakeholderGuideModal: React.FC<StakeholderGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStakeholder, setActiveStakeholder] = useState<'DM' | 'MP' | 'JURY'>('DM');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-teal-400">
                Official Stakeholder Guide & Executive Explainer
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                How MEEV Protects MPLADS Education Funds
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stakeholder Selector Tabs */}
        <div className="bg-slate-100 p-2 flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveStakeholder('DM')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStakeholder === 'DM'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>For District Magistrate / Collector</span>
          </button>

          <button
            onClick={() => setActiveStakeholder('MP')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStakeholder === 'MP'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>For Member of Parliament (MP)</span>
          </button>

          <button
            onClick={() => setActiveStakeholder('JURY')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeStakeholder === 'JURY'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>How the Algorithm Works (Jury / Auditor)</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* DM / Collector View */}
          {activeStakeholder === 'DM' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-bold text-blue-900 text-base mb-1">
                  Role: District Magistrate & Collectorate Enforcement
                </h3>
                <p className="text-blue-800 text-xs leading-relaxed">
                  As the administrative authority responsible for sanctioning and monitoring MPLADS works, MEEV acts as your automated audit radar. It scans incoming completion claims and highlights projects with ground contradictions before final contractor bills are disbursed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-red-700 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Priority 1: Field Warrant</span>
                  </div>
                  <p className="text-xs text-red-900">
                    <strong>Ghost Assets:</strong> The contractor claimed 100% completion in e-SAKSHI, but the official annual school census records <strong>zero new classrooms</strong>. Issue an immediate physical inspection warrant (Form MPLADS-INSP-1).
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase">
                    <Clock className="w-4 h-4" />
                    <span>Priority 2: Desk Review</span>
                  </div>
                  <p className="text-xs text-amber-900">
                    <strong>Timeline & Guideline Lags:</strong> Works that suffered administrative delays &gt; 75 days or require verification of demolition/replacement approvals before release of remaining funds.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Clean</span>
                  </div>
                  <p className="text-xs text-emerald-900">
                    <strong>Census Confirmed:</strong> Both e-SAKSHI and the official UDISE+ school census confirm the new classrooms, labs, or toilets exist on ground. Approved for seamless sign-off.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Member of Parliament View */}
          {activeStakeholder === 'MP' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <h3 className="font-bold text-indigo-900 text-base mb-1">
                  Role: Member of Parliament (MP) Fund Delivery
                </h3>
                <p className="text-indigo-800 text-xs leading-relaxed">
                  Every MP receives ₹5 Crore per year for local development. MEEV ensures that educational assets you recommended actually benefit the children in your constituency without contractor leakages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">
                    1. Real-Time Constituency Scorecard
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Track the exact percentage of your sanctioned educational fund that is physically accounted for across Bengaluru North schools (Yelahanka, Hebbal, Malleshwaram, Peenya, etc.).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">
                    2. Protection Against Contractor Fraud
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prevents rogue agencies from billing unbuilt classrooms or non-functional computer labs under your name, protecting your reputation and ensuring public money creates real impact.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Technical / Jury / Auditor View */}
          {activeStakeholder === 'JURY' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h3 className="font-bold text-emerald-900 text-base mb-1">
                  Core Innovation: 4-Lane Automated Cross-Silo Verification
                </h3>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  MEEV continuously solves the entity resolution problem between non-standard project names in e-SAKSHI and ground-truth UDISE+ school masters, running sub-100ms multi-lane verification.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <span className="px-2 py-1 bg-red-100 text-red-800 font-bold rounded">Lane 1</span>
                  <div>
                    <strong className="text-slate-900">Statutory Eligibility Guardrail:</strong> Verifies that public MPLADS funds are not sanctioned to private unaided institutions (MPLADS Guidelines Ch 6) and flags administrative delays &gt; 75 days.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 font-bold rounded">Lane 2</span>
                  <div>
                    <strong className="text-slate-900">Demographic & Siting Efficiency:</strong> Flags wasteful sanctions where new classrooms are allocated to schools with collapsing enrollments (Student-to-Classroom Ratio &lt; 15).
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 font-bold rounded">Lane 3</span>
                  <div>
                    <strong className="text-slate-900">Asset Reflection (Ground Delta):</strong> Cross-references project completion dates against longitudinal UDISE+ physical audits with census freeze lag guardrails.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 font-bold rounded">Lane 4</span>
                  <div>
                    <strong className="text-slate-900">Physical Velocity & Concrete Physics:</strong> Evaluates reported construction duration against civil engineering physical limits (e.g., 28-day RCC minimum curing threshold).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Smart India Hackathon 2026 — MEEV (SIH26102)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
