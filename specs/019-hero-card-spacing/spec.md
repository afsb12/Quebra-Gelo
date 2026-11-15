# Feature Specification: Respiro e Margens do Card "Tudo Misturado"

**Feature Branch**: `019-hero-card-spacing`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "Refinamento de Espaçamento e Margens do Hero Card ('Tudo Misturado'):
margens externas (topo 16, base 24) e alinhamento lateral idêntico ao da grade; padding interno 20
(vertical e horizontal) e gap 8 entre símbolo, título e descrição; botão de filtro (⚙️) isolado no
canto superior direito (top 14, right 14, hitSlop 10 em todos os lados) e paddingRight 36 no texto
para nunca encostar no botão em telas pequenas."

**Depends on**: [006](../006-mixed-mode-category-filter/spec.md) (filtro de categorias da mistura),
[015](../015-home-grid-redesign/spec.md) (card horizontal "Tudo Misturado" e grade de 3 colunas).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Um card de destaque que respira (Priority: P1)

Na tela inicial, o card "Tudo Misturado" fica claramente separado do cabeçalho ("Sobre o que vamos
conversar?") e da grade de categorias, com as laterais exatamente alinhadas às bordas da grade, e o
conteúdo interno (símbolo, título, descrição, "Jogar") não encosta nas bordas do card.

**Why this priority**: é o primeiro elemento que a pessoa vê; o aperto atual deixa o layout pesado.

**Independent Test**: abrir o app num celular de 360 pt e ver 16 pt acima do card, 24 pt abaixo,
bordas laterais alinhadas às da grade e 20 pt de folga interna em todos os lados.

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** ela aparece, **Then** há 16 pt entre o cabeçalho e o card e
   24 pt entre o card e a grade de categorias (rótulo "Baralhos").
2. **Given** a tela inicial, **When** ela aparece, **Then** as bordas esquerda e direita do card
   coincidem com as bordas externas da grade.
3. **Given** o card, **When** ele aparece, **Then** o conteúdo fica a 20 pt das bordas internas e
   símbolo, título e descrição ficam separados por 8 pt.

---

### User Story 2 - Filtro sem toque acidental (Priority: P1)

O botão de filtro da mistura fica sozinho no canto superior direito do card, longe do "Jogar", com
uma área de toque generosa; tocar nele abre o filtro e nunca inicia o jogo. O título nunca encosta
nem passa por baixo do botão, mesmo em telas estreitas.

**Why this priority**: hoje o filtro fica ao lado do "Jogar"; um toque impreciso inicia o jogo
quando a pessoa queria filtrar (ou o contrário).

**Independent Test**: tocar no botão do canto abre o filtro sem abrir o baralho; num celular de
320 pt o título "Tudo Misturado" termina antes do botão.

**Acceptance Scenarios**:

1. **Given** o card, **When** a pessoa toca no botão do canto superior direito, **Then** o filtro
   abre e o jogo não começa.
2. **Given** o card, **When** a pessoa toca em qualquer outro ponto, **Then** o jogo começa.
3. **Given** uma tela de 320 pt, **When** o card aparece, **Then** o texto do título reserva 36 pt à
   direita e nunca se sobrepõe ao botão.
4. **Given** o filtro com 8 de 10 categorias, **When** o card aparece, **Then** o resumo "8 de 10
   categorias" continua visível no card.

### Edge Cases

- Telas estreitas (320 pt): o título reduz a fonte para caber numa linha antes do botão.
- Fonte grande do sistema: o card cresce na altura em vez de cortar o conteúdo.
- Leitor de tela: o botão do filtro mantém o rótulo "Escolher categorias da mistura: <resumo>" e o
  card continua anunciando "Tudo Misturado" com o resumo.

## Clarifications

### Session 2026-11-15

- Q: O resumo de categorias ("10 categorias") sai do card junto com o chip? → A: não; o botão do
  canto vira só ícone, e o resumo passa a ser um texto ao lado do "Jogar" (015 exige o resumo
  sempre visível).
- Q: Qual ícone usar no botão do canto (⚙️)? → A: a engrenagem da biblioteca de ícones do app
  (`cog-outline`), no lugar do emoji, para manter o estilo traçado dos outros ícones.
- Q: A altura fixa do card (proporção 0,42) comporta o padding de 20 pt? → A: não em telas
  pequenas; a altura passa a ter um mínimo que comporta o conteúdo (a proporção vira o piso visual).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O card MUST ter 16 pt de margem acima e 24 pt abaixo.
- **FR-002**: O card MUST ocupar exatamente a largura da grade de categorias, com as mesmas bordas
  laterais.
- **FR-003**: O conteúdo do card MUST ter 20 pt de padding vertical e horizontal.
- **FR-004**: Símbolo, título e descrição MUST ser separados por 8 pt.
- **FR-005**: O botão de filtro MUST ficar no canto superior direito, a 14 pt do topo e da direita,
  com área de toque ampliada em 10 pt em cada lado.
- **FR-006**: O bloco do título MUST reservar 36 pt à direita para nunca alcançar o botão.
- **FR-007**: Tocar no botão MUST abrir o filtro e MUST NOT iniciar o jogo; tocar no resto do card
  MUST iniciar o jogo.
- **FR-008**: O resumo de categorias da mistura MUST continuar visível no card.
- **FR-009**: Os valores de espaçamento MUST vir de constantes nomeadas (sem números soltos).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 sobreposições entre título e botão de filtro em telas de 320 a 430 pt.
- **SC-002**: As bordas laterais do card e da grade diferem em 0 pt.
- **SC-003**: Tocar no botão de filtro nunca inicia o jogo (0 casos nos testes).
- **SC-004**: Typecheck, lint e testes continuam passando.

## Assumptions

- Os valores em pt são os da descrição; não viram tokens globais, apenas constantes do card.
- A grade já é de 3 colunas (015); esta feature só ajusta o card de destaque.
- Sem mudança de versão nesta feature; a versão sobe uma vez, depois das features 019–021.
