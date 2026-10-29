"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { RECIPES_CHANGED_EVENT, deleteRecipe, getSavedRecipes } from "@/lib/storage";

interface SavedRecipesProps {
  onRecipeSelect?: (recipe: Recipe) => void;
}

export default function SavedRecipes({ onRecipeSelect }: SavedRecipesProps) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadSavedRecipes = () => {
      const recipes = getSavedRecipes();
      recipes.sort((a, b) => b.timestamp - a.timestamp);
      setSavedRecipes(recipes);
    };

    loadSavedRecipes();
    window.addEventListener(RECIPES_CHANGED_EVENT, loadSavedRecipes);
    return () => window.removeEventListener(RECIPES_CHANGED_EVENT, loadSavedRecipes);
  }, []);

  const handleDelete = (id: string) => {
    deleteRecipe(id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Library</p>
          <h2 className="mt-1 font-display text-3xl text-stone-950 sm:text-4xl">Saved recipes</h2>
        </div>
        <p className="text-sm text-stone-500">
          {savedRecipes.length === 0 ? "None yet" : `${savedRecipes.length} saved`}
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/50 px-6 py-12 text-center">
          <p className="font-display text-2xl text-stone-800">Nothing kept yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
            When a dish feels right, save it and it will show up here.
          </p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-[28px] border border-stone-200 bg-white">
          {savedRecipes.map((recipe, index) => (
            <li key={recipe.id || recipe.timestamp} className={index > 0 ? "border-t border-stone-100" : ""}>
              <div className="flex items-center gap-4 px-5 py-4">
                <button
                  type="button"
                  onClick={() => onRecipeSelect?.(recipe)}
                  className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <h3 className="truncate font-display text-2xl leading-tight text-stone-950">{recipe.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {recipe.mood} · {formatDate(recipe.timestamp)}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(recipe.id || `recipe-${recipe.timestamp}`)}
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-stone-600 hover:bg-red-50 hover:text-red-700"
                  aria-label={`Remove ${recipe.name}`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
