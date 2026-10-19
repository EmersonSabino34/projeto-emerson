"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ApiError, autenticar } from "@/lib/api";
import { salvarSessao, sessaoDoUsuario } from "@/lib/auth";
import { emailValido } from "@/lib/validacao";

type Campos = { email: string; senha: string };
type Erros = Partial<Record<keyof Campos, string>>;

/** Usuário semeado em db.json, para dar para entrar sem cadastrar nada. */
const DEMO = { email: "ana@exemplo.com", senha: "123456" };

function validar({ email, senha }: Campos): Erros {
  const erros: Erros = {};
  if (!emailValido(email)) erros.email = "Digite um e-mail válido.";
  if (senha.length === 0) erros.senha = "Digite sua senha.";
  return erros;
}

export default function FormularioLogin() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [campos, setCampos] = useState<Campos>({ email: "", senha: "" });
  const [erros, setErros] = useState<Erros>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function alterar(campo: keyof Campos, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual));
    setErroApi(null);
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novosErros = validar(campos);
    setErros(novosErros);

    const primeiroErro = Object.keys(novosErros)[0];
    if (primeiroErro) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${primeiroErro}"]`)?.focus();
      return;
    }

    setEnviando(true);
    setErroApi(null);

    try {
      const usuario = await autenticar(campos.email, campos.senha);
      salvarSessao(sessaoDoUsuario(usuario));
      // Quem chegou aqui vindo do painel da conta volta para ele. Só aceita
      // caminho interno ("/conta"), nunca outro site ("//exemplo.com").
      const voltar = new URLSearchParams(window.location.search).get("voltar");
      router.push(voltar?.startsWith("/") && !voltar.startsWith("//") ? voltar : "/inicio");
    } catch (erro) {
      setErroApi(erro instanceof ApiError ? erro.message : "Algo deu errado. Tente de novo.");
      setEnviando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <p className="eyebrow">Bem-vinda de volta</p>
          <h1>Entrar no seu mural</h1>
          <p>Seus sonhos continuam exatamente de onde você parou.</p>
        </div>

        {erroApi ? (
          <div className="form-alert" role="alert">
            <span aria-hidden="true">⚠</span>
            <span>
              <strong>Não foi possível entrar</strong>
              {erroApi}
            </span>
          </div>
        ) : null}

        <form ref={formRef} onSubmit={enviar} noValidate>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={campos.email}
              onChange={(e) => alterar("email", e.target.value)}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? "erro-email" : undefined}
            />
            {erros.email ? (
              <span className="field-error" id="erro-email">
                <span aria-hidden="true">✕</span> {erros.email}
              </span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={campos.senha}
              onChange={(e) => alterar("senha", e.target.value)}
              aria-invalid={Boolean(erros.senha)}
              aria-describedby={erros.senha ? "erro-senha" : undefined}
            />
            {erros.senha ? (
              <span className="field-error" id="erro-senha">
                <span aria-hidden="true">✕</span> {erros.senha}
              </span>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            aria-busy={enviando}
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </>
            )}
          </button>
        </form>

        <div className="auth-demo">
          <p>
            Conta de teste: <code>{DEMO.email}</code> · <code>{DEMO.senha}</code>
          </p>
          <button type="button" onClick={() => setCampos(DEMO)}>
            Preencher
          </button>
        </div>

        <p className="auth-alt">
          Ainda não tem conta? <Link href="/cadastro">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  );
}
