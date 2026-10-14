import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

/**
 * Fraunces para display (serifada variável, com um pouco de personalidade) e
 * Inter para interface. Antes o projeto caía em Georgia e Arial, que mudam de
 * métrica em cada sistema operacional. next/font hospeda as duas localmente,
 * então não há requisição ao Google nem salto de layout ao carregar.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "VYRA · Mente · Plano · Vibra · Realiza",
    template: "%s · VYRA",
  },
  description:
    "Visualize, planeje e realize. O VYRA transforma sonhos em objetivos, " +
    "planos de ação e murais que você vê todos os dias.",
  applicationName: "VYRA",
};

/** Pinta a barra do navegador na mesma cor do fundo, em cada tipo. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#080614" },
  ],
};

/**
 * Roda antes do primeiro paint para evitar o flash de dia em quem escolheu
 * noite. Só estampa data-theme quando existe escolha explícita — "auto" e a
 * ausência de escolha deixam o CSS resolver pelo prefers-color-scheme, e o
 * app continua acompanhando o aparelho mesmo se ele mudar depois.
 */
const themeInit = `(function(){try{var t=localStorage.getItem("vyra-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior: o base.css deixa a rolagem suave para âncoras na
    // mesma página. Com o atributo, o Next 16 desliga essa suavidade durante a
    // troca de rota, e a página nova abre no topo na hora, sem deslizar.
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      {/* O shell fica em cada route group: (site) é público e não tem
          navegação do app; (app) monta a barra/trilha do NavRail. */}
      <body>{children}</body>
    </html>
  );
}
