# Feature Specification: Ícone de Brinde de Chope para o Happy Hour

**Feature Branch**: `014-happy-hour-toast-icon`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Novo ícone para a categoria Happy Hour: um brinde de canecas de chope.
Hoje o Happy Hour usa o ícone 'glass-cocktail' (taça de coquetel com haste), que se parece demais
com o 'glass-flute' (taça de espumante com haste) de Primeiros Encontros: duas taças finas com haste,
difíceis de distinguir, principalmente nos versos pequenos da Home. O novo ícone mostra duas canecas
de chope largas, com alça e espuma, inclinadas uma para a outra num brinde, com pequenos traços de
'tim-tim' acima. [...] usado em todos os lugares onde o ícone de categoria aparece [...]. Deve herdar
a cor e o tamanho como os demais ícones, ser decorativo para leitores de tela, e não mudar nada para
as outras categorias."

**Depends on**: [002-card-visual-design](../002-card-visual-design/spec.md) (identidade visual de
cada categoria: cor, ícone, verso e frente da carta),
[007-first-dates-category](../007-first-dates-category/spec.md) (definiu a taça de espumante de
Primeiros Encontros) e [012-automated-qa-tests](../012-automated-qa-tests/spec.md) (testes que
precisam continuar verdes).

**Referência visual**: quadro "Ícone do Happy Hour — antes e depois" do canvas de revisão de design
(https://claude.ai/artifact/7Cup4PFup16b56zKDjgJaV).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconhecer o Happy Hour de relance (Priority: P1)

Na Home, a pessoa olha os versos das cartas para escolher um baralho. O verso do Happy Hour mostra
duas canecas de chope fazendo um brinde, com alça e espuma, e não pode mais ser confundido com a taça
de espumante de Primeiros Encontros, nem nos versos pequenos da grade.

**Why this priority**: é o problema relatado: dois ícones de taça com haste, quase iguais, lado a lado
na escolha de baralho.

**Independent Test**: abrir a Home e comparar os versos de Happy Hour e Primeiros Encontros: o
primeiro mostra o brinde de canecas e o segundo continua com a taça de espumante.

**Acceptance Scenarios**:

1. **Given** a Home aberta, **When** a pessoa olha o verso mini do Happy Hour, **Then** vê o ícone de
   brinde de canecas na cor de texto do verso, do mesmo tamanho dos ícones das outras categorias.
2. **Given** a Home aberta, **When** a pessoa olha o verso de Primeiros Encontros, **Then** ele
   continua com a taça de espumante, sem nenhuma mudança.

---

### User Story 2 - O mesmo ícone em todo o app (Priority: P2)

Onde quer que o ícone da categoria Happy Hour apareça (verso cheio da carta, canto e selo de origem
da frente da carta, filtro de categorias do Tudo Misturado, lista de favoritos e tela de fim do
baralho), aparece o mesmo brinde de canecas, na cor e no tamanho que aquele lugar já usa para os
ícones de categoria.

**Why this priority**: um ícone diferente em cada tela quebraria a identidade visual da categoria.

**Independent Test**: jogar uma carta do Happy Hour, favoritá-la, abrir os Favoritos, abrir o filtro
da mistura e terminar o baralho: em todas as telas o ícone é o brinde de canecas.

**Acceptance Scenarios**:

1. **Given** uma carta do Happy Hour virada para cima, **When** a pessoa olha o canto da carta,
   **Then** vê o brinde de canecas na cor da categoria sobre o papel creme.
2. **Given** o Tudo Misturado com uma carta do Happy Hour revelada, **When** a pessoa olha o selo de
   origem, **Then** o selo mostra o brinde de canecas.
3. **Given** uma pergunta do Happy Hour nos favoritos, **When** a pessoa abre os Favoritos, **Then** o
   item mostra o brinde de canecas.
4. **Given** o filtro da mistura aberto, **When** a pessoa olha a opção Happy Hour, **Then** ela mostra
   o brinde de canecas.
5. **Given** o fim do baralho do Happy Hour, **When** a tela de fim aparece, **Then** ela mostra o
   brinde de canecas.

### Edge Cases

- Leitor de tela: o ícone é decorativo e não é anunciado; os rótulos de acessibilidade das cartas,
  botões e itens continuam iguais.
- Tamanhos muito pequenos (selo de origem, filtro, favoritos): o desenho continua legível como duas
  canecas, sem virar uma mancha.
- Cores: no verso, o ícone usa a cor de texto escolhida para o laranja do Happy Hour; na frente, usa a
  cor da categoria sobre o creme. Nenhuma cor muda.
- Movimento reduzido e animações das cartas: o ícone não anima e não muda o comportamento das cartas.
- Outras categorias: nenhum ícone muda, inclusive o da categoria Família e o símbolo do Tudo
  Misturado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A categoria Happy Hour MUST ser representada por um ícone de duas canecas de chope
  largas, com alça e espuma, inclinadas uma para a outra num brinde, com pequenos traços de
  "tim-tim" acima, conforme o quadro de referência.
- **FR-002**: O ícone MUST ser desenhado em traço, com espessura e cantos arredondados equivalentes
  aos dos demais ícones de categoria, para não destoar deles.
- **FR-003**: O ícone MUST aparecer em todos os lugares onde o ícone de uma categoria aparece hoje:
  verso cheio e verso mini da carta, canto da frente da carta, selo de origem do Tudo Misturado,
  filtro da mistura, item de favoritos e tela de fim do baralho.
- **FR-004**: Em cada lugar, o ícone MUST usar a mesma cor e o mesmo tamanho que aquele lugar já usa
  para os ícones de categoria.
- **FR-005**: O ícone MUST ser decorativo para leitores de tela (não anunciado), sem mudar nenhum
  rótulo de acessibilidade existente.
- **FR-006**: Os ícones das outras categorias, as cores, os textos e as perguntas MUST continuar
  exatamente iguais.
- **FR-007**: O ícone MUST fazer parte do app (funciona offline desde a primeira abertura, sem
  download).
- **FR-008**: A validação automática do conteúdo MUST continuar aceitando a definição de ícone de
  todas as categorias e MUST recusar um nome de ícone que o app não saiba desenhar.

### Key Entities

- **Ícone de categoria**: o desenho que identifica uma categoria. Hoje cada categoria aponta para um
  ícone da biblioteca de ícones do app; o Happy Hour passa a apontar para um ícone próprio do app.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos 7 lugares listados em FR-003, a carta ou item do Happy Hour mostra o brinde
  de canecas.
- **SC-002**: Nenhuma outra categoria tem o ícone alterado (0 diferenças nos outros 9 ícones).
- **SC-003**: Ao ver lado a lado os versos mini de Happy Hour e Primeiros Encontros, uma pessoa os
  diferencia sem ler o nome da categoria.
- **SC-004**: Os testes automatizados e a validação do conteúdo continuam passando.

## Assumptions

- O desenho segue os paths do quadro de referência (viewBox 24×24, traço sem preenchimento): traços
  de brinde `M12 1.5v2.5M8.8 2.6l1 1.6M15.2 2.6l-1 1.6` e a caneca
  `M4 9h7v10a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 014 19zM4 11.5H2.5v4H4M4 9c0-1.5 1.2-2.4 2.3-1.8.6-1 2.2-1 2.8 0 1.1-.4 1.9.6 1.9 1.8M7.5 12v5`
  desenhada duas vezes, com `rotate(14 7.5 14)` e `translate(24 0) scale(-1 1) rotate(14 7.5 14)`.
- A biblioteca de ícones atual não tem um brinde de chope; por isso o ícone é próprio do app, e não
  uma troca de nome na biblioteca.
- Só o ícone do Happy Hour muda; as demais melhorias do canvas (grade 3×3, barra de ações etc.) ficam
  fora deste escopo.
- O ícone do app e a tela de abertura não mudam.
- A versão do app sobe (1.6.0 → 1.7.0) para gerar uma nova versão com o ícone.
