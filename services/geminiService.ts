import { GoogleGenAI } from "@google/genai";

const getGenAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getMotivationalMessage = async (): Promise<string> => {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Menga o'zbek tilida qisqa, ruhlantiruvchi, kuchli motivatsion gap ayt.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational message:", error);
    return "Bugungi harakatingiz ertangi g'alabangizning poydevoridir. Olg'a!";
  }
};
