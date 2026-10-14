"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/data";

type Campos = {
  titulo: string;
  categoria: string;
  prazo: string;
  porque: string;
};

type Erros = Partial<Record<keyof Campos, string>>;

const VAZIO: Campos = { titulo: "", categoria: "", prazo: "", porque: "" };

/**
 * O formulário da tela "Novo objetivo" (tela 12 das referências).
 *
 * Ainda não persiste: o botão valida e devolve para a lista. O que já está no
 * lugar é o contrato — os mesmos quatro campos que a API vai receber.
 */
export default function FormularioObjetivo() {
  const router = useRouter();
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});

  function alterar(campo: keyof Campos, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    // O erro some assim que a pessoa mexe no campo, não só no próximo envio.
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  function validar(): Erros {
    const novos: Erros = {};
    if (campos.titulo.trim().length < 3) {
      novos.titulo = "Escreva o objetivo com pelo menos 3 letras.";
    }
    if (!campos.categoria) {
      novos.categoria = "Escolha uma categoria.";
    }
    return novos;
  }

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();

    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    router.push("/objetivos");
  }

  return (
    <form className="glass glass-pad section" onSubmit={enviar} noValidate>
      <div className="field">
        <label htmlFor="titulo">O objetivo</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          placeholder="Ex.: Abrir minha confeitaria"
          value={campos.titulo}
          onChange={(e) => alterar("titulo", e.target.value)}
          aria-invalid={Boolean(erros.titulo)}
          aria-describedby={erros.titulo ? "erro-titulo" : undefined}
        />
        {erros.titulo ? (
          <span className="field-error" id="erro-titulo">
            <span aria-hidden="true">✕</span> {erros.titulo}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          name="categoria"
          value={campos.categoria}
          onChange={(e) => alterar("categoria", e.target.value)}
          aria-invalid={Boolean(erros.categoria)}
          aria-describedby={erros.categoria ? "erro-categoria" : undefined}
        >
          <option value="">Escolha uma área</option>
          {categories.map((categoria) => (
            <option key={categoria.slug} value={categoria.slug}>
              {categoria.title}
            </option>
          ))}
        </select>
        {erros.categoria ? (
          <span className="field-error" id="erro-categoria">
            <span aria-hidden="true">✕</span> {erros.categoria}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="prazo">Prazo</label>
        <input
          id="prazo"
          name="prazo"
          type="month"
          value={campos.prazo}
          onChange={(e) => alterar("prazo", e.target.value)}
        />
        <span className="field-hint">Opcional — dá para definir depois.</span>
      </div>

      <div className="field">
        <label htmlFor="porque">Por que isso é importante?</label>
        <textarea
          id="porque"
          name="porque"
          rows={4}
          placeholder="O motivo é o que segura você nos dias difíceis."
          value={campos.porque}
          onChange={(e) => alterar("porque", e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Criar objetivo
        <span className="btn-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}
