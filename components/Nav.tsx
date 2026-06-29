"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const onActive = pathname === "/";

  return (
    <div className="w-full flex justify-end px-8 pt-6 pb-2 bg-transparent md:px-16 lg:px-24">
      <div className="flex items-baseline gap-6">
        <Link
          href="/"
          className={`font-syne text-base transition-colors duration-200 ${
            onActive ? "text-recipe-navy" : "text-recipe-navy/30 hover:text-recipe-navy/60"
          }`}
        >
          Recipes
        </Link>
        <Link
          href="/off-the-stove"
          className={`font-syne text-base transition-colors duration-200 ${
            !onActive ? "text-recipe-navy" : "text-recipe-navy/30 hover:text-recipe-navy/60"
          }`}
        >
          Off the Stove
        </Link>
      </div>
    </div>
  );
}
