# Feature Specification: Quebra-Gelo MVP — Baralho de Perguntas

**Feature Branch**: `001-icebreaker-cards-mvp`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "Um aplicativo mobile offline que simula um baralho de perguntas para
iniciar conversas significativas e divertidas em diferentes contextos (dates, amigos, trabalho).
MVP: Home com grade de 8 categorias; Game View com carta central, toque para virar (flip),
deslizar para esquerda/direita para descartar e puxar a próxima, resposta tátil ao virar e ao
deslizar; Favoritos com botão de estrela na carta salvando perguntas numa lista local. Dados em
arquivo local com categorias (id, title, icon, color, description) e perguntas (id, categoryId,
text). Categorias: casual (Descontraído), profundo (Profundo), casais (Casais), happy-hour
(Happy Hour), dilemas (Dilemas), viagens (Viagens e Aventuras), nostalgia (Nostalgia e Infância),
futuro (Futuro e Sonhos)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar um baralho de perguntas (Priority: P1)

Um grupo (casal, amigos ou colegas) abre o app, escolhe uma categoria na tela inicial e passa a
tirar cartas: cada carta aparece virada para baixo no centro da tela; um toque a vira e revela a
pergunta; um deslize para a esquerda ou para a direita descarta a carta e traz a próxima. Cada
virada e cada descarte produzem uma vibração sutil, dando a sensação de manusear cartas reais.

**Why this priority**: é o coração do produto. Sozinha, esta jornada já entrega o valor central:
iniciar conversas com perguntas organizadas por contexto.

**Independent Test**: abrir o app sem internet, escolher qualquer categoria, virar e descartar
cartas até o fim do baralho, verificando que as perguntas pertencem à categoria, não se repetem e
que há vibração em cada virada e descarte.

**Acceptance Scenarios**:

1. **Given** o app aberto na tela inicial, **When** o usuário toca na categoria "Descontraído",
   **Then** a tela de jogo abre exibindo uma carta virada para baixo com a identidade visual
   (cor, ícone e nome) da categoria.
2. **Given** uma carta virada para baixo, **When** o usuário toca nela, **Then** a carta gira com
   animação de virada, revela o texto da pergunta e o dispositivo vibra levemente.
3. **Given** uma carta (virada ou não), **When** o usuário a desliza para a esquerda ou para a
   direita além do limite de descarte, **Then** a carta sai da tela na direção do gesto, o
   dispositivo vibra e a próxima carta aparece virada para baixo.
4. **Given** uma carta sendo arrastada, **When** o usuário a solta antes do limite de descarte,
   **Then** a carta volta suavemente ao centro sem ser descartada e sem vibração de descarte.
5. **Given** o usuário na tela de jogo, **When** ele usa o botão/gesto de voltar, **Then** retorna à
   tela inicial.
6. **Given** o celular sem nenhuma conexão (modo avião) desde a instalação, **When** o usuário
   joga qualquer categoria, **Then** todas as cartas e categorias funcionam normalmente.

---

### User Story 2 - Escolher o contexto na tela inicial (Priority: P2)

Ao abrir o app, o usuário vê uma grade com as 8 categorias temáticas, cada uma com ícone, cor,
nome e uma descrição curta que ajuda a escolher a mais adequada ao momento (um date, um happy
hour, uma viagem...).

**Why this priority**: a escolha de contexto é o que torna as perguntas adequadas ao grupo; sem
ela o jogo funciona, mas com perguntas potencialmente inadequadas à situação.

**Independent Test**: abrir o app e verificar que as 8 categorias aparecem com nome, ícone, cor e
descrição, e que cada uma leva ao seu próprio baralho.

**Acceptance Scenarios**:

1. **Given** o app recém-aberto, **When** a tela inicial carrega, **Then** são exibidas exatamente
   as 8 categorias — Descontraído, Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras,
   Nostalgia e Infância, Futuro e Sonhos — em grade, cada uma com ícone, cor e descrição.
2. **Given** a tela inicial em um celular pequeno (320pt de largura), **When** ela é exibida,
   **Then** todas as categorias ficam legíveis e acessíveis por rolagem, sem texto cortado.

---

### User Story 3 - Favoritar perguntas (Priority: P3)

Durante o jogo, ao encontrar uma pergunta interessante, o usuário toca no ícone de estrela da
carta para salvá-la. Depois, ele acessa a lista de favoritos a partir da tela inicial para rever
essas perguntas e pode remover as que não quiser mais.

**Why this priority**: aumenta o valor de retorno ao app, mas o jogo funciona sem ela.

