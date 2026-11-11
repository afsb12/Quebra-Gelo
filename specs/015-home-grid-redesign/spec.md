# Feature Specification: Início em Grade de 3 Colunas

**Feature Branch**: `015-home-grid-redesign`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Aplicar a proposta do Início do canvas de revisão de design
(https://claude.ai/artifact/7Cup4PFup16b56zKDjgJaV, quadro 'Início — proposta'): grade 3×3 de
versos de carta, como cartas sobre a mesa; o filtro da mistura vira um chip com texto em vez de um
ícone solto; o título repetido 'Quebra-Gelo' vira a pergunta-convite 'Sobre o que vamos
conversar?'."

**Depends on**: [002-card-visual-design](../002-card-visual-design/spec.md) (versos das cartas),
[004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md) (cartão "Tudo Misturado"),
[005-onboarding-tutorial](../005-onboarding-tutorial/spec.md) (tutorial sobre a Home) e
[006-mixed-mode-category-filter](../006-mixed-mode-category-filter/spec.md) (filtro da mistura).

**Contexto**: hoje a Home mostra as categorias numa grade de 2 colunas, cada uma com o verso da
carta em tamanho grande, o nome e a descrição embaixo. Com 10 categorias, só 2 aparecem sem rolar
a tela. O filtro do "Tudo Misturado" é um ícone pequeno no canto do cartão, fácil de não ver, e o
nome do app aparece duas vezes (título e marca).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver os baralhos de relance (Priority: P1)

A pessoa abre o app e vê os baralhos como cartas sobre a mesa: uma grade de 3 colunas de versos,
com o nome já impresso em cada verso. A maior parte dos baralhos cabe na tela sem rolar.

**Why this priority**: é o principal problema do Início atual (só 2 de 10 categorias visíveis).

**Independent Test**: abrir a Home num celular de 390×844 e contar quantos versos aparecem sem
rolar; tocar num verso abre aquele baralho.

**Acceptance Scenarios**:

1. **Given** a Home aberta, **When** a pessoa olha a grade, **Then** vê os versos das categorias em
   3 colunas, na ordem do conteúdo, com o nome de cada uma no próprio verso.
2. **Given** a Home aberta num celular de 390×844, **When** nada é rolado, **Then** pelo menos 6
   versos de categoria aparecem inteiros.
3. **Given** a grade, **When** a pessoa toca num verso, **Then** o baralho daquela categoria abre
   (1 toque, como hoje).
4. **Given** um leitor de tela, **When** o foco chega num verso, **Then** ele anuncia o nome e a
   descrição da categoria.

---

### User Story 2 - Começar o Tudo Misturado e ajustar a mistura (Priority: P2)

O cartão "Tudo Misturado" mostra um botão "Jogar" e um chip com o número de categorias da mistura
("10 categorias", ou "8 de 10 categorias" quando filtrada). Tocar no cartão ou em "Jogar" começa o
jogo; tocar no chip abre o filtro e nunca começa o jogo.

**Why this priority**: o filtro existe desde a 006 mas é pouco descoberto.

**Independent Test**: tocar no chip abre o filtro; salvar 8 de 10 muda o chip para "8 de 10
categorias"; tocar em "Jogar" abre o baralho misturado.

**Acceptance Scenarios**:

1. **Given** a mistura com todas as categorias, **When** a pessoa olha o cartão, **Then** o chip diz
   "10 categorias".
2. **Given** a mistura filtrada em 8 categorias, **When** a pessoa olha o cartão, **Then** o chip diz
   "8 de 10 categorias".
3. **Given** o cartão, **When** a pessoa toca no chip, **Then** o filtro abre e o jogo não começa.
4. **Given** o cartão, **When** a pessoa toca em "Jogar" ou no restante do cartão, **Then** o
   baralho misturado abre.

---

### User Story 3 - Um convite em vez do nome repetido (Priority: P3)

O topo da Home mostra a marca (símbolo + "Quebra-Gelo") pequena ao lado de "Favoritos", e o título
da tela passa a ser a pergunta-convite "Sobre o que vamos conversar?".

**Why this priority**: melhora o tom, mas não muda o que a pessoa consegue fazer.

**Independent Test**: abrir a Home e ver a marca pequena, o botão Favoritos e o título-pergunta.

**Acceptance Scenarios**:

1. **Given** a Home, **When** a pessoa olha o topo, **Then** vê o símbolo do app e "Quebra-Gelo" em
   tamanho de marca, e "Favoritos" à direita.
2. **Given** a Home, **When** o leitor de tela lê os títulos, **Then** o título da tela é "Sobre o
   que vamos conversar?".

### Edge Cases

- 10 categorias em 3 colunas: a última linha tem 1 verso, alinhado à esquerda como os demais.
- Fonte do sistema grande: os nomes nos versos não usam a escala de fonte do sistema (como hoje),
  e a descrição continua acessível pelo leitor de tela.
- Telas estreitas (320 pt): os versos encolhem junto com a largura, mantendo 3 colunas.
- Tutorial da primeira abertura: continua aparecendo por cima da Home, sem mudanças.

## Clarifications

### Session 2026-11-11

- Q: Com 10 categorias, como fica a última linha da grade de 3 colunas? → A: um verso, alinhado à
  esquerda, sem reordenar nem centralizar (a ordem do conteúdo é preservada).
- Q: O cartão inteiro do Tudo Misturado continua começando o jogo, ou só o botão "Jogar"? → A: o
  cartão inteiro continua sendo o alvo de toque (como hoje); "Jogar" é parte visual dele, e só o
  chip é um botão separado.
- Q: A descrição de cada categoria some da Home? → A: some da tela, mas continua no rótulo de
  acessibilidade do verso.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A Home MUST mostrar as categorias como versos de carta numa grade de 3 colunas, na
  ordem do conteúdo, com espaçamento uniforme, e a última linha alinhada à esquerda.
- **FR-002**: Cada verso MUST mostrar só o verso da carta (ícone e nome); nome e descrição não são
  repetidos embaixo.
- **FR-003**: O rótulo de acessibilidade de cada verso MUST continuar sendo "<nome>. <descrição>".
- **FR-004**: Tocar num verso MUST abrir o baralho da categoria.
- **FR-005**: O cartão Tudo Misturado MUST mostrar o símbolo, o nome, a descrição, um indicador
  "Jogar" e um chip de filtro com o texto "<total> categorias" (sem filtro) ou "<ativas> de <total>
  categorias" (com filtro).
- **FR-006**: Tocar no chip MUST abrir o filtro sem começar o jogo; tocar no restante do cartão MUST
  começar o baralho misturado.
- **FR-007**: O topo MUST mostrar o símbolo e o nome do app em tamanho de marca e o botão
  "Favoritos"; o título da tela MUST ser "Sobre o que vamos conversar?" e acima da grade MUST
  aparecer o rótulo "Ou escolha um baralho".
- **FR-008**: Todos os textos novos MUST estar centralizados no arquivo de textos do app.

### Key Entities

Nenhuma entidade nova; a Home continua lendo as categorias e o filtro da mistura.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Num celular de 390×844, pelo menos 6 versos de categoria ficam visíveis sem rolar
  (hoje: 2).
- **SC-002**: O primeiro baralho de categoria continua a 1 toque da Home, e o primeiro cartão a no
  máximo 2 toques.
- **SC-003**: O estado do filtro da mistura fica visível no cartão em 100% dos casos (com ou sem
  filtro).
- **SC-004**: Testes automatizados e validação de conteúdo continuam passando.

## Assumptions

- Medidas do canvas: 3 colunas com 12 pt entre os versos, verso na proporção 5:7 de sempre.
- O "Jogar" usa a cor de destaque do símbolo do app (coral) com texto escuro.
- As outras propostas do canvas (Jogo, Favoritos, Fim do baralho) são features separadas.
- Nenhuma mudança de versão nesta feature; a versão sobe uma vez, no fim de todas as features.
