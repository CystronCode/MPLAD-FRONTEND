import React from 'react';
import { BarChart3, ListFilter, HelpCircle, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tier3Count: number;
  ambiguityCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tier3Count,
  ambiguityCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                MEEV
              </span>
              <span className="text-xs ml-2 text-slate-400 font-mono">
                SIH26102 GovTech Decision Core
              </span>
            </div>
          </div>

          <nav className="flex space-x-1 sm:space-x-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              District Overview
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'queue'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ListFilter className="w-4 h-4 mr-1.5" />
              Investigation Queue
              {tier3Count > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {tier3Count}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ambiguity')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ambiguity'
                  ? 'bg-blue-600 text-white'
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

          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Kangra District (HP)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
