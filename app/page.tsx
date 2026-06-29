import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { PolaroidStack } from "@/components/PolaroidStack";
import { RecipeGrid } from "@/components/RecipeGrid";
import { SubstackSection } from "@/components/SubstackSection";
import { fetchSubstackPosts } from "@/lib/substack";
import type { Recipe } from "@/lib/types";
export const dynamic = "force-dynamic";

const fetchRecipes = unstable_cache(
  async (): Promise<Recipe[]> => {
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
  },
  ["recipes"],
  { revalidate: 3600 }
);

// REMOVE BEFORE LAUNCH — keeps loading screen visible for 1.5 loops (4.5s)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function Home() {
  const [recipes, substackPosts] = await Promise.all([
    fetchRecipes(),
    fetchSubstackPosts(),
    delay(3000),
  ]);

  return (
    <main className="min-h-screen overflow-x-clip bg-recipe-yellow px-8 py-12 text-recipe-navy md:px-16 md:py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16 lg:gap-24">
          <div className="max-w-xl space-y-6">
            <p className="text-base font-medium tracking-wide">Diwyani&apos;s</p>
            <h1 className="font-barrio text-5xl uppercase leading-[0.9] sm:text-6xl md:text-7xl lg:text-8xl" style={{ marginLeft: "-0.05em" }}>
              Recipe Book
            </h1>
            <div className="max-w-md text-base leading-8 md:text-lg md:leading-9 space-y-5">
              <p>I&apos;m Diwyani. By day I design things; lately, I cook them too.</p>
              <p>A year ago a book made me pick up a pan for the first time — before that, there were days I&apos;d just skip eating altogether. Cooking became an act of self-love I didn&apos;t know I needed. This is my running record of what I&apos;ve learned, burnt, and gone back for seconds of.</p>
              <p>The only real rule here: keep it light on money, light on time, and just healthy enough but colourful enough that I actually want to eat it.</p>
            </div>
          </div>

          <div className="flex justify-center overflow-visible md:justify-start md:pt-2">
            <PolaroidStack />
          </div>
        </header>

        <RecipeGrid initialRecipes={recipes} />

        <SubstackSection posts={substackPosts} />
      </div>
    </main>
  );
}
