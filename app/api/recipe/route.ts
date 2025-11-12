import { NextRequest, NextResponse } from "next/server";
import { generateRecipe } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mood, allergies, ingredients } = body;

    if (!mood || typeof mood !== "string" || mood.trim().length === 0) {
      return NextResponse.json(
        { error: "Mood is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const allergiesList = Array.isArray(allergies)
      ? allergies.filter((a) => typeof a === "string" && a.trim().length > 0)
      : [];

    const ingredientsList = Array.isArray(ingredients)
      ? ingredients.filter((i) => typeof i === "string" && i.trim().length > 0)
      : [];

    const recipe = await generateRecipe(mood.trim(), allergiesList, ingredientsList);

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate recipe. Please try again.",
      },
      { status: 500 }
    );
  }
}

