# Feature Specification: Nova Categoria "Família"

**Feature Branch**: `013-family-category`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "User Story: Nova Categoria 'Família'. Como usuário em um encontro
familiar ou almoço de domingo, quero um baralho com perguntas focadas em memórias, dinâmicas e
histórias da minha família, para que possamos relembrar o passado, dar risadas de antigas confusões
e criar conexões mais fortes entre diferentes gerações. Atualização do modelo de dados (data.json):
ID da categoria `familia`; posicionamento: deve ser listada na tela Home, próxima à categoria
`nostalgia`; objeto da categoria: { id: 'familia', title: 'Família', icon: '🏡', color: '#27AE60',
description: 'Histórias, memórias e risadas para compartilhar com quem tem o seu sangue (ou o seu
coração).' }"

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (categorias,
baralho sem repetição, favoritos, validação do conteúdo),
[006-mixed-mode-category-filter](../006-mixed-mode-category-filter/spec.md) (filtro do modo misto,
que trata categorias novas como ativadas),
[007-first-dates-category](../007-first-dates-category/spec.md) (precedente de categoria nova:
regras de cor distinta e de ícone equivalente ao emoji),
[010-deck-curation-expansion](../010-deck-curation-expansion/spec.md) (todas as categorias com 30
perguntas) e [012-automated-qa-tests](../012-automated-qa-tests/spec.md) (testes automatizados que
precisam continuar verdes com a nova categoria).

**Contexto**: o app tem hoje 9 categorias com 30 perguntas cada. A mais próxima em tema é
**"Nostalgia e Infância"** (`nostalgia`), que fala da infância e das memórias de quem responde. A
nova categoria trata da família **como grupo**: histórias compartilhadas, tradições, confusões
lendárias e o que uma geração tem para contar à outra. Ela é pensada para ser jogada **com** a
família à mesa, por pessoas de idades bem diferentes.

## Clarifications

### Session 2026-11-10

- Q: As cartas falam com quem tirou a carta ("você") ou com a mesa toda ("vocês")? → A: Com
  quem tirou a carta ("você"), como nas demais categorias; as perguntas são abertas o bastante para
  que outras pessoas da mesa acrescentem a própria versão.
- Q: As perguntas pressupõem a família reunida à mesa, ou também servem para falar da família com
  amigos ou num encontro? → A: Servem para os dois casos; nenhuma carta depende de os parentes
  estarem presentes (ex.: nada de "alguém aqui da mesa").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar o baralho "Família" num almoço de domingo (Priority: P1)

Avós, pais, tios, primos, crianças e agregados reunidos à mesa abrem o app, tocam em "Família" e
vão passando o celular, virando cartas que puxam histórias da família: a viagem que deu errado, a
receita que ninguém acerta, o apelido que pegou, a tradição que ninguém lembra como começou.
Qualquer carta pode ser pulada sem constrangimento.

**Why this priority**: é o valor inteiro da feature: um baralho próprio para reuniões de família,
que faz as gerações conversarem e rirem juntas.

**Independent Test**: abrir a categoria a partir da tela inicial e percorrer todas as cartas;
verificar que nenhuma se repete antes do fim, que todas podem ser puladas e que o conteúdo segue as
regras de tema, de segurança e de inclusão (FR-006 a FR-009).

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** o usuário toca em "Família", **Then** abre o baralho dessa
   categoria, com a identidade visual dela (cor verde e ícone de casa com coração), mostrando uma
   carta por vez.
2. **Given** o baralho aberto, **When** o usuário vira, descarta, pula ou volta cartas, **Then** o
   comportamento é o mesmo das outras categorias (gestos, resposta tátil, sem repetição até ver
   todas, aviso de baralho concluído com opção de recomeçar).
3. **Given** qualquer carta da categoria, **When** lida em voz alta numa mesa com uma criança, um
   adolescente, um adulto e um idoso, **Then** todos conseguem entendê-la e qualquer um deles pode
   respondê-la.
4. **Given** qualquer carta da categoria, **When** lida por alguém criado por avós, por um só
   responsável, por dois pais ou duas mães, por uma família adotiva, ou que considera amigos como
   família, **Then** ela não pressupõe a existência de pai, mãe, irmãos, avós, filhos, cônjuge ou
   qualquer outro parente específico.
