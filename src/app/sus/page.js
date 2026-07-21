import SusGame from "../components/sus/SusGame";

export const metadata = {
  title: "sus · mohammed elshrief",
  description:
    "an empty ship, one crewmate, zero tasks. walk around. press the button. perfectly normal.",
};

export default function Sus() {
  return (
    <>
      <div className="font-mono text-xs text-stone-500 dark:text-stone-500">
        mohammed@portfolio:
        <span className="text-amber-700 dark:text-amber-400">~/sus</span>$
        ./the-m0 --crew 1
        <span className="text-stone-400 dark:text-stone-600">
          {" "}
          · no network required
        </span>
      </div>
      {/* full-bleed breakout — the ship deserves more than 540px */}
      <div className="relative md:left-1/2 md:-translate-x-1/2 md:w-[min(92vw,960px)]">
        <SusGame />
      </div>
      <p className="font-mono text-micro text-stone-400 dark:text-stone-600">
        {"// wasd or arrows to move · e to interact · you are alone up here (probably)"}
      </p>
    </>
  );
}
