# Feature Specification: Física da Pilha de Cartas

**Feature Branch**: `021-deck-stack-physics`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "Animação dinâmica da pilha de cartas no fundo (Deck Stack Physics):
3 camadas visíveis — topo (0°, escala 1), meio (escala 0,95, y 8, x −8, −3,5°) e base (escala 0,90,
y 16, x 8, +3,5°); durante o arraste as cartas de fundo interpolam em tempo real na UI thread,
antecipando a transição; ao avançar (deslizar para a esquerda) o meio vai ao centro, a base sobe para
o meio invertendo a inclinação e uma nova carta surge na base; ao voltar (deslizar para a direita) a
carta recuperada volta pela esquerda ao topo e a do topo recua para o meio, empurrando o meio para a
base; na primeira carta, deslizar para a direita só dá a resistência elástica na carta ativa, com o
fundo parado."

**Depends on**: [009](../009-directional-swipe-navigation/spec.md) (← próxima, → anterior,
resistência na primeira carta), [016](../016-deck-action-bar/spec.md) (pilha estática e botões
Anterior/Próxima).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O monte acompanha o dedo (Priority: P1)

Enquanto a pessoa arrasta a carta do topo para a esquerda, as cartas do fundo já começam a se
mover: a do meio se endireita e cresce em direção ao centro, a da base sobe para o meio. Se ela
solta antes do limite, tudo volta à posição de repouso com mola.

**Why this priority**: é o que faz o baralho digital parecer um monte real sobre a mesa.

**Independent Test**: arrastar a carta até a metade do limite e ver a carta do meio a meio caminho
entre a pose inclinada e o centro; soltar e ver tudo voltar.

**Acceptance Scenarios**:

1. **Given** uma carta com pelo menos 2 cartas depois, **When** a tela está em repouso, **Then** o
   meio aparece com escala 0,95, deslocado (−8, 8) e −3,5°, e a base com escala 0,90, (8, 16) e +3,5°.
2. **Given** um arraste para a esquerda, **When** o dedo se move, **Then** as cartas do fundo
   avançam proporcionalmente ao arraste (100% no limite de descarte), sem esperar o dedo soltar.
3. **Given** um arraste abaixo do limite, **When** o dedo solta, **Then** a carta e o fundo voltam ao
   repouso com mola.

---

### User Story 2 - Avançar promove o monte (Priority: P1)

Ao descartar a carta para a esquerda (gesto ou botão "Próxima"), a carta do meio termina no centro,
reta e em tamanho cheio; a da base termina no meio, agora inclinada para a esquerda; e uma nova carta
surge na base, inclinada para a direita.

**Acceptance Scenarios**:

1. **Given** um descarte para a esquerda, **When** a carta sai, **Then** o meio chega ao centro
   (0°, escala 1, sem deslocamento) e a base chega ao meio (−3,5°, escala 0,95, (−8, 8)).
2. **Given** pelo menos 3 cartas depois da atual, **When** o descarte termina, **Then** uma nova
   carta aparece na base (+3,5°, escala 0,90).
3. **Given** as últimas cartas do baralho, **When** sobram menos de 2 cartas depois da atual,
   **Then** só as camadas existentes aparecem.

---

### User Story 3 - Voltar devolve a carta ao monte (Priority: P2)

Ao voltar para a carta anterior (deslizar para a direita ou botão "Anterior"), a carta recuperada
entra pela esquerda até o topo, e a carta que estava no topo recua para o meio, empurrando a do meio
de volta para a base.

**Acceptance Scenarios**:

1. **Given** uma volta, **When** a carta anterior aparece, **Then** ela entra pela esquerda e assenta
   no centro (0°, escala 1) com mola.
2. **Given** uma volta, **When** a carta anterior assenta, **Then** o fundo vai da pose "uma camada
   acima" para o repouso: a antiga carta do topo termina no meio (−3,5°, 0,95, (−8, 8)) e a antiga do
   meio na base (+3,5°, 0,90, (8, 16)).

