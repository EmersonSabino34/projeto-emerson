/**
 * O cenário da tela — a paisagem do VYRA.
 *
 * Esta é a camada que faz o app parecer o que as telas de referência mostram:
 * uma FOTOGRAFIA ocupando o fundo inteiro, e a interface flutuando em vidro
 * por cima dela. Não é um cartão com foto dentro de uma tela lisa — é a tela
 * que é a paisagem.
 *
 * São quatro camadas, de baixo para cima:
 *
 *   1. foto     · a paisagem, ancorada embaixo (--scene, por data-ambience)
 *   2. véu      · sólido no topo, onde mora o texto, abrindo até a foto
 *                 aparecer embaixo — é ele que garante a leitura
 *   3. manchas  · o brilho de cor que tinge a cena (aurora, ouro do amanhecer)
 *   4. estrelas · só à noite (--star-opacity vale 0 no dia)
 *
 * Qual foto entra depende do TIPO ativo: de dia, nascer do sol e montanhas;
 * de noite, aurora boreal e céu estrelado. Quem decide é o CSS, por isso este
 * componente continua sendo Server Component e não pisca na troca de tema.
 *
 * Fica em position: fixed dentro da tela para poder ler o data-ambience
 * daquela tela — pseudo-elemento do <body> não enxerga o que um descendente
 * define.
 */
export default function Ambience() {
  return (
    <div className="ambience" aria-hidden="true">
      <span className="ambience-scene" />
      <span className="ambience-veil" />
      <span className="ambience-blob ambience-blob-1" />
      <span className="ambience-blob ambience-blob-2" />
      <span className="ambience-blob ambience-blob-3" />
      <span className="ambience-stars" />
    </div>
  );
}
