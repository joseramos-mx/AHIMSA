import AnimatedButton from "@/components/ui/AnimatedButton";
import Reveal from "@/components/Reveal";
import { WHATSAPP_AGENT_URL } from "@/lib/contact";
import { PRICING, getVisiblePlans } from "@/lib/join";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default function Pricing() {
  const plans = getVisiblePlans();

  return (
    <section
      id="costos"
      aria-labelledby="costos-title"
      className="scroll-mt-16 bg-ink px-6 py-20 text-cream md:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal
          as="h2"
          className="font-fraunces text-[34px] font-light leading-[1.1] lg:text-[48px]"
        >
          <span id="costos-title">{PRICING.title}</span>
        </Reveal>

        {plans.length > 0 ? (
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16">
            {plans.map((plan, i) => (
              <Reveal
                as="li"
                key={plan.name}
                delay={0.1 + i * 0.1}
                distance={24}
                className="relative flex flex-col rounded-[2px] border border-cream/20 p-8 lg:p-10"
              >
                {!plan.published && !IS_PRODUCTION && (
                  <span className="absolute right-4 top-4 rounded-[2px] bg-cream px-2 py-1 font-figtree text-[11px] font-medium uppercase tracking-[0.15em] text-ink">
                    Borrador
                  </span>
                )}
                <h3 className="font-fraunces text-[28px] font-light leading-tight">
                  {plan.name}
                </h3>
                {/* Precio y "al mes" siempre juntos (no se separan al hacer wrap). */}
                <p className="mt-6 whitespace-nowrap">
                  <span className="font-fraunces text-[40px] font-light leading-none lg:text-[48px]">
                    {plan.monthly}
                  </span>{" "}
                  <span className="font-figtree text-[16px] text-cream/80">
                    al mes
                  </span>
                </p>
                {plan.monthlyNote && (
                  <p className="mt-1 font-figtree text-[14px] text-cream/70">
                    {plan.monthlyNote}
                  </p>
                )}
                <dl className="mt-8 flex flex-col gap-3 border-t border-cream/15 pt-6 font-figtree text-[15px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-cream/70">Inscripción</dt>
                    <dd>{plan.enrollment}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-cream/70">Comisión</dt>
                    <dd className="text-right">{plan.commission}</dd>
                  </div>
                </dl>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal
            as="p"
            delay={0.1}
            distance={16}
            className="mt-10 font-fraunces text-[28px] font-light leading-tight lg:text-[36px]"
          >
            {PRICING.fallback}
          </Reveal>
        )}

        <Reveal delay={0.3} distance={16} className="mt-12">
          <AnimatedButton
            href={WHATSAPP_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbeme por WhatsApp (se abre en una pestaña nueva)"
            variant="light"
          >
            Escríbeme por WhatsApp
          </AnimatedButton>
        </Reveal>

        <p className="mt-10 max-w-[640px] font-figtree text-[13px] leading-[1.6] text-cream/70">
          {PRICING.finePrint}
        </p>
      </div>
    </section>
  );
}
