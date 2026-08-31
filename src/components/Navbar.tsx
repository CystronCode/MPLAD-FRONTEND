import { BarChart3, ListFilter, HelpCircle, Layers, BookOpen, RotateCcw, MapPin, ChevronDown, FileSpreadsheet } from 'lucide-react';
import { ConstituencySummary } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tier3Count: number;
  ambiguityCount: number;
  constituencies?: ConstituencySummary[];
  selectedConstituency?: string;
  onSelectConstituency?: (code: string) => void;
  onStreamClaim?: () => void;
  isStreaming?: boolean;
  onOpenGuide?: () => void;
  onOpenCsvModal?: () => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tier3Count,
  ambiguityCount,
  constituencies = [],
  selectedConstituency = 'KA-24',
  onSelectConstituency,
  onStreamClaim,
  isStreaming,
  onOpenGuide,
  onOpenCsvModal,
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
              <span className="text-xs ml-2 text-slate-400 font-medium hidden md:inline">
                MPLADS Decision Core
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

          {/* Right Controls: Interactive 28-Constituency Dropdown & Stream */}
          <div className="flex items-center space-x-2">
            {onOpenCsvModal && (
              <button
                onClick={onOpenCsvModal}
                className="flex items-center px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition-all border border-teal-400/40"
                title="Ingest raw external CSV datasets (karnataka_schools_raw.csv & karnataka_works_raw.csv)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-teal-200" />
                <span className="hidden sm:inline">📂 Ingest CSV</span>
              </button>
            )}

            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="flex items-center px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all border border-indigo-400/40"
                title="View stakeholder guide & plain-English explanations"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1 text-indigo-200" />
                <span className="hidden sm:inline">📘 Explainer</span>
              </button>
            )}

            {onStreamClaim && (
              <button
                onClick={onStreamClaim}
                disabled={isStreaming}
                className="flex items-center px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all border border-emerald-400/40 disabled:opacity-50"
                title={`Trigger a real-time e-SAKSHI claim webhook for ${selectedConstituency}`}
              >
                <span className={`w-2 h-2 mr-1 rounded-full bg-white ${isStreaming ? 'animate-ping' : 'animate-pulse'}`}></span>
                <span>{isStreaming ? 'Ingesting...' : '⚡ Stream Claim'}</span>
              </button>
            )}

            {/* Interactive 28 Karnataka Constituencies Selector */}
            {onSelectConstituency && (
              <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 flex-shrink-0" />
                <select
                  value={selectedConstituency}
                  onChange={(e) => onSelectConstituency(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                  title="Switch between Karnataka Parliamentary Constituencies"
                >
                  <option value="ALL" className="bg-slate-900 text-white">
                    🏛️ Karnataka State (All 28 Seats)
                  </option>
                  <optgroup label="28 Karnataka MP Constituencies" className="bg-slate-900 text-white">
                    {constituencies.length > 0 ? (
                      constituencies.map((c) => (
                        <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                          {c.name} ({c.code})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="KA-24" className="bg-slate-900 text-white">Bangalore North (KA-24)</option>
                        <option value="KA-26" className="bg-slate-900 text-white">Bangalore South (KA-26)</option>
                        <option value="KA-25" className="bg-slate-900 text-white">Bangalore Central (KA-25)</option>
                        <option value="KA-21" className="bg-slate-900 text-white">Mysore (KA-21)</option>
                        <option value="KA-17" className="bg-slate-900 text-white">Dakshina Kannada (KA-17)</option>
                        <option value="KA-02" className="bg-slate-900 text-white">Belgaum (KA-02)</option>
                      </>
                    )}
                  </optgroup>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-1.5" />
                
                {onResetData && (
                  <button
                    onClick={onResetData}
                    className="text-slate-400 hover:text-white p-0.5 ml-1 transition-colors"
                    title="Purge and re-seed clean Karnataka State baseline"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
