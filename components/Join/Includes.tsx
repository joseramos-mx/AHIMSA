import Reveal from "@/components/Reveal";
import { INCLUDES, type IncludeIcon } from "@/lib/join";

/** Íconos de línea fina (lucide-react no está instalado). */
const ICON_PATHS: Record<IncludeIcon, React.ReactNode> = {
  anywhere: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M5 16h22M16 5c3.2 3.4 4.8 7 4.8 11s-1.6 7.6-4.8 11c-3.2-3.4-4.8-7-4.8-11S12.8 8.4 16 5Z" />
    </>
  ),
  providers: (
    <>
      <path d="M6 27V9l7-4v22M13 27h13V13l-6-3" />
      <path d="M9 13h1M9 17h1M9 21h1M17 16h1M21 16h1M17 20h1M21 20h1" />
    </>
  ),
  dollar: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M19.5 11.5c-.8-1-2-1.5-3.5-1.5-2 0-3.5 1-3.5 2.8 0 4 7 2.2 7 6.2 0 1.8-1.5 3-3.5 3-1.6 0-2.9-.6-3.7-1.7M16 8v2M16 22v2" />
    </>
  ),
  training: (
    <>
      <path d="M3 12 16 6l13 6-13 6-13-6Z" />
      <path d="M8 14.5V21c2.4 2 5 3 8 3s5.6-1 8-3v-6.5M29 12v7" />
    </>
  ),
  support: (
    <>
      <circle cx="11" cy="10" r="4" />
      <circle cx="22" cy="12" r="3" />
      <path d="M4 26c0-4 3.1-7 7-7s7 3 7 7M18 20.5c1-.9 2.4-1.5 4-1.5 3 0 5 2.4 5 5.5" />
    </>
  ),
};

// 5 items: 3 arriba + 2 centrados (grid de 6 columnas en desktop).
const DESKTOP_POSITION = ["", "", "", "lg:col-start-2", "lg:col-start-4"];

export default function Includes() {
  return (
    <section className="bg-cream px-6 py-20 text-ink md:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal
          as="h2"
          className="text-center font-fraunces text-[34px] font-light leading-[1.1] lg:text-[48px]"
        >
          Qué incluye
        </Reveal>
        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-6">
          {INCLUDES.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={0.1 + i * 0.08}
              distance={16}
              className={`flex flex-col items-start lg:col-span-2 ${DESKTOP_POSITION[i]}`}
            >
              <svg
                aria-hidden="true"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-dark"
              >
                {ICON_PATHS[item.icon]}
              </svg>
              <h3 className="mt-5 font-fraunces text-[22px] font-light leading-tight">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[340px] font-figtree text-[15px] leading-[1.6] text-ink/75">
                {item.text}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