5. **Given** uma carta da categoria, **When** o usuário a favorita, **Then** ela aparece nos
   favoritos com a etiqueta e a cor de "Família" e continua lá depois de fechar o app.

---

### User Story 2 - Encontrar "Família" perto de "Nostalgia e Infância" (Priority: P2)

Quem procura perguntas de memória encontra "Família" logo ao lado de "Nostalgia e Infância", o
tema vizinho.

**Why this priority**: ajuda a achar a categoria e agrupa assuntos parecidos, mas o baralho
funciona em qualquer posição.

**Independent Test**: abrir a tela inicial e verificar a ordem das categorias.

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** ela é exibida, **Then** as categorias aparecem na ordem
   Descontraído, Primeiros Encontros, Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras,
   Nostalgia e Infância, **Família**, Futuro e Sonhos.
2. **Given** a tela inicial com 10 categorias, **When** ela é exibida em aparelho pequeno, comum ou
   grande, **Then** a grade continua alinhada, sem bloco esticado, cortado ou sobreposto.

---

### User Story 3 - As perguntas de "Família" entram no "Tudo Misturado" (Priority: P3)

Quem joga o modo "Tudo Misturado" passa a receber também perguntas de "Família", e pode tirá-las da
mistura pelo filtro de categorias, como qualquer outra; por exemplo, num encontro entre amigos em
que o tema família não cabe.

**Why this priority**: amplia o modo misto sem trabalho do usuário, mas não é o motivo da feature.

**Independent Test**: abrir o filtro do modo misto e o próprio modo, com e sem uma seleção salva
anteriormente.

**Acceptance Scenarios**:

1. **Given** o filtro do modo misto, **When** aberto, **Then** lista as 10 categorias, incluindo
   "Família", na mesma ordem da tela inicial.
2. **Given** um usuário que salvou um filtro antes desta versão (por exemplo, sem "Casais"),
   **When** atualiza o app, **Then** "Família" aparece **ativada** e as categorias que ele
   desativou continuam desativadas.
3. **Given** "Família" ativa no filtro, **When** o modo misto é jogado até o fim, **Then** todas as
   perguntas dela aparecem uma vez, misturadas às demais, com a etiqueta da categoria na frente da
   carta.
4. **Given** um filtro reduzido, **When** a tela inicial mostra o resumo do filtro, **Then** o
   total reflete as 10 categorias (por exemplo, "8 de 10 categorias").

---

### Edge Cases

- **Descrição longa demais**: a descrição pedida tem 93 caracteres, acima do limite de 80 que vale
  para todas as categorias (e que mantém o texto inteiro no bloco da tela inicial). Adota-se uma
  versão encurtada com o mesmo sentido e o mesmo "sangue / coração": "Histórias, memórias e
  risadas com quem é do seu sangue (ou do seu coração)." (75 caracteres).
- **Verde parecido com "Futuro e Sonhos"**: no verso da carta, o verde pedido `#27AE60` (médio,
  vivo) se distingue do verde-escuro de "Futuro e Sonhos" (diferença perceptual ΔE ≈ 26, acima do
  mínimo de 25 usado em 007) e é mantido. Na frente creme, porém, a cor precisa ser escurecida para
  ficar legível, e o escurecimento automático chega a um verde quase idêntico ao de "Futuro"
  (ΔE ≈ 6). A frente de "Família" deve usar uma tinta própria, legível no creme (contraste
  ≥ 4,5:1) e distinguível da tinta de cada outra categoria (ΔE ≥ 25), como um verde-folha.
- **Legibilidade sobre o verde**: texto e ícone desenhados sobre o verso verde devem ter contraste
  legível (≥ 4,5:1).
- **Ícone em emoji**: o ícone das categorias vem do conjunto de ícones do app, não de emojis.
  Usa-se a casa com coração, o equivalente mais próximo de 🏡; o emoji não é exibido como texto.
