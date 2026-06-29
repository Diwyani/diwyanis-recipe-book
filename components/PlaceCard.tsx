import type React from "react";
import type { Place } from "@/lib/places";

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg"];

export function PlaceCard({ place, index }: { place: Place; index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const usesStar = index % 2 === 0;

  return (
    <a
      href={place.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-fit"
      aria-label={`View ${place.name} on map`}
      style={
        {
          "--card-rotate": rotation,
        } as React.CSSProperties
      }
    >
      <div
        className="place-card relative bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
      >
        {/* Decoration — star or circle, overlapping top edge */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 select-none">
          {usesStar ? (
            <span className="text-lg leading-none" style={{ color: "#E03A2F" }}>★</span>
          ) : (
            <span className="block w-3 h-3 rounded-full bg-recipe-navy" />
          )}
        </div>

        {/* Photo */}
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
          />
        </div>

        {/* Name */}
        <p className="mt-2 font-syne text-sm uppercase text-recipe-navy text-center leading-snug">
          {place.name}
        </p>
      </div>
    </a>
  );
}
