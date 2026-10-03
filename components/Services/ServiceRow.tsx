import { Link000 } from "@/components/ui/skiper-ui/skiper40";
import { contactHref } from "@/lib/trip-types";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/utils";

/*
 * Link000 dibuja su subrayado como ::before del propio <a> (todo el ancho)
 * y aplica nuestro className ANTES que sus clases before:, así que no se
 * pueden recolocar desde aquí. Por eso:
 *  - Link000 es la fila completa (un solo <a>, sin anidar),
 *  - su ::before se apaga con `before:hidden` (no choca con sus clases),
 *  - el nombre recibe el mismo subrayado de Link000 (misma receta) con
 *    group-hover, y sin transición con reduced motion.
 */
const NAME_UNDERLINE = cn(
  "relative before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
  "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
  "[@media(pointer:fine)]:group-hover:before:origin-left [@media(pointer:fine)]:group-hover:before:scale-x-100",
  "group-focus-visible:before:scale-x-100 motion-reduce:before:transition-none"
);

// Desplazamientos solo con puntero fino y sin reduced motion.
const MOVE = "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function ServiceRow({
  service,
  last,
}: {
  service: Service;
  last: boolean;
}) {
  return (
    <Link000
      href={contactHref(service.slug)}
      className={cn(
        "items-start justify-between gap-6 py-7 min-h-12",
        "border-t border-ink/20 transition-colors duration-300",
        "[@media(pointer:fine)]:hover:border-ink",
        last && "border-b",
        "rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        "before:hidden"
      )}
    >
      <span className="flex min-w-0 flex-col gap-2">
        <span
          className={cn(
            "self-start font-playfair text-[24px] leading-tight text-ink",
            MOVE,
            "motion-safe:[@media(pointer:fine)]:group-hover:translate-x-2"
          )}
        >
          <span className="sr-only">Cotizar </span>
          <span className={NAME_UNDERLINE}>{service.name}</span>
        </span>
        <span className="max-w-[380px] font-figtree text-[15px] leading-[1.5] text-ink/70">
          {service.description}
        </span>
      </span>
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "mt-1 shrink-0 text-ink",
          MOVE,
          "motion-safe:[@media(pointer:fine)]:group-hover:-rotate-45"
        )}
      >
        <path d="M4 11h14" />
        <path d="M13 6l5 5-5 5" />
      </svg>
    </Link000>
  );
}
