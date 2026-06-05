"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Recipe } from "@/lib/types";

function CloseButton({ onClose }: { onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute right-5 top-5 font-barrio text-3xl leading-none z-10 transition-all duration-200"
      style={{
        color: hovered ? "#281A7C" : "rgba(255,248,236,0.5)",
        backgroundColor: hovered ? "#FFF8EC" : "transparent",
        borderRadius: "50%",
        width: "2rem",
        height: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Close"
    >
      ×
    </button>
  );
}

export function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <>
      {/* SVG filter — only defines the torn edge, renders nothing visible */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="torn-edge" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="5"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm animate-fadeIn"
        style={{ backgroundColor: "rgba(40,26,124,0.5)", cursor: "default" }}
        onClick={onClose}
      >
        {/*
          Outer wrapper — no filter, just positions the card.
          The torn effect is applied ONLY to the background layer div below,
          so content stays crisp and readable.
        */}
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modalIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/*
            Background layer — torn edge filter applied HERE ONLY.
            This is a purely decorative layer, no content inside.
            pointer-events-none so it doesn't block clicks.
          */}
          <div
            className="absolute inset-0 paper-grain"
            style={{
              backgroundColor: "#281A7C",
              filter: "url(#torn-edge)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Content layer — sits on top of background, no filter applied */}
          <div className="relative p-7 sm:p-9" style={{ zIndex: 1 }}>

            {/* Close button */}
            <CloseButton onClose={onClose} />

            {/* Category stamp */}
            {recipe.category && (
              <span
                className="inline-block -rotate-[1.5deg] mb-3 rounded-full px-3 py-0.5 font-barrio text-xs uppercase tracking-widest"
                style={{
                  border: "2px solid rgba(255,248,236,0.3)",
                  color: "rgba(255,248,236,0.5)",
                }}
              >
                {recipe.category}
              </span>
            )}

            {/* Big title */}
            <h2
              className="font-barrio text-5xl sm:text-7xl uppercase leading-none mb-5"
              style={{ color: "#FFF8EC" }}
            >
              {recipe.title}
            </h2>

            {/* Dashed divider */}
            <div
              className="border-t-2 border-dashed mb-6"
              style={{ borderColor: "rgba(255,248,236,0.2)" }}
            />

            {/* Two column layout */}
            <div className="flex flex-col sm:flex-row gap-8">

              {/* Left — photo + meta */}
              <div className="sm:w-1/2 shrink-0">
                <div className="w-full aspect-square overflow-hidden rounded-[1rem] bg-neutral-700">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span
                        className="font-barrio text-lg uppercase"
                        style={{ color: "rgba(255,248,236,0.4)" }}
                      >
                        Photo soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.time_minutes && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                      style={{
                        border: "2px solid #FFF8EC",
                        color: "#FFF8EC",
                      }}
                    >
                      ⏱ {recipe.time_minutes} mins
                    </span>
                  )}
                  {recipe.cost_inr && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                      style={{
                        border: "2px solid #FFF8EC",
                        color: "#FFF8EC",
                      }}
                    >
                      ₹{recipe.cost_inr}
                    </span>
                  )}
                  {recipe.calories && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                      style={{
                        border: "2px solid #FFF8EC",
                        color: "#FFF8EC",
                      }}
                    >
                      {recipe.calories} cal
                    </span>
                  )}
                </div>
              </div>

              {/* Right — ingredients + method */}
              <div className="sm:w-1/2">

                {/* Ingredients */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div className="mb-7">
                    <h3
                      className="font-barrio text-2xl uppercase mb-4"
                      style={{ color: "#FFF8EC" }}
                    >
                      Ingredients
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {recipe.ingredients.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-16 h-16 rounded-full"
                              style={{ backgroundColor: "rgba(255,248,236,0.15)" }}
                            />
                          )}
                          <p
                            className="text-xs text-center leading-snug"
                            style={{ color: "rgba(255,248,236,0.8)" }}
                          >
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Method */}
                {recipe.instructions && (
                  <div>
                    <h3
                      className="font-barrio text-2xl uppercase mb-3"
                      style={{ color: "#FFF8EC" }}
                    >
                      Method
                    </h3>
                    <p
                      className="text-sm leading-relaxed whitespace-pre-line px-1"
                      style={{ color: "rgba(255,248,236,0.8)" }}
                    >
                      {recipe.instructions}
                    </p>
                  </div>
                )}

              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

