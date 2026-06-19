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
      className="absolute right-5 top-5 font-syne text-3xl leading-none z-10 transition-all duration-200"
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
        {/* Outer card — overflow-hidden keeps torn-edge bg clipped to card bounds */}
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden animate-modalIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background layer — torn edge filter applied HERE ONLY */}
          <div
            className="absolute inset-0 paper-grain"
            style={{
              backgroundColor: "#281A7C",
              filter: "url(#torn-edge)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Scroll container — sits above background, scrolls content */}
          <div className="relative max-h-[90vh] overflow-y-auto" style={{ zIndex: 1 }}>
            <div className="p-5 sm:p-9">

              <CloseButton onClose={onClose} />

              {/* Category stamp */}
              {recipe.category && (
                <span
                  className="inline-block -rotate-[1.5deg] mb-3 rounded-full px-3 py-0.5 font-syne text-xs uppercase tracking-widest"
                  style={{
                    border: "2px solid rgba(255,248,236,0.3)",
                    color: "rgba(255,248,236,0.5)",
                  }}
                >
                  {recipe.category}
                </span>
              )}

              {/*
                TOP ROW — Title (left) + Ingredients (right)
                On mobile: stacks vertically. Small photo appears inside
                the ingredients column on mobile only.
              */}
              <div className="flex flex-col sm:flex-row sm:gap-8 mb-5 sm:mb-6">

                {/* Title */}
                <div className="sm:w-[55%]">
                  <h2
                    className="font-syne uppercase leading-none"
                    style={{
                      color: "#FFF8EC",
                      fontSize:
                        recipe.title.length > 20
                          ? "clamp(1.75rem, 5vw, 3rem)"
                          : "clamp(2.5rem, 7vw, 4.5rem)",
                    }}
                  >
                    {recipe.title}
                  </h2>
                </div>

                {/* Ingredients */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div className="sm:w-[45%] mt-5 sm:mt-0">
                    <h3
                      className="font-syne text-lg uppercase mb-2"
                      style={{ color: "rgba(255,248,236,0.7)" }}
                    >
                      Ingredients
                    </h3>

                    <ul className="space-y-1.5">
                      {recipe.ingredients.map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <span style={{ color: "#E03A2F" }} className="text-xs">★</span>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          )}
                          <p
                            className="text-xs leading-snug break-words"
                            style={{ color: "rgba(255,248,236,0.75)" }}
                          >
                            {item.name}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Dashed divider */}
              <div
                className="border-t-2 border-dashed mb-5 sm:mb-6"
                style={{ borderColor: "rgba(255,248,236,0.2)" }}
              />

              {/*
                BOTTOM ROW — Photo (left, desktop only) + Method (right)
                On mobile: photo is hidden here (shown above in ingredients).
                On desktop: large photo + meta pills on the left.
              */}
              <div className="flex flex-col sm:flex-row gap-8">

                {/* Photo + meta pills */}
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
                          className="font-syne text-lg uppercase"
                          style={{ color: "rgba(255,248,236,0.4)" }}
                        >
                          Photo soon
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:flex flex-wrap gap-2 mt-4">
                    {recipe.time_minutes && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{ border: "2px solid #FFF8EC", color: "#FFF8EC" }}
                      >
                        ⏱ {recipe.time_minutes} mins
                      </span>
                    )}
                    {recipe.cost_inr && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{ border: "2px solid #FFF8EC", color: "#FFF8EC" }}
                      >
                        ₹{recipe.cost_inr}
                      </span>
                    )}
                    {recipe.calories && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{ border: "2px solid #FFF8EC", color: "#FFF8EC" }}
                      >
                        {recipe.calories} cal
                      </span>
                    )}
                  </div>
                </div>

                {/* Method column */}
                <div className="sm:w-1/2 min-w-0">

                  {/* Mobile-only meta pills */}
                  <div className="sm:hidden flex flex-wrap gap-2 mb-4">
                    {recipe.time_minutes && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{ border: "2px solid #FFF8EC", color: "#FFF8EC" }}
                      >
                        ⏱ {recipe.time_minutes} mins
                      </span>
                    )}
                    {recipe.cost_inr && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{ border: "2px solid #FFF8EC", color: "#FFF8EC" }}
                      >
                        ₹{recipe.cost_inr}
                      </span>
                    )}
                    {recipe.calories && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                        style={{ border: "2px solid #FFF8EC", color: "#FFF8EC" }}
                      >
                        {recipe.calories} cal
                      </span>
                    )}
                  </div>

                  {recipe.instructions && (
                    <div>
                      <h3
                        className="font-syne text-2xl uppercase mb-3"
                        style={{ color: "#FFF8EC" }}
                      >
                        Method
                      </h3>
                      <p
                        className="text-sm leading-relaxed whitespace-pre-line break-words px-1"
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
      </div>
    </>,
    document.body
  );
}
