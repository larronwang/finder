import React, { useState } from 'react';
import { CensusData } from '../types'; 
import { EDUCATION_LEVELS, INDUSTRIES, HOUSING_TYPES, MIGRATION_STATUS, ETHNICITIES, DISTRICTS } from '../constants'; 
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

// --- iOS Style Components (适老化增强) ---

const SectionHeader = ({ title, footer }: { title: string, footer?: string }) => (
  <div className="px-5 pb-2 pt-6">
    <h3 className="text-[15px] text-gray-500 uppercase tracking-wide font-medium">{title}</h3>
    {footer && <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">{footer}</p>}
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
  name: keyof CensusData;
}

const ListInput: React.FC<ListInputProps> = ({ label, value, onChange, placeholder, type = 'text', last, name }) => (
  <div className={`flex items-center pl-4 pr-4 py-3 min-h-[60px] bg-white ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="text-black text-[18px] w-2/5 shrink-0 font-medium">{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 text-right text-[#007AFF] placeholder-gray-400 text-[18px] bg-transparent outline-none"
    />
  </div>
);

interface ListSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  last?: boolean;
  name: keyof CensusData;
}

const ListSelect: React.FC<ListSelectProps> = ({ label, options, value, onChange, last, name }) => (
  <div className={`flex items-center pl-4 pr-4 py-3 min-h-[60px] bg-white relative ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="text-black text-[18px] w-2/5 shrink-0 font-medium">{label}</span>
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 text-right text-[#007AFF] text-[18px] bg-transparent outline-none appearance-none pr-6 dir-rtl" 
      style={{ direction: 'rtl' }}
    >
      <option value="" disabled>Select</option>
      {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
       <ChevronRight size={22} />
    </div>
  </div>
);

interface ListToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  last?: boolean;
}

const ListToggle: React.FC<ListToggleProps> = ({ label, checked, onChange, last }) => (
  <div className={`flex items-center justify-between pl-4 pr-4 py-3 min-h-[60px] bg-white ${!last ? 'border-b border-gray-100' : ''}`}>
    <span className="text-black text-[18px] font-medium">{label}</span>
    <div 
        onClick={() => onChange(!checked)}
        className={`w-[56px] h-[34px] rounded-full p-[2px] cursor-pointer transition-colors duration-200 ease-in-out relative ${checked ? 'bg-[#34C759]' : 'bg-[#E9E9EA]'}`}
    >
        <div className={`w-[30px] h-[30px] bg-white rounded-full shadow-md transform transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${checked ? 'translate-x-[22px]' : 'translate-x-0'}`} />
    </div>
  </div>
);

// --- 主组件 ---

interface CensusFormProps {
  onComplete: (data: CensusData) => void;
}

const INITIAL_DATA: CensusData = { 
    fullName: '', hkid: '', gender: 'Male', age: '', ethnicity: '', education: '', industry: '', 
    occupation: '', migrationStatus: '', maritalStatus: 'Single', mortalityInHousehold: false, 
    housingType: '', district: ''
};

export const CensusForm: React.FC<CensusFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<CensusData>(INITIAL_DATA);

  const updateField = (key: keyof CensusData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateStep = (currentStep: number, data: CensusData): string | null => {
    const ageNum = Number(data.age); 

    if (currentStep === 0) {
      if (!data.fullName.trim()) return "Please enter your full name.";
      if (!data.hkid.trim()) return "Please enter your HKID.";
      if (!data.age || isNaN(ageNum) || ageNum < 0 || ageNum > 120) return "Please enter a valid age (0-120).";
      if (!data.district) return "Please select your district of residence."; 
    }

    if (currentStep === 1) {
      if (!data.ethnicity) return "Please select your ethnicity.";
      if (!data.education) return "Please select your education level.";
      if (!data.maritalStatus) return "Please select your marital status.";
      
      if (data.maritalStatus !== 'Single' && ageNum < 16) {
        return `Legal marriage age in Hong Kong is generally 16+. You entered age ${ageNum}.`;
      }
      
      const isHigherEd = data.education.includes('Bachelor') || data.education.includes('Master') || data.education.includes('Associate') || data.education.includes('Diploma');

      if (isHigherEd && ageNum < 17) {
        return `It is unlikely to hold a higher education degree at age ${ageNum}. Please check Age or Education.`;
      }
    }

    if (currentStep === 2) {
      const isWorkingAge = ageNum >= 18 && ageNum <= 65;
      
      if (isWorkingAge && (!data.industry || !data.occupation.trim())) {
        return "Please select your Industry and enter your Occupation, or update your age/status.";
      }
      if (!data.housingType) return "Please select your housing type.";
    }
    
    if (currentStep === 3) {
      if (!data.migrationStatus) return "Please select migration status.";
    }

    return null;
  };

  const steps = [
    {
      title: "身份信息",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
          <SectionHeader title="基本信息" />
          <InsetGroup>
             <ListInput label="全名" name='fullName' value={formData.fullName} onChange={v => updateField('fullName', v)} placeholder="Chan Tai Man 陈大文" />
             <ListInput label="香港身份证 / ID" name='hkid' value={formData.hkid} onChange={v => updateField('hkid', v)} placeholder="A123456(7)" />
             <ListSelect label="性别" name='gender' value={formData.gender} onChange={v => updateField('gender', v)} options={['Male', 'Female', 'Other']} />
             <ListInput label="年龄" name='age' type="number" value={formData.age} onChange={v => updateField('age', v)} placeholder="35" />
             <ListSelect label="居住地区" name='district' value={formData.district} onChange={v => updateField('district', v)} options={DISTRICTS} last /> 
          </InsetGroup>
        </div>
      )
    },
    {
      title: "背景资料",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
          <SectionHeader title="文化与社会" />
          <InsetGroup>
             <ListSelect label="种族" name='ethnicity' value={formData.ethnicity} onChange={v => updateField('ethnicity', v)} options={ETHNICITIES} />
             <ListSelect label="教育水平" name='education' value={formData.education} onChange={v => updateField('education', v)} options={EDUCATION_LEVELS} />
             <ListSelect label="婚姻状况" name='maritalStatus' value={formData.maritalStatus} onChange={v => updateField('maritalStatus', v)} options={['Single', 'Married', 'Divorced', 'Widowed']} last />
          </InsetGroup>
        </div>
      )
    },
    {
      title: "经济与住房",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
          <SectionHeader title="就业与住房" footer="如果您已退休/失业/学生，请在行业中选择相应选项。" />
          <InsetGroup>
             <ListSelect label="行业" name='industry' value={formData.industry} onChange={v => updateField('industry', v)} options={INDUSTRIES} />
             <ListInput label="职业" name='occupation' value={formData.occupation} onChange={v => updateField('occupation', v)} placeholder="工程师, 家庭主妇, 学生..." />
             <ListSelect label="住房类型" name='housingType' value={formData.housingType} onChange={v => updateField('housingType', v)} options={HOUSING_TYPES} last />
          </InsetGroup>
        </div>
      )
    },
    {
      title: "居住详情",
      content: (
        <div className="animate-in slide-in-from-right duration-300">
           <SectionHeader title="居住地变更" />
           <InsetGroup>
             <ListSelect label="迁移状态" name='migrationStatus' value={formData.migrationStatus} onChange={v => updateField('migrationStatus', v)} options={MIGRATION_STATUS} last />
           </InsetGroup>

           <SectionHeader title="家庭成员" footer="在过去的 12 个月内，您的家庭中是否有人去世？" />
           <InsetGroup>
             <ListToggle label="有近期死亡记录" checked={formData.mortalityInHousehold} onChange={v => updateField('mortalityInHousehold', v)} last />
           </InsetGroup>
        </div>
      )
    }
  ];

  const handleNext = () => {
    const error = validateStep(step, formData);
    if (error) {
      window.alert(`数据校验失败:\n\n${error}`);
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
         <div className="h-14 flex items-center justify-between px-4">
            <div className="w-20">
              {step > 0 && (
                <button onClick={handleBack} className="flex items-center text-[#007AFF] text-[18px] ios-active py-2">
                  <ChevronLeft size={26} className="-ml-1.5" />
                  <span>返回</span>
                </button>
              )}
            </div>
            <div className="font-semibold text-[19px] text-black">
              {steps[step].title}
            </div>
            <div className="w-20 text-right">
              <span className="text-gray-400 text-[16px] font-medium">{step + 1} / {steps.length}</span>
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
            className="w-full bg-[#007AFF] text-white font-bold text-[22px] py-4 rounded-xl shadow-sm ios-active active:scale-[0.98] transition-transform"
        >
            {step === steps.length - 1 ? '提交普查数据' : '下一步'}
        </button>
      </div>
    </div>
  );
};