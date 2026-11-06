# Feature Specification: Expansão e Curadoria Psicológica do Baralho

**Feature Branch**: `010-deck-curation-expansion`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Expansão e curadoria psicológica do baralho: revisar as perguntas
existentes de todas as 9 categorias, reescrever as rígidas/clichês ou fechadas (sim/não), manter as
boas, e criar novas até exatamente 30 perguntas de alta qualidade por categoria (270 no total).
Diretrizes: soar como um amigo próximo; perguntas abertas (nada respondível com sim/não; foco em por
quê/como); tom por categoria — casual & dilemas: psicologia do absurdo, inusitadas e engraçadas;
profundo & futuro: abordagem humanista, vulnerabilidade segura, valores, medos, realizações, visão de
mundo; casais & primeiros-encontros: apego seguro, afinidades, linguagem do amor, validação
emocional, memórias conjuntas, sem ser invasivo no início; happy-hour: psicologia organizacional
positiva, seguro para ambiente de trabalho (SFW), alívio de estresse, hobbies; viagens & nostalgia:
memória autobiográfica (cheiros, sensações, lições, choques culturais). Variação de assuntos dentro
de cada baralho para manter engajamento. Formato de cada pergunta: { id, categoryId, text }. O
pedido original sugere IDs como casais-1..casais-30."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (categorias,
baralho sem repetição, favoritos, validação do conteúdo),
[007-first-dates-category](../007-first-dates-category/spec.md) (regras de segurança de
"Primeiros Encontros") e [009-directional-swipe-navigation](../009-directional-swipe-navigation/spec.md)
(navegação atual do baralho, que não muda).

