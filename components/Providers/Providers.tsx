"use client";

import Image from "next/image";
import { PROVIDERS } from "@/lib/providers";
import Reveal from "@/components/Reveal";

export default function Providers() {
  return (
    <section
      id="proveedores"
      className="bg-white py-20 md:py-28"
      aria-labelledby="providers-title"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 text-center mb-12 md:mb-16">
        <Reveal
          as="p"
          distance={0}
          className="font-figtree text-[12px] md:text-[13px] font-medium uppercase tracking-[0.2em] text-accent-dark mb-3"
        >
          Respaldo global
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className="font-fraunces font-light text-[32px] md:text-[44px] leading-[1.1] max-w-[22ch] mx-auto text-ink"
        >
          <span id="providers-title">
            Operamos con los mejores proveedores del mundo
          </span>
        </Reveal>
      </div>

      {/* Grid estático: todos los logos visibles a la vez. Cada celda es
          una caja de alto fijo con object-contain para que logos de
          proporciones distintas convivan sin romper la retícula. */}
      <ul
        className="mx-auto max-w-[1200px] px-6 md:px-10
          grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
          gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12
          justify-items-center items-center"
      >
        {PROVIDERS.map((p) => (
          <li
            key={p.src}
            className="relative h-12 md:h-14 w-full max-w-[160px]"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 20vw, 28vw"
              loading="lazy"
              className="object-contain select-none"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
