"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CTA, NAV_LINKS } from "@/lib/nav";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reduceMotion = useReducedMotion();

  // Lock body scroll + handle Escape while open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const duration = reduceMotion ? 0 : 0.25;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
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
              className="font-playfair text-base leading-none text-cream"
            >
              AHIMSA
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
                  href={link.href}
                  onClick={onClose}
                  className="font-playfair text-[32px] leading-tight text-cream hover:text-accent transition-colors"
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
