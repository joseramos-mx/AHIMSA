import type { ReactNode } from "react";
import Header from "@/components/Header";
import { LEGAL } from "@/lib/legal";

export type LegalSection = {
  /** Ancla para el índice (#id). */
  id: string;
  title: string;
  /** Párrafos o listas; strings se renderizan como <p>. */
  body: ReactNode[];
};

/**
 * Plantilla de las páginas legales: título, introducción, índice con
 * anclas (útil con teclado y lectores de pantalla) y secciones.
 */
export default function LegalPage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro?: ReactNode;
  sections: LegalSection[];
  /** Contenido extra al final (p. ej. el formulario de derechos ARCO). */
  children?: ReactNode;
}) {
  return (
    <>
      <Header />
      <main
        id="contenido"
        tabIndex={-1}
        className="bg-cream px-6 pb-24 pt-32 text-ink focus:outline-none md:px-10 lg:pb-32 lg:pt-40"
      >
        <article className="mx-auto max-w-[720px] font-figtree text-[17px] leading-[1.7]">
          <h1 className="font-fraunces text-[40px] font-light leading-[1.1] lg:text-[56px]">
            {title}
          </h1>
          <p className="mt-4 text-[15px] text-ink/70">
            Última actualización: {LEGAL.updatedAt}
          </p>
          {intro && <div className="mt-8 text-ink/85">{intro}</div>}

          <nav aria-labelledby="indice-titulo" className="mt-10 rounded-[2px] border border-ink/15 p-6">
            <h2 id="indice-titulo" className="font-figtree text-[13px] font-medium uppercase tracking-[0.2em] text-ink/70">
              Contenido
            </h2>
            <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 marker:text-ink/60">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`} className="mt-12 scroll-mt-24">
              <h2
                id={`${section.id}-titulo`}
                className="font-fraunces text-[26px] font-light leading-tight lg:text-[30px]"
              >
                {section.title}
              </h2>
              {section.body.map((block, i) =>
                typeof block === "string" ? (
                  <p key={i} className="mt-4 text-ink/85">
                    {block}
                  </p>
                ) : (
                  <div key={i} className="mt-4 text-ink/85">
                    {block}
                  </div>
                )
              )}
            </section>
          ))}

          {children}
        </article>
      </main>
    </>
  );
}

/** Lista con viñetas para los textos legales. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-ink/50">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
