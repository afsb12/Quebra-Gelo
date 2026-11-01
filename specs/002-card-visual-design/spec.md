# Feature Specification: Identidade Visual das Cartas por Categoria

**Feature Branch**: `002-card-visual-design`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "usa as imagens na pasta assets como base para criação das cartas. Cada
categoria pode ter uma cor."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md), which defines the
8 categories, the card (face down / revealed), the favorite star and the "Fim do Baralho" screen.
This feature defines how those cards and category elements look.

## Clarifications

### Session 2026-10-31

- Q: A frente da carta usa fundo na cor da categoria ou fundo claro tipo papel creme? → A: Verso
  na cor da categoria; frente em papel creme claro com texto escuro, e a cor da categoria na
  moldura, no ícone e no rodapé.
- Q: Qual estilo visual geral as cartas seguem, principalmente no padrão do verso? → A: Moderno e
  minimalista: padrões geométricos simples tom sobre tom, ícone da categoria grande e tipografia
  bold.
- Q: Na tela inicial, cada categoria aparece como miniatura do verso da carta ou como bloco
  simples? → A: Mini cartas: miniatura do verso, em pé, com nome e descrição curta abaixo.
- Q: As cartas usam a fonte padrão do celular ou uma fonte própria embutida no app? → A: Fonte
  própria em tudo: uma família bold para títulos e uma (ou a mesma família) para as perguntas.

## Referências visuais

As imagens em `Assets/` são fotos de jogos de cartas comerciais, usadas **apenas como referência
de estilo do gênero**. Delas foram extraídos padrões gerais, não elementos específicos:

| Referência | Padrão aproveitado (genérico) |
|---|---|
| `modelos cards.webp` | Verso com o nome da categoria em tipografia grande e bold, quebrada em linhas; frente com a pergunta em destaque e um rodapé discreto com o nome da categoria. |
| `Esquenta_Jogo.webp` | Fundo de cor sólida e saturada; texto grande e centralizado no topo; ilustração/ícone simples na metade inferior. |
| `LovCardsExemplo.webp` | Moldura clara fina em volta da carta; ícone da categoria num canto; alto contraste entre fundo e texto. |
| `Trio.jpg` | Uma cor forte e distinta por grupo de cartas; padrão ornamental de fundo em tom sobre tom; cantos arredondados com sombra. |
| `fogo_no_parquinho_jogo_de_cartas.webp` | Textura sutil/vinheta no fundo dando aspecto de papel impresso; ícone da categoria no canto superior; texto alinhado à esquerda. |

Nomes, logotipos, personagens, ilustrações, textos e tipografias próprias desses jogos MUST NOT ser
reproduzidos (constituição, "Conteúdo e Experiência de Jogo").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconhecer a categoria pela cor e pelo verso da carta (Priority: P1)

Ao entrar numa categoria, o grupo vê uma carta virada para baixo que parece uma carta de baralho
física de verdade: cantos arredondados, cor própria da categoria, o nome da categoria em letras
grandes, o ícone em destaque e um padrão geométrico discreto. Só de olhar, todos sabem que tipo de pergunta vem aí.

**Why this priority**: o verso é a primeira coisa que o grupo vê em toda rodada; a cor da
categoria é o principal elemento de identidade pedido pelo usuário.

**Independent Test**: abrir cada uma das 8 categorias e verificar que o verso da carta tem cor,
nome, ícone e padrão próprios, distinguíveis das outras 7 sem ler o texto.

**Acceptance Scenarios**:

1. **Given** a tela de jogo de qualquer categoria, **When** a carta aparece virada para baixo,
   **Then** ela exibe o fundo na cor da categoria, o nome da categoria em tipografia grande e bold,
   o ícone da categoria em destaque e um padrão geométrico simples tom sobre tom, exclusivo da
   categoria.
2. **Given** as 8 categorias, **When** os versos são colocados lado a lado, **Then** cada um tem
   uma cor claramente diferente das demais.
3. **Given** uma carta virada para baixo, **When** ela é exibida, **Then** tem proporção de carta
   de baralho (retrato), cantos arredondados, moldura clara fina e sombra que a destaca do fundo
   escuro do app.

---

### User Story 2 - Ler a pergunta com conforto na face revelada (Priority: P1)

Ao virar a carta, a pergunta aparece grande e escura sobre um fundo claro de papel creme, com uma
moldura, o ícone num canto e o nome da categoria num rodapé discreto na cor da categoria, para que possa ser lida em voz alta ou mostrada
ao grupo à distância de um braço.

**Why this priority**: a leitura da pergunta é o momento central do jogo; um visual bonito que
prejudique a leitura falha no objetivo do produto.

**Independent Test**: revelar a pergunta mais longa de cada categoria num celular pequeno e
verificar que o texto cabe inteiro, sem corte, com contraste adequado, e é legível a ~60 cm.

**Acceptance Scenarios**:

1. **Given** uma carta revelada, **When** a pergunta é exibida, **Then** o fundo é papel creme
   claro e o texto, escuro, é o elemento dominante da carta.
