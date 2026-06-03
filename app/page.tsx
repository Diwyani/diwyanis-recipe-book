import { PolaroidStack } from "@/components/PolaroidStack";
import { RecipeGrid } from "@/components/RecipeGrid";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-recipe-yellow px-8 py-12 text-recipe-navy md:px-16 md:py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16 lg:gap-24">
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-medium tracking-wide">Diwyani&apos;s</p>
            <h1 className="font-barrio text-5xl uppercase leading-[0.9] sm:text-6xl md:text-7xl lg:text-8xl">
              Recipe Book
            </h1>
            <p className="max-w-md text-base leading-8 md:text-lg md:leading-9">
              What I&apos;ve found from all the cooking food is beyond calories
              and protein. Food is an exploration, a way back to memories, warm
              meals, and little moments made for ourselves and the people we
              love.
            </p>
          </div>

          <div className="flex justify-center overflow-visible md:justify-end md:pt-2">
            <PolaroidStack />
          </div>
        </header>

        <RecipeGrid />
      </div>
    </main>
  );
}
