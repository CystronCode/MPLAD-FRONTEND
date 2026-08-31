import React, { useState } from 'react';
import { X, FileSpreadsheet, Play, CheckCircle2, AlertCircle, Database, Server } from 'lucide-react';
import { apiClient } from '../api/client';

interface CsvIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CsvIngestModal: React.FC<CsvIngestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunPipeline = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiClient.triggerCsvPipeline();
      if (res && res.status === 'SUCCESS') {
        setResult(res);
        onSuccess();
      } else {
        setError('Pipeline returned an unexpected response. Please check server logs.');
      }
    } catch (e: any) {
      setError(e?.message || 'Error triggering CSV pipeline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">External CSV & Open Data Ingestion Pipeline</h2>
              <p className="text-xs text-slate-400">
                Load raw Karnataka school infrastructure and MPLADS works CSV datasets into MEEV Core
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* File location card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center">
                <Database className="w-3.5 h-3.5 mr-1.5" />
                Raw Data Source Files on Server
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                UTF-8 CSV
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-slate-500">Schools: </span>
                  <span className="text-slate-200">backend/data/karnataka_schools_raw.csv</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 ml-2">
                  UDISE+ Schema
                </span>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-slate-500">Works: </span>
                  <span className="text-slate-200">backend/data/karnataka_works_raw.csv</span>
                </div>
                <span className="text-[10px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40 ml-2">
                  e-SAKSHI / Dataful
                </span>
              </div>
            </div>
          </div>

          {/* Pipeline Workflow Info */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <h3 className="font-bold text-slate-200 flex items-center">
              <Server className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              What Happens When You Execute:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Parses school master records, GPS coordinates, and 2-year longitudinal census returns.</li>
              <li>Runs free-text work descriptions through the <span className="text-slate-200 font-semibold">7-Stage Entity Matcher</span> (Jaro-Winkler + Haversine).</li>
              <li>Evaluates claims across the <span className="text-slate-200 font-semibold">4 Anomaly Detection Lanes</span> and calculates final IPI scores.</li>
            </ul>
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>{result.message}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-slate-300">
                <div className="p-2 bg-slate-900/80 rounded border border-emerald-900/50">
                  <span className="text-slate-400 block text-[10px]">Schools Ingested</span>
                  <span className="text-sm font-bold text-white">{result.details?.schools || 8} Records</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded border border-emerald-900/50">
                  <span className="text-slate-400 block text-[10px]">Works Audited</span>
                  <span className="text-sm font-bold text-white">{result.details?.works || 8} Claims</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Card */}
          {error && (
            <div className="bg-red-950/40 border border-red-600/40 rounded-xl p-3 text-xs text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleRunPipeline}
            disabled={loading}
            className="flex items-center px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all border border-teal-400/40 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Executing Ingestion & Evaluation...' : '⚡ Ingest & Audit CSV Dataset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
