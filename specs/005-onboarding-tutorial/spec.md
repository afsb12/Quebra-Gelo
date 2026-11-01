# Feature Specification: Mini-Tutorial de Primeira Viagem (Onboarding)

**Feature Branch**: `005-onboarding-tutorial`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "User Story: Mini-Tutorial de Primeira Viagem (Onboarding). Como um
novo usuário, quero ver um tutorial rápido e visual assim que eu abrir o app pela primeira vez, para
que eu entenda os controles básicos (selecionar categoria, tocar para virar, deslizar para pular) sem
precisar ler textos longos. Exibição: apenas na primeira vez que o app for aberto; salvar no
dispositivo uma marcação de 'tutorial visto' depois que o usuário fechar a tela; sobreposição em tela
cheia com fundo preto a 80% de opacidade sobre a tela inicial. Fechar: botão claro 'X' ou 'Pular' no
canto superior direito; tocar fora da área central da carta de exemplo também fecha. Conteúdo: no
centro, uma carta de exemplo estática (ilustração simplificada ou a própria carta do app); ao redor,
indicadores visuais (setas/mãozinhas e textos curtos): 1. 'Toque em um baralho para começar'
(apontando para fora/abaixo da carta); 2. 'Toque na carta para revelar a pergunta' (ícone de toque no
centro da carta); 3. 'Deslize para os lados para a próxima carta' (setas de deslizar para a esquerda
e a direita). Design minimalista, combinando com o tema escuro do app."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (tela inicial,
virar com toque, pular deslizando) e [002-card-visual-design](../002-card-visual-design/spec.md)
(visual das cartas e fundo escuro do app).

**Constitution**: o princípio "Zero Fricção" limita o onboarding a **uma única tela** e exige no
máximo **dois toques** da abertura do app até a primeira carta. Este tutorial é essa tela única:
fechá-lo (1 toque) e escolher um baralho (1 toque) mantêm o limite.

## Clarifications

### Session 2026-11-01

Modo automático: o usuário autorizou aceitar a opção recomendada em cada pergunta.

- Q: O tutorial pode ser reaberto depois de fechado (ex.: link "Como jogar" na tela inicial)? → A:
  Não nesta versão; só reaparece após reinstalar o app ou limpar os dados.
- Q: Qual verso a carta de exemplo usa? → A: O verso neutro da marca da feature 004 (fundo escuro
  com o símbolo do app), que não sugere nenhuma categoria.
- Q: As dicas têm animação? → A: Sim, sutil e em loop (pulsação no ícone de toque, setas de
  deslizar oscilando para os lados); estáticas com movimento reduzido ativo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender os controles na primeira abertura (Priority: P1)

Na primeira vez que alguém abre o Quebra-Gelo, a tela inicial aparece escurecida por trás de uma
sobreposição. No centro há uma carta de exemplo virada para baixo, e em volta dela três dicas curtas,
cada uma com um ícone: um indicador apontando para baixo/fora da carta com "Toque em um baralho para
começar", um ícone de toque no centro da carta com "Toque na carta para revelar a pergunta" e setas
para a esquerda e para a direita com "Deslize para os lados para a próxima carta". Em poucos
segundos a pessoa entende como jogar.

**Why this priority**: é o valor central do pedido: um novo usuário entende as três mecânicas básicas
sem ler texto longo e sem descobrir os gestos por tentativa e erro.

**Independent Test**: instalar o app do zero (ou limpar os dados), abri-lo e verificar que a
sobreposição aparece sobre a tela inicial com a carta de exemplo e as três dicas legíveis.

**Acceptance Scenarios**:

1. **Given** o app aberto pela primeira vez no aparelho, **When** a tela inicial carrega, **Then** a
   sobreposição do tutorial aparece em tela cheia, com a tela inicial visível ao fundo, escurecida.
2. **Given** a sobreposição exibida, **When** a pessoa olha a tela, **Then** vê no centro uma carta de
   exemplo virada para baixo, sem nenhuma pergunta real do baralho.
3. **Given** a sobreposição exibida, **When** a pessoa lê as dicas, **Then** encontra exatamente três
   dicas, cada uma com um ícone e uma frase curta: "Toque em um baralho para começar" (apontando para
   fora/abaixo da carta), "Toque na carta para revelar a pergunta" (ícone de toque sobre a carta) e
   "Deslize para os lados para a próxima carta" (setas para a esquerda e para a direita).
4. **Given** a sobreposição exibida, **When** a pessoa toca na carta de exemplo, **Then** nada muda:
   a carta é estática e o tutorial continua aberto.

