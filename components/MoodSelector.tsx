"use client";

import { useState } from "react";
import { PredefinedMood, Mood } from "@/types/recipe";

const PREDEFINED_MOODS: PredefinedMood[] = [
  "tired",
  "adventurous",
  "lazy",
  "cozy",
  "energetic",
  "romantic",
  "stressed",
  "celebratory",
];

interface MoodSelectorProps {
  onMoodSelect: (mood: string, allergies?: string[], ingredients?: string[]) => void;
  disabled?: boolean;
}

export default function MoodSelector({
  onMoodSelect,
  disabled = false,
}: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | "">("");
  const [customMood, setCustomMood] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleMoodChange = (value: Mood) => {
    setSelectedMood(value);
    if (value === "other") {
      setShowCustomInput(true);
      setCustomMood("");
    } else {
      setShowCustomInput(false);
      setCustomMood("");
    }
  };

  const handleGenerate = () => {
    const moodToUse = selectedMood === "other" ? customMood.trim() : selectedMood;
    if (moodToUse) {
      const allergiesList = allergies
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      const ingredientsList = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
      onMoodSelect(
        moodToUse,
        allergiesList.length > 0 ? allergiesList : undefined,
        ingredientsList.length > 0 ? ingredientsList : undefined
      );
    }
  };

  const canGenerate = selectedMood && (selectedMood !== "other" || customMood.trim().length > 0);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedMood}
          onChange={(e) => handleMoodChange(e.target.value as Mood)}
          disabled={disabled}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a mood...</option>
          {PREDEFINED_MOODS.map((mood) => (
            <option key={mood} value={mood}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </option>
          ))}
          <option value="other">Other (custom)</option>
        </select>

        {showCustomInput && (
          <input
            type="text"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            placeholder="Enter your mood..."
            disabled={disabled}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 transition-all disabled:opacity-50"
          />
        )}
      </div>

      <div className="w-full">
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
          Allergies (optional) - separate with commas
        </label>
        <input
          id="allergies"
          type="text"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="e.g., peanuts, dairy, gluten"
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 transition-all disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          Recipes will avoid ingredients containing these allergens
        </p>
      </div>

      <div className="w-full">
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
          Specific Ingredients (optional) - separate with commas
        </label>
        <input
          id="ingredients"
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., chicken, tomatoes, basil, pasta"
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 transition-all disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          Recipes will include these specific ingredients if possible
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!canGenerate || disabled}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Generate Recipe
      </button>
    </div>
  );
}

