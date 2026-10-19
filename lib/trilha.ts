/**
 * A trilha das jornadas: música gerada no aparelho, afinada na frequência de
 * cada jornada (528 Hz no amor, 741 Hz na carreira...).
 *
 * Nada é baixado: os quatro timbres são sintetizados com a Web Audio API.
 * Isso garante que a frequência é exatamente a da jornada, em qualquer
 * aparelho, e que a trilha não termina nunca, por mais que a leitura dure.
 *
 * Todo timbre toca um tom puro exatamente na frequência, além do próprio
 * desenho do timbre (acorde, tigela, notas, mar).
 *
 * Só roda no navegador: quem importa é o reprodutor, que é cliente.
 */

export type TimbreId = "tigela" | "pad" | "piano" | "ondas";

export const timbres: { id: TimbreId; label: string }[] = [
  { id: "tigela", label: "Tigela tibetana" },
  { id: "pad", label: "Pad celestial" },
  { id: "piano", label: "Piano suave" },
  { id: "ondas", label: "Ondas do mar" },
];

/** Para cada timbre: liga o som em `saida` e devolve a função que o desliga. */
type Gerador = (ctx: AudioContext, saida: AudioNode, f: number) => () => void;

function seno(ctx: AudioContext, freq: number, ganho: number, destino: AudioNode, tipo: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  osc.type = tipo;
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.value = ganho;
  osc.connect(g).connect(destino);
  osc.start();
  return osc;
}

/** Repete `tocar` em intervalos irregulares, só enquanto o áudio está rodando. */
function agendar(ctx: AudioContext, tocar: () => void, minimo: number, variacao: number) {
  let timer = 0;
  const proximo = () => {
    // Com o contexto suspenso (pausa), o relógio do áudio para; agendar notas
    // nele empilharia todas para tocar juntas na volta.
    if (ctx.state === "running") tocar();
    timer = window.setTimeout(proximo, minimo + Math.random() * variacao);
  };
  proximo();
  return () => window.clearTimeout(timer);
}

/**
 * Tigela tibetana: uma batida a cada 6 a 9 segundos, com os parciais
 * inarmônicos da tigela de verdade (1 · 2,71 · 5,15) e dois osciladores
 * levemente desafinados em cada um, que dão o "uá-uá" da tigela vibrando.
 */
const tigela: Gerador = (ctx, saida, f) => {
  const zumbido = [seno(ctx, f, 0.035, saida), seno(ctx, f / 2, 0.03, saida)];

  const parar = agendar(
    ctx,
    () => {
      const t = ctx.currentTime + 0.05;
      for (const [razao, amp] of [[1, 0.22], [2.71, 0.07], [5.15, 0.025]]) {
        for (const desvio of [0, 1.4]) {
          const osc = ctx.createOscillator();
          osc.frequency.value = f * razao + desvio;
          const g = ctx.createGain();
          const duracao = 9 / Math.sqrt(razao);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(amp, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
          osc.connect(g).connect(saida);
          osc.start(t);
          osc.stop(t + duracao + 0.1);
        }
      }
    },
    6000,
    3000,
  );

  return () => {
    parar();
    zumbido.forEach((osc) => osc.stop());
  };
};

/**
 * Pad celestial: o acorde aberto da frequência (oitava abaixo, quinta e a
 * própria frequência), cada nota em dois osciladores desafinados, passando
 * por um filtro que abre e fecha devagar, como uma respiração.
 */
const pad: Gerador = (ctx, saida, f) => {
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 1100;
  filtro.Q.value = 0.6;
  filtro.connect(saida);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const profundidade = ctx.createGain();
  profundidade.gain.value = 450;
  lfo.connect(profundidade).connect(filtro.frequency);
  lfo.start();

  const oscs = [lfo, seno(ctx, f, 0.025, saida)];
  for (const [freq, amp] of [[f / 2, 0.045], [(f / 2) * 1.5, 0.03], [f, 0.023]]) {
    for (const cents of [-5, 5]) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = cents;
      const g = ctx.createGain();
      g.gain.value = amp;
      osc.connect(g).connect(filtro);
      osc.start();
      oscs.push(osc);
    }
  }

  return () => oscs.forEach((osc) => osc.stop());
};

/**
 * Piano suave: notas soltas de uma escala pentatônica cuja nota mais alta é a
 * frequência da jornada, com um eco curto. A frequência e a sua oitava abaixo
 * aparecem mais vezes que as outras notas: é o centro da melodia.
 */
