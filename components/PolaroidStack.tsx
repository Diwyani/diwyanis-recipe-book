import { leftoverItems, restockItems } from "@/components/pantry-data";

const polaroidFrame = "bg-white px-2 pt-1 pb-[3.25rem]";
const slotGap = "gap-[0.35rem]";
const photoSlot = "aspect-[5/4] w-full bg-neutral-300";

function PolaroidPhotos() {
  return (
    <div
      className={`w-[11rem] sm:w-[11.5rem] ${polaroidFrame} rotate-[7deg]`}
    >
      <div className={`flex flex-col ${slotGap}`}>
        <div className={photoSlot} role="img" aria-label="Joy of hosting" />
        <div className={photoSlot} role="img" aria-label="Kitchen memories" />
      </div>
    </div>
  );
}

function PolaroidPantry() {
  return (
    <div
      className={`w-[11rem] sm:w-[11.5rem] ${polaroidFrame} -rotate-[6deg]`}
    >
      <div className={`flex flex-col ${slotGap}`}>
        <section className="flex aspect-[5/4] w-full flex-col bg-recipe-navy px-3 py-2.5 text-white">
          <h2 className="font-barrio text-lg uppercase leading-none">Restock!</h2>
          <ul className="mt-2 space-y-0.5 text-[0.7rem] leading-snug">
            {restockItems.map((item) => (
              <li key={item.name} className="flex items-baseline gap-1.5">
                <span>{item.name}</span>
                {"note" in item && item.note ? (
                  <span className="text-[0.6rem] text-white/75">{item.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex aspect-[5/4] w-full flex-col bg-recipe-navy px-3 py-2.5 text-white">
          <h2 className="font-barrio text-lg uppercase leading-none">
            Left overs
          </h2>
          <ul className="mt-2 space-y-0.5 text-[0.7rem] leading-snug">
            {leftoverItems.map((item) => (
              <li key={item.name} className="flex items-baseline gap-1.5">
                <span>{item.name}</span>
                {"note" in item && item.note ? (
                  <sup className="text-[0.6rem] text-white/75">{item.note}</sup>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function PolaroidStack() {
  return (
    <div className="relative h-[24rem] w-[14rem] shrink-0 sm:h-[25rem] sm:w-[15.5rem]">
      <div className="absolute left-[4rem] top-10 z-10 sm:left-[4.5rem] sm:top-12">
        <PolaroidPantry />
      </div>
      <div className="absolute left-0 top-0 z-20">
        <PolaroidPhotos />
      </div>
    </div>
  );
}
