import type { ReactNode } from "react";
import { Link000 } from "@/components/ui/skiper-ui/skiper40";
import { cn } from "@/lib/utils";

// Color, foco y reduced motion comunes. El subrayado lo pone Link000
// (::before); los externos replican esa misma receta.
const BASE =
  "inline-flex font-figtree text-[16px] text-cream/85 transition-colors duration-200 hover:text-cream rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-reduce:before:transition-none";

const UNDERLINE = cn(
  "group relative items-center",
  "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
  "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
  "hover:before:origin-left hover:before:scale-x-100 focus-visible:before:scale-x-100"
);

type FooterLinkProps = {
  href: string;
  children: ReactNode;
  /** Abre en otra pestaña (WhatsApp, Instagram). */
  external?: boolean;
  className?: string;
};

/**
 * Link del footer. Internos: Link000 de Skiper UI (next/link). Externos y
 * mailto/tel: <a> propio con el mismo subrayado; los que abren otra pestaña
 * lo anuncian a lectores de pantalla.
 */
export default function FooterLink({
  href,
  children,
  external = false,
  className,
}: FooterLinkProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal && !external) {
    return (
      <Link000 href={href} className={cn(BASE, className)}>
        {children}
      </Link000>
    );
  }

  return (
    <a
      href={href}
      className={cn(UNDERLINE, BASE, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
    </a>
  );
}
