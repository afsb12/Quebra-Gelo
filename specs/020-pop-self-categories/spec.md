# Feature Specification: 12 Categorias — Cultura Pop e Autoconhecimento

**Feature Branch**: `020-pop-self-categories`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "Expansão para 12 categorias (grade 3x4) e curadoria de conteúdo:
adicionar 'Cultura Pop' (🎬, #E84393, 'Filmes, séries, músicas e opiniões polêmicas sobre
entretenimento.') e 'Autoconhecimento' (🪞, #00A8FF, 'Reflexões sobre hábitos, valores, gatilhos e
descobertas pessoais.') para completar 12 baralhos; grade de 3 colunas fixas com gap 12 e 4 linhas
completas; o filtro do Tudo Misturado reconhece as 12 e liga as duas novas por padrão; 30 perguntas
abertas, humanas e equilibradas para cada nova categoria (persona de psicólogo comportamental),
100% offline."

**Depends on**: [006](../006-mixed-mode-category-filter/spec.md) (filtro da mistura),
[010](../010-deck-curation-expansion/spec.md) (regras de curadoria, 30 perguntas por categoria),
[015](../015-home-grid-redesign/spec.md) (grade de 3 colunas), [019](../019-hero-card-spacing/spec.md).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dois baralhos novos na Home (Priority: P1)

A tela inicial mostra 12 baralhos numa grade de 3 colunas e 4 linhas completas, sem buraco na última
linha. "Cultura Pop" (rosa, claquete) e "Autoconhecimento" (azul, espelho) aparecem no fim da grade e
abrem seus baralhos com 30 cartas cada.

**Why this priority**: completa a grade e amplia os temas de conversa.

**Independent Test**: abrir a Home, contar 12 mini cartas em 4 linhas de 3; tocar em "Cultura Pop" e
ver "1 / 30".

**Acceptance Scenarios**:

1. **Given** a Home, **When** ela aparece, **Then** há 12 baralhos em 4 linhas completas de 3.
2. **Given** a Home, **When** a pessoa toca em "Cultura Pop", **Then** abre um baralho de 30 cartas
   de Cultura Pop.
3. **Given** a Home, **When** a pessoa toca em "Autoconhecimento", **Then** abre um baralho de 30
   cartas de Autoconhecimento.

---

### User Story 2 - As novas entram na mistura (Priority: P1)

O Tudo Misturado inclui as 12 categorias. Quem já tinha um filtro salvo (por exemplo, sem Dilemas)
mantém suas escolhas, e as duas categorias novas entram ligadas.

**Independent Test**: com um filtro salvo antes da atualização sem "Dilemas", abrir o filtro e ver
Cultura Pop e Autoconhecimento ligadas e Dilemas desligada; o resumo mostra "11 de 12 categorias".

**Acceptance Scenarios**:

1. **Given** uma instalação nova, **When** a Home aparece, **Then** o resumo mostra "12 categorias".
2. **Given** um filtro salvo sem Dilemas, **When** o app abre após a atualização, **Then** as novas
   categorias estão ligadas e o resumo mostra "11 de 12 categorias".

---

### User Story 3 - Perguntas que valem a conversa (Priority: P1)

As 60 perguntas novas são abertas, acolhedoras e equilibradas: Cultura Pop fala de filmes, séries,
músicas, jogos e opiniões sobre entretenimento sem exigir repertório; Autoconhecimento convida a
refletir sobre hábitos, valores, gatilhos e descobertas sem soar como terapia nem expor quem responde.

**Acceptance Scenarios**:

1. **Given** qualquer carta nova, **When** ela é lida, **Then** é uma pergunta aberta (não de sim/não)
   em português do Brasil, com até 200 caracteres.
2. **Given** Autoconhecimento, **When** as cartas são lidas, **Then** nenhuma pede para revelar
   traumas, saúde, diagnósticos, religião, dinheiro ou vida amorosa.
3. **Given** Cultura Pop, **When** as cartas são lidas, **Then** qualquer pessoa consegue responder
   com o que gosta, sem precisar conhecer uma obra específica.

### Edge Cases

- Telas estreitas (320 pt): as 12 mini cartas continuam em 3 colunas, com rolagem vertical.
- Leitor de tela: as novas mini cartas têm rótulo com nome e descrição, como as demais.
- Cores: as duas novas têm cor de verso e de destaque na frente com contraste ≥ 4,5:1 e distintas das
  outras dez.

## Clarifications

### Session 2026-11-15

- Q: Os ícones 🎬 e 🪞 são emojis; o app usa ícones traçados. → A: usar os equivalentes da biblioteca
  de ícones do app: claquete (`movie-open-outline`) e espelho (`mirror`); emojis renderizam diferente
  em cada aparelho e quebrariam o estilo (regra 4 do conteúdo).
- Q: Os IDs pedidos são `cp-1…cp-30` e `auto-1…auto-30`; o padrão do app é `<categoria>-NNN`. → A:
  manter o padrão (`cultura-pop-001…030`, `autoconhecimento-001…030`), validado pelo teste de
  conteúdo; IDs estáveis no mesmo formato evitam um caso especial nos favoritos.
- Q: Em que posição as novas aparecem na grade? → A: no fim, depois de Futuro e Sonhos ("adicionar à
  lista existente"), sem reordenar as dez atuais.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O conteúdo MUST ter 12 categorias, com Cultura Pop e Autoconhecimento ao fim, com os
  títulos, cores e descrições pedidos.
- **FR-002**: Cada nova categoria MUST ter exatamente 30 perguntas com IDs estáveis
  `<categoria>-001…030`.
- **FR-003**: A Home MUST mostrar os 12 baralhos em 3 colunas com espaçamento uniforme de 12 pt,
  formando 4 linhas completas.
- **FR-004**: O filtro do Tudo Misturado MUST reconhecer as 12 categorias, e categorias que não
  existiam quando o filtro foi salvo MUST entrar ligadas.
- **FR-005**: As perguntas novas MUST seguir todas as regras de conteúdo existentes (abertas,
  terminam em "?", ≤ 200 caracteres, sem duplicatas, sem aberturas de sim/não, inclusivas).
- **FR-006**: Autoconhecimento MUST evitar temas sensíveis (traumas, saúde/diagnósticos, religião,
  dinheiro, vida amorosa), validado por teste automatizado.
- **FR-007**: As cores novas MUST ter contraste ≥ 4,5:1 no verso e na frente e ser distintas das
  demais.
- **FR-008**: Tudo continua 100% offline (conteúdo empacotado).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 12 baralhos, 0 espaços vazios na última linha da grade.
- **SC-002**: 360 perguntas no total (12 × 30), todas passando na validação de conteúdo.
- **SC-003**: 100% dos filtros salvos antes da atualização mantêm as escolhas e ligam as novas.
- **SC-004**: Typecheck, lint e testes continuam passando.

## Assumptions

- Persona de escrita: psicólogo(a) comportamental — perguntas sobre comportamento observável,
  escolhas e valores, nunca diagnósticos ou interpretação clínica.
- A grade (3 colunas, gap 12) já existe desde a 015; com 12 categorias ela fecha em 4 linhas.
- Sem mudança de versão nesta feature; a versão sobe uma vez, depois das features 019–021.