2. **Given** a carta revelada, **When** ela é exibida, **Then** a moldura interna, o ícone (num
   canto superior) e o nome da categoria (num rodapé discreto) aparecem na cor da categoria.
3. **Given** a pergunta mais longa permitida (200 caracteres), **When** é exibida num celular de
   320pt de largura, **Then** o texto cabe inteiro na carta sem corte nem rolagem.
4. **Given** uma pergunta favoritada, **When** a carta é revelada, **Then** o indicador de estrela
   aparece integrado ao visual da carta, sem cobrir o texto.

---

### User Story 3 - Cor da categoria consistente em todo o app (Priority: P2)

A mesma cor e o mesmo ícone de cada categoria aparecem na grade da tela inicial, nas cartas, na
lista de favoritos e na tela de "Fim do Baralho", formando uma identidade única por categoria.

**Why this priority**: reforça a associação cor → contexto e ajuda a escolher e reconhecer
categorias, mas o jogo funciona mesmo que só a carta use a cor.

**Independent Test**: para cada categoria, comparar a cor e o ícone do bloco na tela inicial, do
verso e da frente da carta, do item na lista de favoritos e da tela de fim do baralho.

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** a grade é exibida, **Then** cada categoria aparece como uma
   mini carta em pé, idêntica em cor, padrão e ícone ao verso da carta daquela categoria, com o
   nome e a descrição curta logo abaixo.
2. **Given** a lista de favoritos, **When** ela é exibida, **Then** cada pergunta mostra a cor e o
   ícone da sua categoria.
3. **Given** a tela de "Fim do Baralho", **When** ela é exibida, **Then** usa a cor da categoria
   que acabou de ser jogada.

---

### Edge Cases

- **Cores claras** (ex.: amarelo) **no verso**: a cor do nome e do ícone sobre o fundo MUST se
  adaptar (escuro em vez de branco) para manter o contraste exigido.
- **Cores claras na frente creme**: quando a cor da categoria não tem contraste suficiente sobre o
  creme para o nome no rodapé (ex.: amarelo), usa-se uma variação mais escura da mesma cor.
- **Pergunta longa em tela pequena**: o tamanho da fonte da pergunta pode diminuir até um mínimo
  legível, mas o texto nunca é cortado.
- **Fonte do sistema aumentada** (acessibilidade): a pergunta continua cabendo na carta; se
  necessário, a carta cresce dentro da tela antes de reduzir a fonte abaixo do mínimo.
- **Daltonismo**: categorias não podem ser identificadas só pela cor; o nome e o ícone estão sempre
  presentes no verso, na frente e na grade.
- **Movimento reduzido**: elementos decorativos não têm animação própria; o visual é estático.
- **Telas grandes ou tablets**: a carta mantém a proporção e um tamanho máximo, centralizada, em
  vez de esticar.

## Requirements *(mandatory)*

### Functional Requirements

**Paleta de categorias**

- **FR-001**: Cada uma das 8 categorias MUST ter uma cor principal própria, com a seguinte família
  de cor: Descontraído — amarelo-sol; Profundo — azul-índigo; Casais — vermelho-carmim; Happy Hour
  — laranja; Dilemas — roxo; Viagens e Aventuras — turquesa; Nostalgia e Infância — rosa; Futuro e
  Sonhos — verde-esmeralda.
- **FR-002**: As 8 cores MUST ser facilmente distinguíveis entre si quando vistas lado a lado e
  MUST se destacar sobre o fundo escuro do app.
- **FR-003**: Cada categoria MUST ter um ícone próprio, distinto dos demais e coerente com o tema
  (ex.: taça para Happy Hour, avião ou mapa para Viagens).

**Carta — formato geral**

- **FR-004**: A carta MUST ter proporção de carta de baralho em retrato (aprox. 5:7), cantos
  arredondados, moldura clara fina e sombra suave que a destaque do fundo escuro.
- **FR-005**: A carta MUST ocupar a maior parte da largura útil da tela no celular, com um tamanho
  máximo em telas grandes, sempre centralizada e sem distorcer a proporção.
- **FR-006**: O verso MUST usar a cor da categoria como fundo e a frente MUST usar um fundo claro
  de papel creme (o mesmo para todas as categorias); ambos com textura ou vinheta sutil que lembre
  papel impresso, sem prejudicar o contraste do texto.

**Verso (carta virada para baixo)**

- **FR-007**: O verso MUST seguir um estilo moderno e minimalista: nome da categoria em tipografia
  grande e bold (podendo quebrar em linhas), ícone da categoria em destaque (grande) e um padrão
  geométrico simples tom sobre tom (ex.: círculos, ondas, linhas, losangos), diferente para cada
  categoria. Ilustrações, doodles e ornamentos densos MUST NOT ser usados.
- **FR-008**: O verso MUST NOT exibir nenhum trecho da pergunta.

**Frente (carta revelada)**