- **Família ausente, distante ou difícil**: nem todo mundo tem contato com a família de sangue, e
  nem toda lembrança de família é boa. As perguntas valem para "a família de sangue ou de coração"
  e não forçam ninguém a falar de perdas, brigas ou ausências; pular é sempre possível.
- **Pessoas que já não estão vivas**: as perguntas não pedem para falar de mortes, luto ou doenças;
  uma lembrança carinhosa pode surgir espontaneamente, mas nenhuma carta a provoca.
- **Sobreposição com "Nostalgia e Infância"**: perguntas sobre a própria infância de quem responde
  já existem em "Nostalgia"; as de "Família" giram em torno do grupo e das histórias
  compartilhadas, sem repetir as de lá.
- **Família longe da mesa**: no modo misto ou num encontro entre amigos, uma carta de "Família"
  aparece sem os parentes por perto; ela continua respondível porque fala da família de quem
  responde, não de quem está presente.
- **Progresso de outras categorias**: incluir a categoria não altera o progresso nem os favoritos
  existentes de nenhuma outra.
- **Modo misto em andamento ao atualizar**: como o progresso dos baralhos vive só na memória, o app
  atualizado começa com baralhos novos; não há baralho misturado antigo a migrar.

## Requirements *(mandatory)*

### Functional Requirements

**Categoria**

- **FR-001**: O app MUST incluir a categoria com ID estável `familia`, título "Família" e descrição
  "Histórias, memórias e risadas com quem é do seu sangue (ou do seu coração).".
- **FR-002**: A identidade visual da categoria MUST usar a cor `#27AE60` no verso da carta e o
  ícone de casa com coração (`home-heart`, equivalente ao 🏡) do conjunto de ícones já usado pelas
  demais categorias.
- **FR-003**: A cor da categoria na frente creme da carta (moldura, ícone, rodapé) MUST ter
  contraste ≥ 4,5:1 com o creme e diferença perceptual ΔE ≥ 25 em relação à cor de frente de cada
  outra categoria; a cor do verso MUST ter ΔE ≥ 25 em relação ao verso de cada outra categoria e
  MUST NOT ser idêntica a nenhuma.
- **FR-004**: Na tela inicial e no filtro do modo misto, a categoria MUST ser listada imediatamente
  depois de "Nostalgia e Infância" e antes de "Futuro e Sonhos"; a ordem relativa das demais
  categorias não muda.
- **FR-005**: A categoria MUST se comportar como qualquer outra: uma carta por vez, sem repetição na
  sessão até mostrar todas, qualquer carta pode ser pulada, navegação para trás e para frente,
  favoritar, aviso de conclusão e recomeço.

**Conteúdo**

- **FR-006**: A categoria MUST ter exatamente 30 perguntas originais (o mesmo número das demais),
  em português do Brasil, com até 200 caracteres cada, cada uma com ID único e estável no padrão
  das outras (`familia-001` a `familia-030`).
- **FR-007**: As perguntas MUST girar em torno da família como grupo, cobrindo pelo menos estes
  temas, cada um com no mínimo 3 perguntas: histórias e confusões engraçadas que viraram lenda;
  tradições, rituais e datas especiais; comida e receitas de família; jeitos, manias, apelidos e
  expressões da família; ponte entre gerações (o que mudou, o que se aprendeu com alguém mais velho
  ou mais novo); reconhecimento e carinho (o que se admira, agradece ou herdou de alguém).
- **FR-007a**: Cada pergunta MUST se dirigir a quem tirou a carta, na segunda pessoa do singular
  ("você"), e MUST fazer sentido tanto com a família reunida quanto numa conversa sobre a família
  com amigos ou num encontro; nenhuma pergunta MUST depender de os parentes estarem presentes
  ("alguém aqui da mesa", "olhe para…").
