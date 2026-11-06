# Feature Specification: Navegação Direcional por Gestos e Tutorial Atualizado

**Feature Branch**: `009-directional-swipe-navigation`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "User Story 1: Navegação Direcional por Gestos (Swipe). Como usuário
jogando em uma categoria, quero deslizar a carta para a esquerda para ver a próxima pergunta e para
a direita para voltar à anterior, para que eu possa ter controle total sobre o fluxo do jogo e
revisitar perguntas. Deslizar para a esquerda descarta a carta atual e mostra a próxima da fila,
com vibração leve. Deslizar para a direita recupera a carta anterior do histórico e a coloca de
volta no topo, com vibração de confirmação. Na primeira carta, deslizar para a direita é
bloqueado: a carta acompanha o dedo só um pouco, com resistência elástica, e volta ao centro ao
soltar, sem mudar a posição do jogo. User Story 2: Atualização do Mini-Tutorial de Primeira
Viagem. Como novo usuário, quero que o tutorial inicial explique a direção correta para avançar ou
voltar. Mantém o overlay escurecido só no primeiro acesso, com 'Pular' e toque fora da carta para
fechar. Indicadores: 1. 'Toque em um baralho para começar' (abaixo da carta); 2. 'Toque na carta
para revelar a pergunta' (ícone de toque no centro da carta); 3. 'Deslize para a esquerda para
passar a carta' (seta para a esquerda); 4. 'Deslize para a direita para voltar à carta anterior'
(seta para a direita)."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (gestos da carta,
progresso em memória), [004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md)
(modo misto), [005-onboarding-tutorial](../005-onboarding-tutorial/spec.md) (tutorial de primeiro
uso) e [008-reshuffle-remaining-cards](../008-reshuffle-remaining-cards/spec.md) (re-embaralhar a
fila restante).

**Contexto**: hoje deslizar para qualquer lado significa "pular" e não existe voltar carta. Esta
feature **substitui** essa regra: esquerda avança e direita volta. Ela também **substitui**, na
005, a regra de "exatamente três dicas de no máximo 50 caracteres" (FR-012/FR-013 da 005) por
quatro dicas, e, na 008, a suposição "não existe navegação para trás".

## Clarifications

### Session 2026-11-06

- Q: A carta que volta aparece virada para cima ou para baixo? → A: Para cima (pergunta à mostra),
  porque o objetivo de voltar é rever a pergunta; a carta que saiu pela direita, quando reaparecer
  avançando, vem virada para baixo como qualquer carta seguinte.
- Q: Quem já viu o tutorial antigo deve ver o novo? → A: Sim, uma única vez, porque o gesto para a
  direita mudou de significado ("pular" → "voltar") para quem já jogava.
- Q: Qual vibração confirma avançar e voltar? → A: A vibração de descarte já existente para os dois;
  nenhuma vibração quando o voltar é bloqueado na primeira carta.
- Q: Depois de voltar, o re-embaralhar (008) mexe em quais cartas? → A: Só nas cartas nunca
  exibidas; as já vistas "à frente" continuam na ordem em que apareceram.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Avançar pela esquerda, voltar pela direita (Priority: P1)

Durante o jogo, o jogador desliza a carta para a esquerda para passar para a próxima pergunta e
para a direita para rever a pergunta anterior. Voltar não "gasta" cartas: avançar de novo segue
pelas mesmas cartas já vistas, na mesma ordem, até chegar às que ainda não saíram. Na primeira
carta não há para onde voltar: a carta resiste ao arrasto para a direita e volta ao centro.

**Why this priority**: é o pedido central e muda o significado de um gesto já existente; sem ele o
tutorial novo (US2) ensinaria algo falso.

**Independent Test**: em uma categoria, deslizar 3 cartas para a esquerda, depois 2 para a direita:
o contador vai de "Carta 4" para "Carta 2" e a carta exibida é a mesma que era a 2ª. Deslizar de
novo para a esquerda mostra a 3ª e depois a 4ª originais. Na carta 1, arrastar para a direita não
muda nada.

**Acceptance Scenarios**:

1. **Given** o jogador está na carta 3 de 20, **When** desliza a carta para a esquerda além do
   limite (ou com um movimento rápido), **Then** a carta sai pela esquerda, o aparelho vibra, a
   próxima carta aparece e o contador mostra "Carta 4 de 20".
2. **Given** o jogador está na carta 4 de 20, **When** desliza para a direita além do limite,
   **Then** a carta atual sai pela direita, o aparelho vibra, a carta 3 que ele já tinha visto
   reaparece já virada com a pergunta à mostra, e o contador mostra "Carta 3 de 20".
3. **Given** o jogador voltou da carta 4 para a carta 2, **When** desliza para a esquerda duas
   vezes, **Then** aparecem de novo, na mesma ordem, as cartas 3 e 4 que ele já tinha visto, e só
   depois as cartas que ainda não tinham saído.
