"use client";

type SliderControlsProps = {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={dir === "left" ? "rotate-180" : undefined}
    >
      <path d="M3 10h14" />
      <path d="M12 5l5 5-5 5" />
    </svg>
  );
}

const BUTTON = `
  flex h-12 w-12 items-center justify-center rounded-[2px]
  border border-ink/25 text-ink
  transition-colors duration-200
  hover:bg-ink hover:text-white
  disabled:pointer-events-none disabled:opacity-30
`;

/** Contador, barra de progreso y flechas. Sin loop: en los extremos la
 *  flecha correspondiente se deshabilita. */
export default function SliderControls({
  index,
  total,
  onPrev,
  onNext,
}: SliderControlsProps) {
  return (
    <div className="flex items-end gap-6">
      <div className="w-24">
        <p className="font-figtree text-[13px] tabular-nums">
          <span className="text-ink">{pad(index + 1)}</span>
          <span className="text-ink/40"> / {pad(total)}</span>
        </p>
        <div aria-hidden="true" className="mt-2 h-[2px] w-full bg-ink/15">
          <div
            className="h-full bg-ink transition-[width] duration-500 ease-out"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Testimonio anterior"
          className={BUTTON}
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          aria-label="Testimonio siguiente"
          className={BUTTON}
        >
          <Arrow dir="right" />
        </button>
      </div>
    </div>
  );
}
