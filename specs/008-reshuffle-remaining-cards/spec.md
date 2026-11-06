# Feature Specification: Re-embaralhar as Cartas Restantes Durante o Jogo

**Feature Branch**: `008-reshuffle-remaining-cards`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "User Story: Botão de Re-embaralhar (Reshuffle) no Deck. Como usuário
jogando em uma categoria, quero um botão rápido para embaralhar as cartas restantes, para que eu
possa ter uma nova ordem aleatória de perguntas caso queira renovar a dinâmica da conversa sem
precisar sair e entrar na categoria novamente. Posicionamento e UI: botão flutuante ou ícone
discreto no canto inferior direito da tela do jogo; ícone de atualização (🔄) ou embaralhar (🔀);
minimalista, sem fundo preenchido ou com fundo translúcido escuro, na cor de destaque (azul-gelo)
ou na cor da categoria atual. Comportamento: ao tocar, as cartas do baralho são embaralhadas de
novo; a carta atual visível não precisa ser removida, mas a fila das próximas cartas deve ser
totalmente reordenada; o controle de posição do baralho deve continuar funcionando normalmente com
a nova ordem. Feedback: vibração leve de sucesso ao tocar; opcionalmente um giro rápido de 360º no
ícone ou um aviso discreto 'Cartas embaralhadas'."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (tela do baralho,
progresso em memória sem repetição, "Embaralhar de novo" no fim do baralho),
[004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md) (baralho "Tudo Misturado")
e [006-mixed-mode-category-filter](../006-mixed-mode-category-filter/spec.md) (filtro de
categorias do modo misto).

