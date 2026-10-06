"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NAV_LINKS, navHref } from "@/lib/nav";
import { WHATSAPP_URL } from "@/lib/contact";
import { SKIPER_UI_CREDIT } from "@/lib/credits";
import {
  CONTACT_EMAIL,
  CONTACT_HOURS,
  FOOTER_CLOSING,
  FOOTER_TAGLINE,
  JOIN_LINK,
  SOCIAL_LINKS,
  isRealUrl,
} from "@/lib/footer";
import SplitHeading from "@/components/SplitHeading";
import AnimatedButton from "@/components/ui/AnimatedButton";
import FooterLink from "./FooterLink";
import FooterWordmark from "./FooterWordmark";
import BackToTop from "./BackToTop";

/** ¿Es placeholder entre corchetes? Si lo es, no se muestra. */
const isPlaceholder = (s: string) => /^\[.*\]$/.test(s.trim());

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-figtree text-[12px] font-medium uppercase tracking-[0.2em] text-cream/55">
        {title}
      </h2>
      <ul className="mt-5 flex flex-col items-start gap-2">{children}</ul>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const emailOk = !isPlaceholder(CONTACT_EMAIL);
  const hoursOk = !isPlaceholder(CONTACT_HOURS);

  return (
    <footer className="bg-ink pt-16 text-cream lg:pt-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* 1. Cierre */}
        <div className="flex flex-col items-start gap-8 border-b border-cream/15 pb-12 lg:flex-row lg:items-end lg:justify-between lg:pb-12">
          <SplitHeading
            text={FOOTER_CLOSING.title}
            className="max-w-[640px] font-fraunces text-[30px] font-light leading-[1.1] text-cream lg:text-[44px]"
          />
          {/* El tagline va bajo el botón: en desktop cabe junto al título
              sin sumar altura (el telón necesita que el footer quepa). */}
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <AnimatedButton href={FOOTER_CLOSING.cta.href} variant="light">
              {FOOTER_CLOSING.cta.label}
            </AnimatedButton>
            <p className="font-figtree text-[13px] uppercase tracking-[0.35em] text-cream/60">
              {FOOTER_TAGLINE}
            </p>
          </div>
        </div>

        {/* 2. Columnas (sin "Respaldo": ya existe la sección Certificaciones
            en la home, con más detalle y los certificados completos) */}
        <nav
          aria-label="Pie de página"
          className="grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:gap-16 lg:py-10"
        >
          <Column title="Explora">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={navHref(link.href, pathname)}>
                  {link.label}
                </FooterLink>
              </li>
            ))}
            <li>
              <FooterLink href={JOIN_LINK.href}>{JOIN_LINK.label}</FooterLink>
            </li>
          </Column>

          <Column title="Contacto">
            <li>
              <FooterLink href={WHATSAPP_URL} external>
                WhatsApp
              </FooterLink>
            </li>
            {emailOk && (
              <li>
                <FooterLink href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </FooterLink>
              </li>
            )}
            {SOCIAL_LINKS.filter((s) => isRealUrl(s.href)).map((social) => (
              <li key={social.network}>
                <FooterLink href={social.href} external>
                  {social.network}
                  <span className="sr-only"> {social.handle}</span>
                </FooterLink>
              </li>
            ))}
            {hoursOk && (
              <li className="font-figtree text-[16px] text-cream/85">
                {CONTACT_HOURS}
              </li>
            )}
          </Column>
        </nav>
      </div>

      {/* 3. Wordmark */}
      <FooterWordmark />

      {/* 4. Barra inferior */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-4 border-t border-cream/15 py-6 font-figtree text-[13px] text-cream/60 lg:flex-row lg:items-center lg:justify-between">
          {/* Marca completa (versión blanca) + año. Reemplaza el texto
              "© 2026 Ahimsa Travel …" para evitar duplicar el nombre
              con el SVG, y da identidad visual al pie. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Image
              src="/logo-completo-light.svg"
              alt="Ahimsa Travel — Fátima Nieto"
              width={400}
              height={80}
              className="h-7 w-auto select-none opacity-80"
            />
            <span suppressHydrationWarning>
              © {year}. Todos los derechos reservados.
            </span>
          </div>
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
