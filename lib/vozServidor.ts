import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { modulos } from "@/lib/jornadas";
import { diasDaJornada, duracoes, roteiroDoDia } from "@/lib/jornadas/roteiro";

/**
 * A voz do servidor: texto entra, áudio sai. Usada por app/api/voz.
 *
 * Provedor: Azure AI Speech, pela API REST (sem SDK). Escolhido porque tem
 * vozes pt-BR neurais boas, uma delas com estilo "calm" (feito para
 * meditação), aceita SSML para ritmo e pausa, e dá 500 mil caracteres por mês
 * no plano gratuito. Os textos das jornadas somam ~43 mil caracteres únicos
 * por voz, e cada frase é gerada uma vez só (ver o cache abaixo).
 *
 * Configuração (.env.local, nunca no git):
 *   AZURE_SPEECH_KEY       chave do recurso Speech no portal do Azure
 *   AZURE_SPEECH_REGION    região do recurso, ex.: brazilsouth
 *   AZURE_SPEECH_ENDPOINT  opcional: URL completa, no lugar da região
 *   VOZ_CACHE_DIR          opcional: onde guardar os áudios (padrão .cache/voz)
 *
 * Só roda no servidor: importa módulos do Node (fs, crypto) e lê a chave.
 */

export type VozServidor = {
  id: string;
  nome: string;
  descricao: string;
  /** Nome da voz no Azure. */
  azure: string;
  /** Estilo de fala do Azure, para as vozes que têm. */
  estilo?: string;
};

/** As quatro vozes oferecidas no reprodutor das jornadas. */
export const vozesServidor: VozServidor[] = [
  {
    id: "francisca",
    nome: "Francisca",
    descricao: "Feminina, estilo calmo",
    azure: "pt-BR-FranciscaNeural",
    estilo: "calm",
  },
  { id: "thalita", nome: "Thalita", descricao: "Feminina", azure: "pt-BR-ThalitaNeural" },
  { id: "antonio", nome: "Antonio", descricao: "Masculina", azure: "pt-BR-AntonioNeural" },
  { id: "fabio", nome: "Fabio", descricao: "Masculina", azure: "pt-BR-FabioNeural" },
];

export const VOZ_PADRAO = vozesServidor[0].id;

/** Uma frase do roteiro tem até ~300 caracteres; isto sobra com folga. */
export const MAX_CARACTERES = 1000;

/** A voz não está configurada (sem chave): a tela usa a voz do aparelho. */
export class VozIndisponivel extends Error {}

/** O Azure respondeu com erro ou não respondeu. */
export class FalhaNaVoz extends Error {
  constructor(readonly status?: number) {
    super(`O serviço de voz respondeu ${status ?? "sem resposta"}.`);
  }
}

function configuracao() {
  const chave = process.env.AZURE_SPEECH_KEY;
  const regiao = process.env.AZURE_SPEECH_REGION;
  const endpoint =
    process.env.AZURE_SPEECH_ENDPOINT ??
    (regiao ? `https://${regiao}.tts.speech.microsoft.com/cognitiveservices/v1` : undefined);
  return chave && endpoint ? { chave, endpoint } : null;
}

export function vozConfigurada() {
  return configuracao() !== null;
}

/* ==========================================================================
   Só textos das jornadas
   --------------------------------------------------------------------------
   A rota é pública e cada caractere novo custa. Aceitar qualquer texto
   deixaria qualquer pessoa usar a nossa chave como serviço de voz grátis.
   Aqui ela só lê o que o próprio app escreveu: as falas dos roteiros, nas
   três durações. Para ler outros textos (frases, mural), acrescente-os aqui
   ou exija sessão quando a autenticação real existir.
   ========================================================================== */

let permitidos: Set<string> | null = null;

export function textoPermitido(texto: string) {
  permitidos ??= new Set(
    modulos.flatMap((modulo) =>
      modulo.dias.flatMap((dia) =>
        duracoes.flatMap(({ total }) => {
          const posicao = diasDaJornada(total).indexOf(dia.dia) + 1;
          return posicao ? roteiroDoDia(dia, posicao, total).map((fala) => fala.texto) : [];
        }),
      ),
    ),
  );
  // Fora de uma jornada o dia aparece pela posição no arco de 31, e essa fala
  // já está no conjunto acima (duração 31).
  return permitidos.has(texto);
}

/* ==========================================================================
   SSML · ritmo de meditação e o estilo calmo, quando a voz tem
   ========================================================================== */

/** Um pouco mais devagar que a fala normal, como a voz do aparelho. */
const RITMO = "-12%";

function escaparXml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function ssml(texto: string, voz: VozServidor) {
  const corpo = `<prosody rate="${RITMO}">${escaparXml(texto)}</prosody>`;
  const conteudo = voz.estilo
    ? `<mstts:express-as style="${voz.estilo}">${corpo}</mstts:express-as>`
    : corpo;
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" ` +
    `xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="pt-BR">` +
    `<voice name="${voz.azure}">${conteudo}</voice></speak>`
  );
}

/* ==========================================================================
   Cache em disco · cada frase é gerada uma vez por voz
   ========================================================================== */

/** Muda quando ritmo, estilo ou formato mudarem: invalida o que foi gerado. */
const VERSAO_DO_AUDIO = "1";

function pastaDoCache() {
  return process.env.VOZ_CACHE_DIR ?? join(process.cwd(), ".cache", "voz");
}

function arquivoDoCache(texto: string, voz: VozServidor) {
  const chave = createHash("sha256")
    .update(`${VERSAO_DO_AUDIO}|${voz.azure}|${voz.estilo ?? ""}|${RITMO}|${texto}`)
    .digest("hex");
  return join(pastaDoCache(), `${chave}.audio`);
}

/** O Azure devolve MP3; o tipo vem dos primeiros bytes, para o cache não precisar guardá-lo. */
function tipoDoAudio(audio: Uint8Array) {
  const inicio = String.fromCharCode(...audio.subarray(0, 4));
  return inicio === "RIFF" ? "audio/wav" : "audio/mpeg";
}

/**
 * O áudio de uma frase. Vem do cache quando já foi gerado, mesmo que a chave
 * tenha sido removida depois: o que já foi pago continua tocando.
 */
export async function sintetizar(texto: string, voz: VozServidor) {
  const arquivo = arquivoDoCache(texto, voz);

  try {
    const audio = new Uint8Array(await readFile(arquivo));
    return { audio, tipo: tipoDoAudio(audio), doCache: true };
  } catch {
    // ainda não gerado
  }

  const config = configuracao();
  if (!config) throw new VozIndisponivel();

  let resposta: Response;
  try {
    resposta = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": config.chave,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "vyra",
      },
      body: ssml(texto, voz),
      cache: "no-store",
    });
  } catch {
    throw new FalhaNaVoz();
  }
  if (!resposta.ok) throw new FalhaNaVoz(resposta.status);

  const audio = new Uint8Array(await resposta.arrayBuffer());
  try {
    await mkdir(pastaDoCache(), { recursive: true });
    await writeFile(arquivo, audio);
  } catch {
    // disco somente leitura (alguns hosts): toca mesmo assim, só não guarda
  }
  return { audio, tipo: tipoDoAudio(audio), doCache: false };
}
