# Feature Specification: Testes Automatizados e Prevenção de Regressão (QA)

**Feature Branch**: `012-automated-qa-tests`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Testes automatizados e prevenção de regressão (QA): estabelecer uma
suíte de testes automatizados executada a cada nova mudança no código (commit/PR), garantindo que
refatorações ou novas features não quebrem as funcionalidades core do MVP. Stack: Jest (Expo/React
Native), React Native Testing Library, mocks de AsyncStorage, expo-haptics e Reanimated, Husky e
lint-staged para rodar os testes antes de cada commit. Cobertura obrigatória — unidade: embaralhamento
(Fisher-Yates devolve um array reordenado com o mesmo número de elementos), filtro do modo 'Tudo
Misturado' (respeita as categorias ativadas e impede menos de 2), navegação de índices (avançar +1,
voltar −1, sem índice < 0 na primeira carta); integração: store de favoritos (favoritar e
desfavoritar), persistência do tutorial (`hasSeenTutorial` salvo ao fechar o overlay e tutorial não
renderizado nas inicializações seguintes), persistência dos filtros do modo misto; componente/UI: no
modo misto a carta começa pelo verso (identidade visual) e, ao tocar, revela a pergunta e o selo da
categoria de origem; gestos: swipe para a esquerda descarta e avança, swipe para a direita recupera a
carta anterior; feedback tátil chamado em swipe, toque e no botão de re-embaralhar. CI e bloqueio:
hook de pre-commit executa `npm test` e aborta o commit se um teste falhar; testes com animações
rodam com timers e módulos mockados para evitar falsos negativos por tempo de transição."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (baralho sem
repetição, favoritos), [004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md)
(verso da marca no modo misto), [005-onboarding-tutorial](../005-onboarding-tutorial/spec.md)
(tutorial de primeira abertura), [006-mixed-mode-category-filter](../006-mixed-mode-category-filter/spec.md)
(filtro do modo misto), [008-reshuffle-remaining-cards](../008-reshuffle-remaining-cards/spec.md)
(re-embaralhar) e [009-directional-swipe-navigation](../009-directional-swipe-navigation/spec.md)
(swipe esquerda/direita).

**Contexto**: o projeto já tem uma suíte automatizada ampla (cerca de 30 arquivos de teste cobrindo
embaralhamento, navegação, filtro do modo misto, favoritos, tutorial, telas e componentes). Mas ela
só roda quando alguém lembra de rodar: nada impede um commit ou um PR com testes quebrados. Além
disso, há lacunas na cobertura core: os gestos de arrastar a carta são exercitados apenas pelas
ações de acessibilidade (não pelo gesto em si), e a vibração não é verificada de forma sistemática em
cada interação (swipe, toque e re-embaralhar). Esta feature **não muda nada do que o jogador vê**: é
sobre a rede de segurança de quem desenvolve o app. Os nomes de campos citados no pedido (como
`hasSeenTutorial`) descrevem o comportamento esperado; os testes verificam o comportamento, não o
nome interno do campo.

## Clarifications

### Session 2026-11-08

- Q: O que a verificação antes do commit deve rodar além da suíte de testes? → A: Lint nos arquivos preparados para o commit + checagem de tipos completa + suíte de testes completa (todos os gates locais rápidos); a validação de conteúdo já faz parte da suíte.
- Q: Em quais eventos a verificação no repositório deve rodar? → A: Em todo PR (qualquer branch de destino, já que as features ficam empilhadas) e em todo push para a `main`.
- Q: Se o gesto de arrastar não puder ser simulado ponta a ponta em algum caso, testar só a regra de decisão (deslocamento/velocidade → esquerda, direita ou volta ao lugar) é aceitável? → A: Não como substituto: a simulação do gesto na carta é obrigatória para esquerda, direita e abaixo do limite; a regra de decisão, extraída como função pura, ganha testes próprios como complemento.

## User Scenarios & Testing *(mandatory)*

Os "usuários" desta feature são as pessoas (e agentes) que mudam o código do Quebra-Gelo. O
benefício final é do jogador: nenhuma atualização chega ao celular com o jogo quebrado.

### User Story 1 - Bloquear commits que quebram o jogo (Priority: P1)

Quem desenvolve faz uma mudança e tenta registrar um commit. Antes de o commit ser aceito, a
verificação automática roda sozinha. Se algum teste falhar, o commit é recusado e a pessoa vê qual
teste falhou e por quê; se tudo passar, o commit segue normalmente, sem nenhum passo extra.

**Why this priority**: é o coração do pedido. Uma suíte que ninguém roda não previne regressão;
o bloqueio automático transforma os testes que já existem em uma garantia real.

