"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { VyraMark } from "@/components/VyraLogo";
import { useSessao } from "@/lib/auth";

/**
 * Cabeçalho das telas públicas.
 *
 * Se já existe sessão, os CTAs de entrar/criar conta dão lugar a um atalho
 * para dentro do app — quem já está logado não precisa ver o funil de novo.
 */
export default function SiteHeader() {
  const { sessao, carregando } = useSessao();

  return (
    <header className="site-header">
      <Link href="/" className="site-brand">
        <span className="site-brand-mark brand-mark" aria-hidden="true">
          <VyraMark size={18} />
        </span>
        <strong>VYRA</strong>
      </Link>

      <div className="site-header-actions">
        <ThemeToggle />

        {/* Durante a leitura do localStorage não mostramos CTA nenhum, para
            não piscar "Entrar" para quem já tem sessão. */}
        {carregando ? null : sessao ? (
          <Link href="/inicio" className="btn btn-primary btn-sm">
            Entrar no VYRA
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ) : (
          <>
            <Link href="/login" className="site-header-link">
              Entrar
            </Link>
            <Link href="/cadastro" className="btn btn-primary btn-sm">
              Criar conta
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
