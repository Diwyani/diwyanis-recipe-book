"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const polaroidFrame = "bg-white px-2 pt-1 pb-[3.25rem]";
const slotGap = "gap-[0.35rem]";

type PantryItem = {
  id: string;
  item_name: string;
  type: "restock" | "leftover";
  quantity: string | null;
};

function PolaroidPhotos({ hovered }: { hovered: boolean }) {
  return (
    <div
      className={`w-[11rem] rotate-[7deg] transition-shadow duration-[420ms] ease-out sm:w-[11.5rem] ${polaroidFrame} ${
        hovered
          ? "shadow-[0_16px_36px_rgba(40,26,124,0.34)]"
          : "shadow-[0_12px_28px_rgba(40,26,124,0.28)]"
      }`}
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-5xl select-none" style={{ color: "#E03A2F" }}>
        ★
      </div>

      <div className={`flex flex-col ${slotGap}`}>
        <div
          className={`aspect-[4/5] w-full overflow-hidden transition-[filter] duration-300 ease-out ${
            hovered ? "grayscale-0" : "grayscale"
          }`}
        >
          <Image
            src="/polaroid-photo-1.webp"
            alt="memories"
            width={184}
            height={230}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div
          className={`aspect-[4/5] w-full overflow-hidden transition-[filter] duration-300 ease-out ${
            hovered ? "grayscale-0" : "grayscale"
          }`}
        >
          <Image
            src="/polaroid-photo-2.webp"
            alt="Joy of hosting"
            width={184}
            height={230}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function PolaroidPantry({
  hovered,
  restockItems,
  leftoverItems,
}: {
  hovered: boolean;
  restockItems: PantryItem[];
  leftoverItems: PantryItem[];
}) {
  return (
    <div
      className={`-rotate-[8deg] transition-shadow duration-[420ms] ease-out w-[11rem] sm:w-[11.5rem] ${polaroidFrame} ${
        hovered
          ? "shadow-[0_10px_24px_rgba(40,26,124,0.24)]"
          : "shadow-[0_6px_18px_rgba(40,26,124,0.18)]"
      }`}
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 select-none w-6 h-6 rounded-full" style={{ backgroundColor: "#E03A2F" }} />

      <div className={`flex flex-col ${slotGap}`}>
        <section className="flex aspect-[4/5] w-full flex-col bg-recipe-navy px-3 py-2.5 text-white">
          <h2 className="font-syne text-lg uppercase leading-none">Restock!</h2>
          <ul className="mt-2 space-y-0.5 text-[0.7rem] leading-snug">
            {restockItems.map((item) => (
              <li key={item.id} className="flex items-baseline gap-1.5">
                <span>{item.item_name}</span>
                {item.quantity ? (
                  <span className="text-[0.6rem] text-white/75">{item.quantity}</span>
                ) : null}
              </li>
            ))}
            {restockItems.length === 0 && (
              <li className="text-white/40">—</li>
            )}
          </ul>
        </section>

        <section className="flex aspect-[4/5] w-full flex-col bg-recipe-navy px-3 py-2.5 text-white">
          <h2 className="font-syne text-lg uppercase leading-none">Left overs</h2>
          <ul className="mt-2 space-y-0.5 text-[0.7rem] leading-snug">
            {leftoverItems.map((item) => (
              <li key={item.id} className="flex items-baseline gap-1.5">
                <span>{item.item_name}</span>
                {item.quantity ? (
                  <sup className="text-[0.6rem] text-white/75">{item.quantity}</sup>
                ) : null}
              </li>
            ))}
            {leftoverItems.length === 0 && (
              <li className="text-white/40">—</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function PolaroidStack() {
  const [hovered, setHovered] = useState(false);
  const [pantryRaised, setPantryRaised] = useState(false);
  const [pantryOnTop, setPantryOnTop] = useState(false);
  const [restockItems, setRestockItems] = useState<PantryItem[]>([]);
  const [leftoverItems, setLeftoverItems] = useState<PantryItem[]>([]);

  const raiseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchPantry() {
      const { data, error } = await supabase.from("pantry").select("*");
      if (error) {
        console.error("Pantry fetch error:", error.message);
        return;
      }
      setRestockItems(data.filter((i) => i.type === "restock"));
      setLeftoverItems(data.filter((i) => i.type === "leftover"));
    }
    fetchPantry();
  }, []);

  const handleEnter = () => {
    setHovered(true);
    raiseTimer.current = setTimeout(() => {
      setPantryRaised(true);
      zTimer.current = setTimeout(() => setPantryOnTop(true), 80);
    }, 620);
  };

  const handleLeave = () => {
    setHovered(false);
    setPantryRaised(false);
    setPantryOnTop(false);
    if (raiseTimer.current) clearTimeout(raiseTimer.current);
    if (zTimer.current) clearTimeout(zTimer.current);
    raiseTimer.current = null;
    zTimer.current = null;
  };

  useEffect(() => {
    return () => {
      if (raiseTimer.current) clearTimeout(raiseTimer.current);
      if (zTimer.current) clearTimeout(zTimer.current);
    };
  }, []);

  return (
    <div
      className="relative h-[26rem] w-[14rem] shrink-0 overflow-visible sm:h-[27rem] sm:w-[15.5rem] hidden md:block -ml-28"
      role="group"
      aria-label="Polaroid photos and pantry list"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Joy of Hosting label + arrow */}
      <div className="absolute bottom-[8.5rem] left-[-12rem] z-40 flex flex-col items-center gap-1">
        <p className="font-syne text-sm uppercase text-recipe-navy -rotate-[6deg] whitespace-nowrap">
          Joy of Hosting
        </p>
        <svg width="56" height="48" viewBox="0 0 56 48" fill="none" className="rotate-[10deg]">
          <path d="M8 8 C12 26, 32 36, 48 38" stroke="#281A7C" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M43 34 L48 38 L44 43" stroke="#281A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Still Warm label + arrow */}
      <div className="absolute top-[21rem] right-[-2rem] z-40 flex flex-col items-center gap-1">
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none" className="-rotate-[5deg]">
          <path d="M38 6 C30 16, 16 24, 4 30" stroke="#281A7C" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M8 24 L4 30 L10 31" stroke="#281A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <p className="font-syne text-sm uppercase text-recipe-navy rotate-[4deg] whitespace-nowrap">
          Still Warm
        </p>
      </div>

      <div
        className={`absolute right-[6.5rem] top-[-1rem] duration-[420ms] will-change-transform transition-transform [transition-timing-function:cubic-bezier(0.25,0.1,0.25,1)] ${
          pantryOnTop ? "z-30" : "z-10"
        } ${pantryRaised ? "-translate-y-6" : "translate-y-6"} ${
          !hovered ? "pantry-hint" : ""
        }`}
      >
        <PolaroidPantry
          hovered={hovered}
          restockItems={restockItems}
          leftoverItems={leftoverItems}
        />
      </div>

      <div className="absolute left-0 top-0 z-20">
        <PolaroidPhotos hovered={hovered} />
      </div>
    </div>
  );
}
