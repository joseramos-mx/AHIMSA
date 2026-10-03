"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const W = 220;
const H = 280;
const OFFSET = 24;
const SPRING = { stiffness: 200, damping: 25, mass: 0.5 };

type CursorImageProps = {
  items: { slug: string; image: string }[];
  /** Slug de la fila bajo el cursor; null fuera de la lista. */
  active: string | null;
  /** Lista de filas: la imagen se mantiene siempre a su izquierda. */
  listRef: RefObject<HTMLElement | null>;
};

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/**
 * Imagen flotante que acompaña al cursor sobre la lista de servicios (solo
 * desktop con puntero fino y sin reduced motion). Para no tapar nunca el
 * texto de la fila activa vive a la IZQUIERDA de la lista: sigue al cursor
 * en Y y, en X, con un parallax suave cuyo borde derecho nunca pasa del
 * borde izquierdo de la lista (- OFFSET).
 */
export default function CursorImage(props: CursorImageProps) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  if (!fine || reduce) return null;
  return <FloatingImage {...props} />;
}

function FloatingImage({ items, active, listRef }: CursorImageProps) {
  const pointerX = useMotionValue(0);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, SPRING);
  const y = useSpring(targetY, SPRING);

  // Rotación según la velocidad horizontal del cursor (máx. ±6°).
  const velocityX = useVelocity(pointerX);
  const rotate = useSpring(
    useTransform(velocityX, [-1500, 0, 1500], [-6, 0, 6], { clamp: true }),
    { stiffness: 150, damping: 20 }
  );

  const [failed, setFailed] = useState<Record<string, boolean>>({});
  // Al salir de la lista se desvanece mostrando la última fila, no en blanco.
  const lastActive = useRef<string | null>(null);
  if (active) lastActive.current = active;
  const shown = active ?? lastActive.current;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const list = listRef.current;
      if (!list) return;
      const r = list.getBoundingClientRect();
      pointerX.set(e.clientX);
      // Parallax: se corre a la izquierda cuando el cursor lo hace, pero su
      // borde derecho queda siempre a OFFSET px de la lista.
      const parallax = (r.right - e.clientX) * 0.12;
      targetX.set(r.left - OFFSET - W - parallax);
      const yy = e.clientY - H / 2;
      targetY.set(Math.min(window.innerHeight - H - 8, Math.max(8, yy)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [listRef, pointerX, targetX, targetY]);

  // Al entrar desde fuera, salta a la posición del cursor (sin barrido).
  useEffect(() => {
    if (active) return;
    const unsub = targetY.on("change", () => {
      x.jump(targetX.get());
      y.jump(targetY.get());
    });
    return unsub;
  }, [active, targetX, targetY, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 overflow-hidden rounded-[2px] bg-[#DCD8D1]"
      style={{ x, y, rotate, width: W, height: H }}
      initial={false}
      animate={
        active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
      }
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Las 3 imágenes se montan desde el inicio: se precargan y el cambio
          de fila es un crossfade. */}
      {items.map((item) => (
        <motion.div
          key={item.slug}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: item.slug === shown ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {failed[item.slug] ? (
            <div className="flex h-full items-center justify-center bg-ink/15 p-4 text-center">
              <span className="break-all font-figtree text-[11px] text-ink/60">
                {item.image.split("/").pop()}
              </span>
            </div>
          ) : (
            <Image
              src={item.image}
              alt=""
              fill
              sizes={`${W}px`}
              loading="eager"
              className="object-cover"
              onError={() =>
                setFailed((f) => ({ ...f, [item.slug]: true }))
              }
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
