"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BotaoSair } from "@/components/SessaoUI";
import SectionTitle from "@/components/SectionTitle";
import {
  ApiError,
  atualizarUsuario,
  buscarUsuario,
  excluirUsuario,
  trocarSenha,
  type DadosPessoais,
  type Usuario,
} from "@/lib/api";
import { encerrarSessao, salvarSessao, sessaoDoUsuario, useSessao } from "@/lib/auth";
import {
  SENHA_MINIMA,
  dataLocal,
  emailValido,
  formatarTelefone,
  nascimentoValido,
  telefoneValido,
} from "@/lib/validacao";

/**
 * O painel da conta (/conta): o R, o U e o D do cadastro da pessoa. O C é o
 * /cadastro.
 *
 * Lê o cadastro na API pelo id da sessão e mostra três blocos que salvam cada
 * um por conta própria: dados pessoais, senha e excluir conta. Separados de
 * propósito: trocar a senha não pode depender de o resto do formulário estar
 * válido, e excluir não pode estar a um clique de "salvar".
 */

const MAX_BIO = 160;

function mensagemDe(erro: unknown) {
  return erro instanceof ApiError ? erro.message : "Algo deu errado. Tente de novo.";
}

type Carga = { id: number; usuario: Usuario | null; erro?: string };

export default function PainelConta() {
  const { sessao, carregando } = useSessao();
  const [carga, setCarga] = useState<Carga | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const id = sessao?.id;

  useEffect(() => {
    if (id === undefined) return;
    let ativo = true;
    buscarUsuario(id)
      .then((usuario) => ativo && setCarga({ id, usuario }))
      .catch((erro) => ativo && setCarga({ id, usuario: null, erro: mensagemDe(erro) }));
    return () => {
      ativo = false;
    };
  }, [id, tentativa]);

  if (carregando || (sessao && carga?.id !== sessao.id)) {
    return <p className="muted-copy conta-carregando">Carregando a sua conta…</p>;
  }

  if (!sessao) {
    return (
      <section className="conta-secao glass glass-pad conta-vazia">
        <h2>Você não está em nenhuma conta</h2>
        <p className="muted-copy">Entre para ver e editar o seu cadastro.</p>
        <div className="form-acoes">
          <Link href="/cadastro" className="btn btn-ghost">
            Criar conta
          </Link>
          <Link href="/login?voltar=/conta" className="btn btn-primary">
            Entrar
          </Link>
        </div>
      </section>
    );
  }

  if (carga?.erro) {
    return (
      <div className="form-alert" role="alert">
        <span aria-hidden="true">⚠</span>
        <span>
          <strong>Não foi possível carregar a sua conta</strong>
          {carga.erro}{" "}
          <button type="button" className="text-link" onClick={() => setTentativa((n) => n + 1)}>
            Tentar de novo
          </button>
        </span>
      </div>
    );
  }

  const usuario = carga?.usuario;
  if (!usuario) {
    return (
      <section className="conta-secao glass glass-pad conta-vazia">
        <h2>Conta não encontrada</h2>
        <p className="muted-copy">
          Esta conta não existe mais. Saia e entre com outra, ou crie uma nova.
        </p>
        <BotaoSair />
      </section>
    );
  }

  function aoSalvar(atualizado: Usuario) {
    setCarga({ id: atualizado.id, usuario: atualizado });
    // O avatar e a saudação leem a sessão: ela acompanha o nome novo.
    salvarSessao(sessaoDoUsuario(atualizado));
  }

  return (
    <>
      <Resumo usuario={usuario} />
      {/* A chave recomeça o formulário quando o cadastro muda por fora dele. */}
      <FormDados key={usuario.id} usuario={usuario} aoSalvar={aoSalvar} />
      <FormSenha usuarioId={usuario.id} />
      <ZonaExcluir usuarioId={usuario.id} />
      <BotaoSair />
    </>
  );
}

/* --------------------------------------------------------------------------
   Resumo · quem está logado
   -------------------------------------------------------------------------- */
