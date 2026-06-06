"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RecipeModal } from "@/components/RecipeModal";
import type { Recipe } from "@/lib/types";

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
  index: number;
  onClick: () => void;
}) {
  const [clicking, setClicking] = useState(false);

  function handleClick() {
    setClicking(true);
    onClick();
    setTimeout(() => setClicking(false), 400);
  }

  return (
    <article className="relative group/card w-full sm:w-52">
      <button
        type="button"
        onClick={handleClick}
        className="group cursor-pointer text-recipe-navy w-full"
        aria-label={`Open ${recipe.title}`}
      >
        {/* ── Mobile: horizontal row ── */}
        <div className="flex items-start gap-4 sm:hidden">
          {/* Left: image */}
          <div
            className="transition-transform ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0"
            style={{
              transitionDuration: clicking ? "320ms" : "300ms",
              transform: clicking ? "rotate(4deg) scale(1.08)" : undefined,
            }}
          >
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                width={144} height={144}
                className="w-36 h-36 object-cover rounded-[2.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                loading="lazy"
              />
            ) : (
              <div className="w-36 h-36 bg-neutral-300 rounded-[2.5rem]" />
            )}
          </div>

          {/* Right: text */}
          <div className="flex-1 flex flex-col gap-1.5 text-left min-w-0 pt-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-barrio text-lg uppercase leading-snug text-recipe-navy">
                <span style={{ color: "#E03A2F" }}>★ </span>
                {recipe.title}
              </p>
              <img
                src="/Arrow.svg"
                alt="open recipe"
                className="shrink-0 w-7 h-7 mt-0.5 group-hover:scale-110 transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              />
            </div>

            {/* Meta: time, cost, calories */}
            <div className="flex flex-wrap gap-2">
              {recipe.time_minutes && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {recipe.time_minutes}m
                </span>
              )}
              {recipe.cost_inr && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  ₹{recipe.cost_inr}
                </span>
              )}
              {recipe.calories && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
                  {recipe.calories}cal
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop: vertical card ── */}
        <div className="hidden sm:block">
          <div
            className="transition-transform ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              transitionDuration: clicking ? "320ms" : "300ms",
              transform: clicking ? "rotate(4deg) scale(1.08)" : undefined,
            }}
          >
            <div
              className="transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover/card:rotate-[2deg] group-hover/card:scale-95"
              style={clicking ? { transform: "none" } : undefined}
            >
              {recipe.image_url ? (
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  width={208} height={208}
                  className="w-52 h-52 object-cover rounded-[4rem] shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
                  loading="lazy"
                />
              ) : (
                <div className="w-48 h-48 bg-neutral-300 rounded-[4rem]" />
              )}
            </div>
          </div>

          <div className="mt-3 w-52">
            <div className="flex items-start justify-between gap-2">
              <p className="font-barrio text-base uppercase leading-snug text-recipe-navy">
                <span style={{ color: "#E03A2F" }}>★ </span>
                {recipe.title}
              </p>
              <img
                src="/Arrow.svg"
                alt="open recipe"
                className="shrink-0 w-8 h-8 group-hover:scale-110 transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {recipe.time_minutes && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {recipe.time_minutes}m
                </span>
              )}
              {recipe.cost_inr && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  ₹{recipe.cost_inr}
                </span>
              )}
              {recipe.calories && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
                  {recipe.calories}cal
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

export function RecipeGrid({ initialRecipes }: { initialRecipes: Recipe[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const recipes = useMemo(() => {
    let list = initialRecipes;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q));
    }
    if (activeCategory !== "all") {
      list = list.filter((r) => r.category === activeCategory);
    }
    return list;
  }, [initialRecipes, query, activeCategory]);

  return (
    <section className="mt-16 md:mt-20" aria-label="Recipes">

      {/* Search + filter */}
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

      {recipes.length === 0 && (
        <p className="font-barrio text-2xl uppercase text-recipe-navy/30">
          Nothing here yet.
        </p>
      )}

      {recipes.length > 0 && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 sm:gap-y-6 md:gap-x-12 items-start sm:justify-items-center lg:justify-items-start">
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
