"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Recipe } from "@/lib/types";
import { timeLevel, costLevel, calorieLevel } from "@/lib/levels";

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
                        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide"
                        style={{ color: "rgba(255,248,236,0.6)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{timeLevel(recipe.time_minutes)}
                      </span>
                    )}
                    {recipe.cost_inr && (
                      <span
                        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide"
                        style={{ color: "rgba(255,248,236,0.6)" }}
                      >
                        <span className="text-[0.65rem] leading-none">₹</span>{costLevel(recipe.cost_inr)}
                      </span>
                    )}
                    {recipe.calories && (
                      <span
                        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide"
                        style={{ color: "rgba(255,248,236,0.6)" }}
                      >
                        <svg width="12" height="12" viewBox="200 200 100 100" fill="currentColor" stroke="currentColor" strokeWidth="3" className="shrink-0"><path d="M294.462,257.792c-0.168-0.214-0.419-0.345-0.69-0.359c-7.301-0.39-13.02-6.42-13.02-13.727c0-0.362,0.018-0.744,0.054-1.168c0.027-0.326-0.117-0.642-0.38-0.835c-0.264-0.193-0.608-0.236-0.911-0.112c-1.911,0.781-3.932,1.177-6.004,1.177c-8.751,0-15.869-7.108-15.869-15.846c0-4.551,1.967-8.889,5.396-11.9c0.287-0.252,0.393-0.652,0.268-1.012c-0.124-0.36-0.454-0.609-0.835-0.63c-4.313-0.237-7.943-3.351-8.828-7.57c-0.087-0.417-0.444-0.723-0.869-0.745c-0.795-0.041-1.593-0.062-2.375-0.062c-12.036,0-23.351,4.681-31.861,13.18c-8.511,8.5-13.198,19.8-13.198,31.82c0,12.02,4.687,23.32,13.198,31.82c8.51,8.499,19.826,13.18,31.861,13.18c21.569,0,40.176-15.33,44.245-36.453C294.694,258.281,294.629,258.006,294.462,257.792z M250.399,293.123c-23.811,0-43.182-19.346-43.182-43.123c0-23.778,19.372-43.123,43.182-43.123c0.521,0,1.05,0.01,1.581,0.029c1.123,4.047,4.392,7.128,8.429,8.066c-2.972,3.25-4.645,7.508-4.645,11.948c0,9.773,7.961,17.724,17.747,17.724c1.835,0,3.633-0.278,5.364-0.828c0.055,7.892,5.979,14.447,13.716,15.396C288.299,278.924,270.721,293.123,250.399,293.123z"/><path d="M216.783,244.865c-2.834,0-5.141,2.304-5.141,5.135c0,2.832,2.306,5.135,5.141,5.135c2.834,0,5.141-2.303,5.141-5.135C221.924,247.168,219.618,244.865,216.783,244.865z M216.783,253.258c-1.799,0-3.263-1.462-3.263-3.258c0-1.796,1.464-3.258,3.263-3.258s3.263,1.461,3.263,3.258C220.046,251.796,218.583,253.258,216.783,253.258z"/><path d="M244.096,261.65c-5.152,0-9.343,4.186-9.343,9.331s4.191,9.331,9.343,9.331c5.151,0,9.342-4.186,9.342-9.331S249.248,261.65,244.096,261.65z M244.096,278.436c-4.117,0-7.465-3.344-7.465-7.454s3.349-7.454,7.465-7.454c4.116,0,7.465,3.344,7.465,7.454S248.212,278.436,244.096,278.436z"/><path d="M239.894,246.742c2.834,0,5.141-2.304,5.141-5.135c0-2.832-2.306-5.135-5.141-5.135c-2.834,0-5.141,2.304-5.141,5.135C234.753,244.438,237.06,246.742,239.894,246.742z M239.894,238.35c1.799,0,3.263,1.461,3.263,3.257s-1.464,3.258-3.263,3.258s-3.263-1.461-3.263-3.258S238.095,238.35,239.894,238.35z"/><path d="M272.46,263.748c-3.414,0-6.191,2.775-6.191,6.185c0,3.41,2.777,6.185,6.191,6.185s6.191-2.774,6.191-6.185C278.651,266.523,275.874,263.748,272.46,263.748z M272.46,274.239c-2.379,0-4.313-1.933-4.313-4.307s1.935-4.307,4.313-4.307c2.378,0,4.313,1.933,4.313,4.307S274.838,274.239,272.46,274.239z"/></svg>{calorieLevel(recipe.calories)}
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
                        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide"
                        style={{ color: "rgba(255,248,236,0.6)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{timeLevel(recipe.time_minutes)}
                      </span>
                    )}
                    {recipe.cost_inr && (
                      <span
                        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide"
                        style={{ color: "rgba(255,248,236,0.6)" }}
                      >
                        <span className="text-[0.65rem] leading-none">₹</span>{costLevel(recipe.cost_inr)}
                      </span>
                    )}
                    {recipe.calories && (
                      <span
                        className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide"
                        style={{ color: "rgba(255,248,236,0.6)" }}
                      >
                        <svg width="12" height="12" viewBox="200 200 100 100" fill="currentColor" stroke="currentColor" strokeWidth="3" className="shrink-0"><path d="M294.462,257.792c-0.168-0.214-0.419-0.345-0.69-0.359c-7.301-0.39-13.02-6.42-13.02-13.727c0-0.362,0.018-0.744,0.054-1.168c0.027-0.326-0.117-0.642-0.38-0.835c-0.264-0.193-0.608-0.236-0.911-0.112c-1.911,0.781-3.932,1.177-6.004,1.177c-8.751,0-15.869-7.108-15.869-15.846c0-4.551,1.967-8.889,5.396-11.9c0.287-0.252,0.393-0.652,0.268-1.012c-0.124-0.36-0.454-0.609-0.835-0.63c-4.313-0.237-7.943-3.351-8.828-7.57c-0.087-0.417-0.444-0.723-0.869-0.745c-0.795-0.041-1.593-0.062-2.375-0.062c-12.036,0-23.351,4.681-31.861,13.18c-8.511,8.5-13.198,19.8-13.198,31.82c0,12.02,4.687,23.32,13.198,31.82c8.51,8.499,19.826,13.18,31.861,13.18c21.569,0,40.176-15.33,44.245-36.453C294.694,258.281,294.629,258.006,294.462,257.792z M250.399,293.123c-23.811,0-43.182-19.346-43.182-43.123c0-23.778,19.372-43.123,43.182-43.123c0.521,0,1.05,0.01,1.581,0.029c1.123,4.047,4.392,7.128,8.429,8.066c-2.972,3.25-4.645,7.508-4.645,11.948c0,9.773,7.961,17.724,17.747,17.724c1.835,0,3.633-0.278,5.364-0.828c0.055,7.892,5.979,14.447,13.716,15.396C288.299,278.924,270.721,293.123,250.399,293.123z"/><path d="M216.783,244.865c-2.834,0-5.141,2.304-5.141,5.135c0,2.832,2.306,5.135,5.141,5.135c2.834,0,5.141-2.303,5.141-5.135C221.924,247.168,219.618,244.865,216.783,244.865z M216.783,253.258c-1.799,0-3.263-1.462-3.263-3.258c0-1.796,1.464-3.258,3.263-3.258s3.263,1.461,3.263,3.258C220.046,251.796,218.583,253.258,216.783,253.258z"/><path d="M244.096,261.65c-5.152,0-9.343,4.186-9.343,9.331s4.191,9.331,9.343,9.331c5.151,0,9.342-4.186,9.342-9.331S249.248,261.65,244.096,261.65z M244.096,278.436c-4.117,0-7.465-3.344-7.465-7.454s3.349-7.454,7.465-7.454c4.116,0,7.465,3.344,7.465,7.454S248.212,278.436,244.096,278.436z"/><path d="M239.894,246.742c2.834,0,5.141-2.304,5.141-5.135c0-2.832-2.306-5.135-5.141-5.135c-2.834,0-5.141,2.304-5.141,5.135C234.753,244.438,237.06,246.742,239.894,246.742z M239.894,238.35c1.799,0,3.263,1.461,3.263,3.257s-1.464,3.258-3.263,3.258s-3.263-1.461-3.263-3.258S238.095,238.35,239.894,238.35z"/><path d="M272.46,263.748c-3.414,0-6.191,2.775-6.191,6.185c0,3.41,2.777,6.185,6.191,6.185s6.191-2.774,6.191-6.185C278.651,266.523,275.874,263.748,272.46,263.748z M272.46,274.239c-2.379,0-4.313-1.933-4.313-4.307s1.935-4.307,4.313-4.307c2.378,0,4.313,1.933,4.313,4.307S274.838,274.239,272.46,274.239z"/></svg>{calorieLevel(recipe.calories)}
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
