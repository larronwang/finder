import React, { useState, useEffect } from 'react';
import { CensusData, DistrictAnalysis, MapMetric } from '../types';
import { HKMap } from './HKMap';
import { analyzeDemographics } from '../services/gemini';
import { Sparkles, User, RefreshCcw, Layers } from 'lucide-react';

interface DashboardProps {
  userData: CensusData;
}

const METRICS: MapMetric[] = [
  { key: 'age', label: 'Age' },
  { key: 'ethnicity', label: 'Ethnicity' },
  { key: 'industry', label: 'Industry' },
  { key: 'housingType', label: 'Housing' },
  { key: 'maritalStatus', label: 'Marital' },
];

export const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  const [selectedMetric, setSelectedMetric] = useState<MapMetric>(METRICS[0]);
  const [mapData, setMapData] = useState<DistrictAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [selectedMetric]);

  const fetchInsights = async () => {
    setLoading(true);
    const data = await analyzeDemographics(userData, selectedMetric.key);
    setMapData(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F2F2F7] relative overflow-hidden">
      
      {/* Map Layer (Full Screen Background) */}
      <div className="absolute inset-0 z-0">
         <HKMap data={mapData} selectedMetricLabel={selectedMetric.label} />
      </div>

      {/* Floating Top Navigation Bar (Glassmorphism) */}
      <header className="absolute top-0 left-0 right-0 z-20 pt-safe-top">
         <div className="px-4 pb-3 pt-2 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-[22px] font-bold text-black tracking-tight">HK Census Map</h1>
                 <button className="h-8 w-8 bg-gray-200/50 rounded-full flex items-center justify-center text-[#007AFF] ios-active">
                    <User size={18} />
                </button>
            </div>
            
            {/* Segmented Control Style Metric Selector */}
            <div className="flex bg-[#7676801F] rounded-lg p-0.5 overflow-x-auto no-scrollbar snap-x">
                {METRICS.map(metric => (
                    <button
                        key={metric.key}
                        onClick={() => setSelectedMetric(metric)}
                        className={`flex-1 whitespace-nowrap px-3 py-1.5 rounded-[7px] text-[13px] font-medium transition-all snap-center ${
                            selectedMetric.key === metric.key
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500'
                        }`}
                    >
                        {metric.label}
                    </button>
                ))}
            </div>
         </div>
      </header>

      {/* Loading Overlay */}
      {loading && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-white/50">
                  <RefreshCcw className="animate-spin text-[#007AFF]" size={16} />
                  <span className="text-black font-medium text-xs">Updating...</span>
              </div>
          </div>
      )}

      {/* Bottom Sheet / Insight Card */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-safe-bottom bg-white/80 backdrop-blur-2xl rounded-t-[30px] border-t border-white/20 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
           <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4"></div>
           <div className="px-6 pb-6">
               <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-tr from-[#007AFF] to-[#5856D6] p-2.5 rounded-xl shadow-md text-white shrink-0">
                      <Sparkles size={24} />
                  </div>
                  <div>
                      <h3 className="text-[17px] font-semibold text-black mb-1">Demographic Insight</h3>
                      <p className="text-[15px] text-gray-600 leading-snug">
                          Your profile ({userData[selectedMetric.key]}) shows high correlation with residents in 
                          <span className="text-[#007AFF] font-semibold"> {mapData.sort((a,b) => b.density - a.density)[0]?.id || 'Central'}</span>.
                      </p>
                  </div>
               </div>
           </div>
      </div>
    </div>
  );
};
