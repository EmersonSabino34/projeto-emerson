# Plano de início — 10 de setembro

Frontend primeiro. API mock com json-server agora, banco de dados depois.

---

## Como rodar

```bash
npm run dev
```

Um comando só. O script sobe a **API primeiro** e só então o Next:

| Script | O que faz |
| --- | --- |
| `dev` | Orquestra os dois com `concurrently -k` (se um cai, derruba o outro) |
| `dev:api` | `json-server` na porta **3333** |
| `dev:web` | `wait-on tcp:127.0.0.1:3333 && next dev` — espera a API responder |
| `api` | Só a API, para rodar isolada |

App em `http://localhost:3000`, API em `http://localhost:3333`.

> **Por que 3333 e não 3001:** quando a 3000 está ocupada, o Next escaneia para
> cima e pega a 3001 — que seria justamente a da API. No teste ele anunciou
> `using available port 3001` e colidiu com o json-server. A 3333 fica fora do
> caminho de varredura dele.

> **Por que `--host 0.0.0.0` na API:** no Windows, o json-server com o host
> padrão (`localhost`) bindava **só em IPv6** (`[::1]:3333`). O `wait-on`
> checando `127.0.0.1` nunca sucedia e o `npm run dev` ficava travado para
> sempre, sem nunca subir o Next. Com `0.0.0.0` ele escuta em IPv4 e os dois
> caminhos funcionam. Não remover essa flag.

---

## Status geral

| # | Tela / Entrega | Rota | Status |
| --- | --- | --- | --- |
| 0 | Design system (tokens, dark/light, motion) | — | ✅ Concluído |
| 1 | Infra da API mock + script `dev` ordenado | — | ✅ Concluído |
| 2 | **Página de desejo** (landing, 4 pontos fortes) | `/` | ✅ Concluído |
| 3 | **Cadastro** | `/cadastro` | ✅ Concluído |
| 4 | **Login** | `/login` | ✅ Concluído |
| 5 | Ponto forte 01 — Mural com IA | `/ia` | 🟡 UI estática, sem lógica |
| 6 | Ponto forte 02 — Categorias | `/categorias` | 🟡 UI pronta, lê mock local |
| 7 | Ponto forte 03 — Progresso / mural | `/mural` | 🟡 UI pronta, lê mock local |
| 8 | Ponto forte 04 — Frases | `/frases` | 🟡 UI pronta, sem persistência |
| 9 | Migrar app para consumir a API | — | ⬜ Não começado |
| 10 | Banco de dados real + auth de verdade | — | ⬜ Não começado |

Legenda: ✅ concluído · 🟡 parcial · ⬜ não começado · 🔴 travado

---

## Estrutura de rotas

Dois route groups, que não aparecem na URL:

```
app/
├── (site)/              público, sem navegação do app
│   ├── page.tsx         → /            landing (página de desejo)
│   ├── cadastro/        → /cadastro
│   └── login/           → /login
└── (app)/               interno, com NavRail
    ├── mural/           → /mural       (era /)
    ├── categorias/      → /categorias
    ├── categoria/[slug] → /categoria/lugares
    ├── sonho/[id]       → /sonho/1
    ├── ia/              → /ia
    ├── frases/          → /frases
    └── perfil/          → /perfil
```

> **Mudança de rota:** a home do app saiu de `/` e foi para `/mural`, porque `/`
> agora é a landing — é a porta de entrada do funil. O "Início" do menu e todos
> os botões de voltar já apontam para `/mural`.

---

## 1 · Página de desejo (`/`) — ✅

Funil de entrada. Seções, na ordem:

1. **Hero** — título com palavra em gradiente, dois CTAs, faixa de números e
   colagem de 3 fotos flutuando com etiqueta de progresso.
2. **Os 4 pontos fortes** — o centro da página.
3. **CTA final** — faixa com gradiente e brilho.

### Os 4 pontos fortes

| # | Ponto forte | Promessa | Leva para |
| --- | --- | --- | --- |
| 01 | Mural montado por IA | A IA escolhe imagens e monta o layout | `/ia` |
| 02 | 11 áreas da vida | Cada sonho no seu lugar, não numa lista solta | `/categorias` |
| 03 | Progresso que se vê | Meta, prazo e percentual por sonho | `/mural` |
| 04 | Frases prontas para postar | Artes com frases em formato story/feed | `/frases` |

Cada cartão tem número grande ao fundo, ícone, título, texto e link. No hover:
sobe 6px, filete de gradiente cresce no topo, número clareia e o ícone gira.
Entram em cascata no scroll (90ms entre eles).

**Próximo passo:** é por esses 4 que seguimos — itens 5 a 8 do status.

