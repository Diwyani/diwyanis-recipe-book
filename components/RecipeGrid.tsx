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

// Each recipe's visual personality — size, shape, position offset, rotation
// Adjust these values to move cards around without touching layout logic
const shapeMap: Record<string, {
  shapeClass: string;
  titleClass: string;
  wrapperClass: string;
}> = {
  "rice-salad": {
    // Large, organic blob — bottom left feel
    shapeClass: "h-52 w-44 rounded-[55%_45%_48%_52%_/_42%_38%_62%_58%]",
    titleClass: "mt-3 text-left max-w-[10rem]",
    wrapperClass: "mt-8 ml-0 rotate-[-2deg]",
  },
  "chia-jam": {
    // Circle — mid right
    shapeClass: "h-44 w-44 rounded-full",
    titleClass: "mt-3 text-left max-w-[10rem]",
    wrapperClass: "mt-0 ml-auto rotate-[2deg]",
  },
  "apple-chutney": {
    // Tall oval
    shapeClass: "h-52 w-36 rounded-[50%_50%_45%_55%_/_55%_45%_55%_45%]",
    titleClass: "mt-3 text-left max-w-[9rem]",
    wrapperClass: "mt-6 ml-8 rotate-[-1deg]",
  },
};

const fallbackShape = {
  shapeClass: "h-44 w-40 rounded-[2rem]",
  titleClass: "mt-3 text-left max-w-[10rem]",
  wrapperClass: "mt-4 rotate-[-1deg]",
};

// Decorative elements scattered around the grid
function StarDecor({ className }: { className: string }) {
  return (
    <span
      className={`absolute select-none text-2xl ${className}`}
      style={{ color: "#E03A2F" }}
    >
      ★
    </span>
  );
}

function CircleDecor({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full bg-recipe-navy ${className}`}
    />
  );
}

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
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) {
  const shape = shapeMap[recipe.slug] ?? fallbackShape;

  return (
    <article className={`relative w-fit ${shape.wrapperClass}`}>
      <button
        type="button"
        onClick={onClick}
        className="group block cursor-pointer text-recipe-navy"
        aria-label={`Open ${recipe.title}`}
      >
        {/* Shape — photo or grey placeholder */}
        <div
          className={`overflow-hidden transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-1 ${shape.shapeClass} ${
            recipe.image_url ? "" : "bg-neutral-300"
          }`}
        >
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Title + small arrow hint */}
        <div className={`flex items-center gap-1.5 ${shape.titleClass}`}>
          <p className="font-barrio text-base uppercase leading-snug">
            {recipe.title}
          </p>
          {/* Small arrow — hints the card is clickable */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="#281A7C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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

          {/* Decorative elements — adjust positions to taste */}
          <StarDecor className="top-4 right-8 text-xl" />
          <StarDecor className="bottom-12 left-2 text-lg" />
          <CircleDecor className="top-0 right-24 w-3 h-3" />
          <CircleDecor className="bottom-24 right-4 w-2 h-2" />

          {/* 
            Two column layout — left and right columns, 
            cards scattered with margin/rotation via wrapperClass 
          */}
          <div className="flex gap-6 md:gap-10">

            {/* Left column */}
            <div className="flex flex-col flex-1">
              {recipes
                .filter((_, i) => i % 2 === 0)
                .map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              {/* WHY block sits in left column */}
              <WhyBlock />
            </div>

            {/* Right column */}
            <div className="flex flex-col flex-1 pt-16">
              {/* pt-16 offsets right column down — creates staggered feel */}
              {recipes
                .filter((_, i) => i % 2 !== 0)
                .map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
            </div>

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