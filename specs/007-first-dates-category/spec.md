# Feature Specification: Nova Categoria "Primeiros Encontros"

**Feature Branch**: `007-first-dates-category`

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "User Story: Nova Categoria 'Primeiros Encontros'. Como usuário em um
date recente, quero um baralho com perguntas instigantes, divertidas e seguras, para que eu possa
quebrar o gelo, conhecer melhor a pessoa e evitar silêncios constrangedores sem parecer que estou
fazendo uma entrevista de emprego. Atualização do modelo de dados (data.json): ID da categoria
`primeiros-encontros`; posicionamento: deve ser listada na tela Home logo após o deck 'Casual' ou em
destaque para novos usuários; objeto da categoria: { id: 'primeiros-encontros', title: 'Primeiros
Encontros', icon: '🥂', color: '#FF9F43', description: 'Perguntas leves e instigantes para quebrar
o gelo e descobrir afinidades.' }"

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (categorias,
baralho sem repetição, favoritos, validação do conteúdo),
[004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md) (modo "Tudo Misturado") e
[006-mixed-mode-category-filter](../006-mixed-mode-category-filter/spec.md) (filtro de categorias do
modo misto, que já trata categorias novas como ativadas).

**Contexto**: o app tem hoje 8 categorias, 20 perguntas cada. O deck "Casual" do pedido é a
categoria `casual`, exibida como **"Descontraído"**. Já existe a categoria **"Casais"**, voltada a
quem já tem uma história junto ("Qual foi a primeira coisa que te chamou atenção em mim?"); a nova
categoria atende quem **ainda está se conhecendo**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar o baralho "Primeiros Encontros" num date (Priority: P1)

Duas pessoas num primeiro (ou segundo, terceiro) encontro abrem o app, tocam em "Primeiros
Encontros" na tela inicial e vão virando cartas com perguntas leves, curiosas e divertidas, que
puxam histórias, gostos e opiniões em vez de dados de currículo. Qualquer carta pode ser pulada sem
constrangimento.

**Why this priority**: é o valor inteiro da feature: um baralho próprio para o momento mais
delicado de uma relação, quando um silêncio pesa e uma pergunta invasiva assusta.

**Independent Test**: abrir a categoria a partir da tela inicial e percorrer todas as cartas;
verificar que nenhuma se repete antes do fim, que todas podem ser puladas e que o conteúdo segue as
regras de segurança (FR-006 a FR-008).

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** o usuário toca em "Primeiros Encontros", **Then** abre o
   baralho dessa categoria, com a identidade visual dela (cor coral e ícone de taça de espumante),
   mostrando uma carta por vez.
2. **Given** o baralho aberto, **When** o usuário vira, descarta ou pula cartas, **Then** o
   comportamento é o mesmo das outras categorias (gestos, resposta tátil, sem repetição até ver
   todas, aviso de baralho concluído com opção de recomeçar).
3. **Given** qualquer carta da categoria, **When** lida por duas pessoas que acabaram de se
   conhecer, **Then** ela não pressupõe intimidade ou história em comum, não pergunta sobre
   relacionamentos passados, dinheiro, religião, família, orientação ou planos de filhos, e não soa
   como pergunta de entrevista ("Onde você se vê em 5 anos?", "Qual seu maior defeito?").
4. **Given** uma carta da categoria, **When** o usuário a favorita, **Then** ela aparece nos
   favoritos com a etiqueta e a cor de "Primeiros Encontros", e continua lá depois de fechar o app.

---

### User Story 2 - Encontrar a categoria logo no início da lista (Priority: P2)

Quem abre o app pensando num date encontra "Primeiros Encontros" logo no topo da grade de
categorias, imediatamente depois de "Descontraído", sem precisar rolar a tela.

**Why this priority**: a categoria só cumpre seu papel se for achada em segundos, muitas vezes já
à mesa; mas o baralho funciona mesmo que estivesse em outra posição.

**Independent Test**: abrir a tela inicial num aparelho de tamanho comum e verificar a ordem das
categorias.

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** ela é exibida, **Then** as categorias aparecem na ordem
   Descontraído, Primeiros Encontros, Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras,
   Nostalgia e Infância, Futuro e Sonhos.
2. **Given** um aparelho de tela comum (≈ 6"), **When** a tela inicial abre, **Then** o bloco de
   "Primeiros Encontros" está visível sem rolagem.

---

### User Story 3 - As perguntas da nova categoria entram no "Tudo Misturado" (Priority: P3)

Quem joga o modo "Tudo Misturado" passa a receber também perguntas de "Primeiros Encontros", e pode
tirá-las da mistura pelo filtro de categorias, como qualquer outra.

**Why this priority**: amplia o modo misto sem trabalho do usuário, mas não é o motivo da feature.

**Independent Test**: abrir o filtro do modo misto e o próprio modo, com e sem uma seleção salva
anteriormente.

**Acceptance Scenarios**:

1. **Given** o filtro do modo misto, **When** aberto, **Then** lista as 9 categorias, incluindo
   "Primeiros Encontros", na mesma ordem da tela inicial.
2. **Given** um usuário que salvou um filtro antes desta versão (por exemplo, sem "Casais"),
   **When** atualiza o app, **Then** "Primeiros Encontros" aparece **ativada** e as categorias que
   ele desativou continuam desativadas.
3. **Given** "Primeiros Encontros" ativa no filtro, **When** o modo misto é jogado até o fim,
   **Then** todas as perguntas dela aparecem uma vez, misturadas às demais, com a etiqueta da
   categoria na frente da carta.
4. **Given** um filtro reduzido, **When** a tela inicial mostra o resumo do filtro, **Then** o
   total reflete as 9 categorias (por exemplo, "7 de 9 categorias").

---

### Edge Cases

- **Grade com número ímpar de categorias**: com 9 categorias a última linha da grade fica
  incompleta; a tela deve continuar alinhada e equilibrada, sem bloco esticado ou espaço quebrado.
- **Cor parecida com outra categoria**: a cor pedida originalmente (#FF9F43) ficava quase igual à
  de "Happy Hour" (#F27A1F), no verso e na frente da carta. Adota-se o coral `#FF8A80`, que mantém
  o clima quente de brinde e se distingue de todas as categorias pela cor, no verso e na frente
  (diferença perceptual ΔE ≥ 25 em relação a cada uma; ver research R2). A cor não pode ser
  idêntica à de outra categoria.
- **Legibilidade sobre a cor**: texto e ícone desenhados sobre o coral devem ter contraste
  legível, como já acontece com a categoria amarela "Descontraído".
- **Ícone em emoji**: o ícone das categorias vem de um conjunto de ícones do app, não de emojis.
  Usa-se uma taça de espumante, o equivalente mais próximo disponível; o emoji 🥂 não é exibido
  como texto.
- **Progresso de outras categorias**: incluir a categoria não altera o progresso nem os favoritos
  existentes de nenhuma outra.
- **Modo misto em andamento ao atualizar**: como o progresso dos baralhos vive só na memória, o app
  atualizado começa com baralhos novos; não há baralho misturado antigo a migrar.

## Requirements *(mandatory)*

### Functional Requirements

**Categoria**

- **FR-001**: O app MUST incluir a categoria com ID estável `primeiros-encontros`, título
  "Primeiros Encontros" e descrição "Perguntas leves e instigantes para quebrar o gelo e descobrir
  afinidades.".
- **FR-002**: A identidade visual da categoria MUST usar a cor coral `#FF8A80` e o ícone de taça
  de espumante (`glass-flute`, equivalente ao 🥂) do conjunto de ícones já usado pelas demais categorias.
- **FR-003**: Na tela inicial, a categoria MUST ser listada imediatamente depois de "Descontraído"
  e antes de "Profundo"; a ordem relativa das demais categorias não muda.
- **FR-004**: A categoria MUST se comportar como qualquer outra: uma carta por vez, sem repetição
  na sessão até mostrar todas, qualquer carta pode ser pulada, favoritar, aviso de conclusão e
  recomeço.

**Conteúdo**

- **FR-005**: A categoria MUST ter pelo menos 20 perguntas originais (mesmo mínimo das demais), em
  português do Brasil, com até 200 caracteres cada, cada uma com ID único e estável no padrão das
  outras (`primeiros-encontros-001`, `-002`, …).
- **FR-006**: As perguntas MUST ser leves, instigantes e divertidas, voltadas a revelar gostos,
  histórias, opiniões e afinidades (ex.: hábitos curiosos, pequenas manias, preferências, "e se…"
  bem-humorados), e MUST NOT soar como entrevista de emprego (metas de carreira, maiores defeitos,
  "onde você se vê em X anos").
- **FR-007**: As perguntas MUST ser seguras para quem acabou de se conhecer: MUST NOT tratar de
  relacionamentos anteriores ou ex, vida sexual, aparência ou corpo, dinheiro e salário, religião,
  política partidária, saúde, estrutura familiar, estado civil ou desejo de ter filhos, e MUST NOT
  pressupor intimidade ou história em comum (ex.: "o que você mais gosta em mim?").
- **FR-008**: As perguntas MUST seguir as regras de inclusão do app: nenhuma suposição sobre gênero
  ou orientação de quem pergunta ou responde; servem para qualquer combinação de pessoas.
- **FR-009**: Nenhuma pergunta da categoria MUST repetir (com texto igual ou só diferenças de
  maiúsculas, acentos ou pontuação) uma pergunta de outra categoria, em especial de "Casais" e
  "Descontraído".
- **FR-010**: A validação automática do conteúdo MUST cobrir a nova categoria (campos obrigatórios,
  IDs únicos, categoria existente, tamanho máximo, mínimo de perguntas, cor única entre
  categorias).

**Integração com o restante do app**

- **FR-011**: As perguntas da categoria MUST entrar no modo "Tudo Misturado" quando ela estiver
  ativa no filtro.
- **FR-012**: O filtro do modo misto MUST listar a nova categoria e tratá-la como **ativada** para
  todos, inclusive para quem já tinha uma seleção salva; as escolhas anteriores dessas pessoas MUST
  ser preservadas.
- **FR-013**: Textos e contagens que citam o total de categorias (como o resumo "X de N
  categorias" do modo misto) MUST refletir o novo total, sem número fixo.
- **FR-014**: A categoria MUST funcionar 100% offline desde a primeira abertura, com todo o
  conteúdo embarcado no app, sem coleta de dados.

### Key Entities

- **Categoria "Primeiros Encontros"**: ID `primeiros-encontros`, título, descrição, cor coral `#FF8A80`,
  ícone de taça de espumante; posição fixa logo após "Descontraído" na ordem das categorias.
- **Pergunta**: ID único estável (`primeiros-encontros-NNN`), categoria `primeiros-encontros`,
  texto (≤ 200 caracteres).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A categoria tem pelo menos 20 perguntas e 100% delas passam na validação automática
  de conteúdo.
- **SC-002**: Numa revisão manual do conteúdo, 0 perguntas tocam nos temas proibidos de FR-007 e 0
  perguntas soam como entrevista de emprego (FR-006).
- **SC-003**: Um usuário de primeira viagem encontra e abre "Primeiros Encontros" a partir da tela
  inicial em até 5 segundos, sem rolar a tela, num aparelho comum.
- **SC-004**: Em testes com pares que se conhecem há pouco, pelo menos 8 de cada 10 cartas sorteadas
  geram resposta sem que alguém peça para pular por desconforto.
- **SC-005**: 100% dos usuários com filtro do modo misto salvo mantêm suas escolhas anteriores após a
  atualização, com a nova categoria ativada.
- **SC-006**: Nenhuma categoria existente perde perguntas, favoritos ou muda de cor ou identidade.

## Assumptions

- **Posição em vez de destaque**: o pedido oferece "logo após Casual" **ou** "destaque para novos
  usuários". Adota-se a posição fixa logo após "Descontraído" para todos; um destaque especial só
  para novos usuários exigiria detectar o primeiro uso e um novo elemento na tela, e fica fora do
  escopo.
- **"Casual" = "Descontraído"**: o deck "Casual" do pedido é a categoria `casual`, cujo título
  exibido é "Descontraído".
- **Ícone**: como as categorias usam ícones do conjunto do app, o 🥂 do pedido é atendido pelo ícone
  de taça de espumante (`glass-flute`), o equivalente mais próximo; o emoji não é usado literalmente.
- **Cor**: o pedido trazia `#FF9F43`, quase igual a "Happy Hour"; por decisão do usuário (análise
  2026-11-06, opção C) usa-se o coral `#FF8A80`, distinto de todas as categorias. O app já ajusta a
  cor do texto sobre fundos claros para manter a leitura.
- **Quantidade de perguntas**: 20 perguntas, igual às demais categorias, salvo se a revisão do
  conteúdo pedir mais.
- **Público**: "date" vale para qualquer encontro de pessoas que estão se conhecendo, de qualquer
  gênero ou orientação; as perguntas não supõem que seja romântico, mas cabem bem num.
- **Sem mudança de regras**: a categoria não traz mecânica nova; reusa baralho, favoritos, modo
  misto e filtro como já existem.
- **Onboarding**: o tutorial de primeiro uso (005) não cita categorias específicas e não precisa
  mudar.