---

### User Story 4 - A primeira carta não tem para onde voltar (Priority: P1)

Na primeira carta, deslizar para a direita só estica um pouco a carta ativa (resistência elástica) e
ela volta; as cartas do fundo não se mexem.

**Acceptance Scenarios**:

1. **Given** a primeira carta, **When** a pessoa arrasta para a direita, **Then** o fundo permanece
   exatamente na pose de repouso.

### Edge Cases

- Movimento reduzido: o fundo fica parado na pose de repouso; trocas de carta continuam com fade.
- Ações de acessibilidade (próxima/anterior): a troca acontece; o fundo pode se acomodar com mola.
- Fim do baralho: com 0 cartas depois da atual, não há pilha.
- Tudo Misturado e Favoritas: as cartas do fundo continuam neutras (nada revela a próxima categoria).
- "Mudar o clima": a nova carta entra sem mexer na ordem do fundo.

## Clarifications

### Session 2026-11-15

- Q: Arrastar para a direita (voltar) também move o fundo durante o gesto? → A: não; o fundo só
  antecipa o avanço. Ao voltar, a animação do fundo acontece quando a carta recuperada entra pela
  esquerda (o topo antigo recua para o meio). Assim o fundo nunca precisa "desfazer" um movimento
  quando a pessoa desiste no meio do arraste, e a regra da primeira carta (fundo parado) sai de graça.
- Q: As camadas mudam de opacidade? → A: sim, levemente (topo 1, meio 0,9, base 0,75), e a camada que
  surge ou some passa por opacidade 0, para nenhuma carta aparecer ou sumir de repente.
- Q: A pilha continua com só 2 cartas visíveis atrás da atual? → A: sim (meio e base); uma terceira
  camada invisível em repouso existe só para surgir na base durante o avanço.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Em repouso, a pilha MUST mostrar até 2 cartas atrás da atual: meio (escala 0,95,
  (−8, 8), −3,5°) e base (escala 0,90, (8, 16), +3,5°), desenhadas abaixo da carta ativa.
- **FR-002**: Durante um arraste para a esquerda, as poses do fundo MUST ser interpoladas
  continuamente pelo progresso do arraste (0 em repouso, 1 no limite de descarte), sem passar pela
  thread de JavaScript a cada quadro.
- **FR-003**: Um descarte para a esquerda MUST levar o fundo ao progresso 1 (meio → centro,
  base → meio, nova carta → base); na carta seguinte o fundo MUST voltar ao repouso com mola, sem
  saltos visíveis.
- **FR-004**: Uma volta MUST trazer a carta recuperada pela esquerda até o centro com mola, enquanto
  o fundo vai do progresso 1 ao 0 (topo antigo → meio, meio → base).
- **FR-005**: Na primeira carta, um arraste para a direita MUST NOT mover o fundo.
- **FR-006**: Os botões Anterior/Próxima MUST produzir a mesma animação do gesto.
- **FR-007**: Com movimento reduzido, o fundo MUST ficar parado e a carta recuperada MUST NOT
  deslizar (mantém o fade).
- **FR-008**: Camadas que não correspondem a cartas existentes MUST ficar invisíveis.
- **FR-009**: A pilha MUST continuar decorativa: sem toques e oculta para leitores de tela.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O fundo responde ao arraste no mesmo quadro do dedo (60 fps em aparelho intermediário,
  0 atualizações de estado por quadro).
- **SC-002**: 0 saltos visíveis de pose ao trocar de carta (avanço e volta).
- **SC-003**: Na primeira carta, o fundo se move 0 pt ao arrastar para a direita.
- **SC-004**: Typecheck, lint e testes continuam passando.

## Assumptions

- "Limite de descarte" é o já existente (30% da largura da tela ou arremesso rápido, 009).
- As cartas do fundo continuam lisas (cor do baralho ou neutra), como na 016.
- Sem mudança de versão nesta feature; a versão sobe uma vez, depois das features 019–021.
