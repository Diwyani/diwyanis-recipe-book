import Link from "next/link";
import Image from "next/image";

// Drop your illustration into /public/404.png
export default function NotFound() {
  return (
    <main className="min-h-screen bg-recipe-yellow flex flex-col items-center justify-center gap-8 px-8 text-recipe-navy">
      <Image
        src="/404.png"
        alt="Page not found"
        width={320}
        height={320}
        className="w-64 h-64 object-contain sm:w-80 sm:h-80"
        priority
      />
      <div className="text-center space-y-4 max-w-xs">
        <h1 className="font-barrio text-5xl uppercase leading-none sm:text-6xl">
          Page not found
        </h1>
        <p className="text-base leading-7 text-recipe-navy/70">
          Looks like this recipe got lost in the kitchen.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full border-2 border-recipe-navy px-6 py-2 font-syne text-sm uppercase tracking-wide transition-colors hover:bg-recipe-navy hover:text-recipe-yellow"
        >
          Back to recipes
        </Link>
      </div>
    </main>
  );
}
