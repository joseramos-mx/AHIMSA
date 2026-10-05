import Reveal from "@/components/Reveal";
import { FOR_WHO } from "@/lib/join";

export default function ForWho() {
  return (
    <section className="bg-cream px-6 py-20 text-center text-ink md:px-10 lg:py-28">
      <div className="mx-auto max-w-[720px]">
        <Reveal
          as="h2"
          className="font-fraunces text-[34px] font-light leading-[1.1] lg:text-[48px]"
        >
          {FOR_WHO.title}
        </Reveal>
        <Reveal
          as="p"
          delay={0.15}
          distance={16}
          className="mt-6 font-figtree text-[18px] leading-[1.7] text-ink/85"
        >
          {FOR_WHO.text}
        </Reveal>
      </div>
    </section>
  );
}
