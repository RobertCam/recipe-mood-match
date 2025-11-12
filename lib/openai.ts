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

export async function generateRecipe(mood: string, allergies: string[] = []): Promise<Recipe> {
  const allergyNote = allergies.length > 0
    ? `\n\nIMPORTANT: The user has allergies to the following: ${allergies.join(", ")}. You MUST avoid ALL ingredients that contain or are derived from these allergens. Do not use any ingredients that contain these allergens, even in small amounts.`
    : "";

  const prompt = `You are a creative culinary expert. Generate a food or drink recipe that perfectly matches the mood: "${mood}".${allergyNote}

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

