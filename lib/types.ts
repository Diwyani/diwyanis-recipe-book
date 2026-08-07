export type Recipe = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  category: string | null;
  time_minutes: number | null;
  cost_inr: number | null;
  ingredients: { name: string; image: string | null }[] | null;
  instructions: string | null;
};
