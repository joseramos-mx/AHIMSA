"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NAV_LINKS, navHref } from "@/lib/nav";
import { WHATSAPP_URL } from "@/lib/contact";
import { SKIPER_UI_CREDIT } from "@/lib/credits";
import {
  CONTACT_EMAIL,
  CONTACT_HOURS,
  FOOTER_CLOSING,
  INSTAGRAM,
  getVisibleCredentials,
} from "@/lib/footer";
import SplitHeading from "@/components/SplitHeading";
import AnimatedButton from "@/components/ui/AnimatedButton";
import FooterLink from "./FooterLink";
import FooterWordmark from "./FooterWordmark";
import BackToTop from "./BackToTop";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-figtree text-[12px] font-medium uppercase tracking-[0.2em] text-cream/55">
        {title}
      </h2>
      <ul className="mt-5 flex flex-col items-start gap-2.5">{children}</ul>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const credentials = getVisibleCredentials();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink pt-16 text-cream lg:pt-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* 1. Cierre */}
        <div className="flex flex-col items-start gap-8 border-b border-cream/15 pb-12 lg:flex-row lg:items-end lg:justify-between lg:pb-12">
          <SplitHeading
            text={FOOTER_CLOSING.title}
            className="max-w-[640px] font-fraunces text-[30px] font-light leading-[1.1] text-cream lg:text-[44px]"
          />
          <AnimatedButton href={FOOTER_CLOSING.cta.href} variant="light">
            {FOOTER_CLOSING.cta.label}
          </AnimatedButton>
        </div>

        {/* 2. Columnas */}
        <nav
          aria-label="Pie de página"
          className="grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-3">
            <Column title="Explora">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={navHref(link.href, pathname)}>
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </Column>
          </div>

          <div className="lg:col-span-4">
            <Column title="Contacto">
              <li>
                <FooterLink href={WHATSAPP_URL} external>
                  WhatsApp
                </FooterLink>
              </li>
              <li>
                <FooterLink href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </FooterLink>
              </li>
              <li>
                <FooterLink href={INSTAGRAM.href} external>
                  <span className="sr-only">Instagram </span>
                  {INSTAGRAM.handle}
                </FooterLink>
              </li>
              <li className="font-figtree text-[16px] text-cream/85">
                {CONTACT_HOURS}
              </li>
            </Column>
          </div>

          {credentials.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9">
              <Column title="Respaldo">
                {credentials.map((c) => (
                  <li
                    key={c.label}
                    className="font-figtree text-[16px] text-cream/85"
                  >
                    {c.label}
                    {!c.published && !IS_PRODUCTION && (
                      <span className="ml-2 rounded-[2px] bg-cream px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
                        Borrador
                      </span>
                    )}
                  </li>
                ))}
              </Column>
            </div>
          )}
        </nav>
      </div>

      {/* 3. Wordmark */}
      <FooterWordmark />

      {/* 4. Barra inferior */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-4 border-t border-cream/15 py-6 font-figtree text-[13px] text-cream/60 lg:flex-row lg:items-center lg:justify-between">
          <p suppressHydrationWarning>
            © {year} Ahimsa Travel. Todos los derechos reservados.
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <FooterLink
              href="/aviso-de-privacidad"
              className="text-[13px] text-cream/60"
            >
              Aviso de privacidad
            </FooterLink>
            <FooterLink
              href={SKIPER_UI_CREDIT.href}
              external
              className="text-[13px] text-cream/60"
            >
              {SKIPER_UI_CREDIT.label}
            </FooterLink>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
