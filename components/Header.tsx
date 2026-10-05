"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { NAV_LINKS, CTA, navHref } from "@/lib/nav";
import MobileMenu from "./MobileMenu";

type HeaderProps = {
  /** Progreso del scroll del Hero. Sin él (páginas sin Hero) el header se
   *  muestra directo en su estado final: logo chico y fondo cream. */
  progress?: MotionValue<number>;
  rawProgress?: MotionValue<number>;
};

type NavItemProps = {
  progress: MotionValue<number>;
  index: number;
  atEnd: boolean;
  href: string;
  label: string;
};

/** Short staggered appearance between progress 0.25 and 0.45. */
function NavItem({ progress, index, atEnd, href, label }: NavItemProps) {
  const start = 0.25 + index * 0.02;
  const end = start + 0.1;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);

  return (
    <motion.div style={{ opacity, y }}>
      <Link
        href={href}
        className={`font-figtree text-sm transition-colors duration-300 ${
          atEnd ? "text-ink hover:text-accent" : "text-white hover:text-accent"
        }`}
      >
        {label}
      </Link>
    </motion.div>
  );
}

function NavCta({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const start = 0.25 + index * 0.02;
  const end = start + 0.1;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);

  return (
    <motion.div style={{ opacity, y }}>
      <Link
        href={CTA.href}
        className="inline-flex items-center font-figtree text-sm bg-white text-ink px-4 py-2 rounded-[2px] hover:bg-cream transition-colors"
      >
        {CTA.label}
      </Link>
    </motion.div>
  );
}

function HamburgerIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default function Header(props: HeaderProps) {
  const fallback = useMotionValue(1);
  const progress = props.progress ?? fallback;
  const rawProgress = props.rawProgress ?? fallback;
  const isStatic = !props.progress;
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ bigScale: 1, bigX: 0, bigY: 0 });
  const [measured, setMeasured] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Measure the logo's natural (small) position in the header and compute
  // the scale/translate needed to make it appear visually centered on the
  // viewport at ~80vw (desktop) / ~85vw (mobile).
  useLayoutEffect(() => {
    if (reduceMotion) {
      setMeasured(true);
      return;
    }
    const measure = () => {
      const el = logoContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      const targetWidth = vw * (mobile ? 0.85 : 0.8);
      if (rect.width === 0 || rect.height === 0) return;
      const bigScale = targetWidth / rect.width;
      const bigX = vw / 2 - rect.left - (rect.width * bigScale) / 2;
      const bigY = vh / 2 - rect.top - (rect.height * bigScale) / 2;
      setM({ bigScale, bigX, bigY });
      setMeasured(true);
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [reduceMotion]);

  // Toggle the "landed" style once we've essentially left the hero.
  // Uses the raw (unsmoothed) progress to avoid flicker near the edge.
  useMotionValueEvent(rawProgress, "change", (v) => {
    const next = v >= 0.98;
    setAtEnd((prev) => (prev === next ? prev : next));
  });

  // Esc closes the mobile menu even if focus is outside the overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const logoScale = useTransform(progress, [0, 0.35], [m.bigScale, 1]);
  const logoX = useTransform(progress, [0, 0.35], [m.bigX, 0]);
  const logoY = useTransform(progress, [0, 0.35], [m.bigY, 0]);

  // Reduced motion o página sin Hero: skip transforms, render the final
  // state (small logo, visible nav, cream header).
  if (reduceMotion || isStatic) {
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-50 bg-cream/85 backdrop-blur-md border-b border-ink/10">
          <div className="flex items-center justify-between px-5 md:px-10 h-16">
            <Link
              href="/"
              aria-label="AHIMSA, inicio"
              className="font-fraunces font-light [font-variation-settings:'opsz'_144] text-base md:text-xl text-ink leading-none"
            >
              AHIMSA
            </Link>
            <nav
              className="hidden md:flex items-center gap-7"
              aria-label="Principal"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={navHref(link.href, pathname)}
                  className="font-figtree text-sm text-ink hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={CTA.href}
                className="inline-flex items-center font-figtree text-sm bg-white text-ink px-4 py-2 rounded-[2px] hover:bg-cream transition-colors"
              >
                {CTA.label}
              </Link>
            </nav>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden -mr-2 p-2 text-ink"
            >
              <HamburgerIcon />
            </button>
          </div>
        </header>
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header
        data-at-end={atEnd ? "" : undefined}
        className="fixed inset-x-0 top-0 z-50
          bg-transparent border-b border-transparent
          transition-[background-color,backdrop-filter,border-color] duration-300
          data-[at-end]:bg-cream/85 data-[at-end]:backdrop-blur-md data-[at-end]:border-ink/10"
      >
        <div className="flex items-center justify-between px-5 md:px-10 h-16">
          {/* opsz 144: el logo se escala con transform desde ~20px; sin fijar
              el tamaño óptico se vería el corte de texto chico de Fraunces.
              Logo: one visible element (the motion.a). The invisible span
              reserves layout space so getBoundingClientRect gives us the
              natural (post-animation) position for the FLIP math. */}
          <div
            ref={logoContainerRef}
            className="relative inline-block leading-none"
          >
            <span
              aria-hidden="true"
              className="invisible font-fraunces font-light [font-variation-settings:'opsz'_144] text-base md:text-xl leading-none select-none"
            >
              AHIMSA
            </span>
            <motion.a
              href="/"
              aria-label="AHIMSA, inicio"
              className={`absolute left-0 top-0 origin-top-left font-fraunces font-light [font-variation-settings:'opsz'_144] text-base md:text-xl leading-none select-none will-change-transform transition-colors duration-300 ${
                atEnd ? "text-ink" : "text-white"
              }`}
              style={{
                scale: logoScale,
                x: logoX,
                y: logoY,
                opacity: measured ? 1 : 0,
              }}
            >
              AHIMSA
            </motion.a>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Principal"
          >
            {NAV_LINKS.map((link, i) => (
              <NavItem
                key={link.href}
                progress={progress}
                index={i}
                atEnd={atEnd}
                href={link.href}
                label={link.label}
              />
            ))}
            <NavCta progress={progress} index={NAV_LINKS.length} />
          </nav>

          {/* Mobile menu button — appears in the same scroll window */}
          <MobileMenuButton
            progress={progress}
            atEnd={atEnd}
            onOpen={() => setMenuOpen(true)}
          />
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenuButton({
  progress,
  atEnd,
  onOpen,
}: {
  progress: MotionValue<number>;
  atEnd: boolean;
  onOpen: () => void;
}) {
  const opacity = useTransform(progress, [0.25, 0.45], [0, 1]);
  const y = useTransform(progress, [0.25, 0.45], [10, 0]);
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Abrir menú"
      className={`md:hidden -mr-2 p-2 transition-colors duration-300 ${
        atEnd ? "text-ink" : "text-white"
      }`}
      style={{ opacity, y }}
    >
      <HamburgerIcon />
    </motion.button>
  );
}
