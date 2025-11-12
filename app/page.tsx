"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import MoodSelector from "@/components/MoodSelector";
import RecipeCard from "@/components/RecipeCard";
import SavedRecipes from "@/components/SavedRecipes";
import LoadingSpinner from "@/components/LoadingSpinner";
import { saveRecipe } from "@/lib/storage";

export default function Home() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if current recipe is saved
    if (currentRecipe) {
      const saved = localStorage.getItem("mood-recipe-match-saved-recipes");
      if (saved) {
        const recipes: Recipe[] = JSON.parse(saved);
        const isSaved = recipes.some(
          (r) =>
            r.timestamp === currentRecipe.timestamp ||
            (currentRecipe.id && r.id === currentRecipe.id)
        );
        setSavedRecipeIds(
          new Set(isSaved ? [currentRecipe.id || `recipe-${currentRecipe.timestamp}`] : [])
        );
      }
    }
  }, [currentRecipe]);

  const handleMoodSelect = async (mood: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentRecipe(null);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate recipe");
        } else {
          const text = await response.text();
          throw new Error(
            `Server error (${response.status}): ${text.substring(0, 100)}`
          );
        }
      }

      if (!isJson) {
        throw new Error("Server returned non-JSON response. Please check your API configuration.");
      }

      const recipe: Recipe = await response.json();
      setCurrentRecipe(recipe);
    } catch (err) {
      if (err instanceof SyntaxError && err.message.includes("JSON")) {
        setError(
          "Received invalid response from server. Please check that your OpenAI API key is configured correctly."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to generate recipe. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    try {
      saveRecipe(recipe);
      setSavedRecipeIds(
        new Set([...savedRecipeIds, recipe.id || `recipe-${recipe.timestamp}`])
      );
    } catch (err) {
      setError("Failed to save recipe. Please try again.");
    }
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    // Scroll to top to show the selected recipe
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
            🍲 Mood Recipe Match
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us how you're feeling, and we'll suggest the perfect recipe to match your mood!
          </p>
        </header>

        {/* Mood Selector */}
        <div className="mb-8">
          <MoodSelector onMoodSelect={handleMoodSelect} disabled={isLoading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Recipe Display */}
        {currentRecipe && !isLoading && (
          <div className="mb-12">
            <RecipeCard
              recipe={currentRecipe}
              onSave={handleSaveRecipe}
              isSaved={savedRecipeIds.has(
                currentRecipe.id || `recipe-${currentRecipe.timestamp}`
              )}
            />
          </div>
        )}

        {/* Saved Recipes */}
        <SavedRecipes onRecipeSelect={handleRecipeSelect} />
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-500 text-sm">
        <p>Powered by OpenAI • Built with Next.js</p>
      </footer>
    </div>
  );
}
