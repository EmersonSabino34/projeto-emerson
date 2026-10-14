"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * As formas de pagamento da tela 7.
 *
 * Nenhuma delas abre um formulário de cartão aqui: cada uma leva à folha do
 * provedor, que é quem tem direito de ver o número do cartão. No protótipo o
 * botão só avança para a confirmação.
 */
const metodos = [
  { id: "cartao", label: "Cartão de crédito", glyph: "▭" },
  { id: "apple", label: "Apple Pay", glyph: "" },
  { id: "google", label: "Google Pay", glyph: "G" },
  { id: "paypal", label: "PayPal", glyph: "P" },
];

export default function MetodosPagamento() {
  const router = useRouter();
  const [metodo, setMetodo] = useState(metodos[0].id);

  return (
    <>
      <div className="choice-list" role="radiogroup" aria-label="Forma de pagamento">
        {metodos.map((item) => (
          <button
            type="button"
            role="radio"
            key={item.id}
            className="choice-row pay-row"
            aria-checked={item.id === metodo}
            onClick={() => setMetodo(item.id)}
          >
            <span className="choice-icon" aria-hidden="true">
              {item.glyph}
            </span>
            <span className="choice-label">{item.label}</span>
            <span className="theme-picker-dot" aria-hidden="true" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => router.push("/pronto")}
      >
        Finalizar assinatura
        <span className="btn-arrow" aria-hidden="true">
          →
        </span>
      </button>

      <p className="muted-copy secure-note">
        <span aria-hidden="true">🔒</span> Seus dados estão protegidos. O número do
        cartão é tratado pelo provedor de pagamento, não pelo VYRA.
      </p>
    </>
  );
}