**Independent Test**: quebrar de propósito uma regra coberta (ex.: fazer o embaralhamento perder um
elemento), tentar commitar e ver o commit recusado; desfazer a quebra e ver o commit aceito.

**Acceptance Scenarios**:

1. **Given** uma mudança que faz um teste falhar, **When** a pessoa tenta commitar, **Then** o commit
   não é criado e a saída mostra o nome do teste que falhou.
2. **Given** uma mudança com todos os testes passando, **When** a pessoa commita, **Then** o commit é
   criado sem nenhuma ação manual adicional.
3. **Given** um clone novo do repositório, **When** a pessoa instala as dependências do projeto da
   forma de sempre, **Then** a verificação antes do commit já fica ativa, sem configuração manual.
4. **Given** um arquivo com erro de lint entre os arquivos preparados para o commit, **When** a
   pessoa tenta commitar, **Then** o commit é recusado apontando o erro.

---

### User Story 2 - Barrar PRs quebrados mesmo sem o hook local (Priority: P2)

Alguém abre (ou atualiza) um pull request. Mesmo que o hook local tenha sido pulado ou não esteja
instalado naquela máquina, uma verificação automática no repositório roda os mesmos gates de merge
(tipos, lint, testes e validação de conteúdo) e mostra no PR se passou ou falhou.

**Why this priority**: o hook local pode ser contornado; a verificação no PR é a última barreira
antes da `main` e cobre o "commit/PR" do objetivo.

**Independent Test**: abrir um PR com um teste quebrado e ver o status de falha no PR; corrigir e ver
o status verde.

**Acceptance Scenarios**:

1. **Given** um PR para qualquer branch, ou um push para a `main`, **When** ele é aberto ou recebe novos commits, **Then** os gates
   de merge rodam automaticamente e o resultado aparece no PR.
2. **Given** um PR com um teste falhando, **When** a verificação termina, **Then** o PR mostra
   status de falha com o teste responsável visível no log.

---

### User Story 3 - Cobertura garantida das regras core do jogo (Priority: P1)

Quem refatora a lógica do baralho, do modo misto, dos favoritos ou do tutorial precisa de testes que
descrevam explicitamente cada regra core do MVP. Cada regra listada no pedido tem pelo menos um teste
nomeado que falha se a regra for violada.

**Why this priority**: o bloqueio da US1 só protege o que está coberto. As regras core
(embaralhamento, filtro do modo misto, navegação, favoritos, persistência do tutorial e dos filtros)
são as que mais quebrariam a experiência.

**Independent Test**: para cada regra, introduzir uma mutação simples na lógica (ex.: permitir voltar
na primeira carta, aceitar 1 categoria no modo misto, não salvar o tutorial) e ver pelo menos um
teste falhar.

**Acceptance Scenarios**:

1. **Given** o embaralhamento de uma lista, **When** ele roda, **Then** o resultado tem os mesmos
   elementos, na mesma quantidade, sem perder nem duplicar nenhum, e a lista original não é alterada;
   **And** em várias execuções com sorteios diferentes a ordem muda (não devolve sempre a mesma ordem).
2. **Given** uma seleção do modo "Tudo Misturado", **When** a união das categorias é montada,
   **Then** só entram perguntas das categorias ativadas; **And** uma seleção com menos de 2 categorias
   é recusada e não altera o que estava salvo.
3. **Given** a primeira carta do baralho, **When** se tenta voltar, **Then** nada muda (a posição
   nunca fica antes da primeira carta); **Given** qualquer outra carta, **When** se avança ou volta,
   **Then** a posição muda exatamente uma carta para frente ou para trás.
4. **Given** uma pergunta, **When** ela é favoritada e depois desfavoritada, **Then** o estado global
   reflete cada mudança imediatamente.
5. **Given** um primeiro uso, **When** o tutorial é fechado, **Then** o fato de ter visto fica salvo no
   dispositivo; **And** numa nova inicialização com esse dado salvo o tutorial não aparece.
6. **Given** um filtro do modo misto salvo, **When** o app é reaberto, **Then** as mesmas categorias
   voltam selecionadas.

---

### User Story 4 - Interações da carta testadas como o jogador as faz (Priority: P2)

Quem mexe nas animações ou nos gestos da carta precisa saber se arrastar a carta continua fazendo o
que deve. Os testes simulam o próprio gesto de arrastar (não só o atalho de acessibilidade) e
verificam a vibração em cada interação.

**Why this priority**: gestos e háptica são o que dá a sensação tátil do jogo (Princípio II) e são
justamente as partes mais frágeis numa refatoração de animação.

**Independent Test**: simular um arrasto para a esquerda e um para a direita sobre a carta e conferir
o resultado e a vibração; simular um toque e conferir a revelação e a vibração.

