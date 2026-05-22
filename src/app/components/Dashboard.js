const COMMIT_DATA = [
  2, 1, 0, 3, 5, 1, 2, 4, 7, 3, 2, 1, 0, 0, 2, 5, 8, 4, 3, 2, 1, 0, 3, 5, 7, 9,
  6, 4, 2, 5,
];

function TileLabel({ children }) {
  return (
    <span className="text-micro uppercase tracking-widest text-stone-500 dark:text-stone-500 font-mono">
      {children}
    </span>
  );
}

function Sparkline() {
  const width = 120;
  const height = 28;
  const padY = 2;
  const max = Math.max(...COMMIT_DATA);
  const n = COMMIT_DATA.length;
  const stepX = width / (n - 1);
  const points = COMMIT_DATA.map((v, i) => {
    const x = i * stepX;
    const y = padY + (1 - v / max) * (height - padY * 2);
    return [x, y];
  });
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const [lastX, lastY] = points[points.length - 1];
  return (
    <div className="flex flex-col gap-1.5">
      <TileLabel>{"// commits · 30d"}</TileLabel>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block overflow-visible"
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-stone-600 dark:stroke-stone-400"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r={2}
          className="text-amber-500"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function Counter() {
  return (
    <div className="flex flex-col gap-1.5">
      <TileLabel>{"// projects"}</TileLabel>
      <div className="flex items-baseline gap-2 font-mono">
        <span className="flex items-baseline">
          <span className="text-2xl font-extralight tabular-nums text-stone-700 dark:text-stone-300">
            3
          </span>
          <span className="text-micro uppercase tracking-widest ml-1 text-stone-500">
            active
          </span>
        </span>
        <span className="text-stone-400">·</span>
        <span className="flex items-baseline">
          <span className="text-2xl font-extralight tabular-nums text-stone-700 dark:text-stone-300">
            6+
          </span>
          <span className="text-micro uppercase tracking-widest ml-1 text-stone-500">
            shipped
          </span>
        </span>
      </div>
    </div>
  );
}

function NowBuilding() {
  return (
    <div className="flex flex-col gap-1.5">
      <TileLabel>{"// now"}</TileLabel>
      <div className="flex items-center gap-2 font-mono text-sm text-stone-700 dark:text-stone-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400" />
        </span>
        building trace
      </div>
    </div>
  );
}

function Histogram() {
  const bars = [
    { year: "'22", count: 1 },
    { year: "'23", count: 2 },
    { year: "'24", count: 3 },
    { year: "'25", count: 2 },
  ];
  const max = Math.max(...bars.map((b) => b.count));
  const maxHeight = 24;
  return (
    <div className="flex flex-col gap-1.5">
      <TileLabel>{"// hackathons / yr"}</TileLabel>
      <div className="w-[88px] flex flex-col gap-1">
        <div className="flex items-end gap-1 h-6">
          {bars.map((b) => {
            const h = Math.max(2, Math.round((b.count / max) * maxHeight));
            const isTallest = b.count === max;
            return (
              <span
                key={b.year}
                className={`w-3 rounded-[1px] ${
                  isTallest
                    ? "bg-amber-500/70 dark:bg-amber-400/70"
                    : "bg-stone-400/40 dark:bg-stone-600/40"
                }`}
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>
        <div className="flex gap-1">
          {bars.map((b) => (
            <span
              key={b.year}
              className="w-3 text-micro font-mono text-stone-500 dark:text-stone-500 text-center"
            >
              {b.year}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 mb-8 divide-x divide-stone-200 dark:divide-stone-800">
      <div className="px-4 first:pl-0 py-3 flex flex-col gap-1.5">
        <Sparkline />
      </div>
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <Counter />
      </div>
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <NowBuilding />
      </div>
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <Histogram />
      </div>
    </section>
  );
}
