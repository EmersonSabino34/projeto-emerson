"use client";

import { useEffect, useState } from "react";
import type { Usuario } from "@/lib/api";

/**
 * Sessão do protótipo: fica em localStorage, sem token nem cookie.
 *
 * Não é segurança de verdade — qualquer pessoa pode editar o localStorage e
 * "entrar". Serve para o fluxo de telas rodar ponta a ponta enquanto o banco
 * não existe; a troca por sessão real está no plano.
 */

const STORAGE_KEY = "mds-sessao";

/** A senha nunca entra aqui. */
export type Sessao = {
  id: number;
  nome: string;
  email: string;
  iniciais: string;
};

export function sessaoDoUsuario(usuario: Usuario): Sessao {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    iniciais: usuario.iniciais,
  };
}

export function salvarSessao(sessao: Sessao) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessao));
    // Avisa outras abas e os componentes desta mesma aba.
    window.dispatchEvent(new Event("mds-sessao-mudou"));
  } catch {
    // storage bloqueado: a sessão vale só enquanto a página estiver aberta
  }
}

export function lerSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Partial<Sessao>;
    if (typeof dados?.id !== "number" || typeof dados?.email !== "string") return null;
    return dados as Sessao;
  } catch {
    return null;
  }
}

export function encerrarSessao() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("mds-sessao-mudou"));
  } catch {
    // nada a fazer
  }
}

/**
 * Lê a sessão no cliente.
 *
 * `carregando` existe porque no primeiro render (servidor e hidratação) ainda
 * não há acesso a localStorage. Sem esse estado, a UI piscaria "deslogado"
 * antes de descobrir que existe sessão.
 */
export function useSessao() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    function sincronizar() {
      setSessao(lerSessao());
      setCarregando(false);
    }

    sincronizar();
    window.addEventListener("mds-sessao-mudou", sincronizar);
    window.addEventListener("storage", sincronizar);

    return () => {
      window.removeEventListener("mds-sessao-mudou", sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  return { sessao, carregando };
}
