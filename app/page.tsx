import { createClient } from "@supabase/supabase-js";
import { PolaroidStack } from "@/components/PolaroidStack";
import { RecipeGrid } from "@/components/RecipeGrid";
import { SubstackSection } from "@/components/SubstackSection";
import { fetchSubstackPosts } from "@/lib/substack";
import type { Recipe } from "@/lib/types";

async function fetchRecipes(): Promise<Recipe[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
   const { data, error } = await supabase
    .from("recipes")
    .select("id, title, slug, image_url, category, time_minutes, cost_inr, calories, ingredients, instructions")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("Failed to fetch recipes:", error.message);
    return [];
  }
  return (data ?? []) as Recipe[];
}

export default async function Home() {
  const [recipes, substackPosts] = await Promise.all([
    fetchRecipes(),
    fetchSubstackPosts(),
  ]);

  return (
    <main className="min-h-screen overflow-x-clip bg-recipe-yellow px-8 py-12 text-recipe-navy md:px-16 md:py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16 lg:gap-24">
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-medium tracking-wide">Diwyani&apos;s</p>
            <h1 className="font-barrio text-5xl uppercase leading-[0.9] sm:text-6xl md:text-7xl lg:text-8xl" style={{ marginLeft: "-0.05em" }}>
              Recipe Book
            </h1>
            <p className="max-w-md text-base leading-8 md:text-lg md:leading-9">
             I've been cooking my own meals for a year now. What I've found
            from all of it — food is beyond calories and protein. It's
exploration, a way back to memories, warm meals made for
ourselves and the people we love. This is where I keep mine.
            </p>
          </div>

          <div className="flex justify-center overflow-visible md:justify-end md:pt-2">
            <PolaroidStack />
          </div>
        </header>

        <RecipeGrid initialRecipes={recipes} />

        <SubstackSection posts={substackPosts} />
      </div>
    </main>
  );
}
