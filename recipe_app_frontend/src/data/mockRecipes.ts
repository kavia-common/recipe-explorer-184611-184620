import { Recipe } from '../types';

const placeholderImages = [
  'https://images.unsplash.com/photo-1604908554007-071dc3d9d5d2?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-60a3e2f96b8a?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617195737496-54f02b33b1b8?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1400&auto=format&fit=crop',
];

const cuisines = ['Italian', 'Mexican', 'Indian', 'American', 'Chinese', 'Japanese', 'Mediterranean', 'Thai'];
const tagsPool = ['Quick', 'Vegan', 'Gluten-Free', 'Spicy', 'Healthy', 'Comfort', 'Low Carb', 'Kid-Friendly'];

function pick<T>(arr: T[], n: number): T[] {
  const cloned = [...arr];
  const out: T[] = [];
  while (out.length < n && cloned.length) {
    const idx = Math.floor(Math.random() * cloned.length);
    out.push(cloned.splice(idx, 1)[0]);
  }
  return out;
}

function makeRecipe(i: number): Recipe {
  const time = 10 + (i % 8) * 5;
  const title = [
    'Pasta Primavera',
    'Spicy Tacos',
    'Curry Lentils',
    'Classic Burger',
    'Stir Fry Veggies',
    'Sushi Bowl',
    'Greek Salad',
    'Pad Thai',
    'Tomato Soup',
    'Avocado Toast',
  ][i % 10];

  return {
    id: `r-${i + 1}`,
    title,
    image: placeholderImages[i % placeholderImages.length],
    tags: pick(tagsPool, 2),
    cuisine: cuisines[i % cuisines.length],
    time,
    ingredients: [
      '1 tbsp olive oil',
      '2 cloves garlic',
      '1 onion, chopped',
      '2 cups mixed veggies',
      'Salt & pepper to taste',
      'Optional: herbs',
    ],
    steps: [
      'Heat pan with olive oil.',
      'Add garlic and onion; sauté until fragrant.',
      'Add veggies and cook until tender.',
      'Season with salt, pepper, and herbs.',
      'Serve warm and enjoy.',
    ],
  };
}

export const mockRecipes: Recipe[] = Array.from({ length: 20 }).map((_, i) => makeRecipe(i));
