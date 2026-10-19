import {
  MAX_CARACTERES,
  VOZ_PADRAO,
  VozIndisponivel,
  sintetizar,
  textoPermitido,
  vozConfigurada,
  vozesServidor,
} from "@/lib/vozServidor";

/**
 * API de voz do VYRA: texto entra, voz sai.
 *
 *   GET  /api/voz
 *        → 200 { configurada: boolean, vozes: [{ id, nome, descricao }] }
 *
 *   POST /api/voz   Content-Type: application/json
 *        { "texto": "Eu abro espaço para um amor novo e leve.", "voz": "francisca" }
 *        → 200 audio/mpeg     o áudio da frase
 *        → 400 / 413 / 403    texto vazio, longo demais, voz desconhecida ou
 *                             texto que não é das jornadas
 *        → 501                voz do servidor não configurada (sem chave)
 *        → 502                o provedor de voz falhou
 *
 * Os erros vêm em JSON: { "erro": "mensagem pronta para mostrar" }.
 * O provedor, o cache e as regras ficam em lib/vozServidor.ts.
 */

function erro(status: number, mensagem: string) {
  return Response.json({ erro: mensagem }, { status });
}

export async function GET() {
  return Response.json({
    configurada: vozConfigurada(),
    vozes: vozesServidor.map(({ id, nome, descricao }) => ({ id, nome, descricao })),
  });
}

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro(400, 'Envie JSON no formato { "texto": "...", "voz": "francisca" }.');
  }

  const { texto, voz = VOZ_PADRAO } = (corpo ?? {}) as { texto?: unknown; voz?: unknown };

  if (typeof texto !== "string" || texto.trim() === "") {
    return erro(400, 'O campo "texto" é obrigatório.');
  }
  if (texto.length > MAX_CARACTERES) {
    return erro(413, `O texto passa de ${MAX_CARACTERES} caracteres.`);
  }

  const escolhida = vozesServidor.find((item) => item.id === voz);
  if (!escolhida) {
    return erro(400, `Voz desconhecida. Use: ${vozesServidor.map((item) => item.id).join(", ")}.`);
  }

  if (!textoPermitido(texto)) {
    return erro(403, "Este texto não faz parte das jornadas.");
  }

  try {
    const { audio, tipo, doCache } = await sintetizar(texto, escolhida);
    return new Response(audio, {
      headers: {
        "Content-Type": tipo,
        "Content-Length": String(audio.byteLength),
        // Para depurar o custo: "hit" não gastou nada no provedor.
        "X-Voz-Cache": doCache ? "hit" : "miss",
      },
    });
  } catch (falha) {
    if (falha instanceof VozIndisponivel) {
      return erro(501, "A voz do servidor não está configurada (AZURE_SPEECH_KEY).");
    }
    return erro(502, "O serviço de voz não respondeu. Tente de novo.");
  }
}
