import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Reveal from "@/components/Reveal";
import RevealImage from "@/components/RevealImage";
import SplitHeading from "@/components/SplitHeading";
import { WHATSAPP_AGENT_URL } from "@/lib/contact";
import { FOUNDER_NAME } from "@/lib/how-we-work";
import { JOIN_HERO } from "@/lib/join";

export default function JoinHero() {
  return (
    <section className="bg-cream px-6 pb-20 pt-32 text-ink md:px-10 lg:pb-32 lg:pt-40">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          {/* Firma de marca — identidad completa (dorado + petróleo) */}
          <Reveal distance={0} className="mb-8">
            <Image
              src="/logo-completo-color.svg"
              alt="Ahimsa Travel — Fátima Nieto"
              width={400}
              height={80}
              priority
              className="h-10 w-auto select-none md:h-12"
            />
          </Reveal>
          <Reveal
            as="p"
            distance={0}
            className="font-figtree text-[13px] font-medium uppercase tracking-[0.2em] text-accent-dark"
          >
            {JOIN_HERO.eyebrow}
          </Reveal>
          <SplitHeading
            as="h1"
            delay={0.1}
            text={JOIN_HERO.title}
            className="mt-5 font-fraunces text-[40px] font-light leading-[1.05] lg:text-[64px]"
          />
          <Reveal
            as="p"
            delay={0.35}
            distance={16}
            className="mt-6 max-w-[520px] font-figtree text-[18px] leading-[1.6] text-ink/85"
          >
            {JOIN_HERO.text}
          </Reveal>
          <Reveal
            delay={0.5}
            distance={16}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <AnimatedButton
              href={WHATSAPP_AGENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbeme por WhatsApp (se abre en una pestaña nueva)"
              variant="dark"
            >
              Escríbeme por WhatsApp
            </AnimatedButton>
            <a
              href="#costos"
              className="inline-flex h-12 items-center justify-center rounded-[2px] border border-ink/30 px-7 font-figtree text-[15px] font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
            >
              Ver costos
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <RevealImage
            src={JOIN_HERO.image}
            alt={`${FOUNDER_NAME}, fundadora de Ahimsa Travel, en el Gran Cañón`}
            className="aspect-[4/5] w-full rounded-[2px]"
            sizes="(min-width: 1024px) 42vw, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
