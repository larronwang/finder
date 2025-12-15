import { TPUPath } from './types';

// Approximate TPU-level geometry for Hong Kong
// Subdivides the 18 districts into smaller visual chunks to match the reference image style
export const HK_TPU_PATHS: TPUPath[] = [
  // --- HONG KONG ISLAND ---
  // Central & Western
  { id: 'CW_1', districtId: 'CW', name: 'Kennedy Town', d: 'M130,225 L140,225 L142,235 L130,235 Z' },
  { id: 'CW_2', districtId: 'CW', name: 'Sheung Wan', d: 'M140,225 L150,225 L150,235 L142,235 Z' },
  { id: 'CW_3', districtId: 'CW', name: 'Mid-levels West', d: 'M135,235 L150,235 L150,245 L135,245 Z' },
  // Wan Chai
  { id: 'WC_1', districtId: 'WC', name: 'Wan Chai', d: 'M150,227 L160,227 L160,235 L150,235 Z' },
  { id: 'WC_2', districtId: 'WC', name: 'Causeway Bay', d: 'M160,227 L170,227 L170,235 L160,235 Z' },
  { id: 'WC_3', districtId: 'WC', name: 'Happy Valley', d: 'M155,235 L170,235 L165,245 L155,245 Z' },
  // Eastern
  { id: 'E_1', districtId: 'E', name: 'North Point', d: 'M170,228 L185,228 L185,235 L170,235 Z' },
  { id: 'E_2', districtId: 'E', name: 'Quarry Bay', d: 'M185,228 L200,230 L195,240 L185,235 Z' },
  { id: 'E_3', districtId: 'E', name: 'Chai Wan', d: 'M200,230 L210,235 L205,245 L195,240 Z' },
  { id: 'E_4', districtId: 'E', name: 'Shau Kei Wan', d: 'M190,235 L200,235 L195,245 L185,240 Z' },
  // Southern
  { id: 'S_1', districtId: 'S', name: 'Pok Fu Lam', d: 'M130,245 L145,245 L140,260 L130,255 Z' },
  { id: 'S_2', districtId: 'S', name: 'Aberdeen', d: 'M145,245 L160,245 L160,255 L145,260 Z' },
  { id: 'S_3', districtId: 'S', name: 'Repulse Bay', d: 'M160,245 L180,250 L170,265 L160,255 Z' },
  { id: 'S_4', districtId: 'S', name: 'Stanley', d: 'M180,250 L195,260 L185,275 L175,265 Z' },

  // --- KOWLOON ---
  // Yau Tsim Mong
  { id: 'YTM_1', districtId: 'YTM', name: 'Tsim Sha Tsui', d: 'M150,215 L165,215 L160,222 L150,220 Z' },
  { id: 'YTM_2', districtId: 'YTM', name: 'Jordan', d: 'M150,210 L165,210 L165,215 L150,215 Z' },
  { id: 'YTM_3', districtId: 'YTM', name: 'Mong Kok', d: 'M150,200 L165,200 L165,210 L150,210 Z' },
  // Sham Shui Po
  { id: 'SSP_1', districtId: 'SSP', name: 'Cheung Sha Wan', d: 'M135,195 L150,200 L150,210 L135,205 Z' },
  { id: 'SSP_2', districtId: 'SSP', name: 'Sham Shui Po', d: 'M140,190 L155,195 L150,200 L140,195 Z' },
  { id: 'SSP_3', districtId: 'SSP', name: 'Lai Chi Kok', d: 'M130,190 L140,190 L140,200 L130,195 Z' },
  // Kowloon City
  { id: 'KC_1', districtId: 'KC', name: 'Hung Hom', d: 'M165,210 L180,215 L175,222 L165,215 Z' },
  { id: 'KC_2', districtId: 'KC', name: 'To Kwa Wan', d: 'M165,200 L180,200 L180,215 L165,210 Z' },
  { id: 'KC_3', districtId: 'KC', name: 'Kowloon Tong', d: 'M160,190 L175,190 L175,200 L160,200 Z' },
  // Wong Tai Sin
  { id: 'WTS_1', districtId: 'WTS', name: 'Wong Tai Sin', d: 'M175,185 L190,185 L190,195 L175,195 Z' },
  { id: 'WTS_2', districtId: 'WTS', name: 'Diamond Hill', d: 'M180,180 L200,180 L195,190 L180,185 Z' },
  // Kwun Tong
  { id: 'KT_1', districtId: 'KT', name: 'Kwun Tong', d: 'M190,195 L210,195 L205,215 L190,205 Z' },
  { id: 'KT_2', districtId: 'KT', name: 'Lam Tin', d: 'M200,190 L215,190 L215,205 L200,200 Z' },
  { id: 'KT_3', districtId: 'KT', name: 'Yau Tong', d: 'M205,205 L220,205 L215,220 L205,215 Z' },

  // --- NEW TERRITORIES WEST ---
  // Kwai Tsing
  { id: 'K_1', districtId: 'K', name: 'Kwai Chung', d: 'M130,170 L150,175 L145,190 L130,185 Z' },
  { id: 'K_2', districtId: 'K', name: 'Tsing Yi', d: 'M120,190 L135,190 L135,205 L120,200 Z' },
  // Tsuen Wan
  { id: 'TW_1', districtId: 'TW', name: 'Tsuen Wan Town', d: 'M125,160 L145,165 L140,175 L125,170 Z' },
  { id: 'TW_2', districtId: 'TW', name: 'Sham Tseng', d: 'M110,165 L125,170 L120,180 L105,175 Z' },
  { id: 'TW_3', districtId: 'TW', name: 'Ma Wan', d: 'M135,185 L145,185 L145,190 L135,190 Z' },
  // Tuen Mun
  { id: 'TM_1', districtId: 'TM', name: 'Tuen Mun Central', d: 'M80,160 L100,160 L100,180 L80,175 Z' },
  { id: 'TM_2', districtId: 'TM', name: 'Tuen Mun West', d: 'M60,165 L80,165 L80,190 L60,180 Z' },
  { id: 'TM_3', districtId: 'TM', name: 'So Kwun Wat', d: 'M100,165 L110,170 L105,180 L95,175 Z' },
  // Yuen Long
  { id: 'YL_1', districtId: 'YL', name: 'Yuen Long Town', d: 'M90,130 L110,130 L110,150 L90,150 Z' },
  { id: 'YL_2', districtId: 'YL', name: 'Tin Shui Wai', d: 'M80,120 L100,120 L100,135 L80,135 Z' },
  { id: 'YL_3', districtId: 'YL', name: 'Kam Tin', d: 'M110,135 L125,135 L125,155 L110,150 Z' },
  { id: 'YL_4', districtId: 'YL', name: 'Ha Tsuen', d: 'M70,130 L90,130 L90,150 L70,145 Z' },

  // --- NEW TERRITORIES EAST ---
  // North
  { id: 'N_1', districtId: 'N', name: 'Sheung Shui', d: 'M130,90 L150,90 L150,110 L130,110 Z' },
  { id: 'N_2', districtId: 'N', name: 'Fanling', d: 'M150,95 L170,100 L165,120 L150,115 Z' },
  { id: 'N_3', districtId: 'N', name: 'Sha Tau Kok', d: 'M170,90 L200,90 L190,110 L170,105 Z' },
  { id: 'N_4', districtId: 'N', name: 'Ta Kwu Ling', d: 'M150,80 L180,80 L175,95 L150,90 Z' },
  // Tai Po
  { id: 'TP_1', districtId: 'TP', name: 'Tai Po Market', d: 'M150,120 L170,125 L165,145 L145,140 Z' },
  { id: 'TP_2', districtId: 'TP', name: 'Plover Cove', d: 'M170,115 L210,115 L200,140 L170,130 Z' },
  { id: 'TP_3', districtId: 'TP', name: 'Tai Po Kau', d: 'M155,140 L170,140 L165,155 L150,150 Z' },
  // Sha Tin
  { id: 'ST_1', districtId: 'ST', name: 'Sha Tin Central', d: 'M155,155 L175,160 L170,175 L150,170 Z' },
  { id: 'ST_2', districtId: 'ST', name: 'Ma On Shan', d: 'M175,150 L200,145 L195,165 L175,165 Z' },
  { id: 'ST_3', districtId: 'ST', name: 'Fo Tan', d: 'M150,145 L165,150 L160,160 L150,155 Z' },
  { id: 'ST_4', districtId: 'ST', name: 'Tai Wai', d: 'M145,165 L160,165 L155,180 L140,175 Z' },
  // Sai Kung
  { id: 'SK_1', districtId: 'SK', name: 'Sai Kung Town', d: 'M200,160 L220,155 L225,180 L205,185 Z' },
  { id: 'SK_2', districtId: 'SK', name: 'Tseung Kwan O', d: 'M205,190 L225,190 L220,215 L200,205 Z' },
  { id: 'SK_3', districtId: 'SK', name: 'Clear Water Bay', d: 'M220,195 L240,205 L230,230 L215,220 Z' },

  // --- ISLANDS ---
  { id: 'I_1', districtId: 'I', name: 'Tung Chung', d: 'M70,195 L95,195 L90,210 L65,205 Z' },
  { id: 'I_2', districtId: 'I', name: 'Discovery Bay', d: 'M100,195 L115,200 L110,215 L95,210 Z' },
  { id: 'I_3', districtId: 'I', name: 'Mui Wo / South Lantau', d: 'M70,210 L100,215 L90,240 L60,230 Z' },
  { id: 'I_4', districtId: 'I', name: 'Tai O', d: 'M50,200 L70,205 L65,225 L45,215 Z' },
  { id: 'I_5', districtId: 'I', name: 'Cheung Chau', d: 'M105,245 L115,245 L115,255 L105,255 Z' },
  { id: 'I_6', districtId: 'I', name: 'Lamma Island', d: 'M120,250 L135,255 L130,275 L115,270 Z' },
];

export const EDUCATION_LEVELS = [
  'Primary or below',
  'Secondary (F.1-F.3)',
  'Secondary (F.4-F.6)',
  'Diploma / Certificate',
  'Associate Degree',
  'Bachelor Degree',
  'Master Degree or above'
];

export const INDUSTRIES = [
  'Manufacturing',
  'Construction',
  'Import/Export, Wholesale & Retail',
  'Transportation, Storage',
  'Accommodation & Food Services',
  'Information & Communications',
  'Financial & Insurance',
  'Real Estate',
  'Professional & Business Services',
  'Public Admin, Education, Human Health'
];

export const HOUSING_TYPES = [
  'Public Rental Housing',
  'Subsidized Home Ownership',
  'Private Residential',
  'Village House',
  'Temporary Housing',
  'Non-domestic'
];

export const MIGRATION_STATUS = [
  'Born in Hong Kong',
  'Lived in HK for 7+ years',
  'Lived in HK for < 7 years',
  'One-way Permit Holder'
];

export const ETHNICITIES = [
  'Chinese',
  'Filipino',
  'Indonesian',
  'White',
  'Indian',
  'Nepalese',
  'Pakistani',
  'Thai',
  'Other Asian',
  'Other'
];
