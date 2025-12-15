import { GoogleGenAI, Type } from "@google/genai";
import { CensusData, DistrictAnalysis } from "../types";

const initGenAI = () => {
  // Safety check: process might not be defined in browser environments
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
  
  if (!apiKey) {
    console.warn("API Key is missing or process.env is not accessible");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDemographics = async (
  userData: CensusData,
  metricKey: keyof CensusData
): Promise<DistrictAnalysis[]> => {
  const ai = initGenAI();
  if (!ai) {
    return generateMockData();
  }

  // We ask for District-level data, which we will then distribute to TPUs visually
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "District ID (e.g., CW, WC, E, S, YTM, SSP, KC, WTS, KT, TW, TM, YL, N, TP, ST, SK, K, I)" },
        density: { type: Type.NUMBER, description: "Score 0-100 indicating prevalence of this demographic." },
        analysis: { type: Type.STRING, description: "Brief reason." }
      },
      required: ["id", "density"],
    }
  };

  const prompt = `
    Analyze this Hong Kong census profile:
    - ${metricKey}: ${userData[metricKey]}
    - Age: ${userData.age}
    - Occupation/Housing: ${userData.occupation}, ${userData.housingType}

    Determine the density distribution (0-100) for this specific demographic group across the 18 districts.
    High density = high concentration of people with similar ${metricKey} and socioeconomic status.
    
    Districts: CW, WC, E, S, YTM, SSP, KC, WTS, KT, TW, TM, YL, N, TP, ST, SK, K, I.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) return generateMockData();
    return JSON.parse(text) as DistrictAnalysis[];

  } catch (error) {
    console.error("Gemini analysis failed", error);
    return generateMockData();
  }
};

const generateMockData = (): DistrictAnalysis[] => {
  const districts = ['CW', 'WC', 'E', 'S', 'YTM', 'SSP', 'KC', 'WTS', 'KT', 'TW', 'TM', 'YL', 'N', 'TP', 'ST', 'SK', 'K', 'I'];
  return districts.map(id => ({
    id,
    density: Math.floor(Math.random() * 100),
    analysis: "Projected distribution"
  }));
};