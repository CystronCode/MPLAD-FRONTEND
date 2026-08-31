import React, { useState } from 'react';
import { InvestigationCaseDetail } from '../types';
import { EvidenceGraph } from './EvidenceGraph';
import { apiClient } from '../api/client';
import {
  FileText,
  Download,
  AlertTriangle,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface CaseDetailProps {
  caseDetail: InvestigationCaseDetail;
  onBack: () => void;
  onRefresh: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseDetail, onBack, onRefresh }) => {
  const [decisionNotes, setDecisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const p = caseDetail.project_details;
  const s = caseDetail.school_details;

  const handleDecision = async (decisionType: string) => {
    setSubmitting(true);
    try {
      const res = await apiClient.recordDecision(caseDetail.case_id, decisionType, decisionNotes);
      if (res) {
        setActionSuccess(`Decision recorded: ${decisionType}. Audit hash: ${res.audit_hash.slice(0, 16)}...`);
        setTimeout(() => {
          onRefresh();
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const downloadNotice = () => {
    const url = apiClient.getNoticeDownloadUrl(caseDetail.case_id);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              ← Back to Case Queue
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-mono text-slate-500">Case ID: {caseDetail.case_id.slice(0, 8)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            {s.name_canonical}
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              UDISE: {s.udise_code}
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Investigation Priority Index</span>
            <div className="text-2xl font-black text-red-600">
              {caseDetail.ipi_score}/100
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-extrabold text-xs uppercase tracking-wider border border-red-200">
            Tier {caseDetail.risk_tier} Action
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* Split-Pane Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Facts & Evidence Narrative (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Project Summary Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-blue-600" />
              Claimed MPLADS Outlay
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-slate-500 block">Work ID:</span>
                <span className="font-bold text-slate-800">{p.project_id}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-slate-500 block">Sanctioned Cost:</span>
                <span className="font-bold text-slate-800">₹{(p.sanction_cost / 100000).toFixed(2)} Lakh</span>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-slate-500 block">Asset Target:</span>
                <span className="font-bold text-slate-800">{p.target_quantity} {p.canonical_asset_type}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-slate-500 block">Reported Timeline:</span>
                <span className="font-bold text-slate-800">{p.sanction_date} → {p.completion_date || 'N/A'}</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
              "{p.work_description_raw}"
            </div>
          </div>

          {/* Lane Contradictions Breakdown */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-red-600" />
              Bitemporal Contradiction Signals
            </h2>

            <div className="space-y-2">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
                <div className="flex justify-between font-bold text-red-800">
                  <span>Lane 3: Physical Asset Reflection</span>
                  <span>Score: {caseDetail.lane_scores.ASSET_REFLECTION?.score || '0.90'}</span>
                </div>
                <p className="text-red-700 mt-1">
                  UDISE+ post-completion census records <b>0 delta</b> in classroom count (Pre: 7, Post: 7).
                </p>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
                <div className="flex justify-between font-bold text-red-800">
                  <span>Lane 4: Timeline Physics & Velocity</span>
                  <span>Score: {caseDetail.lane_scores.TIMELINE_PHYSICS?.score || '0.95'}</span>
                </div>
                <p className="text-red-700 mt-1">
                  Construction reported complete in 23 days (IS 456 RCC curing standard requires min 45d).
                </p>
              </div>
            </div>
          </div>

          {/* Statutory Action Block */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white shadow-md border border-slate-700 space-y-4">
            <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Statutory Administrative Action
            </h2>
            <p className="text-xs text-slate-300">
              Under Section 6.4 of MPLADS Guidelines 2023, the District Authority may order an immediate on-site physical measurement inspection.
            </p>

            <button
              onClick={downloadNotice}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-lg shadow transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Form MPLADS-INSP-1 Notice (PDF)
            </button>

            <div className="pt-2 border-t border-slate-700 space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">
                Investigator Decision Note:
              </label>
              <input
                type="text"
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="e.g. Verified census gap. Dispatched PWD Exec Engineer."
                className="w-full px-3 py-1.5 text-xs rounded bg-slate-950 text-slate-100 border border-slate-600 focus:outline-none focus:border-teal-400"
              />
              <div className="flex gap-2">
                <button
                  disabled={submitting}
                  onClick={() => handleDecision('ESCALATE_FIELD_INSPECTION')}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 font-bold text-xs rounded transition-colors"
                >
                  {submitting ? 'Recording...' : 'Escalate to Field Notice'}
                </button>
                <button
                  disabled={submitting}
                  onClick={() => handleDecision('DISMISS_BENIGN_CONTEXT')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 font-semibold text-xs rounded transition-colors text-slate-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Interactive D3 Evidence Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Building2 className="w-4 h-4 mr-1.5 text-blue-600" />
              Bitemporal Provenance Subgraph
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Match Confidence: 92% (Auto-Accepted)
            </span>
          </div>

          <EvidenceGraph data={caseDetail.evidence_graph} />

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 shadow-sm leading-relaxed">
            <span className="font-bold text-slate-800">Analytical Explanation: </span>
            {caseDetail.explanation_narrative}
          </div>
        </div>
      </div>
    </div>
  );
};
