
import { GoogleGenAI } from "@google/genai";
import { LocationData } from "../types";

// FIX: Per coding guidelines, initialize GoogleGenAI directly assuming API_KEY is present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLocationData = async (locations: LocationData[]): Promise<string> => {
  const locationSummary = locations
    .map(loc => `${loc.city}, ${loc.country}: ${loc.count} users`)
    .join('\n');

  const prompt = `
    You are a friendly social media analyst for an app called NinoVisk.
    Analyze the following user location data and provide a short, engaging, and optimistic summary for the app owner.
    Do not just list the data. Provide some insight.
    Keep the summary to about 2-3 sentences.
    
    Data:
    ${locationSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing location data with Gemini:", error);
    return "There was an error analyzing the data. Please try again later.";
  }
};
