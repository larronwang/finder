export interface CensusData {
  fullName: string;
  hkid: string; // Partial or masked
  gender: 'Male' | 'Female' | 'Other';
  age: string;
  ethnicity: string;
  education: string;
  industry: string;
  occupation: string;
  migrationStatus: string; // e.g., "Born in HK", "Moved < 1 year"
  maritalStatus: string;
  mortalityInHousehold: boolean; // Recent deaths in household
  housingType: string;
}

export enum AppStep {
  WELCOME = 'WELCOME',
  FORM = 'FORM',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD'
}

export interface DistrictAnalysis {
  id: string; // The parent District ID (e.g., CW, WC)
  density: number; // 0-100 score
  analysis?: string;
}

export interface MapMetric {
  key: keyof CensusData;
  label: string;
}

// Geometry type for TPU units
export interface TPUPath {
  id: string;
  districtId: string; // Links back to parent district for data mapping
  name: string;
  d: string; // SVG path data
}
