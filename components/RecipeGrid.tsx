"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RecipeModal } from "@/components/RecipeModal";
import type { Recipe } from "@/lib/types";
import { timeLevel, costLevel, calorieLevel } from "@/lib/levels";

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

function imageAdjust(title: string): { objectPosition?: string; transform?: string } {
  const t = title.toLowerCase();
  if (t.includes("chutney")) return { objectPosition: "center 5%" };
  if (t.includes("melon")) return { objectPosition: "center 68%" };
  return {};
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
                style={imageAdjust(recipe.title)}
                loading="lazy"
              />
            ) : (
              <div className="w-36 h-36 bg-neutral-300 rounded-[2.5rem]" />
            )}
          </div>

          {/* Right: text */}
          <div className="flex-1 flex flex-col gap-1.5 text-left min-w-0 pt-1">
            <div className="flex items-start justify-between gap-2">
              <p className="flex-1 text-left font-syne text-lg uppercase leading-snug text-recipe-navy">
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
                  {timeLevel(recipe.time_minutes)}
                </span>
              )}
              {recipe.cost_inr && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <span className="text-[0.65rem] leading-none">₹</span>
                  {costLevel(recipe.cost_inr)}
                </span>
              )}
              {recipe.calories && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <svg width="12" height="12" viewBox="200 200 100 100" fill="currentColor" stroke="currentColor" strokeWidth="3"><path d="M294.462,257.792c-0.168-0.214-0.419-0.345-0.69-0.359c-7.301-0.39-13.02-6.42-13.02-13.727c0-0.362,0.018-0.744,0.054-1.168c0.027-0.326-0.117-0.642-0.38-0.835c-0.264-0.193-0.608-0.236-0.911-0.112c-1.911,0.781-3.932,1.177-6.004,1.177c-8.751,0-15.869-7.108-15.869-15.846c0-4.551,1.967-8.889,5.396-11.9c0.287-0.252,0.393-0.652,0.268-1.012c-0.124-0.36-0.454-0.609-0.835-0.63c-4.313-0.237-7.943-3.351-8.828-7.57c-0.087-0.417-0.444-0.723-0.869-0.745c-0.795-0.041-1.593-0.062-2.375-0.062c-12.036,0-23.351,4.681-31.861,13.18c-8.511,8.5-13.198,19.8-13.198,31.82c0,12.02,4.687,23.32,13.198,31.82c8.51,8.499,19.826,13.18,31.861,13.18c21.569,0,40.176-15.33,44.245-36.453C294.694,258.281,294.629,258.006,294.462,257.792z M250.399,293.123c-23.811,0-43.182-19.346-43.182-43.123c0-23.778,19.372-43.123,43.182-43.123c0.521,0,1.05,0.01,1.581,0.029c1.123,4.047,4.392,7.128,8.429,8.066c-2.972,3.25-4.645,7.508-4.645,11.948c0,9.773,7.961,17.724,17.747,17.724c1.835,0,3.633-0.278,5.364-0.828c0.055,7.892,5.979,14.447,13.716,15.396C288.299,278.924,270.721,293.123,250.399,293.123z"/><path d="M216.783,244.865c-2.834,0-5.141,2.304-5.141,5.135c0,2.832,2.306,5.135,5.141,5.135c2.834,0,5.141-2.303,5.141-5.135C221.924,247.168,219.618,244.865,216.783,244.865z M216.783,253.258c-1.799,0-3.263-1.462-3.263-3.258c0-1.796,1.464-3.258,3.263-3.258s3.263,1.461,3.263,3.258C220.046,251.796,218.583,253.258,216.783,253.258z"/><path d="M244.096,261.65c-5.152,0-9.343,4.186-9.343,9.331s4.191,9.331,9.343,9.331c5.151,0,9.342-4.186,9.342-9.331S249.248,261.65,244.096,261.65z M244.096,278.436c-4.117,0-7.465-3.344-7.465-7.454s3.349-7.454,7.465-7.454c4.116,0,7.465,3.344,7.465,7.454S248.212,278.436,244.096,278.436z"/><path d="M239.894,246.742c2.834,0,5.141-2.304,5.141-5.135c0-2.832-2.306-5.135-5.141-5.135c-2.834,0-5.141,2.304-5.141,5.135C234.753,244.438,237.06,246.742,239.894,246.742z M239.894,238.35c1.799,0,3.263,1.461,3.263,3.257s-1.464,3.258-3.263,3.258s-3.263-1.461-3.263-3.258S238.095,238.35,239.894,238.35z"/><path d="M272.46,263.748c-3.414,0-6.191,2.775-6.191,6.185c0,3.41,2.777,6.185,6.191,6.185s6.191-2.774,6.191-6.185C278.651,266.523,275.874,263.748,272.46,263.748z M272.46,274.239c-2.379,0-4.313-1.933-4.313-4.307s1.935-4.307,4.313-4.307c2.378,0,4.313,1.933,4.313,4.307S274.838,274.239,272.46,274.239z"/></svg>
                  {calorieLevel(recipe.calories)}
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
                  style={imageAdjust(recipe.title)}
                  loading="lazy"
                />
              ) : (
                <div className="w-48 h-48 bg-neutral-300 rounded-[4rem]" />
              )}
            </div>
          </div>

          <div className="mt-3 w-52">
            <div className="flex items-start justify-between gap-2">
              <p className="flex-1 text-left font-syne text-base uppercase leading-snug text-recipe-navy">
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
                  {timeLevel(recipe.time_minutes)}
                </span>
              )}
              {recipe.cost_inr && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <span className="text-[0.65rem] leading-none">₹</span>
                  {costLevel(recipe.cost_inr)}
                </span>
              )}
              {recipe.calories && (
                <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-recipe-navy/60">
                  <svg width="12" height="12" viewBox="200 200 100 100" fill="currentColor" stroke="currentColor" strokeWidth="3"><path d="M294.462,257.792c-0.168-0.214-0.419-0.345-0.69-0.359c-7.301-0.39-13.02-6.42-13.02-13.727c0-0.362,0.018-0.744,0.054-1.168c0.027-0.326-0.117-0.642-0.38-0.835c-0.264-0.193-0.608-0.236-0.911-0.112c-1.911,0.781-3.932,1.177-6.004,1.177c-8.751,0-15.869-7.108-15.869-15.846c0-4.551,1.967-8.889,5.396-11.9c0.287-0.252,0.393-0.652,0.268-1.012c-0.124-0.36-0.454-0.609-0.835-0.63c-4.313-0.237-7.943-3.351-8.828-7.57c-0.087-0.417-0.444-0.723-0.869-0.745c-0.795-0.041-1.593-0.062-2.375-0.062c-12.036,0-23.351,4.681-31.861,13.18c-8.511,8.5-13.198,19.8-13.198,31.82c0,12.02,4.687,23.32,13.198,31.82c8.51,8.499,19.826,13.18,31.861,13.18c21.569,0,40.176-15.33,44.245-36.453C294.694,258.281,294.629,258.006,294.462,257.792z M250.399,293.123c-23.811,0-43.182-19.346-43.182-43.123c0-23.778,19.372-43.123,43.182-43.123c0.521,0,1.05,0.01,1.581,0.029c1.123,4.047,4.392,7.128,8.429,8.066c-2.972,3.25-4.645,7.508-4.645,11.948c0,9.773,7.961,17.724,17.747,17.724c1.835,0,3.633-0.278,5.364-0.828c0.055,7.892,5.979,14.447,13.716,15.396C288.299,278.924,270.721,293.123,250.399,293.123z"/><path d="M216.783,244.865c-2.834,0-5.141,2.304-5.141,5.135c0,2.832,2.306,5.135,5.141,5.135c2.834,0,5.141-2.303,5.141-5.135C221.924,247.168,219.618,244.865,216.783,244.865z M216.783,253.258c-1.799,0-3.263-1.462-3.263-3.258c0-1.796,1.464-3.258,3.263-3.258s3.263,1.461,3.263,3.258C220.046,251.796,218.583,253.258,216.783,253.258z"/><path d="M244.096,261.65c-5.152,0-9.343,4.186-9.343,9.331s4.191,9.331,9.343,9.331c5.151,0,9.342-4.186,9.342-9.331S249.248,261.65,244.096,261.65z M244.096,278.436c-4.117,0-7.465-3.344-7.465-7.454s3.349-7.454,7.465-7.454c4.116,0,7.465,3.344,7.465,7.454S248.212,278.436,244.096,278.436z"/><path d="M239.894,246.742c2.834,0,5.141-2.304,5.141-5.135c0-2.832-2.306-5.135-5.141-5.135c-2.834,0-5.141,2.304-5.141,5.135C234.753,244.438,237.06,246.742,239.894,246.742z M239.894,238.35c1.799,0,3.263,1.461,3.263,3.257s-1.464,3.258-3.263,3.258s-3.263-1.461-3.263-3.258S238.095,238.35,239.894,238.35z"/><path d="M272.46,263.748c-3.414,0-6.191,2.775-6.191,6.185c0,3.41,2.777,6.185,6.191,6.185s6.191-2.774,6.191-6.185C278.651,266.523,275.874,263.748,272.46,263.748z M272.46,274.239c-2.379,0-4.313-1.933-4.313-4.307s1.935-4.307,4.313-4.307c2.378,0,4.313,1.933,4.313,4.307S274.838,274.239,272.46,274.239z"/></svg>
                  {calorieLevel(recipe.calories)}
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
        <p className="font-syne text-2xl uppercase text-recipe-navy/30">
          Nothing here yet.
        </p>
      )}

      {recipes.length > 0 && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 sm:gap-y-6 md:gap-x-12 items-start justify-items-start [&>*:nth-child(3n+2)]:lg:justify-self-center [&>*:nth-child(3n+3)]:lg:justify-self-end">
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