**Independent Test**: favoritar perguntas de categorias diferentes, fechar e reabrir o app e
verificar que todas aparecem na lista de favoritos; remover uma e confirmar que sumiu.

**Acceptance Scenarios**:

1. **Given** uma carta revelada não favoritada, **When** o usuário toca na estrela, **Then** a
   estrela fica preenchida e a pergunta é adicionada aos favoritos, sem virar nem descartar a
   carta.
2. **Given** uma carta revelada já favoritada, **When** o usuário toca na estrela, **Then** a
   estrela fica vazia e a pergunta é removida dos favoritos.
3. **Given** perguntas favoritadas, **When** o usuário fecha completamente o app e o reabre,
   **Then** os favoritos continuam salvos.
4. **Given** a tela inicial, **When** o usuário abre a lista de favoritos, **Then** vê todas as
   perguntas salvas, cada uma identificada pela sua categoria (nome e cor), da mais recente para a
   mais antiga, e pode remover qualquer uma.
5. **Given** nenhum favorito salvo, **When** o usuário abre a lista, **Then** vê uma mensagem
   amigável explicando como favoritar uma pergunta.

---

### Edge Cases

- **Fim do baralho**: ao descartar a última carta não vista da categoria, o app mostra uma tela de
  conclusão com as opções "Embaralhar de novo" (reinicia o baralho em nova ordem) e "Escolher outra
  categoria" (volta à tela inicial).
- **Saída no meio do baralho**: ao sair e voltar à mesma categoria (inclusive após fechar o app),
  o jogo continua com as cartas ainda não vistas; nenhuma carta já vista reaparece até o baralho
  ser concluído ou reiniciado.
- **Toque × deslize**: um movimento muito curto conta como toque (vira a carta); só arrastos além
  de uma pequena distância contam como deslize, evitando viradas acidentais.
- **Gestos rápidos repetidos**: toques ou deslizes seguidos durante uma animação não podem pular
  cartas, revelar duas cartas ao mesmo tempo nem deixar a carta em estado inconsistente.
- **Toque na estrela**: tocar na estrela nunca vira nem descarta a carta; a estrela só aparece na
  face revelada.
- **Pergunta favoritada ainda não vista**: favoritos não alteram a ordem nem o progresso do
  baralho.
- **Movimento reduzido**: com a opção de movimento reduzido do sistema ativa, as animações de
  virada e descarte são simplificadas (ex.: transição suave), mantendo a vibração.
- **Dispositivo sem motor de vibração**: o jogo funciona normalmente, apenas sem a resposta tátil.
- **Dados de conteúdo inválidos**: uma pergunta cuja categoria não existe nunca é exibida (o
  conteúdo é validado antes de ser publicado).

## Requirements *(mandatory)*

### Functional Requirements

**Conteúdo**

- **FR-001**: O app MUST incluir, embarcado no próprio aplicativo, as 8 categorias com os
  identificadores e nomes: `casual` (Descontraído), `profundo` (Profundo), `casais` (Casais),
  `happy-hour` (Happy Hour), `dilemas` (Dilemas), `viagens` (Viagens e Aventuras), `nostalgia`
  (Nostalgia e Infância), `futuro` (Futuro e Sonhos).
- **FR-002**: Cada categoria MUST ter identificador, nome, ícone, cor e descrição curta.
- **FR-003**: Cada pergunta MUST ter identificador único e estável, pertencer a exatamente uma
  categoria existente e ter um texto não vazio de no máximo 200 caracteres.
- **FR-004**: Cada categoria MUST ter no mínimo 20 perguntas originais em português do Brasil.
- **FR-005**: Todo o conteúdo MUST estar disponível sem conexão com a internet, desde a primeira
  abertura, e sem cadastro ou login.

**Tela inicial**

- **FR-006**: A tela inicial MUST exibir as 8 categorias em grade, cada uma com ícone, cor, nome e
  descrição.
- **FR-007**: Tocar em uma categoria MUST abrir a tela de jogo daquela categoria (no máximo dois
  toques da abertura do app até a primeira carta).
- **FR-008**: A tela inicial MUST oferecer acesso à lista de favoritos.

**Tela de jogo**

- **FR-009**: A tela de jogo MUST exibir uma carta por vez, centralizada, inicialmente virada para
  baixo, mostrando a identidade visual da categoria no verso.
- **FR-010**: Tocar na carta virada para baixo MUST virá-la com animação, revelando a pergunta;
  tocar na carta revelada MUST virá-la de volta.
- **FR-011**: Deslizar a carta para a esquerda ou para a direita além de um limite de distância ou
  velocidade MUST descartá-la, animando sua saída na direção do gesto e exibindo a próxima carta;
  esquerda e direita têm o mesmo efeito.
