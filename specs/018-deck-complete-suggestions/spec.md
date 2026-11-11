# Feature Specification: Fim do Baralho com Sugestões

**Feature Branch**: `018-deck-complete-suggestions`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Aplicar a proposta do Fim do baralho do canvas de revisão de design
(https://claude.ai/artifact/7Cup4PFup16b56zKDjgJaV, quadro 'Fim do baralho — proposta'): um leque
de cartas comemora o fim; abaixo, duas sugestões de próximo baralho, para ninguém precisar voltar ao
Início."

**Depends on**: [001](../001-icebreaker-cards-mvp/spec.md) ("Fim do Baralho"),
[008](../008-reshuffle-remaining-cards/spec.md) (embaralhar de novo),
[017](../017-favorites-filter-play/spec.md) (baralho de favoritas).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Continuar com outro baralho (Priority: P1)

Ao terminar um baralho de categoria, a tela de fim mostra "Que tal continuar com" e duas sugestões
de próximo baralho (as duas categorias seguintes na ordem do Início, voltando ao começo da lista se
preciso). Tocar numa sugestão abre aquele baralho direto.

**Why this priority**: mantém a conversa fluindo sem voltar ao Início.

**Independent Test**: terminar "Dilemas" e ver as sugestões "Viagens e Aventuras" e "Nostalgia e
Infância"; tocar numa abre o baralho dela.

**Acceptance Scenarios**:

1. **Given** o fim de Dilemas, **When** a tela aparece, **Then** sugere as 2 categorias seguintes na
   ordem do Início.
2. **Given** o fim da última categoria da lista, **When** a tela aparece, **Then** as sugestões voltam
   ao começo da lista.
3. **Given** uma sugestão, **When** a pessoa toca nela, **Then** o baralho sugerido abre no lugar da
   tela de fim.
4. **Given** o fim do Tudo Misturado ou das Favoritas, **When** a tela aparece, **Then** não há
   sugestões (só embaralhar de novo e ver todos os baralhos).

---

### User Story 2 - Um fim que comemora (Priority: P2)

A tela de fim mostra um leque de três cartas viradas (na cor do baralho, com o ícone na carta da
frente), o título "Fim do Baralho", a mensagem, o botão "Embaralhar de novo" e o link "Ver todos os
baralhos" (que volta ao Início).

**Acceptance Scenarios**:

1. **Given** o fim de um baralho, **When** a tela aparece, **Then** vê o leque na cor do baralho, o
   título e a mensagem "Vocês viram todas as perguntas de <baralho>.".
2. **Given** a tela de fim, **When** a pessoa toca "Embaralhar de novo", **Then** o baralho recomeça da
   carta 1.
3. **Given** a tela de fim, **When** a pessoa toca "Ver todos os baralhos", **Then** volta ao Início.

### Edge Cases

- Leitor de tela: o leque é decorativo; cada sugestão é um botão com o nome da categoria.
- Tudo Misturado: o leque usa a cor neutra (nada revela categorias).
- Telas pequenas: o conteúdo rola se não couber.

## Clarifications

### Session 2026-11-11

- Q: Como escolher as duas sugestões? → A: as 2 categorias seguintes na ordem do Início, com volta ao
  começo; determinístico, sem sorteio (fácil de prever e de testar).
- Q: Tudo Misturado e Favoritas mostram sugestões? → A: não; eles já misturam categorias.
- Q: O link "Escolher outra categoria" continua? → A: vira "Ver todos os baralhos", com o mesmo
  destino (Início).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Ao fim de um baralho de categoria, a tela MUST sugerir as 2 categorias seguintes na
  ordem do conteúdo, com volta ao começo, nunca a própria categoria.
- **FR-002**: Tocar numa sugestão MUST abrir aquele baralho substituindo a tela atual.
- **FR-003**: O Tudo Misturado e as Favoritas MUST NOT mostrar sugestões.
- **FR-004**: A tela MUST mostrar um leque decorativo de 3 cartas na cor do baralho (neutra no Tudo
  Misturado), o título, a mensagem, "Embaralhar de novo" e "Ver todos os baralhos".
- **FR-005**: A regra de escolha das sugestões MUST ser uma função pura testada na camada de dados.
- **FR-006**: Textos novos MUST estar centralizados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Do fim de um baralho ao próximo baralho em 1 toque (antes: 2, via Início).
- **SC-002**: As sugestões nunca repetem a categoria terminada (0 casos).
- **SC-003**: Testes automatizados continuam passando.

## Assumptions

- Visual do canvas: leque de cartas de 96×134 pt com ±18°, sugestões em cartões escuros com um
  mini verso da categoria e o nome.
- Sem mudança de versão nesta feature; a versão sobe uma vez, depois desta.
