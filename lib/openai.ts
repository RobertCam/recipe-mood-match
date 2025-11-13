import OpenAI from "openai";
import { Recipe } from "@/types/recipe";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }
  return new OpenAI({
    apiKey: apiKey,
  });
}

export async function generateRecipe(
  mood: string,
  allergies: string[] = [],
  ingredients: string[] = [],
  cuisine?: string,
  dishType?: string
): Promise<Recipe> {
  const allergyNote = allergies.length > 0
    ? `\n\nIMPORTANT: The user has allergies to the following: ${allergies.join(", ")}. You MUST avoid ALL ingredients that contain or are derived from these allergens. Do not use any ingredients that contain these allergens, even in small amounts.`
    : "";

  const ingredientNote = ingredients.length > 0
    ? `\n\nIMPORTANT: The user wants to include these specific ingredients in the recipe: ${ingredients.join(", ")}. You MUST incorporate these ingredients into the recipe in a creative and meaningful way. The recipe should feature these ingredients prominently while still matching the mood.`
    : "";

  const cuisineNote = cuisine
    ? `\n\nThe recipe should be in the ${cuisine} cuisine style. Use authentic ${cuisine} ingredients, cooking techniques, and flavor profiles.`
    : "";

  const dishTypeNote = dishType
    ? `\n\nThe recipe should be a ${dishType.toLowerCase()}. Make sure it fits this category appropriately.`
    : "";

  const prompt = `You are a creative culinary expert. Generate a food or drink recipe that perfectly matches the mood: "${mood}".${allergyNote}${ingredientNote}${cuisineNote}${dishTypeNote}

Return a JSON object with the following structure:
{
  "name": "Recipe name here",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", ...],
  "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", ...],
  "explanation": "A short, warm explanation (2-3 sentences) of why this recipe matches the mood"
}

Make the recipe creative, specific, and emotionally resonant. The explanation should be personal and delightful. Provide clear, step-by-step cooking instructions.`;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a creative culinary expert who matches recipes to moods. Always respond with valid JSON only, no markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const recipeData = JSON.parse(content);

    // Validate and structure the response
    const recipe: Recipe = {
      name: recipeData.name || "Mystery Recipe",
      ingredients: Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients
        : [],
      instructions: Array.isArray(recipeData.instructions)
        ? recipeData.instructions
        : [],
      explanation: recipeData.explanation || "A perfect match for your mood!",
      mood: mood,
      timestamp: Date.now(),
    };

    return recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to generate recipe. Please try again."
    );
  }
}

