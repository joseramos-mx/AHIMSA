import Link from "next/link";
import Reveal from "./Reveal";

export default function Intro() {
  return (
    <section
      id="nosotros"
      className="bg-cream text-ink py-20 md:py-32"
      aria-labelledby="intro-title"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 flex flex-col items-center text-center">
        <Reveal
          as="h2"
          delay={0}
          className="font-playfair font-normal text-[44px] md:text-[72px] leading-[1.05] max-w-[18ch]"
        >
          <span id="intro-title">Viajar bien no es suerte</span>
        </Reveal>

        <Reveal
          as="p"
          delay={0.1}
          className="font-figtree text-[17px] leading-[1.6] max-w-[720px] mt-6 md:mt-8 text-ink/85"
        >
          Detrás de cada viaje que diseño hay horas de planeación, proveedores
          de confianza y el conocimiento de quien ya recorrió esas calles. Me
          encargo de vuelos, hoteles, traslados y experiencias para que tú solo
          te preocupes por disfrutar. Y mientras estás allá, sigo contigo: si
          algo cambia, lo resolvemos juntos.
        </Reveal>

        <Reveal delay={0.2} className="mt-8 md:mt-10">
          <Link
            href="#como-trabajamos"
            className="
              inline-flex items-center font-figtree font-medium
              text-sm md:text-base
              bg-ink text-white px-6 py-3 rounded-[2px]
              transition-colors duration-200
              hover:bg-accent
            "
          >
            Conoce mi historia
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
