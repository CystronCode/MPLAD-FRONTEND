import React from 'react';
import { BarChart3, ListFilter, HelpCircle, Layers, BookOpen, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tier3Count: number;
  ambiguityCount: number;
  onStreamClaim?: () => void;
  isStreaming?: boolean;
  onOpenGuide?: () => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tier3Count,
  ambiguityCount,
  onStreamClaim,
  isStreaming,
  onOpenGuide,
  onResetData
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="bg-blue-600 p-2 rounded-xl text-white font-bold flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                MEEV
              </span>
              <span className="text-xs ml-2 text-slate-400 font-medium hidden sm:inline">
                MPLADS Decision Support
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'queue'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ListFilter className="w-4 h-4 mr-1.5" />
              Works Queue
              {tier3Count > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {tier3Count} Warrants
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ambiguity')}
              className={`flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ambiguity'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 mr-1.5" />
              Ambiguity Triage
              {ambiguityCount > 0 && (
                <span className="ml-2 bg-amber-500 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  {ambiguityCount}
                </span>
              )}
            </button>
          </nav>

          {/* Streamlined Right Controls */}
          <div className="flex items-center space-x-2">
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="flex items-center px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all border border-indigo-400/40"
                title="View stakeholder guide & plain-English explanations"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-200" />
                <span>📘 Explainer Guide</span>
              </button>
            )}

            {onStreamClaim && (
              <button
                onClick={onStreamClaim}
                disabled={isStreaming}
                className="flex items-center px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all border border-emerald-400/40 disabled:opacity-50"
                title="Trigger a real-time Bengaluru North e-SAKSHI claim webhook"
              >
                <span className={`w-2 h-2 mr-1.5 rounded-full bg-white ${isStreaming ? 'animate-ping' : 'animate-pulse'}`}></span>
                {isStreaming ? 'Ingesting...' : '⚡ Stream Claim'}
              </button>
            )}

            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Bengaluru North (KA)</span>
              {onResetData && (
                <button
                  onClick={onResetData}
                  className="text-slate-400 hover:text-white p-0.5 transition-colors ml-1"
                  title="Purge test records and reset to clean Bengaluru North baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
