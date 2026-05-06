export type RecordCondition =
  | "Mint"
  | "Near Mint"
  | "Very Good Plus"
  | "Very Good"
  | "Good"
  | "Fair"
  | "Poor"
  | "Not Graded";

export type RecordFormat = "LP" | "EP" | "Single" | "2xLP" | "3xLP" | "Box Set";

export const CONDITIONS: RecordCondition[] = [
  "Mint",
  "Near Mint",
  "Very Good Plus",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
  "Not Graded",
];

export const FORMATS: RecordFormat[] = ["LP", "EP", "Single", "2xLP", "3xLP", "Box Set"];

export interface RecordFormData {
  title: string;
  artist: string;
  year?: string;
  genre?: string;
  label?: string;
  catalogNumber?: string;
  condition: string;
  coverCondition: string;
  format: string;
  color?: string;
  notes?: string;
  imageUrl?: string;
  confidence?: number;
  aiRawResponse?: string;
}