- **FR-012**: A carta MUST acompanhar o dedo durante o arraste (com leve rotação) e, se solta
  antes do limite, MUST voltar ao centro.
- **FR-013**: O descarte MUST ser permitido com a carta virada ou não, permitindo pular qualquer
  pergunta sem penalidade.
- **FR-014**: O app MUST emitir resposta tátil sutil ao virar uma carta e outra ao descartá-la.
- **FR-015**: As perguntas de uma categoria MUST ser apresentadas em ordem aleatória, sem repetir
  nenhuma até que todas tenham sido exibidas.
- **FR-016**: O progresso de cada categoria (cartas já vistas) MUST ser mantido ao sair da tela
  e ao fechar o app, e MUST poder ser reiniciado ao concluir o baralho.
- **FR-017**: Ao esgotar as cartas da categoria, o app MUST exibir a tela de conclusão com as
  opções "Embaralhar de novo" e "Escolher outra categoria".
- **FR-018**: A tela de jogo MUST NOT exibir placar, cronômetro, anúncios ou notificações.
- **FR-019**: Com movimento reduzido ativo no sistema, as animações MUST ser simplificadas,
  mantendo a resposta tátil.

**Favoritos**

- **FR-020**: A face revelada da carta MUST exibir um botão de estrela que alterna o estado de
  favorito da pergunta, indicando visualmente se ela está favoritada.
- **FR-021**: Os favoritos MUST ser armazenados apenas no dispositivo e persistir entre aberturas
  do app.
- **FR-022**: A lista de favoritos MUST mostrar as perguntas salvas com sua categoria, da mais
  recente para a mais antiga, permitir remover itens e exibir um estado vazio explicativo.

**Acessibilidade**

- **FR-023**: Carta, estrela, categorias e botões MUST ter rótulos de acessibilidade em
  português, e a carta MUST oferecer ações acessíveis equivalentes a virar, favoritar e pular para
  quem usa leitor de tela.

### Key Entities

- **Categoria**: um contexto temático de conversa (ex.: Casais, Happy Hour). Atributos:
  identificador, nome, ícone, cor e descrição. Possui muitas perguntas.
- **Pergunta**: o texto exibido em uma carta. Atributos: identificador único, categoria a que
  pertence e texto.
- **Favorito**: uma pergunta salva pelo usuário, com a data em que foi salva. Fica apenas no
  dispositivo.
- **Progresso da categoria**: por categoria, a ordem embaralhada atual e quais perguntas já foram
  vistas. Fica apenas no dispositivo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário de primeira viagem chega da abertura do app à primeira pergunta revelada
  em menos de 10 segundos, sem instruções.
- **SC-002**: 100% das funcionalidades (8 categorias, jogo e favoritos) funcionam com o celular
  em modo avião desde a instalação.
- **SC-003**: Virar ou descartar uma carta responde visualmente e com vibração de forma imediata
  (percebida como instantânea, sem travadas visíveis) em celulares intermediários.
- **SC-004**: Em uma sessão completa de uma categoria, nenhuma pergunta se repete antes de todas
  terem sido exibidas (0 repetições).
- **SC-005**: 100% dos favoritos salvos continuam disponíveis após fechar e reabrir o app.
- **SC-006**: Em teste com usuários, pelo menos 9 de 10 pessoas conseguem virar, pular e
  favoritar uma carta na primeira tentativa, sem ajuda.
- **SC-007**: O app abre e exibe a tela inicial em até 2 segundos em celulares intermediários.

## Assumptions

- O MVP joga uma categoria por vez; combinar várias categorias num mesmo baralho fica para depois.
- O conteúdo das perguntas (mínimo de 20 por categoria, 160 no total) faz parte desta feature e
  será escrito originalmente para o projeto, seguindo as regras de conteúdo da constituição
  (inclusivo, acolhedor, sem copiar jogos comerciais). A revisão final dos textos é do dono do
  produto.
- Esquerda e direita têm o mesmo significado (descartar); não há "curtir/não curtir".
- A vibração fica sempre ativa no MVP; uma opção para desligá-la fica fora do escopo.
- Fora do escopo: desfazer descarte, compartilhar perguntas, perguntas criadas pelo usuário,
  modo multijogador, contas, sincronização na nuvem, outros idiomas e modo escuro dedicado.
- O app é apenas para celulares (Android e iOS), em orientação retrato.
- Os nomes dos ícones e as cores das categorias serão definidos na fase de design, desde que cada
  categoria tenha cor e ícone distintos e com contraste legível.
