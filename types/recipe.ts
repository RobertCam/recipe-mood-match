export type PredefinedMood =
  | "tired"
  | "adventurous"
  | "lazy"
  | "cozy"
  | "energetic"
  | "romantic"
  | "stressed"
  | "celebratory";

export type Mood = PredefinedMood | "other";

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  explanation: string;
  mood: string;
  timestamp: number;
  id?: string;
}