**Acceptance Scenarios**:

1. **Given** o modo "Tudo Misturado", **When** a carta aparece, **Then** mostra o verso da marca sem
   nomear a categoria; **When** é tocada, **Then** revela a pergunta e o selo da categoria de origem.
2. **Given** uma carta virada, **When** é arrastada para a esquerda além do limite, **Then** é
   descartada e a próxima carta aparece.
3. **Given** uma carta que não é a primeira, **When** é arrastada para a direita além do limite,
   **Then** a carta anterior volta.
4. **Given** uma carta, **When** é arrastada mas solta antes do limite, **Then** volta ao lugar e
   nada é descartado.
5. **Given** cada interação — virar com toque, descartar com swipe, voltar com swipe e
   re-embaralhar — **When** ela acontece, **Then** a vibração correspondente é disparada exatamente
   uma vez.
6. **Given** testes que envolvem animação, **When** a suíte roda várias vezes seguidas, **Then** o
   resultado é sempre o mesmo, sem depender do tempo real das transições.

---

### Edge Cases

- **Commit só de documentação ou conteúdo**: a verificação roda mesmo assim (conteúdo tem validação
  própria e um JSON quebrado também quebra o jogo).
- **Emergência / commit em andamento**: o mecanismo padrão do git para pular hooks continua existindo;
  nesse caso a verificação do PR (US2) ainda barra a mudança. A documentação do projeto deixa claro
  que pular o hook não é o caminho normal.
- **Embaralhamento que cai na mesma ordem**: com poucas cartas, um sorteio legítimo pode devolver a
  ordem original; o teste de "reordenou" usa sorteios controlados ou várias execuções, para nunca
  falhar por azar.
- **Armazenamento indisponível**: falha ao ler ou gravar o dado do tutorial não pode travar o app
  (comportamento já definido na 005) e continua coberto.
- **Swipe para a direita na primeira carta**: não há carta anterior; a carta volta ao lugar e nada
  muda.
- **Clone sem a pasta do hook ou em outra branch antiga**: instalar as dependências reativa o hook; em
  branches que ainda não têm o hook, commits funcionam como antes.
- **Testes lentos**: se a verificação antes do commit ficar lenta demais, as pessoas tendem a
  contorná-la — por isso há meta de tempo (SC-003).

## Requirements *(mandatory)*

### Functional Requirements

**Bloqueio automático**

- **FR-001**: Toda tentativa de commit MUST executar automaticamente a suíte de testes completa
  antes de o commit ser criado; se qualquer teste falhar, o commit MUST ser abortado.
- **FR-002**: Antes do commit, os arquivos preparados para o commit MUST passar pelo lint e o
  projeto inteiro MUST passar na checagem de tipos; erro de lint ou de tipos MUST abortar o commit.
- **FR-003**: A verificação antes do commit MUST ficar ativa automaticamente ao instalar as
  dependências do projeto, sem passo manual.
- **FR-004**: Todo PR (para qualquer branch de destino; abertura e cada novo commit) e todo push
  para a `main` MUST rodar automaticamente os gates de merge — checagem de tipos, lint, testes e validação de conteúdo — e exibir o resultado no
  PR.
- **FR-005**: Quando a verificação falhar, a saída MUST identificar o teste (ou arquivo e regra de
  lint) responsável.

**Cobertura obrigatória — lógica e dados**

- **FR-006**: MUST existir teste que garanta que o embaralhamento devolve todos os elementos da
  entrada, na mesma quantidade, sem duplicar nem perder, sem alterar a entrada, e que a ordem varia
  entre sorteios diferentes.
- **FR-007**: MUST existir teste que garanta que o modo "Tudo Misturado" usa apenas as categorias
  ativadas e recusa seleções com menos de 2 categorias.
- **FR-008**: MUST existir teste que garanta que avançar move exatamente uma carta para frente,
  voltar move exatamente uma para trás, e que voltar na primeira carta não muda a posição.

**Cobertura obrigatória — estado e persistência**

- **FR-009**: MUST existir teste que favorite e desfavorite uma pergunta e confirme o estado global
  após cada ação.
- **FR-010**: MUST existir teste que, ao fechar o tutorial, confirme que o fato de tê-lo visto foi
  gravado no dispositivo, e outro que confirme que, com esse dado salvo, o tutorial não é exibido
  na inicialização seguinte (incluindo a tela inicial, não só a lógica de estado).
- **FR-011**: MUST existir teste que salve um filtro do modo misto e confirme que ele é recuperado
  igual numa nova inicialização.

**Cobertura obrigatória — interações**

