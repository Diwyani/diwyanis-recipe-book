import { places } from "@/lib/places";
import { PlaceCard } from "@/components/PlaceCard";

export default function OffTheStove() {
  return (
    <main className="min-h-screen bg-recipe-yellow px-8 py-12 text-recipe-navy md:px-16 md:py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-xl space-y-4">
          <h1 className="font-barrio text-5xl uppercase leading-[0.9] sm:text-6xl md:text-7xl">
            Off the Stove
          </h1>
        </header>

        <section className="mt-16 md:mt-20">
          {places.length === 0 ? (
            <p className="font-syne text-2xl uppercase text-recipe-navy/30">
              Nothing here yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 items-start">
              {places.map((place, i) => (
                <PlaceCard key={place.name} place={place} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
