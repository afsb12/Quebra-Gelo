# Feature Specification: Tela de Jogo com Barra de Ações

**Feature Branch**: `016-deck-action-bar`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Aplicar a proposta do Jogo do canvas de revisão de design
(https://claude.ai/artifact/7Cup4PFup16b56zKDjgJaV, quadro 'Jogo — proposta'): barra fina de
progresso na cor da categoria no lugar do 'Carta 3 de 30' em texto miúdo; cartas empilhadas atrás
da atual mostrando que é um baralho e quanto falta; barra de ações com Anterior / Favoritar /
Próxima como alternativa ao gesto; a dica longa sai depois das primeiras cartas, ficando um lembrete
curto; no Tudo Misturado, 'Mudar o clima' continua como ação secundária."

**Depends on**: [001](../001-icebreaker-cards-mvp/spec.md) (jogo, favoritos),
[004](../004-mixed-mode-hidden-backs/spec.md) (versos neutros no misturado),
[009](../009-directional-swipe-navigation/spec.md) (esquerda = próxima, direita = anterior) e
[011](../011-mixed-change-mood/spec.md) ("Mudar o clima").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Avançar e voltar sem precisar do gesto (Priority: P1)

Abaixo da carta há três botões: "Anterior", "Favoritar" e "Próxima". "Próxima" faz a carta sair
para a esquerda, como no gesto; "Anterior" traz a carta anterior virada para cima, como o gesto para
a direita. Quem não descobre o gesto, ou usa leitor de tela, joga só com os botões.

**Why this priority**: torna o jogo acessível e óbvio sem depender do swipe.

**Independent Test**: abrir um baralho, tocar "Próxima" duas vezes e "Anterior" uma vez: o contador
vai a 3 e volta a 2, com a carta 2 virada para cima.

**Acceptance Scenarios**:

1. **Given** a carta 1, **When** a pessoa toca "Próxima", **Then** a carta sai com a mesma animação
   e vibração do gesto e a carta 2 aparece virada para baixo.
2. **Given** a carta 1, **When** a pessoa olha "Anterior", **Then** ele está desativado.
3. **Given** a carta 3, **When** a pessoa toca "Anterior", **Then** a carta 2 volta virada para cima.
4. **Given** uma carta virada para baixo, **When** a pessoa olha "Favoritar", **Then** ele está
   desativado (como hoje); virada para cima, ele favorita sem descartar a carta.

---

### User Story 2 - Saber quanto falta (Priority: P2)

O topo mostra o nome do baralho, um contador curto "3 / 30" e, embaixo, uma barra fina de progresso
na cor da categoria. Atrás da carta atual aparecem até duas cartas empilhadas (viradas para baixo)
enquanto houver cartas depois dela.

**Why this priority**: dá noção de baralho e de progresso sem texto miúdo.

**Independent Test**: na carta 3 de 30, a barra está em 10% e há duas cartas atrás; na penúltima,
uma; na última, nenhuma.

**Acceptance Scenarios**:

1. **Given** a carta 3 de 30, **When** a pessoa olha o topo, **Then** vê "3 / 30" e a barra em 10%;
   o leitor de tela lê "Carta 3 de 30".
2. **Given** a penúltima carta, **When** a pessoa olha a mesa, **Then** há 1 carta atrás da atual;
   na última, nenhuma.
3. **Given** o Tudo Misturado, **When** a pessoa olha as cartas de trás e a barra, **Then** nenhuma
   delas revela a categoria da próxima carta (cor neutra).

---

### User Story 3 - Dica que não cansa (Priority: P3)

Nas 3 primeiras cartas de cada partida aparece o lembrete curto "Dica: você também pode deslizar a
carta"; depois a linha fica vazia (e continua mostrando o aviso "Clima trocado" quando houver).

**Independent Test**: a dica aparece nas cartas 1–3 e some a partir da 4.

**Acceptance Scenarios**:

1. **Given** a carta 1, **When** a pessoa olha abaixo dos botões, **Then** vê a dica curta.
2. **Given** a carta 4, **When** a pessoa olha abaixo dos botões, **Then** a dica não aparece.
3. **Given** o Tudo Misturado, **When** a pessoa toca "Mudar o clima", **Then** o aviso "Clima
   trocado" aparece na linha da dica, como hoje.

### Edge Cases

- Toque rápido repetido em "Próxima" durante a animação: só uma carta sai por vez.
- "Anterior" e "Próxima" nunca viram a carta; só tocar na carta vira.
- Movimento reduzido: "Próxima"/"Anterior" usam o mesmo efeito simplificado do gesto (esmaecer).
- Fim do baralho: a barra de ações, a dica e as cartas de trás somem (a tela de fim aparece).
- Telas pequenas (320×568): a carta encolhe para caber, e toda pergunta continua cabendo em ≥ 20 pt.

## Clarifications

### Session 2026-11-11

- Q: Onde fica "Mudar o clima" no Tudo Misturado, agora que "Próxima" ocupa a direita da barra? → A:
  na linha abaixo da barra, à direita da dica, como botão secundário (mesmo botão de hoje).
- Q: "Anterior"/"Próxima" animam a carta ou trocam direto? → A: animam exatamente como o gesto
  (mesma saída, mesma vibração).
- Q: Qual cor a barra de progresso usa quando a cor da categoria é escura demais para o fundo? → A: a
  cor da categoria clareada até contraste ≥ 3:1 com o fundo; no Tudo Misturado, o azul-gelo do app.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Abaixo da carta MUST haver os botões "Anterior", "Favoritar" e "Próxima", com ícone e
  rótulo, alvo de toque ≥ 44 pt.
- **FR-002**: "Próxima" MUST descartar a carta para a esquerda com a mesma animação e vibração do
  gesto; "Anterior" MUST fazer o mesmo para a direita e ficar desativado na primeira carta.
- **FR-003**: "Favoritar" MUST manter o comportamento atual (desativado com a carta virada para
  baixo; nunca descarta).
- **FR-004**: O topo MUST mostrar o contador "<n> / <total>" com rótulo de acessibilidade
  "Carta <n> de <total>" e uma barra de progresso de <n>/<total>.
- **FR-005**: A barra MUST usar a cor da categoria com contraste ≥ 3:1 com o fundo (clareada se
  preciso); no Tudo Misturado, o azul-gelo.
- **FR-006**: Atrás da carta MUST aparecer min(2, cartas restantes depois da atual) cartas viradas
  para baixo, decorativas (não tocáveis, ignoradas pelo leitor de tela); no Tudo Misturado, na cor
  neutra.
- **FR-007**: A dica curta MUST aparecer só nas 3 primeiras cartas mostradas na partida; o aviso
  "Clima trocado" continua no mesmo lugar.
- **FR-008**: No Tudo Misturado, "Mudar o clima" MUST continuar disponível nas mesmas condições da
  011, na linha abaixo da barra de ações.
- **FR-009**: Textos novos MUST estar centralizados no arquivo de textos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um baralho inteiro pode ser jogado só com os botões (0 gestos).
- **SC-002**: A posição no baralho fica visível em 100% das cartas sem texto menor que 15 pt.
- **SC-003**: Em 320×568, toda pergunta cabe na carta em ≥ 20 pt (regra da 002 mantida).
- **SC-004**: Testes automatizados continuam passando.

## Assumptions

- Medidas do canvas: botões laterais 76×64 pt, Favoritar ocupando o meio; barra de progresso de
  4 pt; cartas de trás deslocadas e giradas de leve (−2,5° e 4°).
- A dica conta as cartas mostradas na tela atual; reabrir o baralho mostra a dica de novo.
- Sem mudança de versão nesta feature.
