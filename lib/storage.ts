import { Recipe } from "@/types/recipe";

const STORAGE_KEY = "mood-recipe-match-saved-recipes";

export function saveRecipe(recipe: Recipe): void {
  try {
    const saved = getSavedRecipes();
    const recipeWithId: Recipe = {
      ...recipe,
      id: recipe.id || `recipe-${recipe.timestamp}`,
    };
    saved.push(recipeWithId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw new Error("Failed to save recipe to localStorage");
  }
}

export function getSavedRecipes(): Recipe[] {
  try {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as Recipe[];
  } catch (error) {
    console.error("Error retrieving saved recipes:", error);
    return [];
  }
}

export function deleteRecipe(id: string): void {
  try {
    const saved = getSavedRecipes();
    const filtered = saved.filter((recipe) => recipe.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw new Error("Failed to delete recipe from localStorage");
  }
}

export function isRecipeSaved(recipe: Recipe): boolean {
  try {
    const saved = getSavedRecipes();
    return saved.some(
      (r) =>
        r.timestamp === recipe.timestamp ||
        (recipe.id && r.id === recipe.id)
    );
  } catch (error) {
    return false;
  }
}

