"use client";

import { useRef, useState } from "react";
import { SERVICES } from "@/lib/services";
import Reveal from "@/components/Reveal";
import ServiceRow from "./ServiceRow";
import CursorImage from "./CursorImage";

export default function ServiceList() {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <Reveal
        as="h2"
        className="font-playfair text-[26px] font-normal leading-tight text-ink lg:text-[32px]"
      >
        También te ayudo con
      </Reveal>

      <ul
        ref={listRef}
        onPointerLeave={() => setActive(null)}
        className="mt-8 lg:mt-auto"
      >
        {SERVICES.map((service, i) => (
          <Reveal
            as="li"
            key={service.slug}
            delay={0.1 + i * 0.1}
            distance={16}
          >
            <div onPointerEnter={() => setActive(service.slug)}>
              <ServiceRow service={service} last={i === SERVICES.length - 1} />
            </div>
          </Reveal>
        ))}
      </ul>

      <CursorImage
        items={SERVICES.map(({ slug, image }) => ({ slug, image }))}
        active={active}
        listRef={listRef}
      />
    </div>
  );
}
