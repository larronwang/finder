// --- Core Data Model ---

export interface CensusData {
    fullName: string;
    hkid: string; // Partial or masked
    gender: 'Male' | 'Female' | 'Other';
    age: string; // string for easier form handling
    ethnicity: string;
    education: string;
    industry: string;
    occupation: string;
    migrationStatus: string; // e.g., "Born in HK", "Moved < 1 year"
    maritalStatus: string;
    mortalityInHousehold: boolean; // Recent deaths in household
    housingType: string;
    district: string; // Key for map location
}

export interface TPUPath {
    id: string;
    districtId: string;
    name: string;
    d: string;
}

// App Step Enum
export enum AppStep {
    WELCOME = 'WELCOME',
    FORM = 'FORM',
    ANALYZING = 'ANALYZING',
    DASHBOARD = 'DASHBOARD'
}

// Map visualization data (TPU level)
export interface DistrictAnalysis {
    id: string; // The TPU ID (e.g., CW_001)
    density: number; // 0-100 score: similarity score
    analysis?: string; // AI generated text
}

// Map Metrics (Buttons in Dashboard)
export interface MapMetric {
    key: keyof CensusData;
    label: string;
}

// Initial Data for Form
export const initialCensusData: CensusData = {
    fullName: 'Chan Tai Man',
    hkid: 'Z123456(7)',
    gender: 'Male',
    age: '65',
    ethnicity: 'Chinese',
    education: 'University',
    industry: 'Retired',
    occupation: 'Retired',
    migrationStatus: 'Born in HK',
    maritalStatus: 'Married',
    mortalityInHousehold: false,
    housingType: 'Private Housing',
    district: 'Central and Western'
};

// Map Visualization Options (English)
export const VISUALIZATION_OPTIONS: MapMetric[] = [
    { key: 'age', label: 'Age Dist.' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'gender', label: 'Gender Ratio' },
    { key: 'education', label: 'Education' },
    { key: 'occupation', label: 'Occupation' },
];