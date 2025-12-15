import React, { useState } from 'react';
import { CensusData, AppStep } from './types';
import { CensusForm } from './components/CensusForm';
import { Dashboard } from './components/Dashboard';

// Elderly-friendly feature row component
const FeatureRow: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
    <div className="flex items-start space-x-4">
        <div className="shrink-0 pt-0.5">{icon}</div>
        <div>
            <h3 className="font-semibold text-black text-[20px]">{title}</h3> 
            <p className="text-gray-500 text-[18px] leading-snug">{desc}</p> 
        </div>
    </div>
);

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.WELCOME);
  const [userData, setUserData] = useState<CensusData | null>(null);

  const handleStart = () => {
    setCurrentStep(AppStep.FORM);
  };

  const handleFormComplete = (data: CensusData) => {
    setUserData(data);
    setCurrentStep(AppStep.ANALYZING);
    // Simulate data analysis delay (2 seconds)
    setTimeout(() => {
        setCurrentStep(AppStep.DASHBOARD);
    }, 2000);
  };

  // --- WELCOME STEP ---
  if (currentStep === AppStep.WELCOME) {
    return (
      <div className="h-screen flex flex-col bg-white">
          <div className="flex-1 flex flex-col px-8 pt-safe-top pb-12 overflow-y-auto">
             <div className="mt-16 mb-8">
                <div className="w-16 h-16 bg-[#FF2D55] rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h1 className="text-[38px] font-bold tracking-tight text-black leading-tight mb-2">
                    Welcome to<br/>HK Census Connect
                </h1>
                <p className="text-[18px] text-gray-500 leading-relaxed">
                    Securely submit your population data and explore demographic trends in your district via our interactive map.
                </p>
             </div>

             <div className="space-y-6 mt-4">
                 <FeatureRow 
                    icon={<div className="w-8 h-8 rounded-lg bg-blue-100 text-[#007AFF] flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>}
                    title="Quick & Easy"
                    desc="Complete your profile in under 2 minutes with our simplified form."
                 />
                 <FeatureRow 
                    icon={<div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7"/></svg></div>}
                    title="Interactive Map"
                    desc="Visualize how your demographic compares to others across Hong Kong's 18 districts."
                 />
             </div>
          </div>

          <div className="p-8 safe-area-bottom bg-white/90 backdrop-blur-md sticky bottom-0">
             <button 
                onClick={handleStart}
                className="w-full bg-[#007AFF] text-white font-bold text-[22px] py-4 rounded-xl shadow-sm ios-active"
             >
                Continue
             </button>
             <div className="flex justify-center mt-4 space-x-4 text-[13px] text-gray-400">
                 <span>Privacy Policy</span>
                 <span>•</span>
                 <span>Terms of Service</span>
             </div>
          </div>
      </div>
    );
  }

  // --- ANALYZING STEP ---
  if (currentStep === AppStep.ANALYZING) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-[#F2F2F7] p-8 text-center">
              <div className="relative w-16 h-16 mb-6">
                 <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-[#007AFF] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h2 className="text-[24px] font-bold text-black mb-1">Processing</h2>
              <p className="text-[18px] text-gray-500">Analyzing census data...</p>
          </div>
      )
  }

  // --- DASHBOARD STEP ---
  if (currentStep === AppStep.DASHBOARD && userData) {
    return <Dashboard userData={userData} />;
  }

  // --- FORM STEP ---
  return (
    <div className="h-screen bg-[#F2F2F7]">
        <CensusForm onComplete={handleFormComplete} />
    </div>
  );
}