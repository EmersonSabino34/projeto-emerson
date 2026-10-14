"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { VyraMark } from "@/components/VyraLogo";
import {
  IconHome,
  IconLayers,
  IconPlus,
  IconSearch,
  IconUser,
} from "@/components/icons";

/**
 * A navegação das telas de referência: Início · Explorar · (+) · Mural · Perfil.
 *
 * `also` lista prefixos de rota que ainda pertencem a este item de menu.
 * Sem isso, /sonho/1 e /categoria/lugares deixavam o menu inteiro apagado,
 * porque nenhuma das rotas filhas bate com o href do item pai.
 *
 * `fab` marca o botão central de criar — o círculo dourado que nas telas de
 * referência flutua acima da barra.
 */
const items = [
  { href: "/inicio", label: "Início", Icon: IconHome, also: ["/sonho"], fab: false },
  { href: "/explorar", label: "Explorar", Icon: IconSearch, also: ["/categoria", "/frases"], fab: false },
  { href: "/objetivos/novo", label: "Criar", Icon: IconPlus, also: [], fab: true },
  { href: "/mural", label: "Mural", Icon: IconLayers, also: [], fab: false },
  { href: "/perfil", label: "Perfil", Icon: IconUser, also: ["/configuracoes"], fab: false },
];

export default function NavRail() {
  const pathname = usePathname();

  function isActive(href: string, also: string[]) {
    if (pathname === href || pathname.startsWith(`${href}/`)) return true;
    return also.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  }

  return (
    <nav className="nav" aria-label="Navegação principal">
      {/* Só aparece no layout de trilha lateral (>= 1024px) */}
      <Link href="/inicio" className="nav-brand">
        <span className="brand-mark" aria-hidden="true">
          <VyraMark size={20} />
        </span>
        <div>
          <strong>VYRA</strong>
          <span>Visualize · Planeje · Viva</span>
        </div>
      </Link>

      <div className="nav-items">
        {items.map(({ href, label, Icon, also, fab }) => {
          const active = isActive(href, also);
          return (
            <Link
              key={href}
              href={href}
              className={fab ? "nav-item nav-item-fab" : "nav-item"}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav-icon">
                <Icon />
              </span>
              <span className="nav-label">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* No desktop o seletor de tipo mora no pé da trilha; no mobile, no cabeçalho */}
      <div className="nav-footer">
        <ThemeToggle />
        <span className="nav-footer-note">Dia · Noite · Auto</span>
      </div>
    </nav>
  );
}
