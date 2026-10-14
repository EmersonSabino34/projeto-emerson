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
};

export type NovoUsuario = Omit<Usuario, "id">;

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
