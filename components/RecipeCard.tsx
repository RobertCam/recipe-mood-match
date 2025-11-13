"use client";

import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { isRecipeSaved } from "@/lib/storage";

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  isSaved?: boolean;
}

export default function RecipeCard({
  recipe,
  onSave,
  isSaved: isSavedProp,
}: RecipeCardProps) {
  const isSaved = isSavedProp ?? isRecipeSaved(recipe);
  const [isSharing, setIsSharing] = useState(false);

  const formatRecipeForSharing = (recipe: Recipe): string => {
    let text = `🍲 ${recipe.name}\n\n`;
    
    text += "📋 Ingredients:\n";
    recipe.ingredients.forEach((ingredient, index) => {
      text += `${index + 1}. ${ingredient}\n`;
    });
    
    if (recipe.instructions && recipe.instructions.length > 0) {
      text += "\n👨‍🍳 Instructions:\n";
      recipe.instructions.forEach((instruction, index) => {
        text += `${index + 1}. ${instruction}\n`;
      });
    }
    
    if (recipe.explanation) {
      text += `\n💭 ${recipe.explanation}\n`;
    }
    
    return text;
  };

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback: copy to clipboard
      const text = formatRecipeForSharing(recipe);
      try {
        await navigator.clipboard.writeText(text);
        alert("Recipe copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy recipe:", err);
        alert("Failed to share recipe. Please try again.");
      }
      return;
    }

    setIsSharing(true);
    try {
      const shareData = {
        title: recipe.name,
        text: formatRecipeForSharing(recipe),
      };

      await navigator.share(shareData);
    } catch (err) {
      // User cancelled or error occurred
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error sharing recipe:", err);
        // Fallback to clipboard
        try {
          const text = formatRecipeForSharing(recipe);
          await navigator.clipboard.writeText(text);
          alert("Recipe copied to clipboard!");
        } catch (clipboardErr) {
          console.error("Failed to copy recipe:", clipboardErr);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6 animate-fade-in animate-slide-up">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          {recipe.name}
        </h2>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-600"
              >
                <span className="text-amber-500 mt-1.5">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Instructions
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-600"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white font-semibold flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="flex-1 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Why this matches your mood
          </h3>
          <p className="text-gray-600 leading-relaxed italic">
            {recipe.explanation}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onSave(recipe)}
          disabled={isSaved}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isSaved
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 shadow-md"
          }`}
        >
          {isSaved ? "✓ Saved" : "Save Recipe"}
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex-1 py-3 px-6 rounded-lg font-semibold bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 transform hover:scale-105 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSharing ? "Sharing..." : "📤 Share"}
        </button>
      </div>
    </div>
  );
}

