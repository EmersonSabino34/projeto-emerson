"use client";

import Link from "next/link";
import { useState } from "react";
import { IconSearch } from "@/components/icons";
import type { Category } from "@/lib/data";

/**
 * Explorar (tela 28): abas Templates · Frases · Lugares, com busca.
 *
 * A busca filtra em memória porque o catálogo do protótipo é pequeno e cabe
 * inteiro no cliente. Quando ele crescer, o campo passa a disparar a consulta
 * no servidor e só o corpo deste componente muda — as abas e os cartões não.
 */
const tabs = ["Templates", "Frases", "Lugares"] as const;
type Tab = (typeof tabs)[number];

const frases = [
  "Disciplina é a ponte entre o que você quer e o que você conquista.",
  "Sonhe grande, comece pequeno, comece agora.",
  "A sua vibração atrai o que você vive.",
  "Cuide do seu corpo. É o único lugar que você tem para viver.",
  "Eu confio no meu caminho.",
  "Minha disciplina é maior que a minha vontade de desistir.",
];

type Lugar = { label: string; note: string; image: string };

/** Normaliza para busca: minúsculas e sem acento, para "saude" achar "Saúde". */
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function ExplorarBusca({
  categorias,
  lugares,
}: {
  categorias: Category[];
  lugares: Lugar[];
}) {
  const [tab, setTab] = useState<Tab>("Templates");
  const [busca, setBusca] = useState("");

  const termo = normalizar(busca.trim());
  const casa = (texto: string) => termo === "" || normalizar(texto).includes(termo);

  const templatesVisiveis = categorias.filter((item) => casa(item.title));
  const frasesVisiveis = frases.filter(casa);
  const lugaresVisiveis = lugares.filter((item) => casa(`${item.label} ${item.note}`));

  const vazio =
    (tab === "Templates" && templatesVisiveis.length === 0) ||
    (tab === "Frases" && frasesVisiveis.length === 0) ||
    (tab === "Lugares" && lugaresVisiveis.length === 0);

  return (
    <>
      <div className="section">
        <div className="segmented" role="group" aria-label="O que explorar">
          {tabs.map((option) => (
            <button
              key={option}
              type="button"
              className="segmented-option"
              aria-pressed={option === tab}
              onClick={() => setTab(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="search-field">
          <span className="search-field-icon" aria-hidden="true">
            <IconSearch />
          </span>
          <input
            type="search"
            value={busca}
            placeholder="Buscar..."
            aria-label="Buscar no catálogo"
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>
      </div>

      {vazio ? (
        <p className="empty-state">Nada encontrado para &ldquo;{busca}&rdquo;.</p>
      ) : null}

      {tab === "Templates" && templatesVisiveis.length > 0 ? (
        <div className="place-grid" style={{ marginTop: "var(--sp-5)" }}>
          {templatesVisiveis.map((categoria) => (
            <Link
              href={`/categoria/${categoria.slug}`}
              key={categoria.slug}
              className="place-card"
              style={{ backgroundImage: `url(${categoria.image})` }}
            >
              <span className="place-card-copy">
                <strong>{categoria.short}</strong>
                <span>{categoria.title}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "Frases" && frasesVisiveis.length > 0 ? (
        <div className="choice-list" style={{ marginTop: "var(--sp-5)" }}>
          {frasesVisiveis.map((frase) => (
            <Link href="/frases" key={frase} className="choice-row">
              <span className="choice-label">{frase}</span>
              <span className="choice-chevron" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "Lugares" && lugaresVisiveis.length > 0 ? (
        <div className="place-grid" style={{ marginTop: "var(--sp-5)" }}>
          {lugaresVisiveis.map((lugar) => (
            <Link
              href="/area/lugares"
              key={lugar.label}
              className="place-card"
              style={{ backgroundImage: `url(${lugar.image})` }}
            >
              <span className="place-card-copy">
                <strong>{lugar.label}</strong>
                <span>{lugar.note}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </>
  );
}
