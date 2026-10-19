/**
 * Cliente da API mock (json-server, porta 3333).
 *
 * Quando o banco de dados real entrar, só este arquivo e a URL base mudam —
 * as telas consomem as funções daqui, não `fetch` solto.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  /** ATENÇÃO: texto puro. Vale só para o protótipo — ver nota no plano. */
  senha: string;
  iniciais: string;
  bio: string;
  criadoEm: string;
  /* Opcionais: o cadastro pede só nome, e-mail e senha; o resto a pessoa
     completa depois, no painel da conta (/conta). */
  telefone?: string;
  /** "AAAA-MM-DD". */
  nascimento?: string;
  cidade?: string;
};

export type NovoUsuario = Omit<Usuario, "id">;

/** O que o painel da conta deixa editar. Senha tem fluxo próprio. */
export type DadosPessoais = {
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  cidade: string;
  bio: string;
};

/** Erro com mensagem já pronta para exibir no formulário. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    // json-server fora do ar é o erro mais comum em dev, então a mensagem
    // diz exatamente o que fazer em vez de "Failed to fetch".
    throw new ApiError(
      "Não foi possível falar com a API. Confira se ela está rodando em " +
        `${API_URL} (use "npm run dev", que sobe a API junto).`,
    );
  }

  if (!response.ok) {
    throw new ApiError(`A API respondeu ${response.status}.`, response.status);
  }

  return (await response.json()) as T;
}

/** Gera "AS" a partir de "Ana Silva". */
export function iniciaisDoNome(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "??";
  const primeira = partes[0][0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1][0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  const encontrados = await request<Usuario[]>(
    `/usuarios?email=${encodeURIComponent(email.trim().toLowerCase())}`,
  );
  return encontrados[0] ?? null;
}

export async function criarUsuario(dados: {
  nome: string;
  email: string;
  senha: string;
}): Promise<Usuario> {
  const email = dados.email.trim().toLowerCase();

  // json-server não tem constraint de unicidade, então a checagem é nossa.
  if (await buscarUsuarioPorEmail(email)) {
    throw new ApiError("Esse e-mail já tem uma conta. Tente entrar.");
  }

  const novo: NovoUsuario = {
    nome: dados.nome.trim(),
    email,
    senha: dados.senha,
    iniciais: iniciaisDoNome(dados.nome),
    bio: "Construindo uma vida com intenção.",
    criadoEm: new Date().toISOString(),
  };

  return request<Usuario>("/usuarios", {
    method: "POST",
    body: JSON.stringify(novo),
  });
}

export async function autenticar(email: string, senha: string): Promise<Usuario> {
  const usuario = await buscarUsuarioPorEmail(email);

  // Mensagem idêntica para e-mail inexistente e senha errada, para não
  // revelar quais e-mails estão cadastrados.
  if (!usuario || usuario.senha !== senha) {
    throw new ApiError("E-mail ou senha incorretos.");
  }

  return usuario;
}

/* ==========================================================================
   Painel da conta · ler, editar e excluir o próprio cadastro
   --------------------------------------------------------------------------
   Junto com criarUsuario (cadastro) fecham o CRUD da pessoa.

   ⚠️ Protótipo: o json-server aceita PATCH e DELETE de qualquer id, sem
   saber quem pediu. Quem garante que a pessoa só mexe na própria conta é a
   tela, que usa o id da sessão. Com o banco real, essa checagem vai para o
   servidor (item 10 do plano).
   ========================================================================== */

export async function buscarUsuario(id: number): Promise<Usuario | null> {
  try {
    return await request<Usuario>(`/usuarios/${id}`);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

export async function atualizarUsuario(id: number, dados: DadosPessoais): Promise<Usuario> {
  const email = dados.email.trim().toLowerCase();

  // A mesma checagem de unicidade do cadastro, ignorando a própria conta.
  const dono = await buscarUsuarioPorEmail(email);
  if (dono && dono.id !== id) {
    throw new ApiError("Esse e-mail já é usado por outra conta.");
  }

  return request<Usuario>(`/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nome: dados.nome.trim(),
      email,
      // As iniciais acompanham o nome, senão o avatar ficaria com as antigas.
      iniciais: iniciaisDoNome(dados.nome),
      telefone: dados.telefone.trim(),
      nascimento: dados.nascimento,
      cidade: dados.cidade.trim(),
      bio: dados.bio.trim(),
    }),
  });
}

/** Confere a senha atual antes de trocar: a sessão sozinha não basta. */
export async function trocarSenha(id: number, atual: string, nova: string): Promise<void> {
  const usuario = await buscarUsuario(id);
  if (!usuario || usuario.senha !== atual) {
    throw new ApiError("A senha atual não confere.");
  }

  await request<Usuario>(`/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ senha: nova }),
  });
}

/** Excluir é para sempre, então também pede a senha. */
export async function excluirUsuario(id: number, senha: string): Promise<void> {
  const usuario = await buscarUsuario(id);
  if (!usuario || usuario.senha !== senha) {
    throw new ApiError("A senha não confere.");
  }

  await request<unknown>(`/usuarios/${id}`, { method: "DELETE" });
}
