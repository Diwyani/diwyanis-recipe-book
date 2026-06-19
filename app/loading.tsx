/*
  Drop your 5 PNGs into /public/ named:
    loading-1.png, loading-2.png, loading-3.png, loading-4.png, loading-5.png

  They cycle one at a time, each visible for ~0.6s, looping forever.
*/

const FRAMES = [
  "/loading1.png",
  "/loading2.png",
  "/loading3.png",
];

const TOTAL = FRAMES.length;
// Each frame is visible for 1 step out of TOTAL, then hidden for the rest
// Full cycle = TOTAL * stepDuration. We use 3s total → 0.6s per frame.
const CYCLE = 3; // seconds

export default function Loading() {
  return (
    <main className="min-h-screen bg-recipe-yellow flex flex-col items-center justify-center gap-5">
      <style>{`
        @keyframes loading-frame {
          0%        { opacity: 1; }
          ${(1 / TOTAL) * 100}% { opacity: 1; }
          ${(1 / TOTAL) * 100 + 1}% { opacity: 0; }
          99%       { opacity: 0; }
          100%      { opacity: 1; }
        }
      `}</style>

      <div className="relative w-48 h-48 sm:w-64 sm:h-64">
        {FRAMES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: i === 0 ? 1 : 0,
              animationName: "loading-frame",
              animationDuration: `${CYCLE}s`,
              animationTimingFunction: "steps(1)",
              animationIterationCount: "infinite",
              animationDelay: `${(i / TOTAL) * CYCLE}s`,
            }}
          />
        ))}
      </div>

      <p className="font-syne text-sm titlecase center tracking-widest text-recipe-navy -mt-10">
        Diwyani&apos;s Recipe Book
      </p>
    </main>
  );
}