**Contexto**: o app tem hoje 9 categorias com 20 perguntas cada (180 no total). A maioria é boa,
mas há perguntas fechadas (respondíveis com "sim" ou "não", como "Tem algo que você gostaria de me
agradecer e ainda não disse?" ou "Você toparia saber, por um dia, tudo o que pensam de você?"),
algumas rígidas ou clichês, e o tom de cada baralho ainda não segue uma intenção psicológica
explícita. Esta feature é **só de conteúdo**: nenhuma tela, gesto ou regra de jogo muda.

## Clarifications

### Session 2026-11-06

- Q: Os IDs devem seguir o formato do pedido (`casais-1`…`casais-30`) ou o formato atual com três dígitos (`casais-001`…`casais-030`)? → A: Formato atual com três dígitos; IDs existentes preservados, novas perguntas em `-021`…`-030` (favoritos salvos continuam válidos).
- Q: Como garantir variedade de assuntos, já que o app embaralha as cartas a cada partida? → A: Por cobertura de assuntos, não por ordem no arquivo: cada categoria cobre pelo menos 6 assuntos e nenhum assunto ocupa mais de 5 das 30 cartas.
- Q: Até onde uma reescrita pode ir mantendo o mesmo ID? → A: Pode mudar a forma (abrir a pergunta, deixar mais natural, puxar o tom da categoria), mas mantém o tema; se o tema mudaria, a pergunta é melhorada de outro jeito.
- Q: Perguntas de escolha ("Você prefere A ou B?") são aceitas fora de "Dilemas"? → A: Só com um complemento explícito que peça a justificativa ou a história (ex.: "… Por quê?", "… e o que isso diz de você?"); em "Dilemas" a escolha simples é aceita.
- Q: Como a validação automática deve detectar perguntas fechadas? → A: Lista de aberturas de sim/não proibidas ("Você já…", "Você toparia…", "Tem algo…", etc.), aceitas apenas quando a pergunta oferece alternativas com " ou "; a revisão manual completa o controle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar baralhos mais longos e variados (Priority: P1)

Um grupo abre qualquer categoria e joga uma rodada inteira. Cada baralho agora tem 30 cartas, os
assuntos se alternam (uma pergunta sobre comida não é seguida por outra sobre comida) e o tom é
coerente com a categoria do início ao fim, então a conversa não esfria nem fica repetitiva antes do
fim do baralho. Como o app embaralha as cartas, a variedade vem da cobertura de assuntos, não da
ordem no arquivo.

**Why this priority**: é o valor central: mais conversa por baralho, com qualidade constante. Com
20 cartas, grupos frequentes esgotam um baralho em uma noite.

**Independent Test**: percorrer cada categoria até o aviso de baralho concluído e contar 30 cartas
diferentes; classificar as perguntas de cada categoria por assunto e verificar a distribuição
(FR-009).

**Acceptance Scenarios**:

1. **Given** qualquer uma das 9 categorias, **When** o usuário joga até o fim, **Then** vê
   exatamente 30 cartas diferentes antes do aviso de baralho concluído.
2. **Given** o modo "Tudo Misturado" com todas as categorias ativas, **When** jogado até o fim,
   **Then** mostra 270 cartas, cada uma uma única vez.
3. **Given** o filtro do modo misto, **When** o usuário escolhe algumas categorias, **Then** o
   total de cartas é 30 vezes o número de categorias escolhidas.

---

### User Story 2 - Perguntas que puxam histórias, não monossílabos (Priority: P1)

Quem lê a carta em voz alta não recebe um "sim", um "não" ou um "depende" como resposta: a pergunta
pede um porquê, um como, uma história ou uma escolha explicada, e soa como algo que um amigo próximo
perguntaria, não um formulário ou um entrevistador.

**Why this priority**: perguntas fechadas matam a conversa; é a principal falha do conteúdo atual.

**Independent Test**: revisar as 270 perguntas e confirmar que nenhuma pode ser respondida
honestamente só com "sim" ou "não"; a validação automática barra os formatos fechados mais comuns.

**Acceptance Scenarios**:

1. **Given** qualquer carta, **When** lida, **Then** ela é uma pergunta aberta (começa por "qual",
   "o que", "como", "por que", "quando", "quem", "onde", "se…", ou oferece alternativas a escolher e
   justificar) e termina com ponto de interrogação.
2. **Given** uma pergunta atual fechada (ex.: "Você toparia saber, por um dia, tudo o que pensam de
   você?"), **When** a curadoria é aplicada, **Then** ela é reescrita mantendo a ideia (ex.: "Se por
   um dia você ouvisse tudo o que pensam de você, o que teria medo de descobrir?").
3. **Given** uma pergunta atual boa, **When** a curadoria é aplicada, **Then** ela é mantida, com o
   mesmo texto ou só um ajuste pequeno de naturalidade.

---

### User Story 3 - Cada baralho com a sua intenção psicológica (Priority: P2)

Cada categoria tem um tom reconhecível: "Descontraído" e "Dilemas" provocam risadas com situações
absurdas; "Profundo" e "Futuro e Sonhos" convidam a falar de valores, medos e conquistas num espaço
seguro; "Casais" e "Primeiros Encontros" ajudam a descobrir afinidades e a se sentir visto sem
invadir; "Happy Hour" funciona até com colegas de trabalho; "Viagens" e "Nostalgia" despertam
memórias de cheiros, sensações, lições e estranhamentos culturais.

**Why this priority**: dá identidade e propósito a cada baralho, mas o ganho principal (mais
perguntas e todas abertas) já vem das histórias anteriores.

**Independent Test**: revisão manual por categoria, usando a tabela de tom de FR-008.

**Acceptance Scenarios**:

1. **Given** o baralho "Happy Hour", **When** jogado numa mesa de colegas de trabalho, **Then**
   nenhuma carta expõe a pessoa (intimidade, dinheiro, desempenho, chefes, bebida como requisito)
   e todas podem ser respondidas na frente de qualquer colega.
2. **Given** o baralho "Primeiros Encontros", **When** jogado por pessoas que acabaram de se
   conhecer, **Then** continua respeitando as regras de segurança de 007 (sem ex, dinheiro, religião,
   corpo, família, planos de filhos, sem pressupor intimidade).
3. **Given** o baralho "Profundo", **When** uma carta toca em medo ou vulnerabilidade, **Then** ela
   convida sem exigir (a pessoa escolhe o quanto contar) e não pressupõe trauma, perda ou sofrimento.

---

### User Story 4 - Favoritos antigos continuam lá (Priority: P2)

Quem já tinha perguntas favoritas atualiza o app e encontra todas na tela de favoritos, ainda na
categoria certa.

**Why this priority**: perder favoritos numa atualização de conteúdo quebraria a confiança no app.

**Independent Test**: favoritar perguntas na versão anterior, atualizar e abrir os favoritos.

**Acceptance Scenarios**:

1. **Given** um favorito salvo antes da atualização, **When** o app é atualizado, **Then** ele
   continua nos favoritos, com a mesma categoria.
2. **Given** um favorito cuja pergunta foi reescrita, **When** exibido, **Then** mostra o texto
   novo, que mantém a mesma ideia da pergunta original.

---

### Edge Cases

- **Reescrita que muda a ideia**: uma reescrita pode mudar a forma (abrir a pergunta, deixá-la mais
  natural, puxar o tom da categoria), mas MUST manter o tema; se o único jeito de melhorar mudaria o
  tema, a pergunta é melhorada de outro jeito. Assim o favorito do usuário continua fazendo sentido.
- **Duplicatas entre categorias**: com 270 perguntas, aumenta o risco de perguntas quase iguais em
  categorias diferentes (ex.: "cheiro de infância" em Nostalgia e "cheiro de casa" em Primeiros
  Encontros); nenhum texto pode repetir outro, e temas parecidos devem ter ângulos claramente
  distintos.
- **Alternativas sem justificativa**: "Você prefere A ou B?" admite resposta de uma palavra; em
  "Dilemas" esse formato é a essência do baralho e é aceito; nas outras categorias a escolha MUST
  vir com um complemento explícito que peça a justificativa ou a história ("… Por quê?", "… e o que
  isso diz de você?").
- **Texto longo demais**: perguntas mais ricas tendem a crescer; o limite de 200 caracteres continua
  valendo e a carta deve caber na tela de 320pt sem rolagem.
- **Progresso em andamento**: o progresso dos baralhos vive só na memória; ao atualizar o app, os
  baralhos começam do zero com 30 cartas, sem migração.
- **Filtro do modo misto salvo**: continua válido sem mudança (as categorias são as mesmas).

## Requirements *(mandatory)*

### Functional Requirements

**Quantidade e estrutura**

- **FR-001**: Cada uma das 9 categorias MUST ter exatamente 30 perguntas (270 no total).
- **FR-002**: Cada pergunta MUST ter exatamente os campos ID, categoria e texto.
- **FR-003**: As perguntas existentes MUST manter os seus IDs (padrão atual `<categoria>-001` a
  `-020`), mesmo quando reescritas; as 10 novas de cada categoria MUST usar `-021` a `-030`. Nenhum
  ID existente é removido ou reaproveitado para outra ideia.
- **FR-004**: Os textos MUST seguir as regras atuais de validação: português do Brasil, sem espaços
  sobrando nas pontas, até 200 caracteres, nenhum texto repetido (ignorando maiúsculas, acentos e
  pontuação) em todo o baralho.

**Qualidade das perguntas**

- **FR-005**: Toda pergunta MUST ser aberta: MUST NOT poder ser respondida apenas com "sim" ou
  "não", e MUST terminar com ponto de interrogação.
- **FR-006**: As perguntas MUST soar naturais, calorosas e curiosas, como um amigo próximo falaria;
  MUST NOT soar como entrevista, formulário ou teste de personalidade.
- **FR-007**: Cada pergunta existente MUST ser revisada: mantida se já é boa, ou reescrita se é
  fechada, rígida ou clichê, preservando a ideia original.
- **FR-008**: Cada categoria MUST seguir o seu tom:

  | Categoria | Abordagem | Foco |
  |-----------|-----------|------|
  | Descontraído (`casual`) | Psicologia do absurdo | Situações inusitadas e engraçadas que pedem respostas criativas |
  | Dilemas (`dilemas`) | Psicologia do absurdo | Escolhas impossíveis, bem-humoradas ou instigantes, que rendem debate |
  | Profundo (`profundo`) | Humanista | Vulnerabilidade segura, valores, medos, realizações, visão de mundo |
  | Futuro e Sonhos (`futuro`) | Humanista | Sonhos, propósito, quem a pessoa quer se tornar, esperança |
  | Casais (`casais`) | Apego seguro | Afinidades, linguagem do amor, validação emocional, memórias a dois |
  | Primeiros Encontros (`primeiros-encontros`) | Apego seguro, sem invadir | Afinidades e gostos, leveza, curiosidade mútua |
  | Happy Hour (`happy-hour`) | Psicologia organizacional positiva | Seguro para colegas (SFW), alívio de estresse, hobbies, histórias leves |
  | Viagens e Aventuras (`viagens`) | Memória autobiográfica | Cheiros, sensações, descobertas, choques culturais, lições de estrada |
  | Nostalgia e Infância (`nostalgia`) | Memória autobiográfica | Cheiros, sons, objetos, lugares e lições de outras fases da vida |

- **FR-009**: Dentro de cada categoria, os assuntos MUST variar: como o app embaralha as cartas a
  cada partida, a variedade é garantida por cobertura, não por ordem. Cada categoria MUST cobrir
  pelo menos 6 assuntos diferentes (ex.: comida, música, hábitos, lugares, pessoas, imaginação), e
  nenhum assunto MUST ocupar mais de 5 das 30 cartas.
- **FR-010**: As perguntas MUST continuar acolhedoras e inclusivas: sem pressupor gênero,
  orientação, religião, estado civil, situação financeira, estrutura familiar, saúde ou capacidade
  física, e sem pressupor experiências que nem todos tiveram (ex.: ter viajado ao exterior, ter tido
  uma infância feliz).
- **FR-011**: Perguntas que tocam em medo, perda ou vulnerabilidade MUST convidar sem exigir, e
  MUST NOT pedir que a pessoa reviva traumas.
- **FR-012**: "Primeiros Encontros" MUST continuar cumprindo as regras de segurança de 007 (FR-006 a
  FR-008 daquela spec) e "Happy Hour" MUST ser respondível na frente de colegas de trabalho (sem
  intimidade, dinheiro, política, religião, desempenho profissional ou consumo de álcool como
  pressuposto).
- **FR-013**: Todas as perguntas MUST ser originais: não copiar textos de jogos comerciais, livros
  ou listas conhecidas.

**Validação e integração**

- **FR-014**: A validação automática do conteúdo MUST exigir exatamente 30 perguntas por categoria
  e IDs sequenciais por categoria (`-001` a `-030`), e MUST barrar os formatos fechados mais comuns
  por uma lista de aberturas de sim/não proibidas ("Você já…?", "Você toparia…?", "Você
  aceitaria…?", "Tem algo…?", etc.), aceitas apenas quando a pergunta oferece alternativas com
  " ou ". A revisão manual (SC-002) completa o controle.
- **FR-015**: Categorias (nomes, descrições, cores, ícones e ordem), telas, gestos, favoritos, modo
  misto e filtro MUST permanecer inalterados.
- **FR-016**: Favoritos salvos antes da atualização MUST continuar válidos e visíveis.
- **FR-017**: O conteúdo MUST continuar embarcado no app e funcionar 100% offline.

### Key Entities

- **Pergunta**: ID único e estável (`<categoria>-NNN`, 001–030), categoria (uma das 9 existentes) e
  texto aberto em pt-BR (≤ 200 caracteres).
- **Categoria**: inalterada; ganha uma intenção de tom (FR-008) que guia a curadoria, sem novo campo
  no conteúdo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: As 9 categorias têm exatamente 30 perguntas cada (270) e 100% passam na validação
  automática de conteúdo.
- **SC-002**: Numa revisão manual, 0 das 270 perguntas podem ser respondidas honestamente só com
  "sim" ou "não".
- **SC-003**: Numa revisão manual, 100% das perguntas de cada categoria seguem o tom da tabela de
  FR-008, e 0 perguntas de "Happy Hour" ou "Primeiros Encontros" tocam em temas proibidos.
- **SC-004**: Em cada categoria há pelo menos 6 assuntos diferentes e nenhum assunto passa de 5
  das 30 cartas.
- **SC-005**: 100% dos favoritos salvos antes da atualização continuam visíveis depois dela.
- **SC-006**: Em rodadas de teste, pelo menos 8 de cada 10 cartas geram uma resposta de mais de uma
  frase, sem que alguém peça para pular por desconforto.

## Assumptions

- **Padrão de ID** (confirmado no clarify): o pedido sugere `casais-1` a `casais-30`, mas o app já usa `casais-001` com
  três dígitos e os favoritos salvos dependem desses IDs. Mantém-se o padrão atual (`-001` a
  `-030`), que atende ao objetivo do pedido ("prefixos claros") sem quebrar favoritos.
- **Formato de saída**: o pedido pede "exclusivamente um bloco JSON"; aqui o resultado é o próprio
  arquivo de conteúdo do app, no formato já existente (categorias + perguntas), que é a forma
  unificada pedida.
- **Reescritas mantêm o ID**: uma pergunta reescrita preserva a ideia original e o ID; nenhuma
  pergunta existente é descartada, então nenhum favorito fica órfão.
- **Alternativas em "Dilemas"**: "Você prefere A ou B?" é aceito em "Dilemas", porque escolher e
  defender é a dinâmica do baralho; nas demais categorias a escolha vem com um complemento explícito
  de porquê/como.
- **Happy Hour**: a descrição da categoria ("Assuntos divertidos para a mesa do bar ou do café")
  continua; o novo tom SFW serve tanto para amigos quanto para colegas.
- **Persona**: a curadoria segue a abordagem de um psicólogo de dinâmicas de grupo, mas as cartas
  não usam linguagem técnica de psicologia.
- **Sem mudança de app**: nenhuma tela, texto de interface, cor, ícone ou regra muda; só o conteúdo
  das perguntas e as regras automáticas que o validam.
