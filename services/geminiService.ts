
import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize } from "../types";
import { MODEL_FLASH, MODEL_PRO } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateImage(prompt: string, size: ImageSize): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: MODEL_PRO,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        },
        tools: [{ googleSearch: {} }] // Only available on Pro
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from API");
  }

  async editImage(base64Image: string, prompt: string, mimeType: string = 'image/png'): Promise<string> {
    // Strip header if present
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await this.ai.models.generateContent({
      model: MODEL_FLASH,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image data returned from API");
  }
}
