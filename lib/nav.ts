import { hasPublishedTestimonials } from "./testimonials";

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Viajes", href: "#viajes" },
  { label: "Europa bespoke", href: "#europa" },
  { label: "Cómo trabajamos", href: "#como-trabajamos" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Empresas", href: "#empresas" },
  // Sin testimonios publicados la sección no existe: se quita su link.
].filter(
  (link) => link.href !== "#testimonios" || hasPublishedTestimonials()
);

export const CTA = {
  label: "Cotiza tu viaje",
  href: "/contacto",
};

/** Fuera de la home, los anclas (#seccion) deben llevar a /#seccion. */
export function navHref(href: string, pathname: string | null) {
  return href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
}