**Contexto**: hoje o jogador só consegue uma nova ordem ao terminar o baralho ("Embaralhar de
novo", que recomeça do zero) ou, no modo misto, ao mudar o filtro. Esta feature acrescenta um
re-embaralhamento **no meio do jogo** que mexe apenas nas cartas que ainda não apareceram: não
devolve ao baralho as cartas já vistas, não troca a carta da mesa e não zera o contador. Deslizar
para a esquerda ou para a direita continua significando "pular/descartar e ir para a próxima"; não
existe "voltar carta".

## Clarifications

### Session 2026-11-06

- Q: Qual vibração confirma o re-embaralhamento? → A: O padrão de notificação de "sucesso" do
  sistema (curto e leve), diferente do impacto leve de virar e do impacto médio de descartar.
- Q: Onde aparece o aviso "Cartas embaralhadas"? → A: Uma pílula pequena, centralizada na linha da
  dica de gestos ("Toque para virar · deslize para pular"), que ela substitui temporariamente; a
  linha tem altura fixa, então nada se desloca, e o aviso nunca fica sobre a carta. Aparece e some
  com esmaecimento e não recebe toques. (Revisado no planejamento: a versão anterior, "acima do
  botão de favoritar", podia encostar na carta em telas baixas.)
- Q: Onde fica o botão em relação ao botão de favoritar, inclusive em telas de 320pt? → A: Na
  mesma linha do botão de favoritar, alinhado à borda direita da tela; o botão de favoritar
  permanece centralizado e a dica de gestos continua abaixo dessa linha.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Re-embaralhar a fila no meio do jogo (Priority: P1)

Durante o jogo, a roda quer mudar o clima da conversa. O jogador toca no botão de embaralhar no
canto inferior direito da tela: o aparelho vibra levemente confirmando a ação, a carta que está na
mesa continua lá (do jeito que estava, virada ou não) e, a partir da próxima, as cartas que ainda
não saíram aparecem em uma nova ordem aleatória. O jogo segue normalmente, sem sair da tela.

**Why this priority**: é o valor central do pedido: renovar a dinâmica sem sair e voltar à
categoria (o que hoje nem mudaria a ordem, já que o progresso é retomado).

**Independent Test**: abrir uma categoria, descartar algumas cartas, tocar no botão e verificar
que a carta atual e o contador não mudaram, que as próximas cartas são exatamente as que ainda não
tinham saído (sem repetir nenhuma já vista) e que a ordem delas mudou.

**Acceptance Scenarios**:

1. **Given** o jogador está na carta 4 de 20 de uma categoria, **When** toca no botão de
   embaralhar, **Then** a carta 4 continua na mesa, no mesmo lado (frente ou verso) em que estava,
   e o contador continua "Carta 4 de 20".
2. **Given** o jogador re-embaralhou na carta 4 de 20, **When** descarta as cartas seguintes até o
   fim, **Then** aparecem exatamente as 16 cartas que ainda não tinham saído, cada uma uma única
   vez, e nenhuma das 3 cartas já descartadas volta antes do fim do baralho.
3. **Given** o jogador re-embaralhou, **When** desliza a carta para qualquer lado, **Then** o
   descarte funciona como antes e o contador avança para "Carta 5 de 20".
4. **Given** o jogador está no baralho "Tudo Misturado" com um filtro de categorias ativo,
   **When** toca no botão, **Then** só as cartas restantes desse baralho (das categorias do
   filtro) são reordenadas, o filtro não muda e o verso da próxima carta continua sem revelar a
   categoria.
5. **Given** o jogador re-embaralhou e sai da tela do baralho, **When** volta para a mesma
   categoria na mesma sessão, **Then** o jogo continua da mesma carta, seguindo a nova ordem.

---

### User Story 2 - Confirmação clara da ação (Priority: P2)

Como a próxima carta fica escondida, o jogador precisa perceber que o toque funcionou. Ao tocar no
botão, além da vibração, o ícone dá um giro rápido e um aviso discreto "Cartas embaralhadas"
aparece por um instante, sem cobrir a pergunta e sem exigir toque para sumir.

**Why this priority**: sem confirmação o efeito é invisível (a carta da mesa não muda), e o
jogador tenderia a tocar várias vezes ou achar que o botão está quebrado. Ainda assim, a ação
funciona sem ela (US1).

**Independent Test**: tocar no botão e verificar a vibração, o giro do ícone, o aviso
"Cartas embaralhadas" sumindo sozinho e o anúncio equivalente para leitor de tela; repetir com
movimento reduzido ativado e verificar que não há giro, mas a vibração e o aviso permanecem.

**Acceptance Scenarios**:

1. **Given** o jogador está na tela do baralho, **When** toca no botão, **Then** o aparelho emite
   uma vibração leve de sucesso, o ícone gira uma volta completa e o aviso "Cartas embaralhadas"
   aparece e some sozinho em cerca de 2 segundos.
2. **Given** o sistema está com movimento reduzido ativado, **When** o jogador toca no botão,
   **Then** o ícone não gira (o aviso aparece e some sem animação de movimento) e a vibração
   acontece normalmente.
3. **Given** o leitor de tela está ativo, **When** o jogador ativa o botão, **Then** o leitor
   anuncia "Cartas embaralhadas".
4. **Given** o aviso está visível, **When** o jogador toca no botão de novo, **Then** as cartas
   restantes são re-embaralhadas mais uma vez, a vibração se repete e o aviso continua visível
   sem empilhar uma segunda cópia.

---

### User Story 3 - Botão discreto e em harmonia com a mesa (Priority: P3)

O botão fica no canto inferior direito, fora da área de gesto da carta, pequeno e minimalista
(ícone de embaralhar sem fundo preenchido, ou com fundo escuro translúcido), na cor azul-gelo de
destaque do app. Ele não compete com a pergunta nem com o botão de favoritar, e tocá-lo nunca vira
nem descarta a carta.

**Why this priority**: acabamento visual; a funcionalidade já existe com US1 e US2.

**Independent Test**: abrir uma categoria e o modo misto em telas de 320pt e maiores, verificar
posição, cor, tamanho de toque, contraste e que tocar no botão não vira nem descarta a carta.

**Acceptance Scenarios**:

1. **Given** a tela do baralho com uma carta, **When** é exibida, **Then** o botão aparece no
   canto inferior direito, na cor de destaque azul-gelo, sem sobrepor a carta, o botão de
   favoritar ou a dica "Toque para virar · deslize para pular".
2. **Given** a carta está virada para baixo, **When** o jogador toca no botão, **Then** a carta
   não vira nem é descartada.
3. **Given** uma tela de 320pt de largura com fonte do sistema aumentada, **When** a tela do
   baralho é exibida, **Then** o botão continua visível, tocável e sem cortar outros elementos.

---

### Edge Cases

- **Restam 0 ou 1 cartas depois da atual** (penúltima/última carta): não há o que reordenar; o
  botão aparece desativado (visível, sem vibração, sem aviso, com estado "desativado" para o leitor
  de tela).
- **Restam exatamente 2 ou mais cartas depois da atual**: a nova ordem MUST ser diferente da
  anterior, para que o toque nunca seja "em vão" (com 2 cartas, isso significa trocá-las de lugar).
- **Fim do baralho** (tela "Fim do Baralho"): o botão não aparece; continua valendo o
  "Embaralhar de novo" existente, que recomeça o baralho inteiro.
- **Toque durante uma animação de descarte ou de virar**: o re-embaralhamento não interrompe nem
  altera a animação em curso; vale para as cartas que vêm depois da carta da mesa.
- **Toques repetidos rápidos**: cada toque re-embaralha de novo a fila restante; nenhum estado
  inconsistente (carta duplicada, carta perdida, contador errado) é possível.
- **Tutorial de primeiro uso visível**: o botão não precisa estar destacado no tutorial; ele não
  muda os passos existentes.
- **Favoritos**: re-embaralhar não altera favoritos nem o estado de favorito da carta da mesa.
- **App fechado**: como o progresso do baralho, a ordem re-embaralhada fica só em memória e some
  quando o app é fechado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A tela do baralho MUST exibir um botão de re-embaralhar enquanto houver uma carta na
  mesa, tanto nas categorias quanto no modo "Tudo Misturado".
- **FR-002**: Ao acionar o botão, o sistema MUST reordenar aleatoriamente (com distribuição
  uniforme entre as ordens possíveis, além da regra do FR-005) **somente** as cartas do baralho
  atual que ainda não foram exibidas, excluindo a carta da mesa.
- **FR-003**: O re-embaralhamento MUST NOT alterar a carta da mesa, o lado em que ela está
  (frente/verso), o contador "Carta X de Y", o total de cartas do baralho nem o conjunto de cartas
  já exibidas.
- **FR-004**: Depois do re-embaralhamento, cada carta ainda não exibida MUST aparecer exatamente
  uma vez antes do fim do baralho, e nenhuma carta já exibida MAY reaparecer antes do fim
  (regra de não repetição da constituição).
- **FR-005**: Quando restarem 2 ou mais cartas depois da atual, a nova ordem MUST ser diferente da
  ordem anterior.
- **FR-006**: Quando restarem menos de 2 cartas depois da atual, o botão MUST aparecer desativado e
  acioná-lo MUST NOT produzir vibração, aviso ou mudança.
- **FR-007**: No modo "Tudo Misturado", o re-embaralhamento MUST respeitar o conjunto de cartas já
  montado para o baralho (filtro de categorias vigente) e MUST NOT alterar o filtro salvo.
- **FR-008**: A nova ordem MUST valer para o restante da sessão do baralho: sair e voltar à mesma
  categoria na mesma sessão retoma a partir da mesma carta seguindo a nova ordem.
- **FR-009**: O descarte por deslize (esquerda ou direita), o contador e a tela "Fim do Baralho"
  MUST continuar funcionando como antes depois de um ou mais re-embaralhamentos.
- **FR-010**: Ao acionar o botão ativado, o aparelho MUST emitir a vibração padrão de notificação
  de "sucesso" do sistema, distinta das vibrações de virar (impacto leve) e descartar (impacto
  médio); aparelhos sem vibração simplesmente não vibram.
- **FR-011**: Ao acionar o botão ativado, o sistema MUST exibir um aviso discreto
  "Cartas embaralhadas" em forma de pílula centralizada no lugar da dica de gestos, que some
  sozinho em cerca de 2 segundos (aparecendo e sumindo por esmaecimento), sem cobrir a carta, sem
  deslocar outros elementos e sem bloquear toques ou gestos; ao sumir, a dica de gestos volta;
  toques repetidos MUST NOT empilhar avisos (o aviso visível reinicia sua contagem).
- **FR-012**: Ao acionar o botão ativado, o ícone MUST dar um giro rápido de uma volta (≤ 0,5 s);
  com movimento reduzido ativado, o giro MUST ser omitido, mantendo vibração e aviso.
- **FR-013**: O botão MUST ficar no canto inferior direito, na mesma linha do botão de favoritar
  (que continua centralizado), fora da área de gesto da carta; tocá-lo
  MUST NOT virar nem descartar a carta, e ele MUST NOT sobrepor a carta, o botão de favoritar ou a
  dica de gestos em telas a partir de 320pt.
- **FR-014**: O botão MUST ser minimalista (ícone de embaralhar, sem fundo preenchido ou com fundo
  escuro translúcido) na cor de destaque azul-gelo do app, com área de toque mínima de 44×44pt e
  contraste adequado (WCAG 2.1 AA como referência) também no estado desativado.
- **FR-015**: O botão MUST ter rótulo de acessibilidade (ex.: "Embaralhar as próximas cartas"),
  expor o estado desativado e, ao ser acionado, o leitor de tela MUST anunciar "Cartas
  embaralhadas".
- **FR-016**: Todos os textos novos (rótulo do botão, aviso) MUST ficar centralizados com os demais
  textos de interface, em português do Brasil.
- **FR-017**: A regra de re-embaralhar a fila restante MUST ser testável de forma automatizada sem
  renderizar a tela (carta atual preservada, conjunto restante preservado, ordem diferente com 2+
  cartas, nenhuma mudança com menos de 2).

### Key Entities

- **Progresso do baralho** (existente): ordem das cartas do baralho e posição da carta da mesa.
  O re-embaralhamento produz um novo progresso com o mesmo prefixo (cartas já exibidas + carta da
  mesa) e a mesma posição, mudando apenas a ordem da parte restante.
- **Fila restante** (derivada): cartas do progresso posteriores à carta da mesa; é a única parte
  afetada pela ação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O jogador consegue obter uma nova ordem para as próximas cartas com 1 toque, sem sair
  da tela do baralho.
- **SC-002**: Em 100% dos re-embaralhamentos testados, a carta da mesa, o contador e o conjunto de
  cartas restantes permanecem os mesmos, e nenhuma carta já vista reaparece antes do fim do
  baralho.
- **SC-003**: Em 100% dos re-embaralhamentos com 2 ou mais cartas restantes depois da atual, a
  ordem resultante é diferente da anterior.
- **SC-004**: A confirmação (vibração e aviso) aparece em até 100 ms após o toque, e o aviso some
  sozinho em cerca de 2 segundos.
- **SC-005**: Em testes de uso, os jogadores identificam que o toque funcionou na primeira
  tentativa, sem tocar repetidamente para "conferir", e o botão nunca vira ou descarta a carta
  por engano.
- **SC-006**: O botão permanece visível, tocável e sem sobrepor outros elementos em telas a partir
  de 320pt de largura, inclusive com fonte do sistema aumentada.

## Assumptions

- "Embaralhar as cartas restantes" significa reordenar apenas as cartas ainda não exibidas; as
  cartas já vistas continuam fora da fila até o fim do baralho (a ação não é um "recomeçar"). Quem
  quiser recomeçar do zero continua usando o fim do baralho ("Embaralhar de novo").
- O "índice de controle" citado no pedido é a posição da carta da mesa: ela não muda, então o
  contador e os deslizes seguem funcionando sem ajuste visível para o jogador.
- Deslizar para a esquerda ou para a direita significa a mesma coisa (pular/descartar); não existe
  navegação para trás, então não há "carta anterior" a preservar.
- Entre as opções do pedido, adotam-se o ícone de **embaralhar** (🔀), a cor de destaque
  **azul-gelo** (a mesma em todas as categorias e no modo misto, já que a carta da mesa no modo
  misto não deve antecipar a categoria seguinte) e **ambas** as confirmações opcionais (giro do
  ícone e aviso), porque o efeito da ação é invisível na mesa.
- A vibração de "sucesso" segue a preferência atual do app: não há opção para desligar vibrações
  nesta feature.
- O botão não é incluído no tutorial de primeiro uso (005); ele é autoexplicativo pelo ícone e pelo
  rótulo de acessibilidade.
- O baralho em memória, sem persistência, segue as regras atuais (constituição v2.1.0): a nova
  ordem some quando o app é fechado.
