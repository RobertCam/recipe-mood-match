"use client";

import { useEffect, useRef, useState } from "react";
import { Recipe } from "@/types/recipe";
import MoodSelector from "@/components/MoodSelector";
import RecipeCard from "@/components/RecipeCard";
import SavedRecipes from "@/components/SavedRecipes";
import LoadingSpinner from "@/components/LoadingSpinner";
import FoodImage from "@/components/FoodImage";
import { RECIPES_CHANGED_EVENT, isRecipeSaved, saveRecipe } from "@/lib/storage";
import { HERO_PHOTO } from "@/lib/photos";

export default function Home() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncSavedState = () => {
      if (!currentRecipe) {
        setSavedRecipeIds(new Set());
        return;
      }
      const id = currentRecipe.id || `recipe-${currentRecipe.timestamp}`;
      setSavedRecipeIds(new Set(isRecipeSaved(currentRecipe) ? [id] : []));
    };

    syncSavedState();
    window.addEventListener(RECIPES_CHANGED_EVENT, syncSavedState);
    return () => window.removeEventListener(RECIPES_CHANGED_EVENT, syncSavedState);
  }, [currentRecipe]);

  const revealStage = () => {
    requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleMoodSelect = async (
    mood: string,
    allergies?: string[],
    ingredients?: string[],
    cuisine?: string,
    dishType?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setCurrentRecipe(null);
    revealStage();

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood,
          allergies: allergies || [],
          ingredients: ingredients || [],
          cuisine: cuisine || undefined,
          dishType: dishType || undefined,
        }),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate recipe");
        } else {
          const text = await response.text();
          throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}`);
        }
      }

      if (!isJson) {
        throw new Error("Server returned non-JSON response. Please check your API configuration.");
      }

      const recipe: Recipe = await response.json();
      setCurrentRecipe({
        ...recipe,
        ...(cuisine ? { cuisine } : {}),
        ...(dishType ? { dishType } : {}),
      });
    } catch (err) {
      if (err instanceof SyntaxError && err.message.includes("JSON")) {
        setError(
          "Received invalid response from server. Please check that your OpenAI API key is configured correctly."
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to generate recipe. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    try {
      saveRecipe(recipe);
      setSavedRecipeIds(new Set([...savedRecipeIds, recipe.id || `recipe-${recipe.timestamp}`]));
    } catch {
      setError("Failed to save recipe. Please try again.");
    }
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setError(null);
    revealStage();
  };

  return (
    <div className="min-h-screen bg-[#f3eee6] text-stone-900">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-12 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-900">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
              Mood Recipe Match
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] text-stone-950 sm:text-6xl lg:text-7xl">
              Cook for the mood you&apos;re in.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
              Choose a feeling, name a few ingredients, and get a recipe with a shopping list and the reason it fits.
            </p>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] shadow-[0_30px_80px_-42px_rgba(60,30,10,0.75)]">
            <FoodImage
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              sizes="(min-width: 1024px) 480px, 100vw"
              priority
            />
          </div>
        </header>

        <MoodSelector onMoodSelect={handleMoodSelect} disabled={isLoading} />

        {(isLoading || currentRecipe || error) && (
          <div ref={stageRef} className="mt-10 scroll-mt-8">
            {error && (
              <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
                <p className="font-medium">Something went wrong</p>
                <p className="mt-1 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="mt-3 text-sm font-medium underline decoration-red-300 underline-offset-2 hover:decoration-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              currentRecipe && (
                <RecipeCard
                  recipe={currentRecipe}
                  onSave={handleSaveRecipe}
                  isSaved={savedRecipeIds.has(currentRecipe.id || `recipe-${currentRecipe.timestamp}`)}
                />
              )
            )}
          </div>
        )}

        <SavedRecipes onRecipeSelect={handleRecipeSelect} />
      </main>

      <footer className="px-4 py-10 text-center text-sm text-stone-500">
        <p>Recipes by OpenAI · Photographs via Unsplash</p>
      </footer>
    </div>
  );
}
