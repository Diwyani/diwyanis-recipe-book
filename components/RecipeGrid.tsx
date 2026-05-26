type Recipe = {
  id: string;
  title: string;
  shapeClass: string;
  wrapperClass: string;
  titleClass: string;
};

const recipes: Recipe[] = [
  {
    id: "rice-salad",
    title: "Rice, Salad & Begun Bhaja",
    shapeClass:
      "h-56 w-44 rounded-[2.5rem_1.25rem_2rem_1.5rem] rotate-[-2deg]",
    wrapperClass: "",
    titleClass: "mt-4 max-w-[12rem] text-left",
  },
  {
    id: "chia-jam",
    title: "Chia Plum Jam",
    shapeClass: "h-48 w-48 rounded-full rotate-[3deg]",
    wrapperClass: "",
    titleClass:
      "absolute left-full top-1/2 ml-4 w-28 -translate-y-1/2 text-left",
  },
  {
    id: "apple-chutney",
    title: "Appe & Green Chutney",
    shapeClass:
      "h-60 w-40 rounded-[55%_45%_48%_52%_/_42%_58%_50%_50%] rotate-[-1deg]",
    wrapperClass: "",
    titleClass:
      "absolute right-full top-1/2 mr-4 w-28 -translate-y-1/2 text-right",
  },
];

function RecipePlaceholder({
  title,
  shapeClass,
}: {
  title: string;
  shapeClass: string;
}) {
  return (
    <div
      className={`bg-neutral-300 transition duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-1 ${shapeClass}`}
      role="img"
      aria-label={title}
    />
  );
}

export function RecipeGrid() {
  return (
    <section className="mt-16 md:mt-20" aria-label="Recipes">
      <div className="flex flex-col gap-12 sm:gap-14 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-x-6 md:gap-y-10 lg:gap-x-10">
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className={`relative w-fit shrink-0 ${recipe.wrapperClass}`}
          >
            <button
              type="button"
              className="group relative block cursor-pointer text-recipe-navy"
              aria-label={`Open ${recipe.title}`}
            >
              <RecipePlaceholder title={recipe.title} shapeClass={recipe.shapeClass} />
              <p
                className={`font-barrio text-lg uppercase leading-snug ${recipe.titleClass}`}
              >
                {recipe.title}
              </p>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
