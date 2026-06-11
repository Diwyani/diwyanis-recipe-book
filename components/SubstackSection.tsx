import Image from "next/image";
import type { SubstackPost } from "@/lib/substack";

const SOCIAL_LINKS = [
  { label: "Substack", href: "https://diwyanivajpayee.substack.com" },
  { label: "Instagram", href: "#" },
  { label: "Email", href: "#" },
];

export function SubstackSection({ posts }: { posts: SubstackPost[] }) {
  return (
    <section className="mt-24 md:mt-32 border-t border-recipe-navy/10 pt-12 grid gap-12 md:grid-cols-[14rem_1fr] md:gap-16">
      {/* Left: small photo + links */}
      <div className="flex flex-row items-center gap-4 md:flex-col md:items-start">
        <div className="h-16 w-16 shrink-0 rounded-full bg-recipe-navy/10 overflow-hidden">
          <Image
            src="/polaroid-photo-1.webp"
            alt="Diwyani"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-recipe-navy/70 underline-offset-4 hover:text-recipe-navy hover:underline transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Right: Substack write-ups + footer */}
      <div>
        <h2 className="font-barrio text-3xl uppercase leading-none text-recipe-navy sm:text-4xl">
          On Substack
        </h2>

        {posts.length > 0 && (
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={240}
                    className="h-40 w-full rounded-[1.5rem] object-cover shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                  />
                )}
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-syne text-base font-medium uppercase leading-snug text-recipe-navy">
                      {post.title}
                    </p>
                    {post.subtitle && (
                      <p className="mt-1 text-sm text-recipe-navy/60">
                        {post.subtitle}
                      </p>
                    )}
                  </div>
                  <img
                    src="/Arrow.svg"
                    alt="read on Substack"
                    className="mt-1 w-7 h-7 shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110"
                  />
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 max-w-md text-sm leading-7 text-recipe-navy/70">
          <p>
            I&apos;m Diwyani — I write about food, books, and the small things
            that make up a life. You can find the rest of my work on{" "}
            <a
              href="https://diwyanivajpayee.substack.com"
              target="_blank"
              rel="noreferrer"
              className="text-recipe-navy underline underline-offset-4 hover:no-underline"
            >
              Substack
            </a>{" "}
            and follow along on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="text-recipe-navy underline underline-offset-4 hover:no-underline"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