---

## 2 · Cadastro (`/cadastro`) — ✅

Campos: nome, e-mail, senha, confirmar senha.

Validação no cliente, exibida **só depois da primeira tentativa de envio** (não
enquanto a pessoa digita), e o erro de um campo limpa sozinho quando ela começa
a corrigir. No envio falho, o foco vai para o primeiro campo inválido.

- nome: mínimo 2 caracteres
- e-mail: formato válido
- senha: mínimo 6 caracteres
- confirmação: precisa bater com a senha
- e-mail duplicado: checado contra a API (o json-server não tem constraint
  de unicidade, então a checagem é nossa)

Sucesso → cria o usuário, salva a sessão, vai para `/mural`.

---

## 3 · Login (`/login`) — ✅

Campos: e-mail e senha. Tem caixa com a **conta de teste** e um botão
"Preencher", para entrar sem cadastrar nada:

```
ana@exemplo.com · 123456
```

E-mail inexistente e senha errada devolvem **a mesma mensagem**, para não
revelar quais e-mails têm conta.

Sucesso → salva a sessão, vai para `/mural`.

---

## API mock

`db.json` na raiz, 4 coleções:

| Coleção | Registros | Usada por |
| --- | --- | --- |
| `usuarios` | 1 (Ana Silva) | cadastro e login |
| `desejos` | 3 | semeado para o item 9 |
| `categorias` | 11 | semeado para o item 9 |
| `frases` | 3 | semeado para o item 9 |

Endpoints que o app usa hoje:

```
GET  /usuarios?email=<email>   busca para login e checagem de duplicado
POST /usuarios                 cadastro
```

As telas não chamam `fetch` direto: tudo passa por `lib/api.ts`. Quando o banco
entrar, muda esse arquivo e mais nada.

### ⚠️ O que NÃO é seguro aqui

Isto é protótipo, e de propósito:

- **Senha em texto puro** no `db.json`. Sem hash.
- **Sessão em `localStorage`**, sem token nem cookie. Qualquer pessoa edita o
  localStorage e "entra".
- **Nenhuma rota protegida.** `/mural` abre direto pela URL, sem sessão.
- `npm audit` aponta 2 vulnerabilidades moderadas em dependências do
  json-server 0.17. É ferramenta de desenvolvimento; não vai para produção.

Tudo isso é substituído no item 10.

---

## Itens 5 a 8 · Os 4 pontos fortes

Ordem sugerida, do que mais aparece na landing para o que menos:

### 5 · Mural com IA (`/ia`) 🟡
Hoje: 3 cartões de estilo que não fazem nada.
Falta: selecionar estilo, escolher fotos, tela de geração com loading, resultado.

### 6 · Categorias (`/categorias`, `/categoria/[slug]`) 🟡
Hoje: lista completa e detalhe com estado vazio.
Falta: adicionar item à categoria, contagem real por categoria, busca.

### 7 · Progresso / mural (`/mural`, `/sonho/[id]`) 🟡
Hoje: cartões e barras a partir do mock local.
Falta: criar e editar desejo, atualizar progresso de verdade, marcar concluído.

### 8 · Frases (`/frases`) 🟡
Hoje: pré-visualização, temas, formatos e troca de frase.
Falta: gerar frase por tema, trocar a foto de fundo, exportar a arte.

---

## 9 · Migrar o app para a API ⬜

As telas internas ainda leem `lib/data.ts` (mock em código). Trocar por
`lib/api.ts`, filtrando por `usuarioId` da sessão. `db.json` já está semeado
com `desejos`, `categorias` e `frases` para isso.

## 10 · Banco de dados + auth real ⬜

Quando chegar a hora: Postgres, senha com hash, sessão em cookie httpOnly,
middleware protegendo `/mural` e as outras rotas internas. `lib/api.ts` e
`lib/auth.ts` são os dois pontos de troca.

---

## Verificado nesta entrega

- `npx next build` — 11 rotas, sem erro
- `npx eslint .` — limpo
- 10 rotas respondendo 200 no dev server
- API: 4 coleções semeadas, busca por e-mail, `POST /usuarios` e login do
  usuário novo testados por curl (usuário de teste removido depois)
- Route groups corretos: `/mural` tem a nav do app, `/` e `/login` não
- `concurrently` + `wait-on` com ordenação confirmada (ver nota do IPv6)
- Contraste: 13 pares texto/fundo dos dois temas passam WCAG AA

**Não verificado:** nada foi conferido visualmente — não há ferramenta de
browser nesta sessão, então a checagem foi do HTML/CSS servido, não da tela
renderizada.
