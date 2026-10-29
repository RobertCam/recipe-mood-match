"use client";

import { useState } from "react";
import { Mood } from "@/types/recipe";
import { MOOD_OPTIONS } from "@/lib/photos";
import FoodImage from "@/components/FoodImage";

const CUISINES = [
  "Any",
  "Mexican",
  "French",
  "Japanese",
  "Italian",
  "Chinese",
  "Thai",
  "Indian",
  "Mediterranean",
  "American",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Middle Eastern",
  "Caribbean",
  "Brazilian",
  "Moroccan",
  "Turkish",
  "German",
];

const DISH_TYPES = [
  "Any",
  "Appetizer",
  "Main Course",
  "Dessert",
  "Snack",
  "Beverage",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Side Dish",
  "Soup",
  "Salad",
  "Sandwich",
  "Pasta",
  "Pizza",
];

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-700 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60";

interface MoodSelectorProps {
  onMoodSelect: (
    mood: string,
    allergies?: string[],
    ingredients?: string[],
    cuisine?: string,
    dishType?: string
  ) => void;
  disabled?: boolean;
}

export default function MoodSelector({
  onMoodSelect,
  disabled = false,
}: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | "">("");
  const [customMood, setCustomMood] = useState("");
  const [allergies, setAllergies] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [dishType, setDishType] = useState("Any");

  const handleMoodChange = (value: Mood) => {
    setSelectedMood(value);
    setCustomMood("");
  };

  const handleCustomMood = (value: string) => {
    setCustomMood(value);
    if (value.trim()) {
      setSelectedMood("other");
    } else if (selectedMood === "other") {
      setSelectedMood("");
    }
  };

  const handleGenerate = () => {
    const moodToUse = selectedMood === "other" ? customMood.trim() : selectedMood;
    if (!moodToUse) return;

    const allergiesList = allergies
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    const ingredientsList = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    const selectedCuisine = cuisine && cuisine !== "Any" ? cuisine : undefined;
    const selectedDishType = dishType && dishType !== "Any" ? dishType : undefined;

    onMoodSelect(
      moodToUse,
      allergiesList.length > 0 ? allergiesList : undefined,
      ingredientsList.length > 0 ? ingredientsList : undefined,
      selectedCuisine,
      selectedDishType
    );
  };

  const canGenerate = Boolean(selectedMood && (selectedMood !== "other" || customMood.trim().length > 0));
  const moodLabel =
    selectedMood === "other"
      ? customMood.trim()
      : MOOD_OPTIONS.find((mood) => mood.id === selectedMood)?.label;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Mood</p>
            <h2 className="mt-1 font-display text-3xl text-stone-950 sm:text-4xl">How should it feel?</h2>
          </div>
          <p className="max-w-xs text-sm text-stone-500">Pick a card, or describe the feeling in your own words.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MOOD_OPTIONS.map((mood) => {
            const selected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => handleMoodChange(mood.id)}
                className={`group relative aspect-[4/3] overflow-hidden rounded-2xl text-left ring-offset-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 disabled:cursor-not-allowed disabled:opacity-60 ${
                  selected ? "ring-2 ring-stone-900 ring-offset-[#f3eee6]" : ""
                }`}
              >
                <FoodImage
                  src={mood.photo.src}
                  alt=""
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  imgClassName="transition duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/15 to-stone-950/10" />
                {selected && (
                  <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M4.5 10.5 8 14l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
                  <span className="block font-display text-xl text-white sm:text-2xl">{mood.label}</span>
                  <span className="mt-0.5 block text-[13px] text-white/80">{mood.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>

        <label htmlFor="custom-mood" className="mt-4 block text-sm font-medium text-stone-700">
          Or describe your own
        </label>
        <input
          id="custom-mood"
          type="text"
          value={customMood}
          onChange={(event) => handleCustomMood(event.target.value)}
          placeholder="nostalgic, rainy, hopeful..."
          disabled={disabled}
          autoComplete="off"
          className={`mt-2 ${inputClass} ${
            selectedMood === "other" ? "border-orange-700 ring-4 ring-orange-100" : ""
          }`}
        />
      </section>

      <form
        className="rounded-[28px] border border-stone-200/80 bg-white p-5 shadow-[0_24px_70px_-48px_rgba(68,32,8,0.7)] sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          handleGenerate();
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Preferences</p>
        <h2 className="mt-1 font-display text-3xl text-stone-950">Make it yours</h2>
        <p className="mt-2 text-sm text-stone-500">All optional. Leave them open if you want a surprise.</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <label htmlFor="allergies" className="mb-2 block text-sm font-medium text-stone-700">
              Allergies
            </label>
            <input
              id="allergies"
              type="text"
              value={allergies}
              onChange={(event) => setAllergies(event.target.value)}
              placeholder="peanuts, dairy, gluten"
              disabled={disabled}
              autoComplete="off"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-stone-500">Recipes skip anything that contains these.</p>
          </div>

          <div>
            <label htmlFor="ingredients" className="mb-2 block text-sm font-medium text-stone-700">
              Ingredients to use
            </label>
            <input
              id="ingredients"
              type="text"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              placeholder="chicken, tomatoes, basil"
              disabled={disabled}
              autoComplete="off"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-stone-500">These show up in the dish when they fit.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <div>
              <label htmlFor="cuisine" className="mb-2 block text-sm font-medium text-stone-700">
                Cuisine
              </label>
              <div className="relative">
                <select
                  id="cuisine"
                  value={cuisine}
                  onChange={(event) => setCuisine(event.target.value)}
                  disabled={disabled}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  {CUISINES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            <div>
              <label htmlFor="dishType" className="mb-2 block text-sm font-medium text-stone-700">
                Dish
              </label>
              <div className="relative">
                <select
                  id="dishType"
                  value={dishType}
                  onChange={(event) => setDishType(event.target.value)}
                  disabled={disabled}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  {DISH_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-h-5 text-sm text-stone-500">
            {moodLabel ? (
              <>
                Matching <span className="font-medium text-stone-800">{moodLabel}</span>
                {cuisine !== "Any" ? ` · ${cuisine}` : ""}
                {dishType !== "Any" ? ` · ${dishType}` : ""}
              </>
            ) : (
              "Choose a mood to begin"
            )}
          </p>
          <button
            type="submit"
            disabled={!canGenerate || disabled}
            className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {disabled && canGenerate ? "Finding a recipe..." : "Find a recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