function Resumo({ usuario }: { usuario: Usuario }) {
  const criada = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    new Date(usuario.criadoEm),
  );

  return (
    <section className="conta-resumo glass glass-pad">
      <span className="avatar">{usuario.iniciais}</span>
      <div>
        <strong>{usuario.nome}</strong>
        <span>{usuario.email}</span>
        <span>Conta criada em {criada}</span>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Campo · rótulo, entrada e erro ou dica, no mesmo desenho do cadastro
   -------------------------------------------------------------------------- */
function Campo({
  id,
  label,
  erro,
  dica,
  children,
}: {
  id: string;
  label: string;
  erro?: string;
  dica?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {erro ? (
        <span className="field-error" id={`erro-${id}`}>
          <span aria-hidden="true">✕</span> {erro}
        </span>
      ) : dica ? (
        <span className="field-hint" id={`dica-${id}`}>
          {dica}
        </span>
      ) : null}
    </div>
  );
}

/** aria-invalid e aria-describedby de um campo, a partir do erro e da dica. */
function aria(id: string, erro?: string, dica?: string) {
  return {
    "aria-invalid": Boolean(erro),
    "aria-describedby": erro ? `erro-${id}` : dica ? `dica-${id}` : undefined,
  };
}

/* --------------------------------------------------------------------------
   Dados pessoais
   -------------------------------------------------------------------------- */
function dadosDe(usuario: Usuario): DadosPessoais {
  return {
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone ?? "",
    nascimento: usuario.nascimento ?? "",
    cidade: usuario.cidade ?? "",
    bio: usuario.bio ?? "",
  };
}

type ErrosDados = Partial<Record<keyof DadosPessoais, string>>;

function validarDados(campos: DadosPessoais): ErrosDados {
  const erros: ErrosDados = {};
  if (campos.nome.trim().length < 2) erros.nome = "Digite seu nome.";
  if (!emailValido(campos.email)) erros.email = "Digite um e-mail válido.";
  if (!telefoneValido(campos.telefone)) erros.telefone = "Use DDD + número, como (11) 91234-5678.";
  if (!nascimentoValido(campos.nascimento)) erros.nascimento = "Confira a data.";
  if (campos.bio.length > MAX_BIO) erros.bio = `No máximo ${MAX_BIO} caracteres.`;
  return erros;
}

function FormDados({
  usuario,
  aoSalvar,
}: {
  usuario: Usuario;
  aoSalvar: (usuario: Usuario) => void;
}) {
  const salvos = dadosDe(usuario);
  const [campos, setCampos] = useState<DadosPessoais>(salvos);
  const [erros, setErros] = useState<ErrosDados>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const mudou = (Object.keys(campos) as (keyof DadosPessoais)[]).some(
    (campo) => campos[campo] !== salvos[campo],
  );
  const hoje = dataLocal();

  function alterar(campo: keyof DadosPessoais, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual));
    setErroApi(null);
    setSalvo(false);
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const novos = validarDados(campos);
    setErros(novos);
    const primeiro = Object.keys(novos)[0];
    if (primeiro) {
      evento.currentTarget.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
      return;
    }

    setEnviando(true);
    try {
      const atualizado = await atualizarUsuario(usuario.id, campos);
      aoSalvar(atualizado);
      setCampos(dadosDe(atualizado));
      setSalvo(true);
    } catch (erro) {
      setErroApi(mensagemDe(erro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="conta-secao glass glass-pad">
      <SectionTitle eyebrow="Seu cadastro" title="Dados pessoais" />

      {erroApi ? (
        <div className="form-alert" role="alert">
          <span aria-hidden="true">⚠</span>
          <span>
            <strong>Não foi possível salvar</strong>
            {erroApi}
          </span>
        </div>
      ) : null}

      <form onSubmit={enviar} noValidate>
        <Campo id="nome" label="Nome" erro={erros.nome}>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            value={campos.nome}
            onChange={(e) => alterar("nome", e.target.value)}
            {...aria("nome", erros.nome)}
          />
        </Campo>

        <Campo id="email" label="E-mail" erro={erros.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={campos.email}
            onChange={(e) => alterar("email", e.target.value)}
            {...aria("email", erros.email)}
          />
        </Campo>

        <div className="campos-duplos">
          <Campo id="telefone" label="Telefone" erro={erros.telefone} dica="Opcional">
            <input
              id="telefone"
              name="telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(11) 91234-5678"
              value={campos.telefone}
              onChange={(e) => alterar("telefone", e.target.value)}
              // A máscara entra ao sair do campo: aplicada a cada tecla, ela
              // brigava com o apagar e o cursor pulava.
              onBlur={(e) => alterar("telefone", formatarTelefone(e.target.value))}
              {...aria("telefone", erros.telefone, "Opcional")}
            />
          </Campo>

          <Campo id="nascimento" label="Nascimento" erro={erros.nascimento} dica="Opcional">
            <input
              id="nascimento"
              name="nascimento"
              type="date"
              max={hoje}
              autoComplete="bday"
              value={campos.nascimento}
              onChange={(e) => alterar("nascimento", e.target.value)}
              {...aria("nascimento", erros.nascimento, "Opcional")}
            />
          </Campo>
        </div>

        <Campo id="cidade" label="Cidade" erro={erros.cidade} dica="Opcional">
          <input
            id="cidade"
            name="cidade"
            type="text"
            autoComplete="address-level2"
            placeholder="São Paulo, SP"
            value={campos.cidade}
            onChange={(e) => alterar("cidade", e.target.value)}
            {...aria("cidade", erros.cidade, "Opcional")}
          />
        </Campo>

        <Campo
          id="bio"
          label="Sobre você"
          erro={erros.bio}
          dica={`${campos.bio.length} de ${MAX_BIO} caracteres`}
        >
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={campos.bio}
            onChange={(e) => alterar("bio", e.target.value)}
            {...aria("bio", erros.bio, `${campos.bio.length} de ${MAX_BIO} caracteres`)}
          />
        </Campo>

        <div className="form-acoes">
          {salvo && !mudou ? (
            <p className="form-sucesso" role="status">
              Alterações salvas
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!mudou || enviando}
            aria-busy={enviando}
          >
            {enviando ? <span className="btn-spinner" aria-hidden="true" /> : null}
            {enviando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Senha
   -------------------------------------------------------------------------- */
type CamposSenha = { atual: string; nova: string; confirmacao: string };
const SENHA_VAZIA: CamposSenha = { atual: "", nova: "", confirmacao: "" };

function FormSenha({ usuarioId }: { usuarioId: number }) {
  const [campos, setCampos] = useState<CamposSenha>(SENHA_VAZIA);
  const [erros, setErros] = useState<Partial<CamposSenha>>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [trocada, setTrocada] = useState(false);

  function alterar(campo: keyof CamposSenha, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual));
    setErroApi(null);
    setTrocada(false);
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const novos: Partial<CamposSenha> = {};
    if (!campos.atual) novos.atual = "Digite a senha atual.";
    if (campos.nova.length < SENHA_MINIMA) {
      novos.nova = `A nova senha precisa de pelo menos ${SENHA_MINIMA} caracteres.`;
    } else if (campos.nova === campos.atual) {
      novos.nova = "A nova senha precisa ser diferente da atual.";
    }
    if (campos.confirmacao !== campos.nova) novos.confirmacao = "As senhas não são iguais.";
    setErros(novos);
    const primeiro = Object.keys(novos)[0];
    if (primeiro) {
      evento.currentTarget.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
      return;
    }

    setEnviando(true);
    try {
      await trocarSenha(usuarioId, campos.atual, campos.nova);
      setCampos(SENHA_VAZIA);
      setTrocada(true);
    } catch (erro) {
      setErroApi(mensagemDe(erro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="conta-secao glass glass-pad">
      <SectionTitle eyebrow="Segurança" title="Senha" />

      {erroApi ? (
        <div className="form-alert" role="alert">
          <span aria-hidden="true">⚠</span>
          <span>
            <strong>Não foi possível trocar a senha</strong>
            {erroApi}
          </span>
        </div>
      ) : null}

      <form onSubmit={enviar} noValidate>
        <Campo id="senha-atual" label="Senha atual" erro={erros.atual}>
          <input
            id="senha-atual"
            name="atual"
            type="password"
            autoComplete="current-password"
            value={campos.atual}
            onChange={(e) => alterar("atual", e.target.value)}
            {...aria("senha-atual", erros.atual)}
          />
        </Campo>

        <div className="campos-duplos">
          <Campo id="senha-nova" label="Nova senha" erro={erros.nova}>
            <input
              id="senha-nova"
              name="nova"
              type="password"
              autoComplete="new-password"
              value={campos.nova}
              onChange={(e) => alterar("nova", e.target.value)}
              {...aria("senha-nova", erros.nova)}
            />
          </Campo>

          <Campo id="senha-confirmacao" label="Confirmar" erro={erros.confirmacao}>
            <input
              id="senha-confirmacao"
              name="confirmacao"
              type="password"
              autoComplete="new-password"
              value={campos.confirmacao}
              onChange={(e) => alterar("confirmacao", e.target.value)}
              {...aria("senha-confirmacao", erros.confirmacao)}
            />
          </Campo>
        </div>

        <div className="form-acoes">
          {trocada ? (
            <p className="form-sucesso" role="status">
              Senha trocada
            </p>
          ) : null}
          <button type="submit" className="btn btn-ghost" disabled={enviando} aria-busy={enviando}>
            {enviando ? "Trocando..." : "Trocar senha"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Excluir conta · em dois passos, e pedindo a senha
   -------------------------------------------------------------------------- */
function ZonaExcluir({ usuarioId }: { usuarioId: number }) {
  const router = useRouter();
  const [aberta, setAberta] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function excluir(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!senha) {
      setErro("Digite a sua senha para confirmar.");
      return;
    }

    setEnviando(true);
    try {
      await excluirUsuario(usuarioId, senha);
      encerrarSessao();
      router.push("/");
    } catch (falha) {
      setErro(mensagemDe(falha));
      setEnviando(false);
    }
  }

  return (
    <section className="conta-secao zona-perigo glass glass-pad">
      <SectionTitle eyebrow="Zona de perigo" title="Excluir conta" />
      <p className="muted-copy">
        Apaga o seu cadastro para sempre. Não dá para desfazer.
      </p>

      {aberta ? (
        <form onSubmit={excluir} noValidate>
          <Campo id="senha-excluir" label="Sua senha, para confirmar" erro={erro ?? undefined}>
            <input
              id="senha-excluir"
              name="senha"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro(null);
              }}
              {...aria("senha-excluir", erro ?? undefined)}
            />
          </Campo>
          <div className="form-acoes">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setAberta(false);
                setSenha("");
                setErro(null);
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-perigo"
              disabled={enviando}
              aria-busy={enviando}
            >
              {enviando ? "Excluindo..." : "Excluir para sempre"}
            </button>
          </div>
        </form>
      ) : (
        <div className="form-acoes">
          <button type="button" className="btn btn-perigo" onClick={() => setAberta(true)}>
            Excluir minha conta
          </button>
        </div>
      )}
    </section>
  );
}
