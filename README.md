# 🍲 Mood Recipe Match

A Next.js web application that generates personalized recipes based on your current mood using OpenAI's GPT model. Simply select how you're feeling, optionally specify any allergies or ingredients you'd like to include, and get a custom recipe tailored to match your mood!

## ✨ Features

- **Mood-Based Recipe Generation**: Choose from predefined moods (tired, adventurous, lazy, cozy, energetic, romantic, stressed, celebratory) or enter a custom mood
- **Allergy Support**: Specify allergies to ensure recipes avoid problematic ingredients
- **Ingredient Preferences**: Request specific ingredients to be included in your recipe
- **Recipe Saving**: Save your favorite recipes to localStorage for easy access later
- **Beautiful UI**: Modern, responsive design with a warm, food-themed color palette
- **Real-Time Generation**: Get instant recipe suggestions powered by OpenAI

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: OpenAI API (GPT model)
- **Storage**: Browser localStorage

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-mood-match
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
recipe-mood-match/
├── app/
│   ├── api/
│   │   └── recipe/
│   │       └── route.ts          # API endpoint for recipe generation
│   ├── page.tsx                  # Main page component
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── MoodSelector.tsx          # Mood selection interface
│   ├── RecipeCard.tsx            # Recipe display component
│   ├── SavedRecipes.tsx          # Saved recipes list
│   └── LoadingSpinner.tsx        # Loading indicator
├── lib/
│   ├── openai.ts                 # OpenAI integration
│   └── storage.ts                 # LocalStorage utilities
└── types/
    └── recipe.ts                 # TypeScript type definitions
```

## 🎯 How It Works

1. **Select Your Mood**: Choose from predefined moods or enter a custom one
2. **Add Allergies (Optional)**: Specify any food allergies separated by commas - recipes will avoid these ingredients
3. **Specify Ingredients (Optional)**: List specific ingredients you'd like to include - recipes will feature these prominently
4. **Generate Recipe**: Click "Generate Recipe" to get a personalized recipe
5. **View Recipe**: See the recipe name, ingredients, step-by-step instructions, and an explanation of why it matches your mood
6. **Save Recipe**: Save recipes you like to access them later from the saved recipes section

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your `OPENAI_API_KEY` as an environment variable
4. Deploy!

For more deployment options, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📝 Notes

- Recipes are saved to browser localStorage, so they persist across sessions
- The app uses OpenAI's GPT model (gpt-5-mini) to generate creative, mood-matched recipes
- All recipes include allergy considerations when specified
- When you provide specific ingredients, the AI will incorporate them into the recipe while still matching your mood

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is private and not licensed for public use.