4. **Given** o jogador está na carta 1, **When** arrasta a carta para a direita e solta (devagar
   ou com um movimento rápido), **Then** a carta acompanha o dedo apenas um pouco, com resistência
   elástica, volta ao centro com efeito de mola, não vibra e o contador continua "Carta 1".
5. **Given** o jogador está na carta 1, **When** desliza para a esquerda, **Then** o jogo avança
   normalmente (a resistência só existe para a direita).
6. **Given** qualquer carta, **When** o jogador arrasta para qualquer lado sem passar do limite e
   solta, **Then** a carta volta ao centro com efeito de mola e nada muda (comportamento atual).
7. **Given** o modo "Tudo Misturado", **When** o jogador volta uma carta, **Then** a carta anterior
   reaparece virada, com a etiqueta da categoria de origem, como estava antes.
8. **Given** o leitor de tela ativo, **When** o jogador usa as ações da carta, **Then** existem as
   ações "próxima" (avançar) e "voltar" (voltar uma carta); "voltar" não é oferecida na carta 1.

---

### User Story 2 - Tutorial ensina as duas direções (Priority: P2)

Quem abre o app pela primeira vez vê o tutorial de sempre (fundo escurecido, carta de exemplo,
"Pular", toque fora da carta fecha), agora com quatro dicas curtas que indicam a direção exata:
seta para a esquerda para passar, seta para a direita para voltar, toque no centro para revelar e
toque em um baralho para começar.

**Why this priority**: sem ele, novos jogadores (e quem já conhecia o "deslize para os lados")
não descobririam que a direita agora volta.

**Independent Test**: limpar os dados do app, abrir e verificar as quatro dicas, os ícones nas
posições certas e os caminhos de fechar; verificar que quem já tinha visto o tutorial antigo o vê
mais uma vez, uma única vez.

**Acceptance Scenarios**:

1. **Given** o primeiro acesso, **When** a tela inicial abre, **Then** o tutorial mostra
   exatamente quatro dicas: "Deslize para a esquerda para passar a carta" junto da seta para a
   esquerda, "Deslize para a direita para voltar à carta anterior" junto da seta para a direita,
   "Toque na carta para revelar a pergunta" com o ícone de toque no centro da carta, e
   "Toque em um baralho para começar" abaixo da carta, apontando para baixo.
2. **Given** o tutorial aberto, **When** o jogador toca em "Pular", fora da carta ou no "voltar"
   do sistema, **Then** o tutorial fecha e não volta a aparecer nas próximas aberturas.
3. **Given** uma pessoa que já tinha fechado o tutorial antigo (das versões anteriores), **When**
   abre o app atualizado, **Then** vê o tutorial novo uma única vez; depois de fechá-lo, ele não
   aparece mais.
4. **Given** o leitor de tela ativo, **When** o tutorial abre, **Then** as quatro dicas são lidas
   como textos próprios, na ordem: passar, voltar, revelar, começar.
5. **Given** movimento reduzido ativado, **When** o tutorial abre, **Then** os ícones ficam
   parados (comportamento atual da 005).

---

### Edge Cases

- **Primeira carta**: voltar é bloqueado com resistência elástica, sem vibração e sem mudar o
  contador; vale também para um movimento rápido para a direita.
- **Voltar várias vezes**: é possível voltar até a carta 1 do baralho atual.
- **Fim do baralho**: depois da última carta aparece a tela "Fim do Baralho"; ela não tem carta
  para deslizar, então não há como voltar a partir dela (fora do escopo; "Embaralhar de novo"
  continua recomeçando o baralho).
- **Sair e voltar ao baralho**: a posição atual (inclusive depois de voltar cartas) é mantida na
  mesma sessão, como hoje; o histórico some quando o app é fechado.
- **Re-embaralhar (008) depois de voltar**: o re-embaralhamento mexe só nas cartas que **nunca**
  foram exibidas; as cartas já vistas que estão "à frente" (por ter voltado) continuam na mesma
  ordem antes das novas. O botão fica desativado quando restam menos de 2 cartas nunca exibidas.
- **Gesto durante uma animação**: enquanto uma carta está saindo ou virando, novos gestos são
  ignorados (comportamento atual).
- **Favoritos**: voltar a uma carta mostra a estrela de favorito no estado correto; o botão de
  favoritar fica ativo porque a carta volta virada.
- **Novo baralho por mudança do filtro (006) ou por "Embaralhar de novo"**: o histórico recomeça
  junto com o baralho.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Deslizar a carta para a esquerda além do limite de descarte (ou com velocidade
  suficiente) MUST avançar para a próxima carta, como o descarte atual.
- **FR-002**: Deslizar a carta para a direita além do limite (ou com velocidade suficiente) MUST
  voltar para a carta exibida imediatamente antes, quando houver uma; a carta atual sai pela
  direita e a anterior aparece no topo.
- **FR-003**: A carta que volta MUST aparecer virada para cima (pergunta à mostra), com a mesma
  pergunta, categoria e estado de favorito de antes.
- **FR-004**: Voltar MUST diminuir o contador "Carta X de Y" em 1; avançar MUST aumentá-lo em 1; o
  total Y MUST NOT mudar.
