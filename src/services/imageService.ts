import { GoogleGenAI } from "@google/genai";

// Lazy initialization to avoid issues if key is missing at load time
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI image generation will be disabled.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Simple delay to help with rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateProjectImage(prompt: string, waitMs: number = 0) {
  if (waitMs > 0) await delay(waitMs);
  
  const ai = getAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error: any) {
    // Handle quota errors silently to avoid cluttering the console, 
    // but log a helpful message for the developer.
    if (error?.status === "RESOURCE_EXHAUSTED" || error?.message?.includes("429")) {
      console.warn("Gemini API quota exceeded. Using fallback images.");
    } else {
      console.error("Error generating image:", error);
    }
  }
  return null;
}