- **FR-008**: As perguntas MUST ser adequadas para todas as idades e seguras numa mesa com
  parentes: MUST NOT tratar de morte, luto, doenças, brigas ou rompimentos familiares, divórcio,
  heranças, dinheiro, religião, política, vida amorosa ou sexual, aparência ou corpo, e MUST NOT
  pedir para expor, comparar ou ranquear parentes (ex.: "quem é o parente mais chato?", "quem é o
  preferido?").
- **FR-009**: As perguntas MUST seguir as regras de inclusão do app: MUST NOT pressupor uma
  estrutura familiar (pai e mãe, irmãos, avós, filhos, casamento, morar junto, família grande), o
  gênero ou a orientação de ninguém; MUST se referir a pessoas de forma aberta ("alguém da
  família", "a pessoa mais velha que você conhece da família") e valer para família de sangue ou
  de coração.
- **FR-010**: Nenhuma pergunta da categoria MUST repetir (com texto igual ou só diferenças de
  maiúsculas, acentos ou pontuação) uma pergunta de outra categoria, em especial de "Nostalgia e
  Infância".
- **FR-011**: A validação automática do conteúdo MUST cobrir a nova categoria (campos obrigatórios,
  IDs únicos, categoria existente, tamanho máximo, número de perguntas, cor única entre categorias,
  contraste das cores).

**Integração com o restante do app**

- **FR-012**: As perguntas da categoria MUST entrar no modo "Tudo Misturado" quando ela estiver
  ativa no filtro.
- **FR-013**: O filtro do modo misto MUST listar a nova categoria e tratá-la como **ativada** para
  todos, inclusive para quem já tinha uma seleção salva; as escolhas anteriores dessas pessoas MUST
  ser preservadas.
- **FR-014**: Textos e contagens que citam o total de categorias (como o resumo "X de N categorias"
  do modo misto) MUST refletir o novo total, sem número fixo.
- **FR-015**: A categoria MUST funcionar 100% offline desde a primeira abertura, com todo o conteúdo
  embarcado no app, sem coleta de dados.

### Key Entities

- **Categoria "Família"**: ID `familia`, título "Família", descrição (≤ 80 caracteres), cor de verso
  `#27AE60`, cor de frente própria (verde-folha legível no creme), ícone de casa com coração;
  posição fixa entre "Nostalgia e Infância" e "Futuro e Sonhos".
- **Pergunta**: ID único estável (`familia-NNN`), categoria `familia`, texto (≤ 200 caracteres).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A categoria tem 30 perguntas e 100% delas passam na validação automática de conteúdo.
- **SC-002**: Numa revisão manual do conteúdo, 0 perguntas tocam nos temas proibidos de FR-008 e 0
  perguntas pressupõem um parente ou estrutura familiar específica (FR-009).
- **SC-003**: Cada um dos 6 temas de FR-007 tem pelo menos 3 perguntas.
- **SC-004**: Em testes com grupos familiares de pelo menos 3 gerações, pelo menos 8 de cada 10
  cartas sorteadas recebem resposta de alguém da mesa sem que peçam para pular por desconforto ou
  por não entender a pergunta.
- **SC-005**: Um usuário de primeira viagem encontra e abre "Família" a partir da tela inicial em
  até 10 segundos.
- **SC-006**: 100% dos usuários com filtro do modo misto salvo mantêm suas escolhas anteriores após a
  atualização, com a nova categoria ativada.
- **SC-007**: Nenhuma categoria existente perde perguntas ou favoritos, nem muda de cor, ícone ou
  posição relativa.

## Assumptions

- "Próxima à categoria `nostalgia`" significa **imediatamente depois** de "Nostalgia e Infância",
  o que mantém as categorias existentes na mesma ordem relativa e põe os dois temas de memória lado
  a lado.
- A descrição pedida é encurtada para caber no limite de 80 caracteres comum a todas as categorias,
  em vez de aumentar o limite para todas.
- A cor pedida `#27AE60` é mantida no verso; só a cor derivada para a frente creme é ajustada,
  porque a derivação automática colidiria com "Futuro e Sonhos" (mesma regra aplicada às outras
  categorias em 002 e 007).
- O baralho segue o padrão de 30 perguntas por categoria definido em 010.
- As perguntas são escritas para serem respondidas por qualquer pessoa da mesa, inclusive
  agregados, amigos da família e crianças a partir da idade escolar.
- Não há mudança de navegação, de gestos, de tutorial nem de outras telas além da inclusão da
  categoria na lista; o tutorial de primeira abertura não precisa citar a nova categoria.
