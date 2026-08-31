import React, { useState } from 'react';
import { InvestigationCaseDetail } from '../types';
import { EvidenceGraph } from './EvidenceGraph';
import { apiClient } from '../api/client';
import {
  FileText,
  Download,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Send,
  XCircle,
  CheckCircle,
  FileBadge
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
        setActionSuccess(`Enforcement action recorded: ${decisionType}. Cryptographic audit hash: ${res.audit_hash.slice(0, 16)}...`);
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
      {/* Top Header for District Collectorate */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center"
            >
              ← Back to Constituency Works Queue
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-mono text-slate-500">Work ID: {caseDetail.project_id}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2">
            {s.name_canonical}
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
              UDISE: {s.udise_code}
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold block">Audit Discrepancy Priority</span>
            <div className="text-2xl font-black text-red-600">
              {caseDetail.ipi_score}/100
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-red-100 text-red-800 font-black text-xs uppercase tracking-wider border border-red-200 shadow-sm">
            Priority {caseDetail.risk_tier} Action
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm font-semibold flex items-center shadow-sm">
          <ShieldCheck className="w-5 h-5 mr-2.5 text-emerald-600 flex-shrink-0" />
          {actionSuccess}
        </div>
      )}

      {/* Split-Pane Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Facts & Executive Brief (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Claimed Work Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-blue-600" />
                Sanctioned MPLADS Claim Details
              </h2>
              <span className="text-xs font-mono text-slate-500">{p.project_id}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
              "{p.work_description_raw}"
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Sanctioned Outlay</span>
                <span className="font-black text-sm text-slate-900 mt-0.5 block">
                  ₹{(p.sanction_cost / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Sanction Date</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {String(p.sanction_date || 'N/A')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Reported Completion</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {String(p.completion_date || 'In Progress')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Institution Category</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {s.management_category.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Ground Audit Findings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
              Automated Ground Audit Findings
            </h2>
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
              {caseDetail.explanation_narrative}
            </div>
          </div>

          {/* Statutory Inspection Warrant Action Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md border border-slate-700 space-y-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                District Magistrate Enforcement Actions
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                Issue Field Warrant or Clearance
              </h3>
            </div>

            <textarea
              placeholder="Enter official collectorate notes / inspection dispatch instructions..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-xl bg-slate-800/90 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:border-teal-400"
            />

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDecision('ESCALATE_FIELD_INSPECTION')}
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs text-white transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Issue Field Inspection Warrant (Form MPLADS-INSP-1)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={downloadNotice}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Notice (PDF)</span>
                </button>
                <button
                  onClick={() => handleDecision('VERIFY_LEGITIMATE')}
                  disabled={submitting}
                  className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-bold text-xs text-white transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Certify Clean</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Interactive Provenance Graph (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-full min-h-[540px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center">
                  <Building2 className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Inter-System Audit Provenance Graph
                </h2>
                <span className="text-xs text-slate-500">
                  Visual proof connecting e-SAKSHI claim nodes with official UDISE+ school ground census records.
                </span>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200">
                Interactive D3 Canvas
              </span>
            </div>

            <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
              <EvidenceGraph caseId={caseDetail.case_id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
