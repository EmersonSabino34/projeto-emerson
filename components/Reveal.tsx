"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em ms, para escalonar vários blocos irmãos. */
  delay?: number;
  className?: string;
};

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * O elemento começa com .reveal (invisível, deslocado 26px) e ganha
 * .is-visible uma única vez — depois disso o observer solta o alvo, para não
 * re-animar a cada scroll. Se IntersectionObserver não existir, o conteúdo
 * aparece direto em vez de ficar invisível para sempre.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
