"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { getSavedRecipes, deleteRecipe } from "@/lib/storage";

interface SavedRecipesProps {
  onRecipeSelect?: (recipe: Recipe) => void;
}

export default function SavedRecipes({ onRecipeSelect }: SavedRecipesProps) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = () => {
    const recipes = getSavedRecipes();
    // Sort by timestamp, most recent first
    recipes.sort((a, b) => b.timestamp - a.timestamp);
    setSavedRecipes(recipes);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRecipe(id);
    loadSavedRecipes();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (savedRecipes.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-500">No saved recipes yet. Generate one to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 hover:border-amber-300 transition-all"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          Saved Recipes ({savedRecipes.length})
        </h3>
        <span className="text-amber-600 transform transition-transform">
          {isExpanded ? "▼" : "▶"}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 animate-fade-in animate-slide-down">
          {savedRecipes.map((recipe) => (
            <div
              key={recipe.id || recipe.timestamp}
              onClick={() => onRecipeSelect?.(recipe)}
              className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {recipe.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Mood: {recipe.mood} • {formatDate(recipe.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(recipe.id || `recipe-${recipe.timestamp}`, e)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all flex-shrink-0"
                  aria-label="Delete recipe"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

