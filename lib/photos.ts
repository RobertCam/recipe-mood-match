import { PredefinedMood } from "@/types/recipe";

export type FoodPhoto = {
  src: string;
  alt: string;
};

function photo(id: string, alt: string): FoodPhoto {
  return {
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`,
    alt,
  };
}

export const HERO_PHOTO = photo(
  "photo-1504674900247-0877df9cc836",
  "A wooden table crowded with roasted dishes, herbs, and bread"
);

export const MOOD_OPTIONS: {
  id: PredefinedMood;
  label: string;
  blurb: string;
  photo: FoodPhoto;
}[] = [
  {
    id: "tired",
    label: "Tired",
    blurb: "Slow and warming",
    photo: photo("photo-1569718212165-3a8278d5f624", "A bowl of ramen with a soft egg"),
  },
  {
    id: "adventurous",
    label: "Adventurous",
    blurb: "Bold, a little wild",
    photo: photo("photo-1565299585323-38d6b0865b47", "Tacos topped with lime and cilantro"),
  },
  {
    id: "lazy",
    label: "Lazy",
    blurb: "Few steps, full comfort",
    photo: photo("photo-1565299624946-b28f40a0ae38", "A pizza pulled from the oven"),
  },
  {
    id: "cozy",
    label: "Cozy",
    blurb: "Soft food, soft day",
    photo: photo("photo-1547592166-23ac45744acd", "Tomato soup with a swirl of cream"),
  },
  {
    id: "energetic",
    label: "Energetic",
    blurb: "Bright and fresh",
    photo: photo("photo-1512621776951-a57141f2eefd", "A colorful grain bowl with vegetables"),
  },
  {
    id: "romantic",
    label: "Romantic",
    blurb: "Worth lingering over",
    photo: photo("photo-1414235077428-338989a2e8c0", "A candlelit restaurant table set for two"),
  },
  {
    id: "stressed",
    label: "Stressed",
    blurb: "Comfort, no fuss",
    photo: photo("photo-1495474472287-4d71bcdd2085", "A cup of coffee on a wooden table"),
  },
  {
    id: "celebratory",
    label: "Celebratory",
    blurb: "Set the nice plates",
    photo: photo("photo-1464349095431-e9a21285b5f3", "A celebration cake with candles"),
  },
];
