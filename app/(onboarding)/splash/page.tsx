"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Ambience from "@/components/Ambience";
import { VyraMark } from "@/components/VyraLogo";

/** Quanto a marca fica em cena antes de o fluxo seguir sozinho. */
const DURACAO = 2400;

/**
 * Splash (tela 1).
 *
 * Avança sozinha com router.replace, e não push: a splash não pode ficar no
 * histórico, senão o botão voltar da tela seguinte devolve a pessoa para cá e
 * ela cai num laço.
 *
 * O link "Continuar" não é decorativo — é a saída para quem usa teclado ou
 * leitor de tela e não deve depender de um timer para sair da tela.
 */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/bem-vindo"), DURACAO);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="onboarding onboarding-center" data-ambience="aurora">
      <Ambience />

      <div className="splash">
        <span className="brand-mark brand-mark-lg brand-mark-halo">
          <VyraMark size={30} />
        </span>

        <div className="vyra-logo-word">
          <strong>VYRA</strong>
          <span>Mente · Plano · Vibra · Realiza</span>
        </div>

        <p className="splash-lede">O extraordinário começa na sua mente.</p>

        <Link href="/bem-vindo" className="text-link splash-skip">
          Continuar <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
