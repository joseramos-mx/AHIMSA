import Image from "next/image";
import Link from "next/link";
import type { Niche } from "@/lib/niches";

/**
 * Toda la tarjeta es un link a /contacto?tipo={slug} para que el
 * formulario llegue con el tipo de viaje preseleccionado.
 *
 * Los efectos de hover están gateados por `@media (pointer: fine)`
 * para que no se disparen en dispositivos táctiles.
 */
export default function NicheCard({
  slug,
  name,
  description,
  image,
  alt,
}: Niche) {
  return (
    <Link
      href={`/contacto?tipo=${slug}`}
      aria-label={`Cotizar viaje ${name}`}
      className="
        group flex h-full flex-col
        bg-cream border border-ink/25 rounded-[2px] p-2
        transition-colors duration-300
        [@media(pointer:fine)]:hover:border-accent
      "
    >
      <div className="relative aspect-square overflow-hidden rounded-[2px] bg-ink/5">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
          className="
            object-cover
            transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            [@media(pointer:fine)]:group-hover:scale-[1.05]
          "
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-fraunces font-light text-[17px] leading-tight text-accent-dark">
          {name}
        </h3>
        <p className="font-figtree text-[14px] leading-[1.5] text-ink">
          {description}
        </p>

        {/* Siempre visible en móvil / touch; aparece en hover en desktop */}
        <span
          aria-hidden="true"
          className="
            mt-auto pt-3 flex items-center gap-1
            font-figtree text-[13px] font-medium text-ink
            opacity-100 transition-opacity duration-300
            [@media(pointer:fine)]:opacity-0
            [@media(pointer:fine)]:group-hover:opacity-100
          "
        >
          Cotizar
          <span
            className="
              inline-block transition-transform duration-300
              [@media(pointer:fine)]:group-hover:translate-x-1
            "
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