const piano: Gerador = (ctx, saida, f) => {
  const raiz = f / 2;
  // Pesos repetidos: 1 e 2 (a raiz e a frequência) saem com mais frequência.
  const graus = [1, 1, 9 / 8, 5 / 4, 3 / 2, 3 / 2, 5 / 3, 2, 2, 2];

  const eco = ctx.createDelay();
  eco.delayTime.value = 0.42;
  const retorno = ctx.createGain();
  retorno.gain.value = 0.3;
  const ecoSaida = ctx.createGain();
  ecoSaida.gain.value = 0.35;
  eco.connect(retorno).connect(eco);
  eco.connect(ecoSaida).connect(saida);

  const drone = seno(ctx, raiz, 0.04, saida);
  const puro = seno(ctx, f, 0.035, saida);

  function nota(freq: number, t: number, forca: number) {
    for (const [harmonico, amp] of [[1, 1], [2, 0.22], [3, 0.06]]) {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq * harmonico;
      const g = ctx.createGain();
      const duracao = 3.4 / harmonico;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(forca * amp, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
      osc.connect(g);
      g.connect(saida);
      g.connect(eco);
      osc.start(t);
      osc.stop(t + duracao + 0.1);
    }
  }

  const parar = agendar(
    ctx,
    () => {
      const t = ctx.currentTime + 0.05;
      nota(raiz * graus[Math.floor(Math.random() * graus.length)], t, 0.2);
      if (Math.random() < 0.3) {
        nota(raiz * graus[Math.floor(Math.random() * graus.length)], t + 0.5, 0.12);
      }
    },
    1400,
    1600,
  );

  return () => {
    parar();
    drone.stop();
    puro.stop();
  };
};

/**
 * Ondas do mar: ruído marrom (mais grave que o branco, soa como água) num
 * filtro baixo, com o volume subindo e descendo a cada ~11 s, como ondas. Por
 * baixo, a frequência da jornada como um tom contínuo.
 */
const ondas: Gerador = (ctx, saida, f) => {
  const segundos = 6;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * segundos, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < dados.length; i++) {
    ultimo = (ultimo + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    dados[i] = ultimo * 3.5;
  }
  // Emenda do loop: o fim desliza até o começo, sem estalo a cada volta.
  const emenda = Math.floor(ctx.sampleRate * 0.25);
  for (let i = 0; i < emenda; i++) {
    const k = dados.length - emenda + i;
    dados[k] = dados[k] * (1 - i / emenda) + dados[0] * (i / emenda);
  }

  const fonte = ctx.createBufferSource();
  fonte.buffer = buffer;
  fonte.loop = true;

  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 650;

  // Os volumes dos quatro timbres foram medidos e igualados (~0,05 RMS):
  // trocar de timbre no meio da leitura não pode dar um salto de volume.
  const onda = ctx.createGain();
  onda.gain.value = 0.16;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.09;
  const amplitude = ctx.createGain();
  amplitude.gain.value = 0.13;
  lfo.connect(amplitude).connect(onda.gain);

  fonte.connect(filtro).connect(onda).connect(saida);
  fonte.start();
  lfo.start();

  const tons = [seno(ctx, f, 0.03, saida), seno(ctx, f / 2, 0.025, saida)];

  return () => {
    fonte.stop();
    lfo.stop();
    tons.forEach((osc) => osc.stop());
  };
};

const geradores: Record<TimbreId, Gerador> = { tigela, pad, piano, ondas };

/**
 * O reprodutor da trilha. Um por tela de jornada.
 *
 * O AudioContext só nasce no primeiro `tocar`, que precisa vir de um toque da
 * pessoa: o navegador bloqueia áudio que começa sozinho.
 */
export class Trilha {
  private ctx: AudioContext | null = null;
  private mestre: GainNode | null = null;
  private atual: { bus: GainNode; parar: () => void; timbre: TimbreId; f: number } | null = null;
  private volume = 0.5;
  private suspensao = 0;

  private contexto() {
    if (!this.ctx) {
      const Contexto =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Contexto();

      // Corta o brilho agudo das frequências mais altas (963 Hz e harmônicos)
      // e segura picos quando duas batidas se somam.
      const filtro = ctx.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.value = 4200;
      const compressor = ctx.createDynamicsCompressor();

      this.mestre = ctx.createGain();
      this.mestre.gain.value = 0;
      this.mestre.connect(filtro).connect(compressor).connect(ctx.destination);
      this.ctx = ctx;
    }
    return this.ctx;
  }

  async tocar(f: number, timbre: TimbreId) {
    const ctx = this.contexto();
    window.clearTimeout(this.suspensao);
    if (ctx.state !== "running") await ctx.resume();
    if (!this.atual || this.atual.timbre !== timbre || this.atual.f !== f) this.trocar(f, timbre);
    this.mestre!.gain.cancelScheduledValues(ctx.currentTime);
    this.mestre!.gain.setTargetAtTime(this.volume, ctx.currentTime, 0.7);
  }

  /** Troca de timbre em crossfade: o novo entra enquanto o antigo sai. */
  private trocar(f: number, timbre: TimbreId) {
    const ctx = this.ctx!;
    const antigo = this.atual;
    if (antigo) {
      antigo.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      window.setTimeout(() => {
        antigo.parar();
        antigo.bus.disconnect();
      }, 3000);
    }

    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.connect(this.mestre!);
    bus.gain.setTargetAtTime(1, ctx.currentTime, 0.8);
    this.atual = { bus, parar: geradores[timbre](ctx, bus, f), timbre, f };
  }

  /** Abaixa devagar e suspende o áudio, para não gastar bateria na pausa. */
  pausar() {
    const ctx = this.ctx;
    if (!ctx || !this.mestre) return;
    this.mestre.gain.cancelScheduledValues(ctx.currentTime);
    this.mestre.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    this.suspensao = window.setTimeout(() => void ctx.suspend(), 2000);
  }

  /** 0 a 1. */
  definirVolume(volume: number) {
    this.volume = volume;
    const ctx = this.ctx;
    if (ctx && this.mestre && ctx.state === "running") {
      this.mestre.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
    }
  }

  encerrar() {
    window.clearTimeout(this.suspensao);
    this.atual?.parar();
    this.atual = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}