- **FR-009**: A frente MUST exibir a pergunta como elemento dominante, com tamanho de fonte de no
  mínimo 24pt para perguntas de até 120 caracteres e nunca menor que 20pt para perguntas mais
  longas.
- **FR-010**: A frente MUST exibir a pergunta em texto escuro, uma moldura interna fina na cor da
  categoria, o ícone da categoria num canto superior e o nome da categoria num rodapé discreto,
  ambos na cor da categoria.
- **FR-011**: O indicador de estrela de favorito MUST aparecer na frente sem sobrepor o texto da
  pergunta.

**Tipografia**

- **FR-011a**: O app MUST usar tipografia própria, embutida no aplicativo (disponível offline desde
  a primeira abertura) e de licença livre para uso comercial: uma fonte display bold para nomes de
  categorias e títulos, e uma fonte de texto (da mesma família ou combinada) para as perguntas e
  demais textos. A fonte das perguntas MUST ter acentuação completa do português e alta
  legibilidade em tamanhos a partir de 20pt.
- **FR-011b**: Os textos MUST respeitar o ajuste de tamanho de fonte do sistema (acessibilidade),
  mesmo usando as fontes próprias.

**Contraste e acessibilidade**

- **FR-012**: Todo texto MUST ter contraste mínimo de 4.5:1 e todo ícone/elemento gráfico 3:1
  com o seu fundo: no verso, nome e ícone sobre a cor da categoria (claros ou escuros conforme a
  cor); na frente, pergunta, rodapé e ícone sobre o creme (usando uma variação mais escura da cor
  da categoria quando necessário).
- **FR-013**: A identificação da categoria MUST NOT depender só da cor: nome e ícone estão
  presentes no verso, na frente, na grade inicial e na lista de favoritos.

**Consistência no app**

- **FR-014**: Na grade da tela inicial, cada categoria MUST aparecer como uma miniatura do verso
  da sua carta (mesma proporção, cor, padrão e ícone), em pé, com o nome e a descrição curta abaixo
  da miniatura; a grade MUST manter pelo menos 2 colunas em celulares de 320pt.
- **FR-014a**: A lista de favoritos e a tela de "Fim do Baralho" MUST usar a cor e o ícone de cada
  categoria e o mesmo estilo de cantos arredondados das cartas.

**Originalidade**

- **FR-015**: O visual MUST ser original: nomes, logotipos, personagens, ilustrações, textos e
  tipografias exclusivas dos jogos das imagens de referência MUST NOT ser reproduzidos (as fontes
  próprias do app MUST ser diferentes das usadas nessas referências); padrões
  decorativos e ícones são criados para o projeto ou vêm de conjuntos livres de uso.

### Key Entities

- **Identidade visual da categoria**: complementa a Categoria (feature 001) com cor principal, cor
  de texto sobre essa cor no verso (clara ou escura), variação da cor para uso sobre o creme da
  frente, ícone e padrão geométrico do verso.
- **Carta**: elemento visual com duas faces — verso (identidade da categoria) e frente (pergunta,
  ícone, rodapé e indicador de favorito).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste com usuários, pelo menos 9 de 10 pessoas associam corretamente o verso de
  uma carta à sua categoria após ver a tela inicial uma vez.
- **SC-002**: 100% das combinações de texto/ícone das 8 categorias, no verso (sobre a cor) e na
  frente (sobre o creme), atendem às razões de contraste definidas (4.5:1 para texto, 3:1 para
  ícones).
- **SC-003**: 100% das perguntas do conteúdo cabem inteiras na carta, sem corte, num celular de
  320pt de largura com fonte padrão do sistema.
- **SC-004**: Em uma comparação lado a lado das 8 cartas, 10 de 10 avaliadores distinguem todas as
  categorias entre si (inclusive com simulação de daltonismo, graças ao nome e ícone).
- **SC-005**: A pergunta revelada é lida sem esforço a 60 cm de distância por pelo menos 9 de 10
  pessoas em teste.
- **SC-006**: Uma revisão visual confirma que nenhum elemento exclusivo (nome, logo, personagem,
  ilustração ou tipografia própria) dos jogos de referência aparece no app.

## Assumptions

- As imagens de `Assets/` são referências de estilo; o app não as exibe nem as distribui.
- As famílias de cor de FR-001 são o ponto de partida; os tons exatos são ajustados no design
  para cumprir o contraste (FR-012) sobre o tema escuro do app definido na feature 001.
- As fontes são escolhidas entre famílias de licença livre (ex.: catálogos de fontes abertas); a
  escolha exata é feita no design/plano.
- Ícones vêm de um conjunto de ícones livre já disponível no app (sem desenho de ícones próprio
  nesta feature); os padrões geométricos do verso são criados para o projeto.
- Fora do escopo: ilustrações por pergunta, níveis de intensidade nas cartas (ex.: ícones de fogo
  das referências), animações decorativas, temas alternativos e personalização de cores pelo
  usuário.
- Esta feature altera apenas a aparência; regras de jogo, gestos, vibração e favoritos seguem a
  feature 001.