---

### User Story 2 - Fechar o tutorial e não vê-lo de novo (Priority: P1)

A pessoa fecha o tutorial tocando em "Pular" no canto superior direito ou em qualquer lugar fora da
carta de exemplo. A sobreposição some e a tela inicial fica pronta para escolher um baralho. Nas
próximas aberturas do app, o tutorial não aparece mais.

**Why this priority**: sem um jeito fácil de fechar e sem lembrar que já foi visto, o tutorial vira
atrito, o oposto do princípio "Zero Fricção". É inseparável da história 1 para ir para produção.

**Independent Test**: abrir o app pela primeira vez, fechar o tutorial por cada um dos caminhos,
fechar o app por completo, reabri-lo e verificar que o tutorial não aparece.

**Acceptance Scenarios**:

1. **Given** o tutorial aberto, **When** a pessoa toca em "Pular" no canto superior direito, **Then**
   o tutorial fecha e a tela inicial fica totalmente utilizável.
2. **Given** o tutorial aberto, **When** a pessoa toca em qualquer ponto fora da carta de exemplo,
   **Then** o tutorial fecha, sem que esse toque abra um baralho ou acione algo da tela inicial.
3. **Given** o tutorial aberto num Android, **When** a pessoa usa o gesto/botão "voltar" do sistema,
   **Then** o tutorial fecha (sem sair do app) e conta como visto.
4. **Given** o tutorial já fechado uma vez, **When** o app é fechado por completo e aberto de novo,
   **Then** o tutorial não aparece e a tela inicial é mostrada direto.
5. **Given** o tutorial recém-fechado, **When** a pessoa toca num baralho, **Then** a primeira carta
   aparece (no máximo 2 toques desde a abertura do app).

---

### Edge Cases

- **App fechado com o tutorial aberto**: se o app for encerrado antes de o tutorial ser fechado, ele
  ainda não conta como visto e aparece de novo na próxima abertura.
- **Falha ao ler a marcação salva**: se o app não conseguir ler se o tutorial já foi visto, a tela
  inicial MUST abrir normalmente; é preferível não mostrar o tutorial a travar ou atrasar o jogo.
- **Falha ao salvar a marcação**: o tutorial fecha mesmo assim; ele pode reaparecer na próxima
  abertura, mas nunca impede o uso do app.
- **Tutorial aparecendo depois da tela inicial**: o tutorial não pode "piscar" (surgir depois que a
  tela inicial já ficou interativa, nem aparecer por um instante para quem já o viu).
- **Toques rápidos/repetidos**: tocar várias vezes seguidas para fechar não pode abrir um baralho por
  baixo nem causar efeitos duplicados.
- **Leitor de tela**: o tutorial é anunciado como uma janela própria; as três dicas e o botão "Pular"
  são lidos em ordem lógica e o foco não passa para os elementos da tela inicial ao fundo enquanto
  ele estiver aberto.
- **Fonte grande do sistema e telas pequenas**: as dicas continuam legíveis, sem se sobrepor à carta,
  ao botão "Pular" ou entre si, de telas pequenas a tablets, em retrato.
- **Movimento reduzido**: com movimento reduzido ativo, a pulsação do toque e a oscilação das setas
  não acontecem; os ícones ficam estáticos (FR-017).
- **Abertura sem internet**: o tutorial funciona totalmente offline desde a primeira execução.

## Requirements *(mandatory)*

### Functional Requirements

**Exibição**

- **FR-001**: O app MUST exibir o tutorial automaticamente sobre a tela inicial na primeira abertura
  no aparelho.
- **FR-002**: O app MUST guardar no próprio aparelho que o tutorial foi visto assim que ele for
  fechado, por qualquer caminho, e MUST NOT exibi-lo de novo em aberturas seguintes.
- **FR-003**: A marcação de tutorial visto MUST sobreviver a fechar e reabrir o app e MUST ser a única
  informação salva por esta feature (nenhum dado pessoal, nenhum envio para fora do aparelho).
- **FR-004**: O tutorial MUST ocupar a tela inteira como uma sobreposição de uma única tela, com fundo
  preto a 80% de opacidade, deixando a tela inicial perceptível ao fundo.
- **FR-005**: Enquanto o tutorial estiver aberto, os elementos da tela inicial MUST NOT receber toques.
- **FR-006**: Para quem já viu o tutorial, a tela inicial MUST abrir sem nenhum sinal do tutorial e
  sem atraso perceptível em relação a hoje.

**Fechar**

