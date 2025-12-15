import React, { useState } from 'react';
import { CensusData } from '../types';
import { EDUCATION_LEVELS, INDUSTRIES, HOUSING_TYPES, MIGRATION_STATUS, ETHNICITIES } from '../constants';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

// --- iOS Style Components ---

const SectionHeader = ({ title, footer }: { title: string, footer?: string }) => (
  <div className="px-5 pb-2 pt-6">
    <h3 className="text-[13px] text-gray-500 uppercase tracking-wide font-normal">{title}</h3>
    {footer && <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">{footer}</p>}
  </div>
);

const InsetGroup = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-white mx-4 rounded-xl overflow-hidden border border-gray-200/60 shadow-sm">
    {children}
  </div>
);

interface ListInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  last?: boolean;
}

const ListInput = ({ label, value, onChange, placeholder, type = 'text', last }: ListInputProps) => (
  <div className={`flex items-center pl-4 pr-4 py-4 min-h-[54px] bg-white ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="text-black text-[17px] w-2/5 shrink-0 font-medium">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 text-right text-[#007AFF] placeholder-gray-300 text-[17px] bg-transparent outline-none"
    />
  </div>
);

interface ListSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  last?: boolean;
}

const ListSelect = ({ label, options, value, onChange, last }: ListSelectProps) => (
  <div className={`flex items-center pl-4 pr-4 py-4 min-h-[54px] bg-white relative ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="text-black text-[17px] w-2/5 shrink-0 font-medium">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 text-right text-[#007AFF] text-[17px] bg-transparent outline-none appearance-none pr-6 dir-rtl"
      style={{ direction: 'rtl' }}
    >
        <option value="" disabled>Select</option>
        {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none">
       <ChevronRight size={20} />
    </div>
  </div>
);

interface ListToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  last?: boolean;
}

const ListToggle = ({ label, checked, onChange, last }: ListToggleProps) => (
  <div className={`flex items-center justify-between pl-4 pr-4 py-4 min-h-[54px] bg-white ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="text-black text-[17px] font-medium">{label}</span>
    <div 
        onClick={() => onChange(!checked)}
        className={`w-[51px] h-[31px] rounded-full p-[2px] cursor-pointer transition-colors duration-200 ease-in-out relative ${checked ? 'bg-[#34C759]' : 'bg-[#E9E9EA]'}`}
    >
        <div className={`w-[27px] h-[27px] bg-white rounded-full shadow-md transform transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`} />
    </div>
  </div>
);

interface CensusFormProps {
  onComplete: (data: CensusData) => void;
}

const INITIAL_DATA: CensusData = {
  fullName: '',
  hkid: '',
  gender: 'Male',
  age: '',
  ethnicity: '',
  education: '',
  industry: '',
  occupation: '',
  migrationStatus: '',
  maritalStatus: 'Single',
  mortalityInHousehold: false,
  housingType: ''
};

export const CensusForm: React.FC<CensusFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<CensusData>(INITIAL_DATA);

  const updateField = (key: keyof CensusData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateStep = (currentStep: number, data: CensusData): string | null => {
    const ageNum = parseInt(data.age);

    if (currentStep === 0) {
      if (!data.fullName.trim()) return "Please enter your full name.";
      if (!data.hkid.trim()) return "Please enter your HKID.";
      if (!data.age || isNaN(ageNum) || ageNum < 0 || ageNum > 120) return "Please enter a valid age (0-120).";
    }

    if (currentStep === 1) {
      if (!data.ethnicity) return "Please select your ethnicity.";
      if (!data.education) return "Please select your education level.";
      if (!data.maritalStatus) return "Please select your marital status.";

      // --- Logic Checks for Data Consistency ---
      
      // Marriage Age Check
      if (data.maritalStatus !== 'Single' && ageNum < 16) {
        return `Legal marriage age in Hong Kong is generally 16+. You entered age ${ageNum}.`;
      }
      
      // Education vs Age Checks
      const isHigherEd = data.education.includes('Bachelor') || data.education.includes('Master') || data.education.includes('Associate') || data.education.includes('Diploma');
      const isSecondary = data.education.includes('Secondary');

      if (isHigherEd && ageNum < 17) {
         return `It is unlikely to hold a higher education degree at age ${ageNum}. Please check Age or Education.`;
      }
      if (isSecondary && ageNum < 11) {
         return `Secondary education usually starts around age 12. Please check your inputs.`;
      }
    }

    if (currentStep === 2) {
       if (!data.industry) return "Please select your industry.";
       if (!data.occupation.trim()) return "Please enter your occupation.";
       if (!data.housingType) return "Please select your housing type.";
    }

    if (currentStep === 3) {
       if (!data.migrationStatus) return "Please select migration status.";
    }

    return null;
  };

  const steps = [
    {
      title: "Identity",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
          <SectionHeader title="Basic Information" />
          <InsetGroup>
             <ListInput label="Full Name" value={formData.fullName} onChange={v => updateField('fullName', v)} placeholder="Chan Tai Man" />
             <ListInput label="HKID / ID" value={formData.hkid} onChange={v => updateField('hkid', v)} placeholder="A123456(7)" last />
          </InsetGroup>

          <SectionHeader title="Demographics" />
          <InsetGroup>
             <ListSelect label="Gender" value={formData.gender} onChange={v => updateField('gender', v)} options={['Male', 'Female', 'Other']} />
             <ListInput label="Age" type="number" value={formData.age} onChange={v => updateField('age', v)} placeholder="35" last />
          </InsetGroup>
        </div>
      )
    },
    {
      title: "Background",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
          <SectionHeader title="Cultural & Social" />
          <InsetGroup>
             <ListSelect label="Ethnicity" value={formData.ethnicity} onChange={v => updateField('ethnicity', v)} options={ETHNICITIES} />
             <ListSelect label="Education" value={formData.education} onChange={v => updateField('education', v)} options={EDUCATION_LEVELS} />
             <ListSelect label="Marital Status" value={formData.maritalStatus} onChange={v => updateField('maritalStatus', v)} options={['Single', 'Married', 'Divorced', 'Widowed']} last />
          </InsetGroup>
        </div>
      )
    },
    {
      title: "Economics",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
          <SectionHeader title="Employment & Housing" />
          <InsetGroup>
             <ListSelect label="Industry" value={formData.industry} onChange={v => updateField('industry', v)} options={INDUSTRIES} />
             <ListInput label="Occupation" value={formData.occupation} onChange={v => updateField('occupation', v)} placeholder="Engineer, Retired..." />
             <ListSelect label="Housing Type" value={formData.housingType} onChange={v => updateField('housingType', v)} options={HOUSING_TYPES} last />
          </InsetGroup>
        </div>
      )
    },
    {
      title: "Details",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
           <SectionHeader title="Residency" />
           <InsetGroup>
             <ListSelect label="Migration Status" value={formData.migrationStatus} onChange={v => updateField('migrationStatus', v)} options={MIGRATION_STATUS} last />
           </InsetGroup>

           <SectionHeader title="Household" footer="Has anyone in your household passed away in the last 12 months?" />
           <InsetGroup>
             <ListToggle label="Recent Mortality" checked={formData.mortalityInHousehold} onChange={v => updateField('mortalityInHousehold', v)} last />
           </InsetGroup>
        </div>
      )
    }
  ];

  const handleNext = () => {
    const error = validateStep(step, formData);
    if (error) {
      // Native-like alert for accessibility and clarity
      window.alert(error);
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      {/* iOS Navigation Bar */}
      <div className="pt-safe-top bg-white/80 backdrop-blur-md border-b border-gray-300 sticky top-0 z-20">
         <div className="h-12 flex items-center justify-between px-4">
            <div className="w-20">
              {step > 0 && (
                <button onClick={handleBack} className="flex items-center text-[#007AFF] text-[17px] ios-active py-2">
                  <ChevronLeft size={24} className="-ml-1.5" />
                  <span>Back</span>
                </button>
              )}
            </div>
            <div className="font-semibold text-[17px] text-black">
              {steps[step].title}
            </div>
            <div className="w-20 text-right">
              <span className="text-gray-400 text-[15px] font-medium">{step + 1} / {steps.length}</span>
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden safe-area-bottom pb-32">
        {steps[step].content}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-300 px-6 py-4 safe-area-bottom z-50">
        <button 
            onClick={handleNext}
            className="w-full bg-[#007AFF] text-white font-bold text-[19px] py-4 rounded-xl shadow-sm ios-active active:scale-[0.98] transition-transform"
        >
            {step === steps.length - 1 ? 'Submit Census' : 'Next'}
        </button>
      </div>
    </div>
  );
};