import React, { useState, useEffect } from 'react';
import { CensusData, DistrictAnalysis, MapMetric, VISUALIZATION_OPTIONS } from '../types';
import HKTPUMap from './HKTPUMap';
import { analyzeDemographics } from '../services/gemini';
import { Sparkles, User, RefreshCcw } from 'lucide-react';

interface DashboardProps {
  userData: CensusData;
}

const METRICS: MapMetric[] = VISUALIZATION_OPTIONS;

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

  const mostCorrelatedDistrict = mapData.sort((a,b) => b.density - a.density)[0]?.id || userData.district || 'Unknown';
  const userMetricValue = userData[selectedMetric.key as keyof CensusData];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F2F2F7] relative overflow-hidden">
      
      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
         <HKTPUMap 
            userData={userData}
            visualizationMetric={selectedMetric.key}
            mapData={mapData} 
         />
      </div>

      {/* Floating Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 pt-safe-top">
         <div className="px-5 pb-4 pt-3 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[24px] font-bold text-black tracking-tight">Census Map</h1>
                 <button 
                       className="h-10 w-10 bg-gray-200/60 rounded-full flex items-center justify-center text-[#007AFF] ios-active"
                       onClick={() => window.alert(`User: ${userData.fullName}\nAge: ${userData.age}`)} 
                    >
                    <User size={20} />
                </button>
            </div>
            
            {/* Metric Selector */}
            <div className="flex bg-[#7676801F] rounded-xl p-1 overflow-x-auto no-scrollbar snap-x">
                {METRICS.map(metric => (
                    <button
                        key={metric.key}
                        onClick={() => setSelectedMetric(metric)}
                        className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-lg text-[16px] font-semibold transition-all snap-center ${
                            selectedMetric.key === metric.key
                            ? 'bg-white text-black shadow-lg' 
                            : 'text-gray-700'
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
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-xl flex items-center space-x-2 border border-white/70">
                  <RefreshCcw className="animate-spin text-[#007AFF]" size={20} />
                  <span className="text-black font-semibold text-[16px]">Updating map data...</span>
              </div>
          </div>
      )}

      {/* Bottom Sheet / Insight Card */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-safe-bottom bg-white/95 backdrop-blur-2xl rounded-t-[30px] border-t border-white/30 shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
           <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-5"></div>
           <div className="px-6 pb-6">
               <div className="flex items-start space-x-5">
                  <div className="bg-gradient-to-tr from-[#007AFF] to-[#5856D6] p-3 rounded-xl shadow-lg text-white shrink-0">
                      <Sparkles size={28} />
                  </div>
                  <div>
                      <h3 className="text-[20px] font-bold text-black mb-1">Demographic Insight</h3>
                      <p className="text-[17px] text-gray-700 leading-snug">
                          People with similar <span className="font-semibold">{selectedMetric.label} ({userMetricValue})</span> are most concentrated in 
                          <span className="text-[#D32F2F] font-bold"> {mostCorrelatedDistrict}</span>.
                      </p>
                  </div>
               </div>
           </div>
      </div>
    </div>
  );
};