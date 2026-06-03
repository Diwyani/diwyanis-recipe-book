"use client";

import { useEffect } from "react";

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

export function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // Backdrop — navy tint + blur, click outside to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-recipe-navy/50 px-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* 
        The card itself.
        - paper-grain: CSS noise texture class from globals.css
        - rotate-[0.5deg]: slight tilt — feels physically placed, not digital
        - bg-[#FFF8EC]: warm off-white, like aged recipe card paper (not pure white, not yellow)
        - rounded-[1.75rem]: softer than sharp, less perfect than a UI card
        - shadow: deep navy shadow anchors it to the page
        - border: faint inset border like card stock edge
      */}
      <div
        className="paper-grain relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FFF8EC] rounded-[1.75rem] rotate-[0.5deg] border border-recipe-navy/10 shadow-[0_24px_60px_rgba(40,26,124,0.22)] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 
          Inner padding wrapper — separate from the card so the grain
          overlay (absolute inset-0) doesn't interfere with content spacing 
        */}
        <div className="p-7 sm:p-9">

          {/* Close button — top right, uses × character not an icon library */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 font-barrio text-3xl text-recipe-navy/40 leading-none hover:text-recipe-navy transition-colors z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* 
            Category stamp — sits above the title like a label on a recipe card.
            Rotated slightly the other way to the card to create visual tension.
          */}
          {recipe.category && (
            <span className="inline-block -rotate-[1.5deg] mb-3 rounded-full border-2 border-recipe-navy/30 px-3 py-0.5 font-barrio text-xs uppercase tracking-widest text-recipe-navy/50">
              {recipe.category}
            </span>
          )}

          {/* Title */}
          <h2 className="font-barrio text-4xl sm:text-5xl uppercase leading-none text-recipe-navy mb-5">
            {recipe.title}
          </h2>

          {/* 
            Divider — hand-drawn feel using a dashed border instead of a solid line 
          */}
          <div className="border-t-2 border-dashed border-recipe-navy/20 mb-5" />

          {/* Photo */}
          <div className="w-full aspect-[4/3] rounded-[1rem] overflow-hidden mb-6 bg-neutral-200">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              // Placeholder with a subtle inner pattern until real photo exists
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <span className="font-barrio text-lg uppercase text-neutral-400">
                  Photo soon
                </span>
              </div>
            )}
          </div>

          {/* 
            Meta pills — time, cost, calories.
            Uses navy border on cream background — stays in palette. 
          */}
          <div className="flex flex-wrap gap-2 mb-7">
            {recipe.time_minutes && (
              <span className="rounded-full border-2 border-recipe-navy px-3 py-1 text-xs font-medium uppercase tracking-wide text-recipe-navy">
                ⏱ {recipe.time_minutes} mins
              </span>
            )}
            {recipe.cost_inr && (
              <span className="rounded-full border-2 border-recipe-navy px-3 py-1 text-xs font-medium uppercase tracking-wide text-recipe-navy">
                ₹{recipe.cost_inr}
              </span>
            )}
            {recipe.calories && (
              <span className="rounded-full border-2 border-recipe-navy px-3 py-1 text-xs font-medium uppercase tracking-wide text-recipe-navy">
                {recipe.calories} cal
              </span>
            )}
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-7">
              <h3 className="font-barrio text-2xl uppercase text-recipe-navy mb-3">
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed text-recipe-navy/80 flex gap-2.5 items-baseline"
                  >
                    {/* Bullet styled as a small navy dash — more recipe-like than a dot */}
                    <span className="shrink-0 text-recipe-navy font-barrio">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 
            Instructions — recipe-ruled adds faint horizontal lines behind the text,
            like writing on lined recipe card paper.
            whitespace-pre-line respects line breaks you type in Supabase.
          */}
          {recipe.instructions && (
            <div>
              <h3 className="font-barrio text-2xl uppercase text-recipe-navy mb-3">
                Method
              </h3>
              <p className="recipe-ruled text-sm leading-[1.6rem] text-recipe-navy/80 whitespace-pre-line px-1">
                {recipe.instructions}
              </p>
            </div>
          )}

          {/* Bottom margin so last content doesn't sit against the card edge */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}