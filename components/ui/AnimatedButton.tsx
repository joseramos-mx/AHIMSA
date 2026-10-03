import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "light" | "dark";

type AnimatedButtonProps = {
  children: string;
  /** light: fondo cream (para superficies oscuras). dark: fondo ink. */
  variant?: Variant;
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "children" | "className">)
  | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">)
);

const VARIANTS: Record<Variant, string> = {
  light:
    "bg-cream text-ink hover:bg-accent focus-visible:outline-cream",
  dark: "bg-ink text-cream hover:bg-accent hover:text-ink focus-visible:outline-accent",
};

// El texto sube y sale mientras su copia entra desde abajo. Solo con
// puntero fino y sin reduced motion; si no, solo cambia el color de fondo.
const ROLL =
  "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
const ROLL_OUT =
  "motion-safe:[@media(pointer:fine)]:group-hover:-translate-y-full motion-safe:group-focus-visible:-translate-y-full";
const ROLL_IN =
  "translate-y-full motion-safe:[@media(pointer:fine)]:group-hover:translate-y-0 motion-safe:group-focus-visible:translate-y-0";

/**
 * Botón (o link si recibe `href`) con texto que rueda en hover. La copia
 * es aria-hidden: el nombre accesible se lee una sola vez.
 */
export default function AnimatedButton({
  children,
  variant = "dark",
  className,
  ...props
}: AnimatedButtonProps) {
  const classes = cn(
    "group relative inline-flex h-12 items-center justify-center rounded-[2px] px-7",
    "font-figtree text-[15px] font-medium",
    "transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
    VARIANTS[variant],
    className
  );

  const label = (
    <span className="relative block overflow-hidden">
      <span className={cn("block", ROLL, ROLL_OUT)}>{children}</span>
      <span aria-hidden="true" className={cn("absolute inset-0 block", ROLL, ROLL_IN)}>
        {children}
      </span>
    </span>
  );

  if (props.href !== undefined) {
    return (
      <Link {...props} className={classes}>
        {label}
      </Link>
    );
  }
  const buttonProps = props as ComponentPropsWithoutRef<"button">;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {label}
    </button>
  );
}