- **FR-012**: MUST existir teste de tela que confirme que, no modo misto, a carta começa pelo verso
  da marca e, após o toque, mostra a pergunta e o selo da categoria de origem.
- **FR-013**: MUST existir testes que simulem o gesto de arrastar a carta (não apenas as ações de
  acessibilidade) e confirmem: arrasto para a esquerda além do limite descarta e avança; arrasto para
  a direita além do limite volta para a carta anterior; arrasto abaixo do limite não muda nada.
  A regra de decisão do gesto (deslocamento e velocidade → esquerda, direita ou volta ao lugar)
  MUST também ter testes próprios como função pura, em complemento — nunca em substituição — à
  simulação do gesto.
- **FR-014**: MUST existir testes que confirmem que a vibração é disparada exatamente uma vez ao
  virar a carta com toque, ao descartar com swipe, ao voltar com swipe e ao re-embaralhar (desde a
  011, o botão "Mudar o clima" do modo misto, que substituiu o re-embaralhar com a mesma vibração).

**Confiabilidade da suíte**

- **FR-015**: Testes que envolvem animação MUST rodar com o tempo e os módulos de animação
  controlados (simulados), de forma que o resultado não dependa da duração real das transições.
- **FR-016**: Os módulos nativos (armazenamento local, vibração, animação, gestos) MUST ser simulados
  em todos os testes, de forma que a suíte rode sem aparelho, emulador ou rede.
- **FR-017**: A suíte MUST ser determinística: o mesmo código produz o mesmo resultado em execuções
  repetidas.
- **FR-018**: Cada regra core das FR-006 a FR-014 MUST ser rastreável a pelo menos um teste com nome
  descritivo, documentado num mapa regra → teste do próprio feature.

**Escopo**

- **FR-019**: Esta feature MUST NOT alterar nenhum comportamento, texto ou visual visto pelo
  jogador; mudanças em código de produção só são aceitas quando necessárias para tornar uma regra
  testável e não mudam o comportamento.
- **FR-020**: Testes existentes que já cobrem uma regra MUST ser reaproveitados (e, se preciso,
  reforçados) em vez de duplicados.

### Key Entities

- **Gate de verificação**: conjunto de checagens (tipos, lint, testes, conteúdo) com um ponto de
  disparo (antes do commit ou no PR) e um resultado (passa/bloqueia).
- **Regra core**: comportamento do MVP que não pode regredir (ex.: "não voltar antes da primeira
  carta"); ligada a um ou mais testes.
- **Mapa de cobertura**: tabela regra core → teste(s) que a protegem, mantida junto do feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das tentativas de commit com algum teste falhando são recusadas (verificado
  quebrando uma regra de propósito e tentando commitar).
- **SC-002**: 100% das regras core listadas (FR-006 a FR-014) têm pelo menos um teste que falha
  quando a regra é violada por uma mutação simples.
- **SC-003**: A verificação antes do commit termina em até 60 segundos numa máquina de
  desenvolvimento comum, para não incentivar que seja contornada.
- **SC-004**: A suíte completa passa em 10 execuções seguidas sem nenhuma falha intermitente.
- **SC-005**: Todo PR mostra o resultado dos gates de merge em até 10 minutos após o
  push.
- **SC-006**: Zero mudanças visíveis para o jogador: a experiência do app é idêntica antes e depois
  da feature.

## Assumptions

- A stack de testes já existente (Jest com preset do Expo, React Native Testing Library e os mocks
  de armazenamento local, vibração, Reanimated/Worklets e Gesture Handler em `jest.setup.ts`) é
  mantida; esta feature acrescenta o bloqueio automático e fecha as lacunas de cobertura, sem trocar
  ferramentas.
- O bloqueio antes do commit usa Husky + lint-staged, como pedido; o lint roda só nos arquivos
  preparados para o commit, enquanto a checagem de tipos e os testes rodam completos (o pedido exige
  `npm test`).
- "Integração Contínua" inclui, além do hook local, uma verificação automática nos PRs do GitHub
  (o repositório já está no GitHub); isso é ferramenta de desenvolvimento e não afeta o princípio de
  zero backend do app.
- Os nomes citados no pedido (`hasSeenTutorial`, "índice") descrevem comportamento; o estado real do
  app (flag do tutorial com versão, cursor do baralho com histórico da 009) é o que os testes
  verificam.
- "Swipe para a esquerda descarta e avança; para a direita recupera a anterior" segue as regras da
  009, inclusive a carta anterior voltar já virada.
- O efeito do embaralhamento "reordenado" é verificado com sorteios controlados, já que uma ordem
  idêntica pode ocorrer legitimamente num sorteio aleatório.
- Não há meta de porcentagem de cobertura de linhas; o critério é a cobertura das regras core
  (SC-002).
