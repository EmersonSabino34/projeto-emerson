# Pastas, correções e performance — 24 de setembro

Revisão do projeto inteiro: rotas, componentes, `lib/`, CSS, configuração e o
repositório em `C:/dev`. Aqui estão as correções já aplicadas e as que ainda
faltam.

Este arquivo também é o **prompt** para quem continuar o trabalho. As etapas
estão na ordem de execução, e cada uma traz status, arquivos e critério de pronto.
A visão geral, com percentuais e a comparação com concorrentes, está no
[manual.html](manual.html) (abra no navegador).

Legenda: ✅ concluído · 🟡 parcial · ⬜ não começado · 🔴 bloqueado (precisa da sua autorização)

---

## ⚠️ O `.git` de `C:/dev` continua sumido

Na sessão de 24/09, a pasta `C:/dev/.git` deixou de existir entre dois comandos
do agente. O `git rm` da Etapa 1 funcionou e, minutos depois, `git diff` e
`git rev-parse` responderam *"not a git repository"*, tanto em `C:/dev` quanto
na pasta do projeto. O agente não apagou nem moveu essa pasta: entre um comando
e outro, só rodou build, lint, typecheck, `curl` e edições de arquivo.

**Decisão de 24/09: seguir com backup.** Antes de mudar qualquer coisa, o agente
copia a pasta do app, sem `node_modules`, `.next` e `tsconfig.tsbuildinfo`, para
`C:\dev\projeto-emerson\backups\<data-hora>\`. O primeiro backup é
`backups\2026-09-24_1248` (105 arquivos), feito antes da segunda rodada.

- Para comparar ou desfazer uma mudança, use a cópia do backup.
- Os 8 arquivos legados removidos na Etapa 1 não estão no backup, porque saíram
  antes dele. Só voltam pelo remoto (`origin`, commit `3d16470`) ou de uma
  cópia da pasta `.git`, se ela foi movida.
- Se não foi você quem mexeu: procure o `.git` na Lixeira do Windows e veja se
  algum programa (IDE, sincronização, antivírus) o moveu. Restaure antes de
  qualquer commit.

---

## Prompt para o agente

> Copie a partir daqui para continuar numa sessão nova.

Você vai continuar a revisão do VYRA em `C:/dev/projeto-emerson/projeto-emerson`
(Next.js 16.3.4 com Turbopack, React 19.2). Regras:

0. **Confira se `git status` funciona.** Se não funcionar, faça um backup da
   pasta do app antes de mudar qualquer coisa, como decidido em 24/09 (ver o
   aviso acima).
1. **Leia o `AGENTS.md` antes de escrever código.** Este Next 16 tem mudanças
   que não estão no seu treino. Consulte `node_modules/next/dist/docs/` para
   cada API que for usar.
2. **Siga a ordem da tabela.** Uma etapa que depende de outra só começa quando
   a anterior estiver ✅.
3. **Não apague arquivos nem mexa no índice do git sem autorização explícita**
   de quem é dono do projeto.
4. **Depois de cada etapa**, rode `npx eslint .`, `npx tsc --noEmit` e
   `npx next build`. Para o que depende do navegador, rode
   `node --experimental-websocket ../ferramentas/verificar-navegador.mjs` com o
   `npm run dev` no ar (no Node 22 a flag não é necessária). Em seguida
   atualize neste arquivo: o status na tabela, a seção da etapa (o que mudou,
   onde e como foi verificado) e uma linha no [Histórico](#histórico).
5. **No visual, as imagens de referência mandam.** Quando o texto de um briefing
   e a tela de referência divergirem, siga a tela. Nada visual conta como
   concluído sem ser aberto no navegador.
6. Em 24/09 já havia um `next dev` rodando na porta 3000 (PID 21704). Use esse
   servidor, que recarrega sozinho, em vez de subir outro: o Next 16 recusa um
   segundo `next dev` na mesma pasta ("Another next dev server is already
   running").
7. **Os percentuais do `manual.html` saem do bloco de dados no fim dele.** Ao
   mudar o status de uma etapa ou de uma função, atualize esse bloco também.

---

## Status geral

| # | Etapa | Tipo | Status |
| --- | --- | --- | --- |
| 0 | Diagnóstico completo | — | ✅ |
| 1 | Remover as rotas legadas que quebram o build | Pastas | ✅ |
| 2 | Remover código morto (2 componentes + ~680 linhas de CSS) | Pastas · performance | ✅ |
| 3 | Reconectar o funil de onboarding | Correção | ✅ |
| 4 | Perfil com os mesmos números da Home | Correção | ✅ |
| 5 | 404 para id inválido + pré-renderização (sonho, categoria) | Correção · performance | ✅ |
| 6 | Contagem do plano de ação acompanhando as etapas | Correção | ✅ |
| 7 | Data e frase do dia sem congelar no build | Correção · performance | ✅ |
| 8 | Chaves repetidas na legenda do mural | Correção | ✅ |
| 9 | README e rodapé | Documentação | ✅ |
| 10 | Verificação completa (build, rotas, navegador) | Verificação | ✅ menos o cadastro de ponta a ponta |
| 11 | Tamanho das imagens | Performance | ⬜ precisa de você (medir no DevTools) |
| 12 | Utilitário `ring` do Tailwind no anel de progresso | Performance · visual | ⬜ precisa de você (confirmar no DevTools) |
| 13 | Títulos das páginas `"use client"` | UX · performance | ✅ |
| 14 | Editor do mural perde as edições na pré-visualização | Correção | ✅ |
| 15 | Repositório `C:/dev`: `projeto-financ` ainda rastreado | Pastas (repositório) | ⬜ precisa de você |
| 16 | Decisões de produto | Produto | ⬜ precisa de você |

A segunda rodada de 24/09 foi feita com backup, porque o `.git` segue sumido.
Nela saiu o código morto que faltava, as abas ganharam título e o editor do
mural passou a levar a edição para a pré-visualização. O app foi testado no
navegador: 14 de 14 checagens e nenhum aviso no console em 27 telas. O que
falta agora depende de você: medir no DevTools (11 e 12), o repositório (15) e
as decisões de produto (16).

---

## 0 · Diagnóstico — ✅

Tudo foi lido: as 37 páginas (30 ativas e 7 legadas), os 4 layouts, os 28
componentes, os 8 módulos de `lib/`, a configuração (`next`, `tsconfig`,
`eslint`, `postcss`, `package.json`) e o histórico do git. O CSS foi cruzado
classe a classe com o TSX por um script. `components.css`, `base.css` e
`ambience.css` foram lidos inteiros.

| Gravidade | Achado | Onde | Etapa |
| --- | --- | --- | --- |
| 🔴 Crítico | Build e dev quebrados: 7 páginas legadas repetem URLs dos route groups | raiz de `app/` | 1 |
| 🟠 Alto | Telas 5 a 9 do onboarding sem nenhum caminho de entrada | cadastro | 3 |
| 🟠 Alto | Frase do dia congelada no build e data no fuso do servidor | `/inicio` | 7 |
| 🟡 Médio | Perfil mostra 41% de progresso, a Home mostra 50% | `/perfil` | 4 |
| 🟡 Médio | Contagem "2 de 7" não acompanha as etapas marcadas | `/objetivos/[id]` | 6 |
| 🟡 Médio | Id ou slug inventado abre o primeiro item em vez de 404 | `/sonho`, `/categoria` | 5 |
| 🟡 Médio | Toda foto é pedida a 900 px, inclusive miniaturas | `lib/data.ts` | 11 |
| 🟡 Médio | ~670 linhas de CSS morto carregadas em todas as páginas | `components.css` | 2 |
| 🟢 Baixo | Chave repetida na legenda do mural | `Collage`, `WallpaperPreview` | 8 |
| 🟢 Baixo | README com estrutura e chave de tema antigas; rodapé com a marca antiga | `README.md`, `(site)/layout.tsx` | 9 |

### Medido em 24/09, antes dos ajustes

- `npx next build` **falhava** com 4 erros do tipo *"You cannot have two parallel
  pages that resolve to the same path"*, em `/categoria`, `/frases`, `/perfil` e
  `/sonho`.
- `next dev` (porta 3000) **respondia 500 em todas as 14 rotas testadas**,
  inclusive `/` e `/explorar`, com o mesmo erro, desde o merge de 11/09.
- `npx eslint .`: 0 erros e 4 avisos (`no-img-element`), todos em arquivos legados.
- `npx tsc --noEmit`: limpo.

---

## 1 · Remover as rotas legadas — ✅

**Problema.** O merge `795e989` (*Merge remote-tracking branch 'origin/main'*,
11/09) trouxe de volta, do commit `3d16470` (09/09), a versão do app de antes
dos route groups: 7 páginas soltas na raiz de `app/` e o `BottomNav`, que só
elas usam. Cinco dessas páginas resolviam para a mesma URL de uma página nova:

| Arquivo legado | URL | Conflitava com | Onde está hoje |
| --- | --- | --- | --- |
| `app/page.tsx` | `/` | `app/(site)/page.tsx` | landing |
| `app/categoria/[slug]/page.tsx` | `/categoria/:slug` | `app/(app)/categoria/[slug]/page.tsx` | mesma rota no grupo |
| `app/frases/page.tsx` | `/frases` | `app/(app)/frases/page.tsx` | mesma rota no grupo |
| `app/perfil/page.tsx` | `/perfil` | `app/(app)/perfil/page.tsx` | mesma rota no grupo |
| `app/sonho/[id]/page.tsx` | `/sonho/:id` | `app/(app)/sonho/[id]/page.tsx` | mesma rota no grupo |
| `app/categorias/page.tsx` | `/categorias` | — | `/explorar` (aba Templates) |
| `app/ia/page.tsx` | `/ia` | — | `/mural` (a landing já leva o "IA Designer" para lá) |
| `components/BottomNav.tsx` | — | — | `NavRail` |

Na primeira tentativa, o controle de permissões da sessão negou a exclusão. Ela
foi feita depois da sua autorização, na pasta `projeto-emerson/projeto-emerson`:

```bash
git rm -r app/page.tsx app/categorias app/categoria app/frases app/ia app/perfil app/sonho components/BottomNav.tsx
```

Os endereços antigos ganharam redirecionamento temporário (307) no
`next.config.ts`: `/categorias` → `/explorar` e `/ia` → `/mural`.

**Verificado:** build com 51 páginas, ESLint sem nenhum aviso (os 4 de antes
vinham desses arquivos), TypeScript limpo e o `next dev` de volta, com os
códigos da tabela da Etapa 10.

---

## 2 · Remover código morto — ✅

Feito em duas partes, com cerca de 680 linhas de CSS a menos. O
`components.css`, carregado em todas as páginas, caiu de 1.217 para 538 linhas.

**2a.** Blocos que ficaram mortos com a Etapa 1:

| Bloco | Classes |
| --- | --- |
| Superfície base | `.surface-card` |
| Hero | `.hero`, `.hero-*`, `.hero-orbit` |
| Banner de frases | `.quote-banner`, `.quote-mark` |
| Página de frases | `.quote-preview`, `.quote-preview-*`, `.preview-edit` |
| — | `.format-row` |
| Cartão de IA | `.ai-card`, `.ai-card-*`, `.ai-sparkle` |
| Página de IA | `.ai-intro`, `.style-*` |
| Cartão de estatística | `.stat-card`, `.stat-row` |

- `.page-lede`, que dividia seletor com `.ai-intro p`, virou uma regra própria
  com as mesmas propriedades, na seção "Abertura de página".
- `.chip-wrap`, `.chip` e `.chip-format` ficaram, agora na seção "Chips".

**2b, com a sua autorização.** Saíram `components/DreamCard.tsx` e
`components/CategoryCard.tsx`, que nenhum arquivo importava, e os blocos
"Cartão de sonho" (`.dream-*`) e "Categorias" (`.category-row`,
`.category-pill`, `.all-categories`, `.all-category`) do `components.css`. Sem
git, a remoção foi feita com `rm`; as cópias estão no backup
`2026-09-24_1248`.

Também:

- A keyframe `orbit-counter`, que ficou órfã, saiu de `motion.css`.
- Os tokens `--hero-*` de `tokens.css` ficaram, porque o `landing.css` ainda
  usa todos.
- `.progress-sm` ficou, porque faz parte da API do `ProgressBar` (prop `small`).
- Opcional, não feito: `IconGrid`, `IconQuote` e `IconSparkle`, em
  `components/icons.tsx`, não são usados.

**Verificado:** build com 51 páginas, ESLint sem avisos, TypeScript sem erros,
e as telas que usam as classes mantidas passaram no verificador da Etapa 10.

---

## 3 · Reconectar o funil de onboarding — ✅

**Problema.** As telas de entrada são numeradas de 1 a 9, e os `StepDots` contam
5 etapas: idioma é a 1, personalização a 3, planos a 4 e pagamento a 5. A 2 é o
cadastro. Só que o cadastro mandava direto para `/inicio`, e nada no app
apontava para `/personalizacao`. Personalização, planos, pagamento, pronto e
tutorial só abriam digitando a URL.

**Feito.** Depois de criar a conta, o fluxo segue para `/personalizacao`. O
código está em `components/FormularioCadastro.tsx`, que saiu da página na
Etapa 13. O login continua indo para `/inicio`.

O caminho agora é `/splash` → `/bem-vindo` → `/idioma` → `/cadastro` →
`/personalizacao` → `/planos` → `/pagamento` → `/pronto` → `/tutorial` →
`/inicio`.

**Não testado no navegador:** o cadastro de ponta a ponta gravaria uma conta de
teste no `db.json`. A mudança é uma linha (`router.push("/personalizacao")`).
Para testar, crie uma conta e apague-a depois.

## 4 · Perfil com os mesmos números da Home — ✅

**Problema.** O `/perfil` lia o modelo antigo (`dreams`) e mostrava 3 sonhos, 11
categorias e 41% de progresso. As 11 categorias eram o catálogo inteiro, igual
para todo mundo. Já a Home, que usa `goals`, mostra 4 objetivos e 50%.

**Feito.** `app/(app)/perfil/page.tsx` passou a usar `goals` e `goalProgress`: 4
objetivos, 4 áreas (as áreas em que há objetivo) e 50%. A página também ganhou
`metadata` (título "Perfil"). Saiu de `lib/data.ts` o `overallProgress`, que só
existia para aquele número.

**Verificado** no HTML servido: "4 objetivos · 4 áreas · 50%" e a aba "Perfil · VYRA".

## 5 · 404 para id inválido e pré-renderização — ✅

**Problema.** `/sonho/999` abria "Conhecer Paris" e `/categoria/qualquer-coisa`
abria "Lugares". O `/objetivos/[id]` já tinha corrigido esse mesmo erro. As duas
rotas também eram renderizadas sob demanda.

**Feito.** Em `app/(app)/sonho/[id]/page.tsx` e
`app/(app)/categoria/[slug]/page.tsx`:

- `notFound()` para id desconhecido;
- `generateStaticParams`, que gera no build as 3 páginas de sonho e as 11 de
  categoria;
- `generateMetadata`, com o título do item.

**Verificado:** `/sonho/999` e `/categoria/xyz` devolvem 404; `/sonho/1` e
`/categoria/lugares` devolvem 200, com o título do item na aba.

## 6 · Contagem do plano de ação — ✅

**Problema.** Em `/objetivos/[id]`, a contagem "2 de 7" aparece no cabeçalho de
Etapas e na coluna lateral, mas vinha pronta do servidor. Marcar uma etapa
mudava a lista e deixava as duas contagens paradas.

**Feito.** `components/Checklist.tsx` agora exporta `PlanoProvider`, que guarda
o estado, `EtapasContador` e a lista. A página envolve a `<main>` no provider e
usa o contador nos dois lugares. O resto da página continua sendo renderizado no
servidor, porque entra no provider como `children`.

**Verificado no navegador:** em `/objetivos/1`, marcar uma etapa muda as duas
contagens de "2 de 7" para "3 de 7".

## 7 · Data e frase do dia — ✅

**Problema.** A `/inicio` é pré-renderizada no build. Em produção, a data do
cabeçalho e a "frase do dia" ficavam congeladas no dia do deploy. Além disso, a
data era formatada no fuso do servidor: com o servidor em UTC, depois das 21h no
Brasil já aparecia o dia seguinte.

**Feito.**

- `components/DataDeHoje.tsx` (novo) formata a data no navegador, no fuso de
  quem está vendo. Segue o guia *Preventing flash before hydration* do Next 16
  (`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`):
  um script inline corrige o texto antes do primeiro paint, e
  `suppressHydrationWarning` evita o erro de hidratação.
- `app/(app)/inicio/page.tsx` ganhou `export const revalidate = 3600`. A página
  continua estática, mas é regenerada a cada hora, então a frase do dia vira no
  máximo uma hora depois da meia-noite UTC.
- "Objetivos ativos" conta só os que estão em andamento. Antes contava todos.

**Verificado no navegador:** o cabeçalho mostra "QUINTA-FEIRA, 24 DE SETEMBRO",
igual à data calculada no próprio navegador, sem aviso de hidratação.

## 8 · Chaves repetidas na legenda — ✅

`components/Collage.tsx` e `components/WallpaperPreview.tsx` usavam o texto de
cada linha da legenda como `key`. Como a legenda é editável no editor do mural,
duas linhas iguais ou duas em branco repetiam a chave. Agora a chave é a posição
da linha.

**Verificado no navegador:** a legenda "Linha A", linha vazia, "Linha A", linha
vazia, "Fim" não gera aviso de chave no console.

## 9 · README e rodapé — ✅

- `README.md`: a seção "Estrutura" foi reescrita com os três route groups e o
  caminho do onboarding, e ganhou o aviso para não criar `page.tsx` solto na
  raiz de `app/`. A chave do tema foi corrigida (`vyra-theme`, não
  `mds-theme`), a lista de camadas de CSS foi completada e há links para este
  arquivo e para o manual.
- `app/(site)/layout.tsx`: o rodapé assinava "Mural dos Sonhos", o nome antigo.
  Agora assina "VYRA".

---

## 10 · Verificação completa — ✅ menos o cadastro de ponta a ponta

**Build e rotas:** o build passa com 51 páginas; `/sonho/[id]` (3) e
`/categoria/[slug]` (11) saem pré-renderizadas (●) e `/inicio` sai estática com
revalidação de 1h. ESLint e `tsc` estão limpos. Os endereços respondem assim no
`next dev`:

| Rota | Resposta |
| --- | --- |
| `/`, `/login`, `/cadastro` | 200 |
| `/inicio`, `/explorar`, `/objetivos`, `/objetivos/1`, `/mural`, `/perfil` | 200 |
| `/sonho/1`, `/categoria/lugares` | 200 |
| `/sonho/999`, `/categoria/xyz`, `/objetivos/999` | 404 |
| `/categorias`, `/ia` | 307, para `/explorar` e `/mural` |

**No navegador:** o verificador `../ferramentas/verificar-navegador.mjs`
controla o Chrome em modo headless contra o `next dev` e confere 14 pontos.
Resultado: 14 de 14.

| Checagem | Resultado |
| --- | --- |
| Plano de ação | "2 de 7" vira "3 de 7" nas duas contagens ao marcar uma etapa |
| Data do cabeçalho | "QUINTA-FEIRA, 24 DE SETEMBRO", igual à data do navegador |
| Mural, ida | legenda com linhas repetidas e em branco, filtro P&B e giro 2 chegam na pré-visualização |
| Mural, volta | o editor reabre com a mesma legenda |
| Botão Trocar | sem `aria-pressed` |
| Tema | "Noite" continua depois de recarregar no `next dev` |
| Títulos | as 7 abas da Etapa 13 |
| Console | nenhum erro ou aviso em 27 telas |

- **Tema no dev:** o guia do Next avisa que, no dev, o Strict Mode pode apagar
  o `data-theme` que o script inline pôs no `<html>`. Aqui isso não aconteceu,
  então nenhum ajuste foi preciso.
- **Aviso corrigido:** na primeira execução, o único aviso do console foi do
  Next 16 sobre `scroll-behavior: smooth` no `<html>`. O `app/layout.tsx`
  ganhou `data-scroll-behavior="smooth"`, como manda o guia de upgrade da v16.
  A troca de página volta a abrir no topo na hora, e a rolagem suave continua
  valendo para âncoras.
- **Capturas conferidas:** a pré-visualização do mural (o filtro pega só as
  fotos; relógio e legenda ficam nítidos) e a `/inicio` no celular, com o tema
  noite.
- **Não testado:** o cadastro de ponta a ponta, para não gravar uma conta de
  teste no `db.json` (ver Etapa 3).
- **Não conferido:** o efeito do `@source not "../manual.html"` no CSS gerado
  (ver "Ajustes fora da lista"). Inspecionar o CSS gerado foi negado pelo
  controle de permissões nesta sessão.

---

## 11 · Tamanho das imagens — ⬜ precisa de você

**Problema.** Toda foto sai de `lib/data.ts` com `w=900` (constante `CROP`),
inclusive as células das colagens e as miniaturas das listas. O `/mural/novo`
monta 5 colagens (73 células, 20 fotos diferentes) e o `/mural` monta mais 25
células, todas baixando a foto de 900 px para exibi-la pequena. As miniaturas de
objetivos (`.goal-thumb`) usam a mesma URL da foto grande de `/objetivos/[id]`.

**Por que ficou para você.** Nesta sessão, o controle de permissões negou a
leitura das medidas nas folhas de CSS. Meça no DevTools (item 1 abaixo) e passe
os números, ou libere essa permissão, e o agente faz o resto.

**O que fazer.**

1. Meça no DevTools a largura real de `.collage-cell`, `.goal-thumb`, `.thumb`,
   `.place-card` e `.session-card` no maior layout (1320 px ou mais) e
   multiplique por 2, por causa das telas retina.
2. Em `lib/data.ts`, mude para `photoUrl(id, width = 900)` e faça cada uso pedir
   a largura medida. Por exemplo: colagens e miniaturas a partir do `photoBank`,
   e um campo `thumb` em `Goal`.
3. Mantenha `auto=format`, porque o CDN do Unsplash já entrega AVIF e WebP, e
   `q=85`, para não mudar o visual.

**Por que não `next/image` agora:** as fotos são `background-image` em uns dez
componentes, e o CDN do Unsplash já redimensiona e converte o formato. O
`next/image` exigiria `images.remotePatterns` e a reescrita do markup e do CSS
desses componentes. Fica para quando as fotos vierem de upload.

**Pronto quando:** na aba Network de `/mural/novo`, o total de bytes de imagem
cair sem perda visível na célula de destaque do editor. Estimativa: o peso
acompanha a área em pixels, então de 900 para 400 px a queda seria de cerca de
5×.

## 12 · Utilitário `ring` do Tailwind — ⬜ precisa de você

**Suspeita.** O `app/globals.css` importa o Tailwind inteiro
(`@import "tailwindcss"`), e nenhum componente usa utilitários do Tailwind desde
que o `BottomNav` saiu. O Tailwind v4 gera utilitários a partir de palavras que
encontra nos arquivos do projeto, e o `ProgressRing` usa `className="ring"`.
Acontece que `ring` também é um utilitário do Tailwind, que aplica um
`box-shadow` de 1 px na cor do texto. O `.ring` do projeto
(`app/styles/vyra.css`) não define `box-shadow`, então o do Tailwind passaria a
valer.

**Por que ficou para você.** Inspecionar o CSS gerado foi negado pelo controle
de permissões nesta sessão.

**Como confirmar.** Em `/inicio`, abra o DevTools, inspecione o anel de "Meu
progresso" e procure um `box-shadow` vindo de `@layer utilities`.

**Se confirmar**, escolha uma saída:

- trocar a classe para `progress-ring`, em `components/ProgressRing.tsx` e nas
  regras `.ring` e `.ring::after` de `vyra.css`; ou
- importar só o que o projeto usa, sem os utilitários (menos CSS):

  ```css
  @layer theme, base, components, utilities;
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/preflight.css" layer(base);
  ```

Antes de mudar, confira a tela de referência. Se o fio fino em volta do anel
estiver lá, ele fica.

## 13 · Títulos das páginas `"use client"` — ✅

**Problema.** Uma página marcada com `"use client"` não pode exportar
`metadata`, então a aba do navegador mostrava o título padrão.

**Feito.** Cada página voltou a ser Server Component, com `metadata`, e a parte
interativa foi para um componente cliente, como o `/pagamento` já fazia:

| Tela | Título da aba | Componente cliente |
| --- | --- | --- |
| `/login` | Entrar · VYRA | `FormularioLogin` |
| `/cadastro` | Criar conta · VYRA | `FormularioCadastro` |
| `/objetivos/novo` | Novo objetivo · VYRA | `FormularioObjetivo` |
| `/mural/novo` | Novo mural · VYRA | `EscolhaLayout` |
| `/idioma` | Idioma · VYRA | `EscolhaIdioma` |
| `/personalizacao` | Personalização · VYRA | `EscolhaAreas` |
| `/planos` | Planos · VYRA | `EscolhaPlano` |

- Em `/personalizacao` e `/planos`, o cabeçalho (etapas e título) vem do
  servidor e entra no componente como `cabecalho`. O DOM ficou igual, e a
  animação em cascata do `.stagger` continua valendo.
- O "Continuar" do `/idioma` só navegava e virou `Link`, como no rodapé do
  `/tutorial`.
- O comentário do `/idioma` dizia que a escolha "é guardada". Não é; o texto
  foi corrigido.
- O `/splash` ficou como estava, de propósito: o título padrão da marca
  ("VYRA · Mente · Plano · Vibra · Realiza") é o certo para a abertura.

**Verificado:** os 7 títulos no navegador, ESLint, `tsc` e build, em que as 7
telas saem estáticas.

## 14 · Editor do mural → pré-visualização — ✅

**Problema.** "Salvar e ver no celular" só levava `?layout=`. Legenda, filtro e
ordem das fotos se perdiam, e voltar ao editor apagava tudo.

**Feito.**

- `lib/murais.ts` ganhou `filtrosMural` (que saiu do editor), `LEGENDA_PADRAO`,
  `MAX_LEGENDA` (280), `girarFotos` e o par `edicaoParaQuery` /
  `edicaoDaQuery`. Eles escrevem e leem a edição na URL e validam cada valor;
  o que vier errado cai no padrão do mural.
- `components/MuralEditor.tsx` abre com a edição que chega na URL e envia
  layout, legenda, filtro e giro para `/mural/[id]/preview`.
- A pré-visualização aplica os três, e o botão de voltar do app leva a edição
  de volta ao editor.
- O filtro vale só para as fotos da pré-visualização (`Collage` ganhou a prop
  `filtro`), então relógio e legenda do celular ficam nítidos.
- O botão "Trocar" perdeu o `aria-pressed`, porque é uma ação que gira as fotos
  a cada toque.
- A legenda tem no máximo 280 caracteres, no editor e na URL.

**Limite:** pelo botão voltar do navegador, o editor pode abrir sem a edição,
porque o endereço anterior não a tem. Isso se resolve quando a API salvar o
mural.

**Verificado no navegador:** ida e volta com legenda de linhas repetidas e em
branco, filtro P&B e giro 2.

## 15 · Repositório `C:/dev` — ⬜ precisa de você

> Esta seção descreve o repositório como estava antes de o `.git` sumir (ver o
> aviso no topo). Revise quando ele voltar.

- O git deste projeto é o de `C:/dev`, que reúne cerca de vinte pastas de
  projetos.
- O commit `8e5b7f5` (*Ignorar projeto-financ, que passou a ter repositório
  próprio*) pôs `projeto-financ/` no `.gitignore`, mas **42 arquivos dele
  continuam rastreados**: o `.gitignore` não vale para o que já está no índice.
  Por isso o `git status` continua listando mudanças em `projeto-financ`.
- Para parar de rastrear sem apagar nada do disco, rode em `C:/dev`:

  ```bash
  git rm -r --cached projeto-financ
  git commit -m "Parar de rastrear projeto-financ (tem repositório próprio)"
  ```

- O `projeto-emerson/package.json`, um nível acima do app, é intencional: ele
  repassa `dev`, `build`, `start` e `lint` para a pasta interna. Pode ficar.

## 16 · Decisões de produto — ⬜ precisa de você

Estes pontos não são bugs de código. Cada um depende de uma escolha sua ou da
tela de referência.

1. **`/sonho/[id]` não tem link de entrada.** O `DreamCard`, que levava até lá,
   saiu na Etapa 2. Dá para religar a rota em algum lugar ou removê-la junto
   com `dreams` de `lib/data.ts`. Se ela ficar, a "Data desejada" mostra "2027"
   fixo para todos os sonhos.
2. **Telas sem cenário.** `/sonho/[id]` e `/categoria/[slug]` não
   renderizam `<Ambience />`, mas o README diz que toda tela tem a paisagem de
   fundo. Falta escolher o `data-ambience` de cada uma pelas referências.
   O `/perfil` ganhou `horizon` em 18/10, na revisão de design; troque se a
   referência pedir outro.
3. **"Sem cartão de crédito"** aparece na landing, mas o onboarding (telas 6 e
   7) pede plano e forma de pagamento.
4. **"Meta mais próxima"**, na `/inicio`, é `goals[1]` fixo. Os prazos são texto
   livre ("Dez 2027", "Contínuo") e não dá para ordená-los. Precisa de um campo
   de data estruturado.
5. **Controles sem efeito:** as abas Hoje/Semana/Mês da Home, o sino de
   notificações, os humores, sessões e lugares de `/area/[slug]`, "Gerar arte",
   "Adicionar etapa" e "Definir como papel de parede".
6. **As escolhas do onboarding não são guardadas.** O idioma e as 3 áreas da
   personalização somem ao avançar. O comentário que dizia o contrário foi
   corrigido na Etapa 13.
7. **Taxonomias diferentes para a mesma coisa:** áreas (`profissao`,
   `religiao`), categorias (`carreira`, `espiritualidade`) e personalização
   (`autoconhecimento`…). Vale unificar antes de migrar para a API.
8. **Frases repetidas.** `components/ExplorarBusca.tsx` tem a própria lista de
   frases, separada de `lib/frases.ts` e `lib/areas.ts`.
9. **Apple Pay.** O glifo `` (U+F8FF) só existe em aparelhos Apple. No Windows
   e no Android ele aparece como um quadrado.
10. **Os itens 9 e 10 do plano de 10/09** continuam ⬜: migrar as telas para a
    API e ter banco de dados e autenticação de verdade. O `db.json` já tem
    `desejos`, `categorias` e `frases`, que o app ainda não lê. A senha em texto
    puro e a sessão em `localStorage` continuam valendo só para o protótipo.
11. **Data fixa no celular da pré-visualização.** O mural mostra "Quinta-feira,
    11 de setembro", mas em 2026 o dia 11/09 é uma sexta-feira.

---

## Ajustes fora da lista

- **`app/globals.css`:** `@source not "../manual.html"`. O `manual.html` passou
  a morar na pasta do app, e sem essa linha o Tailwind colocaria as classes dele
  no CSS de todas as telas.
- **`app/layout.tsx`:** `data-scroll-behavior="smooth"`, pelo aviso do Next 16
  (ver Etapa 10).
- **`../ferramentas/verificar-navegador.mjs`** (novo, fora do app): o
  verificador de navegador da Etapa 10, para repetir a checagem com um comando.
- **`../backups/2026-09-24_1248/`** (novo, fora do app): o backup da pasta do
  app antes da segunda rodada.

---

## Histórico

| Data | Etapa | Status | Nota |
| --- | --- | --- | --- |
| 24/09 | 0 | ✅ | Diagnóstico. Build e dev quebrados pelas rotas legadas. |
| 24/09 | 3–9 | ✅ | Aplicadas. `eslint` com 0 erros (os 4 avisos eram dos arquivos legados), `tsc` limpo. Sem teste no navegador: o app respondia 500 até a Etapa 1. |
| 24/09 | 1 | 🔴 | Exclusão dos arquivos negada pelo controle de permissões da sessão; aguardando sua autorização. |
| 24/09 | 1 | ✅ | Com a sua autorização, os 8 arquivos saíram com `git rm` e `/categorias` e `/ia` ganharam redirecionamento. Build passa, lint sem avisos, rotas conferidas. |
| 24/09 | 2 | 🟡 | ~445 linhas de CSS morto removidas. Remoção de `DreamCard` e `CategoryCard` negada pelo controle de permissões; aguardando autorização. |
| 24/09 | 10 | 🟡 | Build, lint, `tsc`, códigos de rota e HTML servido conferidos. Faltava o navegador. |
| 24/09 | — | ⚠️ | A pasta `C:/dev/.git` sumiu entre dois comandos, depois do `git rm`. Trabalho interrompido. |
| 24/09 | — | ✅ | Por decisão sua, a segunda rodada segue com backup: `backups/2026-09-24_1248`, 105 arquivos. |
| 24/09 | 2 | ✅ | Com a sua autorização: `DreamCard` e `CategoryCard` removidos, com mais ~234 linhas de CSS e a keyframe órfã. |
| 24/09 | 13 | ✅ | 7 telas com título na aba; formulários e escolhas em componentes cliente. |
| 24/09 | 14 | ✅ | A edição do mural vai e volta pela URL; Trocar sem `aria-pressed`. |
| 24/09 | 10 | ✅ | Verificador no Chrome headless: 14 de 14 e console zerado em 27 telas, depois de `data-scroll-behavior="smooth"`. Cadastro de ponta a ponta não testado. |
| 24/09 | — | ✅ | `@source not "../manual.html"` no `globals.css`, para o Tailwind não varrer o manual. |

## Arquivos alterados em 24/09

### Primeira rodada

| Arquivo | Mudança |
| --- | --- |
| `app/(site)/cadastro/page.tsx` | depois do cadastro, segue para `/personalizacao` |
| `app/(site)/layout.tsx` | rodapé com "VYRA" |
| `app/(app)/perfil/page.tsx` | números a partir de `goals`; `metadata` |
| `app/(app)/sonho/[id]/page.tsx` | `notFound`, `generateStaticParams`, `generateMetadata` |
| `app/(app)/categoria/[slug]/page.tsx` | `notFound`, `generateStaticParams`, `generateMetadata` |
| `app/(app)/objetivos/[id]/page.tsx` | `PlanoProvider` e `EtapasContador` |
| `app/(app)/inicio/page.tsx` | `DataDeHoje`, `revalidate = 3600`, objetivos ativos |
| `components/Checklist.tsx` | estado no provider; exporta o contador |
| `components/DataDeHoje.tsx` | **novo** |
| `components/Collage.tsx` | chave da legenda pela posição |
| `components/WallpaperPreview.tsx` | chave da legenda pela posição |
| `lib/data.ts` | remoção de `overallProgress` |
| `README.md` | estrutura, tema, camadas de CSS, link para este arquivo |
| `next.config.ts` | redirecionamentos de `/categorias` e `/ia` |
| `app/styles/components.css` | ~445 linhas de CSS morto removidas |
| 7 páginas legadas + `components/BottomNav.tsx` | **removidos** com `git rm` (Etapa 1) |
| `24-setembro-pastas.md` | **novo**: este arquivo |

### Segunda rodada (com backup)

| Arquivo | Mudança |
| --- | --- |
| `app/globals.css` | `@source not "../manual.html"` |
| `app/layout.tsx` | `data-scroll-behavior="smooth"` |
| `app/styles/components.css` | blocos `.dream-*` e `.category-*` removidos; no total do dia, de 1.217 para 538 linhas |
| `app/styles/motion.css` | keyframe `orbit-counter` removida |
| `components/DreamCard.tsx`, `components/CategoryCard.tsx` | **removidos** (Etapa 2b) |
| `app/(site)/login/page.tsx`, `app/(site)/cadastro/page.tsx` | páginas de servidor com `metadata` |
| `components/FormularioLogin.tsx`, `components/FormularioCadastro.tsx` | **novos**: os formulários que estavam nas páginas |
| `app/(app)/objetivos/novo/page.tsx` + `components/FormularioObjetivo.tsx` | página no servidor; formulário **novo** no cliente |
| `app/(app)/mural/novo/page.tsx` + `components/EscolhaLayout.tsx` | página no servidor; escolha de layout **nova** no cliente |
| `app/(onboarding)/idioma/page.tsx` + `components/EscolhaIdioma.tsx` | página no servidor; lista de idiomas **nova** no cliente; "Continuar" virou `Link` |
| `app/(onboarding)/personalizacao/page.tsx` + `components/EscolhaAreas.tsx` | página no servidor; escolha de áreas **nova** no cliente |
| `app/(onboarding)/planos/page.tsx` + `components/EscolhaPlano.tsx` | página no servidor; escolha de plano **nova** no cliente |
| `lib/murais.ts` | filtros, legenda padrão, giro e leitura e escrita da edição na URL |
| `components/MuralEditor.tsx` | abre com a edição da URL e a envia para a pré-visualização; Trocar sem `aria-pressed` |
| `components/Collage.tsx`, `components/WallpaperPreview.tsx` | prop `filtro`, aplicada só às fotos |
| `app/(app)/mural/[id]/editar/page.tsx`, `app/(app)/mural/[id]/preview/page.tsx` | leem e repassam a edição |
| `manual.html` | status e percentuais atualizados (o arquivo foi movido por você para a pasta do app) |
| `README.md` | `components.css` sem "hero" na tabela de camadas; link para o manual |
| `../ferramentas/verificar-navegador.mjs` | **novo**, fora do app |
| `../backups/2026-09-24_1248/` | **novo**, fora do app |

Nada foi commitado, porque o `.git` segue sumido. Os arquivos da segunda rodada
podem ser comparados com o backup `backups/2026-09-24_1248`.