- **FR-007**: O tutorial MUST ter um controle "Pular", claro e visível, no canto superior direito,
  com área de toque confortável.
- **FR-008**: Tocar em qualquer ponto fora da carta de exemplo MUST fechar o tutorial; tocar na
  carta de exemplo MUST NOT fechá-lo.
- **FR-009**: O gesto/botão "voltar" do sistema MUST fechar o tutorial em vez de sair do app.
- **FR-010**: Fechar o tutorial MUST levar a pessoa à tela inicial pronta para uso, de modo que a
  primeira carta fique a no máximo 2 toques da abertura do app.

**Conteúdo**

- **FR-011**: O centro do tutorial MUST mostrar uma carta de exemplo estática, virada para baixo, com
  o verso neutro da marca (fundo escuro e símbolo do app, como no modo "Tudo Misturado"), sem expor
  nenhuma pergunta real nem sugerir uma categoria.
- **FR-012**: Em volta da carta, o tutorial MUST mostrar exatamente três dicas, cada uma com um ícone
  e uma frase curta:
  1. "Toque em um baralho para começar", com indicador apontando para fora/abaixo da carta;
  2. "Toque na carta para revelar a pergunta", com ícone de toque sobre o centro da carta;
  3. "Deslize para os lados para a próxima carta", com setas para a esquerda e para a direita.
- **FR-013**: Cada dica MUST ter no máximo 50 caracteres; o tutorial MUST NOT ter parágrafos, várias
  etapas ou paginação.
- **FR-014**: O visual MUST ser minimalista e seguir o tema escuro do app (cores, tipografia e cantos
  arredondados já usados), com as dicas em cor clara legível sobre o fundo escurecido.
- **FR-015**: Todos os textos do tutorial ("Pular", as três dicas e os rótulos de acessibilidade)
  MUST ficar centralizados com os demais textos da interface, em pt-BR.
- **FR-016**: Com o leitor de tela ativo, o tutorial MUST ser anunciado como janela própria, ler as
  três dicas e o "Pular" e manter o foco dentro dele até ser fechado.
- **FR-017**: As dicas de toque e de deslizar MUST ter uma animação sutil em loop (pulsação no ícone
  de toque; setas oscilando para os lados). Com movimento reduzido ativo, essas animações MUST ser
  removidas (ícones estáticos) e o tutorial aparece só com um surgimento suave.
- **FR-018**: O app MUST NOT oferecer, nesta versão, um caminho para reabrir o tutorial depois que ele
  foi fechado.

### Key Entities

- **Marcação de tutorial visto**: valor sim/não guardado só no aparelho; começa como "não visto" numa
  instalação nova e passa a "visto" quando o tutorial é fechado.
- **Dica do tutorial**: ícone + frase curta + posição em relação à carta de exemplo (fora/abaixo,
  centro, laterais).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das instalações novas, o tutorial aparece na primeira abertura; em 100% das
  aberturas seguintes ao fechamento, ele não aparece.
- **SC-002**: Uma pessoa lê todas as dicas e fecha o tutorial em até 10 segundos.
- **SC-003**: Em testes com novos usuários, ao menos 9 em cada 10 conseguem, logo após o tutorial,
  abrir um baralho, virar a primeira carta e pular para a próxima sem ajuda.
- **SC-004**: Da abertura do app até a primeira carta, são necessários no máximo 2 toques, também na
  primeira abertura.
- **SC-005**: Para quem já viu o tutorial, o tempo até a tela inicial ficar utilizável não piora de
  forma perceptível em relação à versão atual.
- **SC-006**: Nenhuma dica é cortada ou se sobrepõe a outro elemento nos tamanhos de tela e de fonte
  suportados pelo app.

## Assumptions

- O pedido menciona soluções técnicas específicas (armazenamento local do aparelho para a marcação
  `hasSeenTutorial`, componente de janela modal ou sobreposição, a carta do app reutilizada de forma
  estática). Elas são indicações para o plano; a spec só exige o comportamento.
- O tutorial conta como visto quando é fechado por qualquer caminho ("Pular", toque fora da carta ou
  "voltar"), não ao ser apenas exibido.
- Reinstalar o app ou limpar os dados faz o tutorial voltar (FR-018).
- Tocar na carta de exemplo não a vira nem fecha o tutorial.
- O controle de fechar é exibido como o texto "Pular" (o pedido aceita "X" ou "Pular"; o texto é mais
  claro e mais acessível).
- O tutorial não tem som nem vibração.
- O tutorial existe só na tela inicial; não há dicas dentro da tela do baralho.
- Orientação retrato, como o resto do app.
