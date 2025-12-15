
// --- 核心数据模型 ---

export interface CensusData {
    fullName: string;
    hkid: string; // Partial or masked
    gender: 'Male' | 'Female' | 'Other';
    age: string; // 使用 string 以方便表单输入
    ethnicity: string;
    education: string;
    industry: string;
    occupation: string;
    migrationStatus: string; // e.g., "Born in HK", "Moved < 1 year"
    maritalStatus: string;
    mortalityInHousehold: boolean; // Recent deaths in household
    housingType: string;
    district: string; // 居住地区 (用于定位)
}

export interface TPUPath {
    id: string;
    districtId: string;
    name: string;
    d: string;
}

// App 流程的步骤枚举
export enum AppStep {
    WELCOME = 'WELCOME',
    FORM = 'FORM',
    ANALYZING = 'ANALYZING',
    DASHBOARD = 'DASHBOARD'
}

// 供地图可视化使用的分析数据 (TPU 级别)
export interface DistrictAnalysis {
    id: string; // The TPU ID (e.g., CW_001)
    density: number; // 0-100 score: 代表与用户画像相似度
    analysis?: string; // AI 模型生成的简要分析
}

// 地图可视化指标 (用于 Dashboard 中的按钮)
export interface MapMetric {
    key: keyof CensusData;
    label: string;
}

// 供 CensusForm 提交时使用的初始数据
export const initialCensusData: CensusData = {
    fullName: '王明',
    hkid: 'Z1234567',
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
    district: 'Central and Western' // 用于测试地图定位
};

// 地图指标列表
export const VISUALIZATION_OPTIONS: MapMetric[] = [
    { key: 'age', label: '年龄分布' },
    { key: 'maritalStatus', label: '婚姻状况' },
    { key: 'gender', label: '性别比例' },
    { key: 'education', label: '教育水平' },
    { key: 'occupation', label: '职业' },
];
