"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CTA, NAV_LINKS, navHref } from "@/lib/nav";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Mientras está abierto: bloquea el scroll, Esc cierra, el foco entra al
  // menú y Tab no se sale de él; al cerrar, el foco vuelve a donde estaba
  // (el botón "Abrir menú").
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  const duration = reduceMotion ? 0 : 0.25;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className="fixed inset-0 z-[60] bg-ink text-cream md:hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
            <Link
              href="/"
              onClick={onClose}
              aria-label="AHIMSA, inicio"
              className="inline-flex items-center leading-none"
            >
              <Image
                src="/logo-simple-light.svg"
                alt="AHIMSA"
                width={240}
                height={48}
                className="h-5 w-auto select-none"
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="-mr-2 p-2 text-cream"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav
            className="flex-1 flex flex-col justify-center px-6 gap-5"
            aria-label="Principal móvil"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.3,
                  delay: reduceMotion ? 0 : 0.05 + i * 0.05,
                }}
              >
                <Link
                  href={navHref(link.href, pathname)}
                  onClick={onClose}
                  className="font-fraunces font-light text-[32px] leading-tight text-cream hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="p-6 pb-10 border-t border-white/10">
            <Link
              href={CTA.href}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center font-figtree text-base bg-white text-ink py-4 rounded-[2px] hover:bg-cream transition-colors"
            >
              {CTA.label}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
