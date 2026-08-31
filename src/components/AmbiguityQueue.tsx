import React, { useState } from 'react';
import { AmbiguityItem } from '../types';
import { apiClient } from '../api/client';
import { HelpCircle, CheckCircle2, MapPin } from 'lucide-react';

interface AmbiguityQueueProps {
  items: AmbiguityItem[];
  onResolved: () => void;
}

export const AmbiguityQueue: React.FC<AmbiguityQueueProps> = ({ items, onResolved }) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const defaultItems: AmbiguityItem[] = items.length > 0 ? items : [
    {
      project_id: 'PRJ-2023-09941',
      work_description_raw: 'Renovation and civil works at Shaheed Bhagat Singh Memorial High School',
      project_coords: [31.1423, 77.1724],
      candidates: [
        {
          udise_code: '02120100402',
          school_name: 'Government High School Rampur',
          distance_meters: 45,
          similarity_score: 0.38,
          management: 'GOVERNMENT',
          status: 'OPERATIONAL (Historical alias match within 50m)'
        },
        {
          udise_code: '02120100890',
          school_name: 'Bhagat Memorial Public School',
          distance_meters: 2800,
          similarity_score: 0.62,
          management: 'PRIVATE_UNAIDED',
          status: 'OPERATIONAL'
        }
      ]
    }
  ];

  const handleConfirmMatch = async (projectId: string, udiseCode: string) => {
    setResolvingId(projectId);
    try {
      await apiClient.resolveAmbiguity(projectId, udiseCode);
      onResolved();
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            Human-in-the-Loop Ambiguity Resolution Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Projects with match confidence in the 0.60 to 0.84 range or renamed school reverse-spatial triggers.
          </p>

        </div>
        <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
          {defaultItems.length} Pending Tasks
        </span>
      </div>

      <div className="space-y-4">
        {defaultItems.map((item) => (
          <div key={item.project_id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  Project: {item.project_id}
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  "{item.work_description_raw}"
                </p>
              </div>
              {item.project_coords && (
                <div className="text-xs text-slate-500 flex items-center font-mono">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                  {item.project_coords[0]}, {item.project_coords[1]}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Potential Candidate Matches in District:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.candidates.map((cand) => (
                  <div
                    key={cand.udise_code}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-slate-900">{cand.school_name}</span>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {cand.udise_code}
                        </span>
                      </div>
                      <div className="mt-2 text-xs space-y-1 text-slate-600">
                        <div><b>Distance:</b> {cand.distance_meters}m from project GPS</div>
                        <div><b>Management:</b> {cand.management}</div>
                        <div><b>Note:</b> {cand.status}</div>
                      </div>
                    </div>

                    <button
                      disabled={resolvingId === item.project_id}
                      onClick={() => handleConfirmMatch(item.project_id, cand.udise_code)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Confirm Match to {cand.udise_code}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
