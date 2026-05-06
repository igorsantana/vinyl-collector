import { GoogleGenerativeAI } from "@google/generative-ai";

export interface RecognitionResult {
  title: string;
  artist: string;
  year: string;
  genre: string;
  label: string;
  catalogNumber: string;
  format: string;
  confidence: number;
  reasoning: string;
}

const SYSTEM_PROMPT = `You are a vinyl record identification expert. Analyze this image of a vinyl record (cover, label, spine, or the vinyl itself) and extract the following information.

Return ONLY valid JSON with these fields:
{
  "title": "Album title",
  "artist": "Artist or band name",
  "year": "Original release year (best guess)",
  "genre": "Primary genre",
  "label": "Record label",
  "catalogNumber": "Catalog number if visible",
  "format": "LP | EP | Single | 2xLP",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of how you identified this record"
}

If you cannot identify the record, set confidence to 0 and fill fields with "Unknown". Always attempt a best guess based on visual clues like artwork style, typography, color scheme, and any visible text.

Important rules:
- confidence should reflect how certain you are (1.0 = absolutely certain, 0.5 = educated guess, 0.0 = cannot identify)
- For format, default to "LP" if unsure
- Include the most specific genre (e.g., "Post-Punk" rather than "Rock")
- If you can see text on the record/cover, prioritize that over visual style guesses`;

export async function recognizeRecord(
  imageBase64: string,
  mimeType: string
): Promise<RecognitionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonStr = (jsonMatch[1] || text).trim();

  try {
    const parsed = JSON.parse(jsonStr) as RecognitionResult;
    return parsed;
  } catch {
    console.error("Failed to parse AI response:", text);
    return {
      title: "Unknown",
      artist: "Unknown",
      year: "Unknown",
      genre: "Unknown",
      label: "Unknown",
      catalogNumber: "Unknown",
      format: "LP",
      confidence: 0,
      reasoning: "Failed to parse AI response",
    };
  }
}
