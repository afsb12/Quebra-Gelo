# Feature Specification: Favoritos com Filtro e Baralho de Favoritas

**Feature Branch**: `017-favorites-filter-play`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Aplicar a proposta de Favoritos do canvas de revisão de design
(https://claude.ai/artifact/7Cup4PFup16b56zKDjgJaV, quadro 'Favoritos — proposta'): chips de
filtro por categoria; um botão novo, 'Jogar com as favoritas', que transforma a lista em baralho
(offline, sem backend); os itens perdem a faixa colorida lateral e ganham um cabeçalho com o ícone e
o nome da categoria, como na frente da carta."

**Depends on**: [001](../001-icebreaker-cards-mvp/spec.md) (favoritos persistidos, baralho sem
repetição), [004](../004-mixed-mode-hidden-backs/spec.md) (verso neutro + selo de origem) e
[016](../016-deck-action-bar/spec.md) (tela de jogo atual).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar com as perguntas favoritas (Priority: P1)

Na tela de Favoritos há um botão "Jogar com as favoritas". Ele abre um baralho com todas as
perguntas favoritas, embaralhadas, que se joga como os outros: uma carta por vez, sem repetir, com o
selo da categoria de origem na frente e o verso neutro do app.

**Why this priority**: transforma a lista em algo jogável — o maior ganho de valor da proposta.

**Independent Test**: favoritar 3 perguntas, abrir Favoritos, tocar "Jogar com as favoritas" e jogar:
as 3 aparecem uma vez cada, depois o fim do baralho.

**Acceptance Scenarios**:

1. **Given** 3 favoritas, **When** a pessoa toca "Jogar com as favoritas", **Then** abre o baralho
   "Favoritas" com 3 cartas ("1 / 3").
2. **Given** o baralho de favoritas, **When** a pessoa vira uma carta, **Then** vê a pergunta e o selo
   da categoria de origem.
3. **Given** o fim do baralho de favoritas, **When** a pessoa toca "Embaralhar de novo", **Then** o
   baralho recomeça com as favoritas atuais.
4. **Given** nenhuma favorita, **When** a pessoa abre Favoritos, **Then** o botão não aparece (o
   estado vazio de hoje continua).
5. **Given** que a pessoa favoritou ou removeu perguntas desde a última partida, **When** ela toca o
   botão de novo, **Then** o baralho é montado com as favoritas atuais.

---

### User Story 2 - Filtrar a lista por categoria (Priority: P2)

Acima da lista há chips: "Todas" e uma por categoria que tenha favoritas, cada uma com um ponto na
cor da categoria. Tocar num chip mostra só as favoritas daquela categoria.

**Independent Test**: com favoritas de 2 categorias, tocar no chip de uma delas mostra só as dela;
"Todas" mostra tudo.

**Acceptance Scenarios**:

1. **Given** favoritas de Profundo e Viagens, **When** a pessoa abre Favoritos, **Then** vê os chips
   "Todas", "Profundo" e "Viagens e Aventuras", com "Todas" selecionado.
2. **Given** o chip "Profundo" selecionado, **When** a pessoa olha a lista, **Then** só aparecem as
   favoritas de Profundo.
3. **Given** o chip "Profundo" selecionado, **When** a pessoa remove a última favorita de Profundo,
   **Then** o filtro volta para "Todas" e o chip some.

---

### User Story 3 - Itens no estilo da carta (Priority: P3)

Cada item é um cartão creme com um cabeçalho (ícone e nome da categoria na cor da categoria, como na
frente da carta) e a estrela de remover à direita; a pergunta vem embaixo. O topo mostra quantas
perguntas estão salvas.

**Acceptance Scenarios**:

1. **Given** um item, **When** a pessoa olha, **Then** vê o ícone e o nome da categoria na cor dela,
   a pergunta e a estrela de remover; não há faixa colorida lateral.
2. **Given** 5 favoritas, **When** a pessoa olha o topo, **Then** vê "5 perguntas" (1 → "1 pergunta").

### Edge Cases

- Favorita cuja pergunta saiu do conteúdo: já é descartada ao carregar (regra atual).
- Remover uma favorita durante a partida de favoritas: a partida em andamento não muda; a próxima
  partida usa a lista atual.
- O baralho de favoritas não tem "Mudar o clima" (é exclusivo do Tudo Misturado).
- O progresso do baralho de favoritas fica só em memória, como os outros baralhos.

## Clarifications

### Session 2026-11-11

- Q: "Jogar com as favoritas" usa o filtro de categoria selecionado? → A: não; joga sempre todas as
  favoritas (o filtro serve para navegar na lista; o botão diz "as favoritas").
- Q: A carta do baralho de favoritas mostra o verso da categoria ou o verso neutro? → A: o verso
  neutro e o selo de origem, como no Tudo Misturado (a categoria aparece só ao virar).
- Q: Ao voltar a Favoritos e tocar o botão de novo, retoma a partida ou recomeça? → A: recomeça
  sempre, com as favoritas atuais (a lista pode ter mudado).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela de Favoritos MUST mostrar o botão "Jogar com as favoritas" sempre que houver ao
  menos 1 favorita.
- **FR-002**: O botão MUST abrir um baralho "Favoritas" com todas as favoritas atuais, embaralhadas,
  sem repetição, recomeçado do início a cada toque.
- **FR-003**: As cartas desse baralho MUST usar o verso neutro do app e mostrar o selo da categoria
  de origem na frente; "Mudar o clima" MUST NOT aparecer.
- **FR-004**: "Embaralhar de novo" no fim desse baralho MUST montar o baralho com as favoritas atuais.
- **FR-005**: A tela MUST mostrar chips "Todas" + uma por categoria com favoritas (ordem do
  conteúdo), seleção única; o filtro MUST voltar para "Todas" quando a categoria selecionada ficar
  sem favoritas.
- **FR-006**: Cada item MUST ter cabeçalho com ícone e nome da categoria na cor de texto da categoria
  sobre o creme, a estrela de remover (alvo ≥ 44 pt, rótulo atual) e a pergunta; sem faixa lateral.
- **FR-007**: O topo MUST mostrar a contagem "<n> perguntas" (singular para 1).
- **FR-008**: Textos novos MUST estar centralizados; nenhum dado novo é salvo no aparelho.

### Key Entities

- **Baralho de favoritas**: um baralho como os outros, cuja lista de perguntas são as favoritas no
  momento em que ele é montado; progresso só em memória.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Das Favoritos à primeira carta de favoritas em 1 toque.
- **SC-002**: 100% das favoritas aparecem exatamente uma vez por partida.
- **SC-003**: Filtrar por uma categoria mostra 0 itens de outras categorias.
- **SC-004**: Testes automatizados continuam passando.

## Assumptions

- O botão usa a cor de destaque do app (coral) com texto escuro, fixo no rodapé da tela.
- Os pontos dos chips usam a cor da categoria clareada até ficar visível sobre o fundo escuro.
- Sem mudança de versão nesta feature.
