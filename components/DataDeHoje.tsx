"use client";

import { useId } from "react";

/**
 * "QUARTA-FEIRA, 24 DE SETEMBRO" — o dia de hoje no fuso de quem está vendo.
 *
 * Formatar só no servidor dava dois erros: a página é pré-renderizada, então a
 * data ficava congelada no dia do build, e o servidor (em UTC) já mostrava o
 * dia seguinte às 21h no Brasil.
 *
 * É o padrão do guia "Preventing flash before hydration" do Next:
 *   · carregamento completo · o <script> inline roda durante o parse do HTML
 *     e troca o texto antes do primeiro paint; suppressHydrationWarning faz o
 *     React aceitar o texto que já está no DOM
 *   · navegação pelo <Link> · o script chega como text/plain e não roda; quem
 *     formata é o próprio componente, já no navegador
 */
const FORMATO: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };

function hoje() {
  return new Intl.DateTimeFormat("pt-BR", FORMATO).format(new Date()).toUpperCase();
}

export default function DataDeHoje({ className }: { className?: string }) {
  const id = useId();

  const script =
    `{var n=document.getElementById(${JSON.stringify(id)});` +
    `if(n)n.textContent=new Intl.DateTimeFormat("pt-BR",${JSON.stringify(FORMATO)})` +
    `.format(new Date()).toUpperCase()}`;

  return (
    <>
      <p id={id} className={className} suppressHydrationWarning>
        {hoje()}
      </p>
      <script
        // No servidor o script precisa rodar; no cliente ele não pode, e o
        // React avisaria sobre <script> renderizado. A diferença de `type`
        // entre os dois lados é esperada.
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
}
