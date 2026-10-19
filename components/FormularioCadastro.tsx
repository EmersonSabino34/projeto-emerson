"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ApiError, criarUsuario } from "@/lib/api";
import { salvarSessao, sessaoDoUsuario } from "@/lib/auth";
import { SENHA_MINIMA, emailValido } from "@/lib/validacao";

type Campos = { nome: string; email: string; senha: string; confirmacao: string };
type Erros = Partial<Record<keyof Campos, string>>;

const VAZIO: Campos = { nome: "", email: "", senha: "", confirmacao: "" };

function validar({ nome, email, senha, confirmacao }: Campos): Erros {
  const erros: Erros = {};

  if (nome.trim().length < 2) erros.nome = "Digite seu nome.";
  if (!emailValido(email)) erros.email = "Digite um e-mail válido.";
  if (senha.length < SENHA_MINIMA) {
    erros.senha = `A senha precisa de pelo menos ${SENHA_MINIMA} caracteres.`;
  }
  if (confirmacao !== senha) erros.confirmacao = "As senhas não são iguais.";

  return erros;
}

export default function FormularioCadastro() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function alterar(campo: keyof Campos, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    // Limpa o erro do campo assim que a pessoa começa a corrigi-lo.
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual));
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
      const usuario = await criarUsuario({
        nome: campos.nome,
        email: campos.email,
        senha: campos.senha,
      });
      salvarSessao(sessaoDoUsuario(usuario));
      // Conta nova segue o onboarding (tela 5 em diante: personalização,
      // plano, pagamento, pronto, tutorial). Antes ia direto para /inicio e
      // essas cinco telas ficavam sem nenhum caminho que chegasse nelas.
      router.push("/personalizacao");
    } catch (erro) {
      setErroApi(
        erro instanceof ApiError ? erro.message : "Algo deu errado. Tente de novo.",
      );
      setEnviando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <p className="eyebrow">Passo 1 de 1</p>
          <h1>Criar sua conta</h1>
          <p>Em menos de um minuto seu mural já começa a tomar forma.</p>
        </div>

        {erroApi ? (
          <div className="form-alert" role="alert">
            <span aria-hidden="true">⚠</span>
            <span>
              <strong>Não foi possível criar a conta</strong>
              {erroApi}
            </span>
          </div>
        ) : null}

        <form ref={formRef} onSubmit={enviar} noValidate>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Ana Silva"
              value={campos.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={erros.nome ? "erro-nome" : undefined}
            />
            {erros.nome ? (
              <span className="field-error" id="erro-nome">
                <span aria-hidden="true">✕</span> {erros.nome}
              </span>
            ) : null}
          </div>

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
              autoComplete="new-password"
              placeholder="No mínimo 6 caracteres"
              value={campos.senha}
              onChange={(e) => alterar("senha", e.target.value)}
              aria-invalid={Boolean(erros.senha)}
              aria-describedby={erros.senha ? "erro-senha" : "dica-senha"}
            />
            {erros.senha ? (
              <span className="field-error" id="erro-senha">
                <span aria-hidden="true">✕</span> {erros.senha}
              </span>
            ) : (
              <span className="field-hint" id="dica-senha">
                Pelo menos 6 caracteres.
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmacao">Confirmar senha</label>
            <input
              id="confirmacao"
              name="confirmacao"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={campos.confirmacao}
              onChange={(e) => alterar("confirmacao", e.target.value)}
              aria-invalid={Boolean(erros.confirmacao)}
              aria-describedby={erros.confirmacao ? "erro-confirmacao" : undefined}
            />
            {erros.confirmacao ? (
              <span className="field-error" id="erro-confirmacao">
                <span aria-hidden="true">✕</span> {erros.confirmacao}
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
                Criando sua conta...
              </>
            ) : (
              <>
                Criar conta
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </>
            )}
          </button>
        </form>

        <p className="auth-alt">
          Já tem uma conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
