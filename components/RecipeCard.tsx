"use client";

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

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onSave(recipe)}
          disabled={isSaved}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isSaved
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 shadow-md"
          }`}
        >
          {isSaved ? "✓ Saved" : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}

