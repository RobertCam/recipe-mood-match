"use client";

import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { isRecipeSaved } from "@/lib/storage";

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  isSaved?: boolean;
}

function label(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cleanStep(step: string) {
  return step.replace(/^\s*step\s*\d+\s*[:.)\-]\s*/i, "");
}

export default function RecipeCard({
  recipe,
  onSave,
  isSaved: isSavedProp,
}: RecipeCardProps) {
  const isSaved = isSavedProp ?? isRecipeSaved(recipe);
  const [shareLabel, setShareLabel] = useState("Share");

  const formatRecipeForSharing = (item: Recipe): string => {
    let text = `${item.name}\n\n`;
    text += "Ingredients:\n";
    item.ingredients.forEach((ingredient, index) => {
      text += `${index + 1}. ${ingredient}\n`;
    });

    if (item.instructions && item.instructions.length > 0) {
      text += "\nInstructions:\n";
      item.instructions.forEach((instruction, index) => {
        text += `${index + 1}. ${cleanStep(instruction)}\n`;
      });
    }

    if (item.explanation) {
      text += `\n${item.explanation}\n`;
    }

    return text;
  };

  const copyRecipe = async () => {
    await navigator.clipboard.writeText(formatRecipeForSharing(recipe));
    setShareLabel("Copied");
    window.setTimeout(() => setShareLabel("Share"), 2000);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      try {
        await copyRecipe();
      } catch (error) {
        console.error("Failed to copy recipe:", error);
        setShareLabel("Couldn't share");
        window.setTimeout(() => setShareLabel("Share"), 2000);
      }
      return;
    }

    setShareLabel("Sharing...");
    try {
      await navigator.share({
        title: recipe.name,
        text: formatRecipeForSharing(recipe),
      });
      setShareLabel("Share");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setShareLabel("Share");
        return;
      }
      console.error("Error sharing recipe:", error);
      try {
        await copyRecipe();
      } catch (clipboardError) {
        console.error("Failed to copy recipe:", clipboardError);
        setShareLabel("Couldn't share");
        window.setTimeout(() => setShareLabel("Share"), 2000);
      }
    }
  };

  const chips = [label(recipe.mood), recipe.cuisine, recipe.dishType].filter(Boolean) as string[];

  return (
    <article className="animate-fade-in animate-slide-up rounded-[28px] border border-stone-200/80 bg-white px-6 py-8 shadow-[0_24px_70px_-48px_rgba(68,32,8,0.7)] sm:px-10 sm:py-10">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium tracking-wide text-orange-900"
          >
            {chip}
          </span>
        ))}
      </div>

      <h2 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] text-balance text-stone-950 sm:text-5xl">
        {recipe.name}
      </h2>
      <p className="mt-3 text-sm text-stone-500">
        {recipe.ingredients.length} ingredients
        {recipe.instructions?.length ? ` · ${recipe.instructions.length} steps` : ""}
      </p>

      {recipe.explanation && (
        <p className="mt-5 max-w-3xl font-display text-xl italic leading-snug text-stone-700 sm:text-2xl">
          {recipe.explanation}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Ingredients</h3>
          <ul className="mt-4 space-y-2.5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`} className="flex items-start gap-2.5 text-[15px] text-stone-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Instructions</h3>
            <ol className="mt-4 space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={`${instruction}-${index}`} className="flex items-start gap-3 text-[15px] leading-relaxed text-stone-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{cleanStep(instruction)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={() => onSave(recipe)}
          disabled={isSaved}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
            isSaved
              ? "cursor-not-allowed bg-stone-100 text-stone-500"
              : "bg-stone-900 text-white hover:bg-orange-800"
          }`}
        >
          {isSaved ? "Saved" : "Save recipe"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={shareLabel === "Sharing..."}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 16V4" strokeLinecap="round" />
              <path d="m7 8 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 13v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5" strokeLinecap="round" />
            </svg>
            {shareLabel}
        </button>
      </div>
    </article>
  );
}
