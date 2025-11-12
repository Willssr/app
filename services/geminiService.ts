import { GoogleGenAI } from "@google/genai";
import { LocationData } from "../types";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable. AI features will be disabled.");
}

export const analyzeLocationData = async (locations: LocationData[]): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Cannot analyze data.";
  }
  
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