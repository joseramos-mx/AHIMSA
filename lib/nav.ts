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
];

export const CTA = {
  label: "Cotiza tu viaje",
  href: "/contacto",
};
