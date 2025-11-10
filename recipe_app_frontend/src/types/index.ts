export type Recipe = {
  id: string;
  title: string;
  image: string;
  tags: string[]; // e.g. ['Quick', 'Vegan']
  cuisine: string; // e.g. 'Italian'
  time: number; // in minutes
  ingredients: string[];
  steps: string[];
};