- **FR-005**: Depois de voltar, avançar MUST mostrar de novo as cartas já vistas na mesma ordem em
  que apareceram, e só depois as cartas nunca exibidas; nenhuma carta nunca exibida MAY ser
  pulada ou duplicada por causa da navegação.
- **FR-006**: Na primeira carta do baralho, arrastar para a direita MUST NOT voltar nem mudar o
  contador: a carta MUST acompanhar o dedo com resistência elástica (deslocamento bem menor que o
  do dedo, limitado a uma pequena distância) e voltar ao centro com efeito de mola ao soltar,
  qualquer que seja a velocidade.
- **FR-007**: Avançar e voltar MUST disparar a vibração de descarte já usada pelo app; o bloqueio
  na primeira carta MUST NOT vibrar.
- **FR-008**: Com movimento reduzido ativado, avançar e voltar MUST usar a transição simplificada
  já existente (esmaecimento em vez de voo), mantendo a vibração.
- **FR-009**: A carta MUST oferecer ações de acessibilidade "próxima" e "voltar"; "voltar" MUST
  ser oferecida somente quando houver uma carta anterior.
- **FR-010**: A dica de gestos da tela do baralho MUST passar a indicar as duas direções (ex.:
  "Toque para virar · ← próxima · anterior →").
- **FR-011**: O re-embaralhamento da 008 MUST reordenar somente as cartas nunca exibidas e MUST
  ficar disponível somente quando restarem pelo menos 2 delas; as demais regras da 008 continuam.
- **FR-012**: O histórico de navegação MUST valer só para a sessão do baralho (em memória, como o
  progresso) e MUST recomeçar quando o baralho é recriado ("Embaralhar de novo", mudança de
  filtro do modo misto).
- **FR-013**: O tutorial MUST mostrar exatamente quatro dicas, nesta ordem de leitura:
  "Deslize para a esquerda para passar a carta" (com seta para a esquerda, à esquerda da carta),
  "Deslize para a direita para voltar à carta anterior" (com seta para a direita, à direita da
  carta), "Toque na carta para revelar a pergunta" (ícone de toque no centro da carta) e
  "Toque em um baralho para começar" (abaixo da carta, com seta para baixo). Cada dica MUST ter no
  máximo 55 caracteres (substitui o limite de 50 e as "três dicas" da 005).
- **FR-014**: O tutorial MUST manter o restante da 005: fundo escurecido, carta de exemplo virada
  para baixo, "Pular", toque fora da carta e "voltar" do sistema fecham, ícones animados (parados
  com movimento reduzido), exibição só enquanto não tiver sido visto.
- **FR-015**: Quem já fechou o tutorial de uma versão anterior MUST ver o tutorial novo uma única
  vez; fechar o tutorial novo MUST impedir que ele apareça de novo.
- **FR-016**: Todos os textos novos ou alterados MUST ficar centralizados com os demais textos de
  interface, em português do Brasil.
- **FR-017**: As regras de avançar, voltar, limite na primeira carta e re-embaralhar só as cartas
  nunca exibidas MUST ser testáveis de forma automatizada sem renderizar a tela.

### Key Entities

- **Progresso do baralho** (existente, ampliado): ordem das cartas, posição da carta da mesa e,
  agora, a posição mais adiantada já alcançada (até onde o jogador já viu). As cartas até essa
  posição formam o histórico; as depois dela são as nunca exibidas.
- **Marcação de tutorial visto** (existente, ampliada): passa a registrar qual versão do tutorial
  foi vista, para mostrar o tutorial novo uma vez a quem viu o antigo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O jogador consegue rever a pergunta anterior com 1 gesto, e voltar até a primeira
  carta com 1 gesto por carta.
- **SC-002**: Em 100% das sequências testadas de avançar e voltar, nenhuma carta nunca exibida é
  pulada ou duplicada, e o contador corresponde à carta exibida.
- **SC-003**: Na primeira carta, 100% dos arrastos para a direita terminam com a carta de volta ao
  centro, sem mudança de posição e sem vibração.
- **SC-004**: Em testes de uso, novos jogadores dizem qual direção avança e qual volta depois de
  ver o tutorial uma vez, sem ajuda.
- **SC-005**: As quatro dicas do tutorial cabem em telas a partir de 320 pt de largura sem cortar
  texto nem sobrepor a carta de exemplo.

## Assumptions

- O "índice 0" do pedido é a primeira carta do baralho atual (sessão), não da categoria em geral.
- A vibração de "avançar" e "voltar" é a mesma vibração de descarte que o app já usa (sutil); o
  "leve" do pedido é atendido por ela, e o toque de virar continua sendo o mais leve.
- Avançar sobre cartas já vistas (depois de voltar) não viola a regra de "não repetir carta" da
  constituição: a regra trata da ordem em que o baralho distribui cartas novas, e rever uma carta
  é uma escolha explícita do jogador.
- A tela "Fim do Baralho" não ganha um "voltar" nesta feature.
- A carta de exemplo do tutorial continua sendo o verso neutro da marca (005).
