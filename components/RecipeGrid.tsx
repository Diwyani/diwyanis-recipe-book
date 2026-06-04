"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RecipeModal } from "@/components/RecipeModal";

type Recipe = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  category: string | null;
  time_minutes: number | null;
  cost_inr: number | null;
  calories: number | null;
  ingredients: string[] | null;
  instructions: string | null;
};

// The WHY? editorial block — sits between cards like in Figma
function WhyBlock() {
  return (
    <div className="relative w-fit max-w-[14rem] rotate-[1deg] mt-6 ml-4">
      <h3 className="font-barrio text-3xl uppercase text-recipe-navy leading-none mb-2">
        Why?
      </h3>
      <p className="text-xs leading-relaxed text-recipe-navy/70">
        Deciding to cook, and being in the kitchen not knowing how to make
        things, still not looking up for recipe, just instinct and memories
        has made me confident in my choices, made me comfortable with "not
        knowing". Now it's going to turn out. I've deliciously adopted a
        learn-on-the-go mindset.
      </p>
    </div>
  );
}

function RecipeCard({
  recipe,
  index,
  onClick,
}: {
  recipe: Recipe;
  index: number;
  onClick: () => void;
}) {
  return (
    <article className="relative w-fit group/card">
      <button
        type="button"
        onClick={onClick}
        className="group block cursor-pointer text-recipe-navy"
        aria-label={`Open ${recipe.title}`}
      >
        {/* Rounded square image */}
        <div className="transition-transform duration-300 ease-out group-hover/card:rotate-[2deg] group-hover/card:scale-95">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-48 h-48 object-cover rounded-[4rem]"
              style={{ display: "block" }}
            />
          ) : (
            <div className="w-48 h-48 bg-neutral-300 rounded-[4rem]" />
          )}
        </div>

        {/* Title + circled arrow */}
        <div className="mt-3 max-w-[12rem] flex items-end justify-between gap-4">
          <p className="font-barrio text-base uppercase leading-snug text-recipe-navy">
            <span style={{ color: "#E03A2F" }}>★ </span>
            {recipe.title}
          </p>
          <img
  src="/Arrow.svg"
  alt="open recipe"
  className="shrink-0 w-8 h-8 group-hover:scale-110 transition-transform duration-200"
/>
        </div>
      </button>
    </article>
  );
}

export function RecipeGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      let q = supabase.from("recipes").select("*");
      if (query.trim()) q = q.ilike("title", `%${query}%`);
      if (activeCategory !== "all") q = q.eq("category", activeCategory);
      const { data, error } = await q;
      if (error) console.error("Error fetching recipes:", error.message);
      else setRecipes(data ?? []);
      setLoading(false);
    }
    fetchRecipes();
  }, [query, activeCategory]);

  return (
    <section className="mt-16 md:mt-20" aria-label="Recipes">

      {/* Search + filter — quieter styling */}
      <div className="mb-12 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-36 border-b border-recipe-navy/30 bg-transparent pb-1 text-sm text-recipe-navy placeholder:text-recipe-navy/30 focus:outline-none focus:border-recipe-navy transition-colors"
        />
        <div className="flex flex-wrap gap-2">
          {["all", "breakfast", "dinner", "snack"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-wide transition-colors duration-200 ${
                activeCategory === cat
                  ? "bg-recipe-navy/15 text-recipe-navy font-medium"
                  : "bg-transparent text-recipe-navy/40 hover:text-recipe-navy/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-recipe-navy/40">Loading...</p>
      )}

      {/* Empty */}
      {!loading && recipes.length === 0 && (
        <p className="font-barrio text-2xl uppercase text-recipe-navy/30">
          Nothing here yet.
        </p>
      )}

      {/* 
        Grid — relative container so decorative elements 
        can be absolutely positioned inside it 
      */}
      {!loading && recipes.length > 0 && (
        <div className="relative">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-x-12 md:gap-y-12">
            {recipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
            <WhyBlock />
          </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </section>
  );
}